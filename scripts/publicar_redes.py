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
LOGO_PATH = os.path.join(BASE_DIR, "assets", "images", "logo_dermaline_original.png")

# Credenciais da Meta (obtidas via variáveis de ambiente / GitHub Secrets)
META_ACCESS_TOKEN = os.environ.get("META_ACCESS_TOKEN", "").strip()
FACEBOOK_PAGE_ID = os.environ.get("FACEBOOK_PAGE_ID", "457804507635117").strip()
INSTAGRAM_ACCOUNT_ID = os.environ.get("INSTAGRAM_ACCOUNT_ID", "17841404225729043").strip()
REPO_SLUG = os.environ.get("GITHUB_REPOSITORY", "renatonakad-byte/Instituto-Dermaline-Website")
BRANCH_NAME = os.environ.get("GITHUB_REF_NAME", "main")

# Paleta Visual do Instituto Dermaline
COLOR_BG_DARK = (14, 17, 19)          # #0E1113 - Carvão nobre
COLOR_BG_CARD = (21, 25, 28)          # #15191C - Superfície do card
COLOR_GOLD = (197, 168, 128)          # #C5A880 - Ouro primário
COLOR_GOLD_LIGHT = (223, 202, 171)    # #DFCAAB - Ouro claro
COLOR_GOLD_BORDER = (197, 168, 128, 90)
COLOR_WHITE = (250, 249, 246)         # #FAF9F6 - Marfim
COLOR_TEXT_MUTED = (160, 168, 176)    # Cinza elegante


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
    """Tenta carregar fontes elegantes do sistema ou usa fontes padrão como fallback."""
    fontes_serif = ["georgia.ttf", "times.ttf", "timesbd.ttf", "DejaVuSerif.ttf"]
    fontes_sans = ["arial.ttf", "tahoma.ttf", "DejaVuSans.ttf"]
    
    font_titulo = None
    font_sub = None
    font_corpo = None
    font_destaque = None

    for nome in fontes_serif:
        try:
            font_titulo = ImageFont.truetype(nome, 38)
            font_sub = ImageFont.truetype(nome, 26)
            break
        except Exception:
            continue

    for nome in fontes_sans:
        try:
            font_corpo = ImageFont.truetype(nome, 22)
            font_destaque = ImageFont.truetype(nome, 25)
            break
        except Exception:
            continue

    if not font_titulo:
        font_titulo = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_corpo = ImageFont.load_default()
        font_destaque = ImageFont.load_default()

    return font_titulo, font_sub, font_corpo, font_destaque


def gerar_card_imagem(dia, dica):
    """Gera um card quadrado 1080x1080 com design editorial premium do Instituto Dermaline."""
    os.makedirs(CARDS_DIR, exist_ok=True)
    card_path = os.path.join(CARDS_DIR, f"card_diario_edicao_{dia:02d}.png")
    card_hoje_path = os.path.join(CARDS_DIR, "card_hoje.png")

    largura, altura = 1080, 1080
    img = Image.new("RGBA", (largura, altura), COLOR_BG_DARK)
    draw = ImageDraw.Draw(img)

    # 1. Moldura Dourada Sofisticada
    margem = 40
    draw.rectangle(
        [(margem, margem), (largura - margem, altura - margem)],
        outline=COLOR_GOLD,
        width=2
    )
    # Borda interna fina
    margem_interna = 46
    draw.rectangle(
        [(margem_interna, margem_interna), (largura - margem_interna, altura - margem_interna)],
        outline=(197, 168, 128, 50),
        width=1
    )

    # 2. Logotipo e Cabeçalho Superior
    y_cursor = 70
    if os.path.exists(LOGO_PATH):
        try:
            logo = Image.open(LOGO_PATH).convert("RGBA")
            # Redimensiona mantendo proporção
            logo.thumbnail((90, 90), Image.Resampling.LANCZOS)
            x_logo = (largura - logo.width) // 2
            img.paste(logo, (x_logo, y_cursor), logo)
            y_cursor += logo.height + 15
        except Exception as e:
            print(f"[!] Aviso logo: {e}")
            y_cursor += 30

    font_titulo, font_sub, font_corpo, font_destaque = obter_fontes()

    # Nome da Clínica
    texto_clinica = "INSTITUTO DERMALINE"
    bbox = draw.textbbox((0, 0), texto_clinica, font=font_sub)
    draw.text(((largura - (bbox[2] - bbox[0])) // 2, y_cursor), texto_clinica, font=font_sub, fill=COLOR_GOLD_LIGHT)
    y_cursor += 36

    # Tag Badge: Pílula Diária • Edição #X
    tag_edicao = f"DIÁRIO DE SAÚDE & LONGEVIDADE • EDIÇÃO #{dia:02d}"
    bbox_tag = draw.textbbox((0, 0), tag_edicao, font=font_corpo)
    draw.text(((largura - (bbox_tag[2] - bbox_tag[0])) // 2, y_cursor), tag_edicao, font=font_corpo, fill=COLOR_TEXT_MUTED)
    y_cursor += 45

    # Linha divisória dourada
    draw.line([(margem + 150, y_cursor), (largura - margem - 150, y_cursor)], fill=COLOR_GOLD, width=1)
    y_cursor += 35

    # 3. Os Três Pilares da Dica Diária
    pilares = [
        {
            "tag": "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
            "titulo": dica["nutriente"]["habito_titulo"],
            "destaque": f"Nutriente: {dica['nutriente']['nutriente_nome']} ({dica['nutriente']['nutriente_tipo']})",
            "descricao": dica["nutriente"]["habito_descricao"],
            "medico": dica["nutriente"]["medico"]
        },
        {
            "tag": "DERMATOLOGIA CLÍNICA",
            "titulo": dica["dermatologia"]["titulo"],
            "destaque": dica["dermatologia"]["destaque_texto"],
            "descricao": dica["dermatologia"]["descricao"],
            "medico": dica["dermatologia"]["medico"]
        },
        {
            "tag": "BELEZA CONSCIENTE & PROTOCOLOS",
            "titulo": dica["beleza"]["titulo"],
            "destaque": dica["beleza"]["destaque_texto"],
            "descricao": dica["beleza"]["descricao"],
            "medico": dica["beleza"]["medico"]
        }
    ]

    card_largura = largura - (margem * 2) - 60
    card_x = margem + 30
    bloco_altura = 190

    for i, p in enumerate(pilares):
        bloco_y = y_cursor + (i * (bloco_altura + 15))
        
        # Caixa de fundo sutil para cada pilar
        draw.rounded_rectangle(
            [(card_x, bloco_y), (card_x + card_largura, bloco_y + bloco_altura)],
            radius=12,
            fill=COLOR_BG_CARD,
            outline=(197, 168, 128, 60),
            width=1
        )

        # Barra lateral dourada de destaque
        draw.rounded_rectangle(
            [(card_x, bloco_y), (card_x + 6, bloco_y + bloco_altura)],
            radius=3,
            fill=COLOR_GOLD
        )

        # Cabeçalho do Pilar (Tag em ouro nobre)
        tag_texto = p['tag']
        draw.text((card_x + 22, bloco_y + 14), tag_texto, font=font_corpo, fill=COLOR_GOLD)

        # Título do Pilar
        draw.text((card_x + 22, bloco_y + 44), p["titulo"], font=font_destaque, fill=COLOR_WHITE)

        # Destaque / Dica Prática (limitado a 2 linhas)
        linhas_destaque = quebrar_texto(draw, p["destaque"], font_corpo, card_largura - 45)
        for idx, linha in enumerate(linhas_destaque[:2]):
            draw.text((card_x + 22, bloco_y + 80 + (idx * 26)), linha, font=font_corpo, fill=COLOR_GOLD_LIGHT)

        # Linha de assinatura médica discreta no pilar
        medico_tag = f"Orientação: {p['medico']}"
        draw.text((card_x + 22, bloco_y + 148), medico_tag, font=font_corpo, fill=COLOR_TEXT_MUTED)

    # 4. Rodapé Elegante com Redes e Localização
    y_rodape = altura - margem - 75
    draw.line([(margem + 100, y_rodape), (largura - margem - 100, y_rodape)], fill=COLOR_GOLD, width=1)
    
    rodape_linha1 = "Dr. Renato Nakad Gouveia • Dra. Line Manuelle Gouveia"
    bbox_r1 = draw.textbbox((0, 0), rodape_linha1, font=font_corpo)
    draw.text(((largura - (bbox_r1[2] - bbox_r1[0])) // 2, y_rodape + 14), rodape_linha1, font=font_corpo, fill=COLOR_GOLD_LIGHT)

    rodape_linha2 = "Instagram: @institutodermaline • Site: institutodermaline.com.br"
    bbox_r2 = draw.textbbox((0, 0), rodape_linha2, font=font_corpo)
    draw.text(((largura - (bbox_r2[2] - bbox_r2[0])) // 2, y_rodape + 42), rodape_linha2, font=font_corpo, fill=COLOR_TEXT_MUTED)

    # Salva os arquivos de imagem
    img_rgb = img.convert("RGB")
    img_rgb.save(card_path, "PNG", quality=95)
    img_rgb.save(card_hoje_path, "PNG", quality=95)

    print(f"[✓] Card gerado com sucesso: {card_path}")
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
🏥 Instituto Dermaline | Medicina Integrativa & Dermatologia Avançada
👨‍⚕️ Dr. Renato Nakad Gouveia | CRM-DF 17680
👩‍⚕️ Dra. Line Manuelle Gouveia | CRM-DF 17449
🌐 Acesse o acervo completo e artigos científicos no site: institutodermaline.com.br
📍 Brasília - DF

#InstitutoDermaline #DermatologiaBrasilia #MedicinaIntegrativa #Skincare #SaudeDaPele #LongevidadeSaudavel #NutricaoCelular #DicasDeSaude #Brasilia #DraLineManuelle #DrRenatoNakad
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
