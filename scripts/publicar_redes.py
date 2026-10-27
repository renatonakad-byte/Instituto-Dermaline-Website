"""
=============================================================================
INSTITUTO DERMALINE - ROBÔ DE PUBLICAÇÃO DIÁRIA NAS REDES SOCIAIS
Publica automaticamente no Instagram e Facebook a Pílula do Dia
=============================================================================
"""

import os
import sys
import json
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
INSTAGRAM_ACCOUNT_ID = os.environ.get("INSTAGRAM_ACCOUNT_ID", "17841404225729043").strip()
REPO_SLUG = os.environ.get("GITHUB_REPOSITORY", "renatonakad-byte/Instituto-Dermaline-Website")
BRANCH_NAME = os.environ.get("GITHUB_REF_NAME", "main")

# Paleta Visual Editorial de Alto Padrão (Warm Champagne & Marfim Nobre)
COLOR_BG_IVORY = (250, 248, 244)       # #FAF8F4 - Marfim nobre luminoso
COLOR_GOLD = (197, 168, 128)           # #C5A880 - Ouro acetinado Dermaline
COLOR_GOLD_DARK = (154, 123, 80)       # #9A7B50 - Ouro profundo
COLOR_CHARCOAL_DARK = (24, 28, 32)     # #181C20 - Carvão profundo elegante
COLOR_CHARCOAL_TEXT = (61, 68, 74)     # #3D444A - Texto editorial
COLOR_MUTED = (107, 114, 128)          # #6B7280 - Subtexto sutil
COLOR_WHITE = (255, 255, 255)


def carregar_conteudo():
    """Lê o arquivo conteudo_diario.json e retorna a pílula do dia atual."""
    with open(CONTEUDO_PATH, "r", encoding="utf-8") as f:
        dados = json.load(f)

    config = dados.get("config", {})
    total_dias = config.get("total_dias", 32)
    data_pub_str = config.get("data_publicacao_site", "")

    # Se houver data de publicação configurada, calcula o dia relativo
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

    # Permite forçar o dia via argumento no terminal (ex: python publicar_redes.py 5)
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        dia_atual = int(sys.argv[1])

    dicas = dados.get("dicas_diarias", [])
    dica_do_dia = next((d for d in dicas if d.get("dia") == dia_atual), dicas[0] if dicas else None)

    return dia_atual, dica_do_dia, dados.get("artigo_semana", {})


def quebrar_texto(draw, texto, font, max_largura):
    """Quebra o texto em múltiplas linhas para caber dentro da largura do card."""
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
    """Carrega fontes nobres da pasta assets/fonts ou fontes do sistema como fallback."""
    font_script_path = os.path.join(FONTS_DIR, "AlexBrush-Regular.ttf")
    font_serif_path = os.path.join(FONTS_DIR, "Georgia-Bold.ttf")
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

    font_script = carregar(font_script_path, 58, ["AlexBrush-Regular.ttf", "segoesc.ttf", "georgiai.ttf"])
    font_titulo = carregar(font_serif_path, 40, ["georgiab.ttf", "timesbd.ttf", "DejaVuSerif-Bold.ttf"])
    font_corpo = carregar(font_sans_path, 21, ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"])
    font_destaque = carregar(font_sans_bold_path, 21, ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"])
    font_cta = carregar(font_sans_bold_path, 20, ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"])
    font_pequena = carregar(font_sans_path, 15, ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"])

    return font_script, font_titulo, font_corpo, font_destaque, font_cta, font_pequena


def criar_mascara_gradiente(largura, altura):
    """Cria uma máscara suave marfim/champagne para o lado esquerdo do card."""
    grad = Image.new("RGBA", (largura, altura), (0, 0, 0, 0))
    cor_rgb = COLOR_BG_IVORY
    x_solid = 440
    x_fade = 690

    for x in range(largura):
        if x <= x_solid:
            alpha = 248
        elif x < x_fade:
            import math
            t = (x - x_solid) / (x_fade - x_solid)
            factor = (1.0 + math.cos(t * math.pi)) / 2.0
            alpha = int(248 * factor)
        else:
            alpha = 0

        if alpha > 0:
            coluna = Image.new("RGBA", (1, altura), (*cor_rgb, alpha))
            grad.paste(coluna, (x, 0))

    return grad


def gerar_card_imagem(dia, dica):
    """Gera um card quadrado 1080x1080 com design editorial premium e alta conversão."""
    os.makedirs(CARDS_DIR, exist_ok=True)
    card_path = os.path.join(CARDS_DIR, f"card_diario_edicao_{dia:02d}.png")
    card_hoje_path = os.path.join(CARDS_DIR, "card_hoje.png")

    largura, altura = 1080, 1080

    # 1. Carrega o template editorial (rotaciona entre os modelos estéticos)
    template_idx = ((dia - 1) % 3) + 1
    template_path = os.path.join(TEMPLATES_DIR, f"bg_editorial_{template_idx}.jpg")
    if os.path.exists(template_path):
        base_img = Image.open(template_path).convert("RGBA")
        if base_img.size != (largura, altura):
            base_img = base_img.resize((largura, altura), Image.Resampling.LANCZOS)
    else:
        base_img = Image.new("RGBA", (largura, altura), COLOR_BG_IVORY)

    # 2. Aplica máscara de luminosidade/gradiente no lado esquerdo para legibilidade
    gradiente = criar_mascara_gradiente(largura, altura)
    img = Image.alpha_composite(base_img, gradiente)
    draw = ImageDraw.Draw(img)

    # 3. Moldura sutil elegante (padrão marcas de luxo)
    draw.rectangle([(36, 36), (largura - 36, altura - 36)], outline=(197, 168, 128, 100), width=1)

    # 4. Fontes
    font_script, font_titulo, font_corpo, font_destaque, font_cta, font_pequena = obter_fontes()

    # 5. Topo: Handle oficial e badge de edição
    draw.text((72, 66), "@institutodermaline", font=font_destaque, fill=(45, 51, 56))

    tag_edicao = f"EDIÇÃO #{dia:02d}"
    bbox_ed = draw.textbbox((0, 0), tag_edicao, font=font_pequena)
    ed_w = bbox_ed[2] - bbox_ed[0] + 20
    tag_x = 350
    draw.rounded_rectangle([(tag_x, 66), (tag_x + ed_w, 92)], radius=13, fill=(197, 168, 128, 45), outline=(197, 168, 128, 110), width=1)
    draw.text((tag_x + 10, 71), tag_edicao, font=font_pequena, fill=COLOR_GOLD_DARK)

    # 6. Eyebrow Cursivo em Dourado Luxo
    script_titles = [
        "Pílula de Longevidade",
        "Segredos da Longevidade",
        "Dermatologia & Saúde",
        "Beleza & Vitalidade Celular",
        "Medicina Integrativa"
    ]
    eyebrow = script_titles[(dia - 1) % len(script_titles)]
    draw.text((72, 124), eyebrow, font=font_script, fill=COLOR_GOLD_DARK)

    # 7. Gancho Principal (Headline de Alto Impacto)
    titulo = dica["nutriente"]["habito_titulo"]
    linhas_titulo = quebrar_texto(draw, titulo, font_titulo, 530)
    y_cur = 202
    for linha in linhas_titulo[:2]:
        draw.text((72, y_cur), linha, font=font_titulo, fill=COLOR_CHARCOAL_DARK)
        y_cur += 50

    # 8. Teaser Sucinto e Magnético
    y_cur += 8
    desc = dica["nutriente"]["habito_descricao"]
    if len(desc) > 130:
        desc = desc[:127] + "..."
    linhas_desc = quebrar_texto(draw, desc, font_corpo, 490)
    for linha in linhas_desc[:2]:
        draw.text((72, y_cur), linha, font=font_corpo, fill=COLOR_CHARCOAL_TEXT)
        y_cur += 28

    # 9. As 3 Pílulas Rápidas do Dia (Cards Minimalistas com Destaque Dourado)
    y_cur += 16
    itens = [
        ("1. NUTRIÇÃO CELULAR", f"{dica['nutriente']['nutriente_nome']} • {dica['nutriente']['nutriente_tipo']}"),
        ("2. DERMATOLOGIA", f"{dica['dermatologia']['titulo']}"),
        ("3. BELEZA ATIVA", f"{dica['beleza']['titulo']}")
    ]
    card_w = 500
    card_h = 42
    for cat, val in itens:
        draw.rounded_rectangle([(72, y_cur), (72 + card_w, y_cur + card_h)], radius=8, fill=(255, 255, 255, 215), outline=(197, 168, 128, 80), width=1)
        draw.rounded_rectangle([(72, y_cur), (76, y_cur + card_h)], radius=3, fill=COLOR_GOLD)
        draw.text((88, y_cur + 11), cat, font=font_pequena, fill=COLOR_GOLD_DARK)
        if len(val) > 34:
            val = val[:32] + "..."
        draw.text((230, y_cur + 11), val, font=font_corpo, fill=(45, 51, 56))
        y_cur += 50

    # 10. Botão de Chamada para Ação (CTA Capsule Luxo)
    y_cur += 14
    btn_w = 440
    btn_h = 56
    draw.rounded_rectangle([(72, y_cur), (72 + btn_w, y_cur + btn_h)], radius=28, fill=COLOR_GOLD)
    texto_btn = "Ler Matéria Completa no Diário  ↗"
    bbox_btn = draw.textbbox((0, 0), texto_btn, font=font_cta)
    w_btn_txt = bbox_btn[2] - bbox_btn[0]
    draw.text((72 + (btn_w - w_btn_txt) // 2, y_cur + 15), texto_btn, font=font_cta, fill=(255, 255, 255))

    # 11. Rodapé Médico e Link Oficial
    y_rodape = 980
    draw.line([(72, y_rodape), (600, y_rodape)], fill=(197, 168, 128, 90), width=1)
    draw.text((72, y_rodape + 14), "Dr. Renato Nakad • Dra. Line Manuelle", font=font_pequena, fill=COLOR_MUTED)
    draw.text((435, y_rodape + 14), "institutodermaline.com.br", font=font_destaque, fill=COLOR_GOLD_DARK)

    # 12. Salva os arquivos de imagem
    img_rgb = img.convert("RGB")
    img_rgb.save(card_path, "PNG", quality=95)
    img_rgb.save(card_hoje_path, "PNG", quality=95)

    print(f"[✓] Card editorial gerado com sucesso: {card_path}")
    print(f"[✓] Card de hoje atualizado: {card_hoje_path}")

    return card_path, card_hoje_path


def montar_legenda(dia, dica):
    """Constrói a legenda completa e atraente para o Instagram e Facebook com hashtags."""
    n = dica["nutriente"]
    d = dica["dermatologia"]
    b = dica["beleza"]

    legenda = f"""✨ Diário Dermaline • Edição #{dia:02d}
Pílula Diária de Saúde, Dermatologia & Longevidade

🌿 {n['tag']}
• Hábito do Dia: {n['habito_titulo']}
{n['habito_descricao']}
• Nutriente em Foco: {n['nutriente_nome']} ({n['nutriente_tipo']})
👉 O que faz: {n['o_que_faz']}
🌱 Fontes: {n['fontes_alimentares']}
💡 {n['orientacao_medica']}

🔬 {d['tag']}
• {d['titulo']}
{d['descricao']}
📌 {d['destaque_texto']}
💡 {d['orientacao_medica']}

✨ {b['tag']}
• {b['titulo']}
{b['descricao']}
💎 {b['destaque_texto']}
💡 {b['orientacao_medica']}

---
👉 Gostou? Toque no link da nossa bio para acessar o Diário Dermaline e conferir o acervo completo de artigos médicos e reflexões de longevidade no site!
🌐 www.institutodermaline.com.br

🏥 Instituto Dermaline | Medicina Integrativa & Dermatologia Avançada
👨‍⚕️ Dr. Renato Nakad Gouveia | CRM-DF 17680
👩‍⚕️ Dra. Line Manuelle Gouveia | CRM-DF 17449
📍 Shopping Conjunto Nacional, Torre Vermelha, Salas 5040/5042 - Brasília/DF
📲 Agendamentos: (61) 99173-6660

#InstitutoDermaline #DermatologiaBrasilia #MedicinaIntegrativa #Skincare #SaudeDaPele #LongevidadeSaudavel #NutricaoCelular #DicasDeSaude #Brasilia #DraLineManuelle #DrRenatoNakad #EsteticaAvancada
"""
    return legenda.strip()


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
            "access_token": META_ACCESS_TOKEN
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
        "access_token": META_ACCESS_TOKEN
    }

    res_container = requests.post(container_url, data=container_payload)
    if res_container.status_code != 200:
        print(f"[X] Instagram Erro ao criar container ({res_container.status_code}): {res_container.text}")
        return False

    creation_id = res_container.json().get("id")
    print(f"[✓] Instagram: Container criado! ID: {creation_id}. Aguardando 10 segundos para processamento...")
    time.sleep(10)

    print(f"[*] Publicando container no Feed do Instagram...")
    publish_url = f"https://graph.facebook.com/v20.0/{INSTAGRAM_ACCOUNT_ID}/media_publish"
    publish_payload = {
        "creation_id": creation_id,
        "access_token": META_ACCESS_TOKEN
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
    print("=" * 65)
    print("  INSTITUTO DERMALINE - ROBÔ DE PUBLICAÇÃO AUTOMÁTICA")
    print("=" * 65)

    dia, dica, artigo = carregar_conteudo()
    print(f"[*] Dia / Edição Atual: #{dia:02d} ({dica.get('dia_semana', '')})")

    apenas_card = "--apenas-card" in sys.argv
    apenas_publicar = "--apenas-publicar" in sys.argv

    # 1. Gera o Card Visual 1080x1080
    if not apenas_publicar:
        card_path, card_hoje_path = gerar_card_imagem(dia, dica)
    else:
        card_path = os.path.join(CARDS_DIR, f"card_diario_edicao_{dia:02d}.png")
        card_hoje_path = os.path.join(CARDS_DIR, "card_hoje.png")

    if apenas_card:
        print("[✓] Etapa de geração do card concluída.")
        return

    # 2. Monta a Legenda
    legenda = montar_legenda(dia, dica)

    # 3. URL pública da imagem no GitHub para o Instagram
    image_url_publica = (
        f"https://raw.githubusercontent.com/{REPO_SLUG}/{BRANCH_NAME}/assets/images/cards/card_hoje.png"
    )

    # 4. Publica nas Redes se as credenciais estiverem disponíveis
    if META_ACCESS_TOKEN:
        print("\n--- INICIANDO DISPAROS NA META API ---")
        fb_sucesso = publicar_facebook_pagina(card_hoje_path, legenda)
        ig_sucesso = publicar_instagram(image_url_publica, legenda)

        print("\n" + "=" * 65)
        print(f"  Resultado: Facebook = {'✓ SUCESSO' if fb_sucesso else 'FALHA'} | Instagram = {'✓ SUCESSO' if ig_sucesso else 'FALHA'}")
        print("=" * 65)
    else:
        print("\n[i] MODO LOCAL DE TESTE: META_ACCESS_TOKEN não configurado no ambiente.")
        print(f"[i] O card #{dia:02d} foi gerado em: {card_path}")
        print(f"[i] A legenda pronta foi estruturada com sucesso.")


if __name__ == "__main__":
    main()
