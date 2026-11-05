"""
=============================================================================
INSTITUTO DERMALINE - ROBÔ DE PUBLICAÇÃO DIÁRIA NAS REDES SOCIAIS (OPÇÃO A)
Gera e publica 3 Posts Individuais por Dia no Instagram e Facebook:
  1. Manhã (08h): Medicina Integrativa & Nutrição Celular (Dr. Renato Nakad)
  2. Tarde (13h): Dermatologia Clínica & Saúde da Pele (Dra. Line Manuelle)
  3. Noite (19h): Beleza Consciente & Protocolos Estéticos (Dra. Line Manuelle)
=============================================================================
"""

import os
import sys
import json
import math
import time
import requests
from datetime import datetime, date
from PIL import Image, ImageDraw, ImageFont

# Configurações do Repositório e Caminhos
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CONTEUDO_PATH = os.path.join(BASE_DIR, "conteudo_diario.json")
CARDS_DIR = os.path.join(BASE_DIR, "assets", "images", "cards")
TEMPLATES_DIR = os.path.join(BASE_DIR, "assets", "images", "templates")
FONTS_DIR = os.path.join(BASE_DIR, "assets", "fonts")
LOGO_PATH = os.path.join(BASE_DIR, "assets", "images", "logo_dermaline_original.png")

# Credenciais da Meta (obtidas via variáveis de ambiente / GitHub Secrets)
META_ACCESS_TOKEN = os.environ.get("META_ACCESS_TOKEN", "").strip()
FACEBOOK_PAGE_ID = os.environ.get("FACEBOOK_PAGE_ID", "457804507635117").strip()
_raw_ig_id = os.environ.get("INSTAGRAM_ACCOUNT_ID", "17841400910495764").strip()
# Garante o ID oficial de @institutodermaline mesmo se o secret antigo (17841404225729043) estiver salvo
INSTAGRAM_ACCOUNT_ID = "17841400910495764" if _raw_ig_id in ("", "17841404225729043") else _raw_ig_id
REPO_SLUG = os.environ.get("GITHUB_REPOSITORY", "renatonakad-byte/Instituto-Dermaline-Website")
BRANCH_NAME = os.environ.get("GITHUB_REF_NAME", "main")

# Paleta Visual Oficial @institutodermaline (Inspirada nos Posts de Laser, Sculptra e Preenchedores)
COLOR_BG_IVORY = (250, 247, 242)        # #FAF7F2 - Marfim champagne luminoso
COLOR_BRONZE_TITLE = (96, 62, 44)       # #603E2C - Marrom bronze nobre (igual título "Benefícios dos Tratamentos a Laser")
COLOR_GOLD_SCRIPT = (180, 138, 72)      # #B48A48 - Dourado cursivo elegante
COLOR_GOLD_PRIMARY = (197, 168, 128)    # #C5A880 - Ouro acetinado Dermaline
COLOR_TEXT_DARK = (48, 40, 36)          # #302824 - Texto escuro quente de alta leitura
COLOR_TEXT_BODY = (74, 63, 56)          # #4A3F38 - Texto editorial secundário
COLOR_TEXT_MUTED = (118, 104, 94)       # #76685E - Rodapé e metadados

# As 3 cores dos quadrados de Checkmark [✓] iguais ao post de "Benefícios dos Tratamentos a Laser"
CHECK_COLORS = [
    (216, 175, 108),  # #D8AF6C - Champagne Gold
    (184, 138, 68),   # #B88A44 - Bronze Dourado
    (162, 122, 102),  # #A27A66 - Rose Bronze / Taupe Nobre
]


def carregar_conteudo():
    """Lê o arquivo conteudo_diario.json e retorna a pílula do dia atual."""
    with open(CONTEUDO_PATH, "r", encoding="utf-8") as f:
        dados = json.load(f)

    config = dados.get("config", {})
    dicas = dados.get("dicas_diarias", [])
    total_dias = config.get("total_dias", len(dicas) if dicas else 64)
    data_pub_str = config.get("data_publicacao_site", "")

    hoje = date.today()
    if data_pub_str:
        try:
            data_pub = datetime.strptime(data_pub_str, "%Y-%m-%d").date()
            dias_passados = (hoje - data_pub).days
            if dias_passados >= 0:
                dia_atual = (dias_passados % total_dias) + 1
            else:
                dia_atual = 1
        except Exception:
            dia_atual = 1
    else:
        dia_atual = 1

    # Permite forçar o dia via argumento numérico no terminal (ex: python publicar_redes.py 33)
    for arg in sys.argv[1:]:
        if arg.isdigit():
            dia_atual = int(arg)
            break

    dica_do_dia = next((d for d in dicas if d.get("dia") == dia_atual), dicas[0] if dicas else None)
    return dia_atual, dica_do_dia, dados.get("artigo_semana", {})


def obter_pilar_argumento():
    """Identifica qual pilar foi solicitado via CLI (--pilar nutricao|dermatologia|beleza|todos)."""
    if "--pilar" in sys.argv:
        idx = sys.argv.index("--pilar")
        if idx + 1 < len(sys.argv):
            val = sys.argv[idx + 1].strip().lower()
            if val in ("nutricao", "dermatologia", "beleza", "todos"):
                return val
    return "todos"


def quebrar_texto(draw, texto, font, max_largura):
    """Quebra o texto em múltiplas linhas para caber perfeitamente na largura."""
    if not texto:
        return []
    palavras = texto.split()
    linhas = []
    linha_atual = []

    for palavra in palavras:
        linha_teste = " ".join(linha_atual + [palavra])
        bbox = draw.textbbox((0, 0), linha_teste, font=font)
        largura = bbox[2] - bbox[0]
        if largura <= max_largura:
            linha_atual.append(palavra)
        else:
            if linha_atual:
                linhas.append(" ".join(linha_atual))
            linha_atual = [palavra]

    if linha_atual:
        linhas.append(" ".join(linha_atual))
    return linhas


def obter_fontes():
    """Carrega as fontes da pasta assets/fonts com tamanhos calibrados para leitura mobile."""
    font_script_path = os.path.join(FONTS_DIR, "AlexBrush-Regular.ttf")
    font_serif_bold_path = os.path.join(FONTS_DIR, "Georgia-Bold.ttf")
    font_serif_reg_path = os.path.join(FONTS_DIR, "Georgia.ttf")
    font_sans_bold_path = os.path.join(FONTS_DIR, "SegoeUI-Bold.ttf")
    font_sans_path = os.path.join(FONTS_DIR, "SegoeUI.ttf")

    def carregar(caminho, tamanho, fallbacks):
        if os.path.exists(caminho):
            try:
                return ImageFont.truetype(caminho, tamanho)
            except Exception:
                pass
        for nome in fallbacks:
            try:
                return ImageFont.truetype(nome, tamanho)
            except Exception:
                continue
        return ImageFont.load_default()

    return {
        "script_lg": carregar(font_script_path, 58, ["AlexBrush-Regular.ttf", "segoesc.ttf", "georgiai.ttf"]),
        "script_sm": carregar(font_script_path, 38, ["AlexBrush-Regular.ttf", "segoesc.ttf", "georgiai.ttf"]),
        "titulo": carregar(font_serif_bold_path, 38, ["georgiab.ttf", "timesbd.ttf", "DejaVuSerif-Bold.ttf"]),
        "subtitulo_serif": carregar(font_serif_reg_path, 22, ["georgia.ttf", "times.ttf", "DejaVuSerif.ttf"]),
        "check_titulo": carregar(font_sans_bold_path, 21, ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]),
        "check_corpo": carregar(font_sans_path, 19, ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]),
        "lead": carregar(font_sans_path, 20, ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]),
        "callout_bold": carregar(font_sans_bold_path, 19, ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]),
        "callout_reg": carregar(font_sans_path, 18, ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]),
        "badge": carregar(font_sans_bold_path, 15, ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]),
        "rodape_bold": carregar(font_sans_bold_path, 16, ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]),
        "rodape_reg": carregar(font_sans_path, 15, ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]),
    }


def selecionar_template_fundo(dia, pilar):
    """Seleciona a fotografia/ilustração editorial correspondente ao pilar e ao dia."""
    candidatos_por_pilar = {
        "nutricao": [
            "bg_nutricao_1.jpg",
            "bg_nutricao_2.jpg",
            "bg_editorial_3.jpg",
        ],
        "dermatologia": [
            "bg_dermato_1.jpg",
            "bg_dermato_2.jpg",
            "bg_editorial_2.jpg",
        ],
        "beleza": [
            "bg_editorial_1.jpg",
            "bg_editorial_2.jpg",
            "bg_editorial_3.jpg",
        ],
    }

    lista = candidatos_por_pilar.get(pilar, ["bg_editorial_1.jpg"])
    existentes = [
        os.path.join(TEMPLATES_DIR, nome)
        for nome in lista
        if os.path.exists(os.path.join(TEMPLATES_DIR, nome))
    ]
    if not existentes:
        # Fallback caso algum template ainda não exista
        todos = [
            os.path.join(TEMPLATES_DIR, f"bg_editorial_{i}.jpg")
            for i in (1, 2, 3)
            if os.path.exists(os.path.join(TEMPLATES_DIR, f"bg_editorial_{i}.jpg"))
        ]
        if todos:
            return todos[(dia - 1) % len(todos)]
        return None

    return existentes[(dia - 1) % len(existentes)]


def criar_mascara_gradiente(largura, altura):
    """Cria máscara marfim/champagne suave à esquerda garantindo leitura perfeita sem esconder a foto à direita."""
    grad = Image.new("RGBA", (largura, altura), (0, 0, 0, 0))
    cor_rgb = COLOR_BG_IVORY
    x_solid = 500
    x_fade = 770

    for x in range(largura):
        if x <= x_solid:
            alpha = 246
        elif x < x_fade:
            t = (x - x_solid) / (x_fade - x_solid)
            factor = (1.0 + math.cos(t * math.pi)) / 2.0
            alpha = int(246 * factor)
        else:
            alpha = 0

        if alpha > 0:
            coluna = Image.new("RGBA", (1, altura), (*cor_rgb, alpha))
            grad.paste(coluna, (x, 0))

    return grad


def desenhar_check_box(draw, x, y, tamanho, cor_fundo):
    """Desenha o quadrado com ícone [✓] idêntico ao padrão visual do @institutodermaline."""
    draw.rounded_rectangle(
        [(x, y), (x + tamanho, y + tamanho)],
        radius=6,
        fill=cor_fundo,
    )
    # Desenha o V (checkmark) branco nítido dentro do quadrado
    p1 = (x + int(tamanho * 0.24), y + int(tamanho * 0.52))
    p2 = (x + int(tamanho * 0.44), y + int(tamanho * 0.72))
    p3 = (x + int(tamanho * 0.78), y + int(tamanho * 0.28))
    draw.line([p1, p2, p3], fill=(255, 255, 255), width=3, joint="curve")


def desenhar_coroa_e_diamante(draw, x, y):
    """Desenha um pequeno diamante dourado estilo a marca Dermaline."""
    pts_top = [(x + 12, y), (x + 24, y + 8), (x + 12, y + 22), (x, y + 8)]
    draw.polygon(pts_top, fill=COLOR_GOLD_PRIMARY, outline=COLOR_GOLD_SCRIPT)


def estruturar_dados_pilar(dia, dica, pilar):
    """Organiza os textos, checklists e assinaturas para cada um dos 3 posts separados."""
    if pilar == "nutricao":
        n = dica["nutriente"]
        return {
            "codigo_arquivo": "1_nutricao",
            "selo_topo": f"DIÁRIO DERMALINE • EDIÇÃO #{dia:02d} • NUTRIÇÃO & LONGEVIDADE",
            "eyebrow_cursivo": "Medicina Integrativa",
            "titulo_principal": n["habito_titulo"],
            "texto_intro": n["habito_descricao"],
            "checklists": [
                ("Nutriente do Dia", f"{n['nutriente_nome']} ({n['nutriente_tipo']})"),
                ("Ação Celular", n["o_que_faz"]),
                ("Fontes Naturais", n["fontes_alimentares"]),
            ],
            "box_destaque_label": "ORIENTAÇÃO MÉDICA",
            "box_destaque_texto": n["orientacao_medica"],
            "assinatura_clube": "Clube da Longevidade",
            "medico_nome": "Dr. Renato Nakad Gouveia",
            "medico_crm": "CRM-DF 17680 • Medicina Integrativa",
        }
    elif pilar == "dermatologia":
        d = dica["dermatologia"]
        return {
            "codigo_arquivo": "2_dermatologia",
            "selo_topo": f"DIÁRIO DERMALINE • EDIÇÃO #{dia:02d} • DERMATOLOGIA CLÍNICA",
            "eyebrow_cursivo": "Saúde da Sua Pele",
            "titulo_principal": d["titulo"],
            "texto_intro": "Cuidar da saúde dermatológica exige atenção aos sinais precoces e proteção diária da barreira cutânea:",
            "checklists": [
                ("Entenda a Condição", d["descricao"]),
                ("Sinais & Prevenção", d["destaque_texto"]),
                ("Conduta Médica", d["orientacao_medica"]),
            ],
            "box_destaque_label": "DIAGNÓSTICO ESPECIALIZADO",
            "box_destaque_texto": "Ao notar alterações persistentes na pele, cabelos ou unhas, realize uma avaliação dermatoscópica.",
            "assinatura_clube": "Dermatologia Clínica",
            "medico_nome": "Dra. Line Manuelle Gouveia",
            "medico_crm": "CRM-DF 17449 • Dermatologia",
        }
    else:  # beleza
        b = dica["beleza"]
        return {
            "codigo_arquivo": "3_beleza",
            "selo_topo": f"DIÁRIO DERMALINE • EDIÇÃO #{dia:02d} • ESTÉTICA AVANÇADA",
            "eyebrow_cursivo": "Beleza Consciente",
            "titulo_principal": b["titulo"],
            "texto_intro": "Protocolos dermatológicos de alta precisão para realçar sua beleza natural com segurança e estímulo biológico:",
            "checklists": [
                ("Mecanismo de Ação", b["descricao"]),
                ("Resultados & Benefícios", b["destaque_texto"]),
                ("Recomendação Médica", b["orientacao_medica"]),
            ],
            "box_destaque_label": "PRONTA PARA REALÇAR SUA BELEZA?",
            "box_destaque_texto": "Conheça nossos protocolos personalizados de rejuvenescimento e gerenciamento da pele em Brasília.",
            "assinatura_clube": "Clube da Beleza",
            "medico_nome": "Dra. Line Manuelle Gouveia",
            "medico_crm": "CRM-DF 17449 • Estética Avançada",
        }


def gerar_card_pilar(dia, dica, pilar):
    """Gera o card 1080x1080 de um pilar específico seguindo o padrão visual da página @institutodermaline."""
    os.makedirs(CARDS_DIR, exist_ok=True)
    info = estruturar_dados_pilar(dia, dica, pilar)
    cod = info["codigo_arquivo"]

    card_path = os.path.join(CARDS_DIR, f"card_edicao_{dia:02d}_{cod}.png")
    card_hoje_pilar_path = os.path.join(CARDS_DIR, f"card_hoje_{cod}.png")
    card_hoje_geral_path = os.path.join(CARDS_DIR, "card_hoje.png")

    largura, altura = 1080, 1080

    # 1. Carrega template fotográfico do pilar
    template_path = selecionar_template_fundo(dia, pilar)
    if template_path and os.path.exists(template_path):
        base_img = Image.open(template_path).convert("RGBA")
        if base_img.size != (largura, altura):
            base_img = base_img.resize((largura, altura), Image.Resampling.LANCZOS)
    else:
        base_img = Image.new("RGBA", (largura, altura), COLOR_BG_IVORY)

    # 2. Aplica máscara gradiente marfim/champagne à esquerda
    gradiente = criar_mascara_gradiente(largura, altura)
    img = Image.alpha_composite(base_img, gradiente)

    # Camada RGBA para elementos translúcidos (boxes de vidro/champagne)
    overlay = Image.new("RGBA", (largura, altura), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)

    # Moldura editorial dupla fina estilo revista/clínica de luxo
    draw_ov.rectangle([(28, 28), (largura - 28, altura - 28)], outline=(197, 168, 128, 115), width=2)
    draw_ov.rectangle([(36, 36), (largura - 36, altura - 36)], outline=(197, 168, 128, 55), width=1)

    fontes = obter_fontes()

    # 3. Cabeçalho Superior (@institutodermaline + Badge do Pilar)
    x_left = 68
    y_cur = 58
    desenhar_coroa_e_diamante(draw_ov, x_left, y_cur + 2)
    draw_ov.text((x_left + 32, y_cur), "@institutodermaline", font=fontes["rodape_bold"], fill=COLOR_BRONZE_TITLE)

    # Pill da categoria
    selo_txt = info["selo_topo"]
    bbox_selo = draw_ov.textbbox((0, 0), selo_txt, font=fontes["badge"])
    selo_w = bbox_selo[2] - bbox_selo[0] + 28
    y_cur += 34
    draw_ov.rounded_rectangle(
        [(x_left, y_cur), (x_left + selo_w, y_cur + 28)],
        radius=14,
        fill=(197, 168, 128, 42),
        outline=(180, 138, 72, 110),
        width=1,
    )
    draw_ov.text((x_left + 14, y_cur + 5), selo_txt, font=fontes["badge"], fill=COLOR_GOLD_SCRIPT)

    # 4. Eyebrow Cursivo Dourado ("Medicina Integrativa" / "Saúde da Sua Pele" / "Beleza Consciente")
    y_cur += 36
    draw_ov.text((x_left, y_cur), info["eyebrow_cursivo"], font=fontes["script_lg"], fill=COLOR_GOLD_SCRIPT)

    # 5. Título Principal em Serif Bronze/Marrom (estilo "Benefícios dos Tratamentos a Laser")
    y_cur += 62
    linhas_titulo = quebrar_texto(draw_ov, info["titulo_principal"], fontes["titulo"], 565)
    for linha in linhas_titulo[:3]:
        draw_ov.text((x_left, y_cur), linha, font=fontes["titulo"], fill=COLOR_BRONZE_TITLE)
        y_cur += 44

    # 6. Parágrafo Introdutório / Hábito Completo
    y_cur += 8
    linhas_intro = quebrar_texto(draw_ov, info["texto_intro"], fontes["lead"], 555)
    for linha in linhas_intro[:4]:
        draw_ov.text((x_left, y_cur), linha, font=fontes["lead"], fill=COLOR_TEXT_BODY)
        y_cur += 26

    # 7. Os 3 Checklists Visuais com [✓] Dourado/Bronze (Informação completa no próprio card!)
    y_cur += 14
    max_text_w = 495
    for idx, (chk_titulo, chk_texto) in enumerate(info["checklists"]):
        cor_chk = CHECK_COLORS[idx % len(CHECK_COLORS)]
        linhas_chk = quebrar_texto(draw_ov, chk_texto, fontes["check_corpo"], max_text_w)
        linhas_chk = linhas_chk[:4]  # Permite até 4 linhas completas por item sem truncar
        box_h = max(72, 38 + len(linhas_chk) * 23 + 12)

        # Card translúcido branco/marfim para destacar cada ponto
        draw_ov.rounded_rectangle(
            [(x_left, y_cur), (x_left + 575, y_cur + box_h)],
            radius=12,
            fill=(255, 255, 255, 218),
            outline=(197, 168, 128, 95),
            width=1,
        )

        # Quadrado [✓] colorido à esquerda
        chk_size = 38
        chk_x = x_left + 16
        chk_y = y_cur + 16
        desenhar_check_box(draw_ov, chk_x, chk_y, chk_size, cor_chk)

        # Título em negrito e texto completo ao lado do [✓]
        txt_x = chk_x + chk_size + 16
        draw_ov.text((txt_x, y_cur + 11), chk_titulo, font=fontes["check_titulo"], fill=COLOR_BRONZE_TITLE)

        ty = y_cur + 37
        for l_chk in linhas_chk:
            draw_ov.text((txt_x, ty), l_chk, font=fontes["check_corpo"], fill=COLOR_TEXT_DARK)
            ty += 22

        y_cur += box_h + 12

    # 8. Bloco de Orientação Médica / Callout Inferior
    if y_cur < 885:
        linhas_call = quebrar_texto(draw_ov, info["box_destaque_texto"], fontes["callout_reg"], 540)[:2]
        call_h = 34 + len(linhas_call) * 22 + 10
        draw_ov.rounded_rectangle(
            [(x_left, y_cur), (x_left + 575, y_cur + call_h)],
            radius=10,
            fill=(244, 236, 223, 235),
            outline=(180, 138, 72, 130),
            width=1,
        )
        draw_ov.rounded_rectangle(
            [(x_left, y_cur), (x_left + 6, y_cur + call_h)],
            radius=3,
            fill=COLOR_GOLD_SCRIPT,
        )
        draw_ov.text((x_left + 18, y_cur + 8), f"✦ {info['box_destaque_label']}", font=fontes["badge"], fill=COLOR_GOLD_SCRIPT)
        cy = y_cur + 30
        for l_c in linhas_call:
            draw_ov.text((x_left + 18, cy), l_c, font=fontes["callout_reg"], fill=COLOR_BRONZE_TITLE)
            cy += 21

    # 9. Selo Editorial no Canto Inferior Direito (igual "Clube do Sculptra" / "Clube do Laser")
    selo_dir_w = 260
    selo_dir_h = 66
    selo_dir_x = largura - selo_dir_w - 56
    selo_dir_y = 892
    draw_ov.rounded_rectangle(
        [(selo_dir_x, selo_dir_y), (selo_dir_x + selo_dir_w, selo_dir_y + selo_dir_h)],
        radius=33,
        fill=(250, 247, 242, 235),
        outline=(197, 168, 128, 160),
        width=1,
    )
    draw_ov.text((selo_dir_x + 26, selo_dir_y + 10), info["assinatura_clube"], font=fontes["script_sm"], fill=COLOR_GOLD_SCRIPT)

    # 10. Rodapé Institucional com Assinatura Médica e Site
    y_rodape = 974
    draw_ov.line([(x_left, y_rodape), (largura - 68, y_rodape)], fill=(197, 168, 128, 120), width=1)
    draw_ov.text(
        (x_left, y_rodape + 14),
        f"{info['medico_nome']}  •  {info['medico_crm']}",
        font=fontes["rodape_bold"],
        fill=COLOR_BRONZE_TITLE,
    )
    draw_ov.text(
        (largura - 310, y_rodape + 14),
        "institutodermaline.com.br",
        font=fontes["rodape_bold"],
        fill=COLOR_GOLD_SCRIPT,
    )

    # Combina camadas e salva
    img_final = Image.alpha_composite(img, overlay).convert("RGB")
    img_final.save(card_path, "PNG", quality=95)
    img_final.save(card_hoje_pilar_path, "PNG", quality=95)
    img_final.save(card_hoje_geral_path, "PNG", quality=95)

    print(f"[✓] Card [{pilar.upper()}] gerado com sucesso: {card_path}")
    return card_path, card_hoje_pilar_path


def montar_legenda_pilar(dia, dica, pilar):
    """Constrói uma legenda exclusiva, aprofundada e magnética para cada um dos 3 posts do dia."""
    rodape_padrao = """---
👉 Acesse o link na nossa bio para ler o Diário Dermaline completo e agendar sua consulta personalizada!
🌐 www.institutodermaline.com.br

🏥 Instituto Dermaline | Medicina Integrativa & Dermatologia Avançada
👨‍⚕️ Dr. Renato Nakad Gouveia | CRM-DF 17680
👩‍⚕️ Dra. Line Manuelle Gouveia | CRM-DF 17449
📍 Shopping Conjunto Nacional, Torre Vermelha, Salas 5040/5042 - Brasília/DF
📲 Agendamentos: (61) 99173-6660"""

    if pilar == "nutricao":
        n = dica["nutriente"]
        return f"""🌿 {n['habito_titulo']}
Diário de Longevidade Dermaline • Edição #{dia:02d} (Parte 1/3)

{n['habito_descricao']}

✨ NUTRIENTE EM FOCO: {n['nutriente_nome']} ({n['nutriente_tipo']})
✅ Benefício Celular: {n['o_que_faz']}
🥗 Melhores Fontes: {n['fontes_alimentares']}

💡 Orientação Médica ({n['medico']}):
"{n['orientacao_medica']}"

Salve este post para consultar sempre que precisar e compartilhe com quem busca saúde e longevidade celular! ✨

{rodape_padrao}

#InstitutoDermaline #MedicinaIntegrativa #NutricaoCelular #LongevidadeSaudavel #DrRenatoNakad #SaudeIntegrativa #Brasilia #VitalidadeCelular""".strip()

    elif pilar == "dermatologia":
        d = dica["dermatologia"]
        return f"""🔬 {d['titulo']}
Diário de Saúde da Pele Dermaline • Edição #{dia:02d} (Parte 2/3)

✅ Entenda a Condição:
{d['descricao']}

📌 Sinais de Alerta & Cuidados Práticos:
{d['destaque_texto']}

💡 Orientação Dermatológica ({d['medico']}):
"{d['orientacao_medica']}"

Sua pele reflete sua saúde interna e seus hábitos diários. Salve esta dica da Dra. Line Manuelle e compartilhe! ✨

{rodape_padrao}

#InstitutoDermaline #DermatologiaBrasilia #DermatologiaClinica #SaudeDaPele #DraLineManuelle #CuidadosComAPele #SkincareMedico #Brasilia""".strip()

    else:  # beleza
        b = dica["beleza"]
        return f"""✨ {b['titulo']}
Diário de Beleza Consciente Dermaline • Edição #{dia:02d} (Parte 3/3)

💎 Como Funciona na Derme:
{b['descricao']}

✅ Benefícios & Resultados:
{b['destaque_texto']}

💡 Recomendação Especializada ({b['medico']}):
"{b['orientacao_medica']}"

Pronta para cuidar da sua pele com protocolos médicos de alta performance e naturalidade? Salve este post! ✨

{rodape_padrao}

#InstitutoDermaline #EsteticaAvancada #BelezaConsciente #RejuvenescimentoNatural #DraLineManuelle #DermatologiaEstetica #SkincareLuxo #Brasilia""".strip()


def publicar_facebook_pagina(card_path, legenda):
    """Publica a foto e a legenda diretamente na Página do Facebook."""
    if not META_ACCESS_TOKEN or not FACEBOOK_PAGE_ID:
        print("[!] Facebook: META_ACCESS_TOKEN ou FACEBOOK_PAGE_ID não configurados.")
        return False

    url = f"https://graph.facebook.com/v20.0/{FACEBOOK_PAGE_ID}/photos"
    print(f"[*] Enviando publicação para a Página do Facebook ({FACEBOOK_PAGE_ID})...")

    with open(card_path, "rb") as img_file:
        files = {"source": img_file}
        data = {
            "caption": legenda,
            "access_token": META_ACCESS_TOKEN,
        }
        res = requests.post(url, files=files, data=data)

    if res.status_code == 200:
        resp_json = res.json()
        print(f"[✓] Facebook: Post publicado com sucesso! ID: {resp_json.get('id')}")
        return True
    else:
        print(f"[X] Facebook Erro ({res.status_code}): {res.text}")
        return False


def publicar_instagram(image_url, legenda):
    """Cria o container e publica a foto com a legenda no Feed do Instagram."""
    if not META_ACCESS_TOKEN or not INSTAGRAM_ACCOUNT_ID:
        print("[!] Instagram: META_ACCESS_TOKEN ou INSTAGRAM_ACCOUNT_ID não configurados.")
        return False

    print(f"[*] Criando container de publicação no Instagram ({INSTAGRAM_ACCOUNT_ID})...")
    container_url = f"https://graph.facebook.com/v20.0/{INSTAGRAM_ACCOUNT_ID}/media"
    container_payload = {
        "image_url": image_url,
        "caption": legenda,
        "access_token": META_ACCESS_TOKEN,
    }

    res_container = requests.post(container_url, data=container_payload)
    if res_container.status_code != 200:
        print(f"[X] Instagram Erro ao criar container ({res_container.status_code}): {res_container.text}")
        return False

    creation_id = res_container.json().get("id")
    print(f"[✓] Instagram: Container criado! ID: {creation_id}. Aguardando 10 segundos para processamento...")
    time.sleep(10)

    print("[*] Publicando container no Feed do Instagram...")
    publish_url = f"https://graph.facebook.com/v20.0/{INSTAGRAM_ACCOUNT_ID}/media_publish"
    publish_payload = {
        "creation_id": creation_id,
        "access_token": META_ACCESS_TOKEN,
    }

    res_publish = requests.post(publish_url, data=publish_payload)
    if res_publish.status_code == 200:
        media_id = res_publish.json().get("id")
        print(f"[✓] Instagram: Post publicado com sucesso no Feed! Media ID: {media_id}")
        return True
    else:
        print(f"[X] Instagram Erro ao publicar ({res_publish.status_code}): {res_publish.text}")
        return False


def main():
    print("=" * 72)
    print("  INSTITUTO DERMALINE - ROBÔ DE PUBLICAÇÃO (3 POSTS SEPARADOS / DIA)")
    print("=" * 72)

    dia, dica, _ = carregar_conteudo()
    pilar_arg = obter_pilar_argumento()
    pilares_para_processar = (
        ["nutricao", "dermatologia", "beleza"] if pilar_arg == "todos" else [pilar_arg]
    )

    print(f"[*] Dia / Edição Atual: #{dia:02d} ({dica.get('dia_semana', '')})")
    print(f"[*] Pilares selecionados: {', '.join(p.upper() for p in pilares_para_processar)}")

    apenas_card = "--apenas-card" in sys.argv
    apenas_publicar = "--apenas-publicar" in sys.argv

    arquivos_gerados = {}

    # 1. Gera sempre os cards solicitados
    if not apenas_publicar:
        for p in pilares_para_processar:
            card_path, card_hoje_pilar = gerar_card_pilar(dia, dica, p)
            arquivos_gerados[p] = (card_path, card_hoje_pilar)
    else:
        for p in pilares_para_processar:
            cod = estruturar_dados_pilar(dia, dica, p)["codigo_arquivo"]
            card_path = os.path.join(CARDS_DIR, f"card_edicao_{dia:02d}_{cod}.png")
            card_hoje_pilar = os.path.join(CARDS_DIR, f"card_hoje_{cod}.png")
            if not os.path.exists(card_hoje_pilar):
                card_path, card_hoje_pilar = gerar_card_pilar(dia, dica, p)
            arquivos_gerados[p] = (card_path, card_hoje_pilar)

    if apenas_card:
        print("[✓] Etapa de geração de cards concluída com sucesso.")
        return

    # 2. Publica cada pilar selecionado no Facebook e Instagram
    for idx, p in enumerate(pilares_para_processar):
        card_path, card_hoje_pilar = arquivos_gerados[p]
        cod = estruturar_dados_pilar(dia, dica, p)["codigo_arquivo"]
        legenda = montar_legenda_pilar(dia, dica, p)

        # Cache-busting query string por edição para garantir que a Meta baixe a imagem mais recente
        image_url_publica = (
            f"https://raw.githubusercontent.com/{REPO_SLUG}/{BRANCH_NAME}/assets/images/cards/card_hoje_{cod}.png?ed={dia:02d}"
        )

        if META_ACCESS_TOKEN:
            print(f"\n--- DISPARANDO POST [{idx + 1}/{len(pilares_para_processar)}]: {p.upper()} ---")
            fb_ok = publicar_facebook_pagina(card_hoje_pilar, legenda)
            ig_ok = publicar_instagram(image_url_publica, legenda)
            print(
                f"  -> Resultado [{p.upper()}]: Facebook = {'✓ SUCESSO' if fb_ok else 'FALHA'} | Instagram = {'✓ SUCESSO' if ig_ok else 'FALHA'}"
            )
            if idx + 1 < len(pilares_para_processar):
                print("[*] Aguardando 8 segundos antes do próximo post...")
                time.sleep(8)
        else:
            print(f"\n[i] MODO LOCAL ({p.upper()}): Card salvo em {card_path}")


if __name__ == "__main__":
    main()
