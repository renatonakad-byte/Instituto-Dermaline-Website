# 📖 Guia do Diário Dermaline: Lançamento Progressivo, Dicas Diárias & Artigos

Este guia explica exatamente como funciona o sistema de **Lançamento Progressivo**, a rotação das **32 Pílulas Diárias**, os **Artigos Semanais** e como acrescentar novos conteúdos quando as matérias atuais estiverem terminando, **sem bagunçar o projeto**.

---

## 🎯 1. Como Funciona o Início do Zero (Lançamento Oficial)

O sistema foi programado para que, a partir da data de publicação do site, os conteúdos comecem rigorosamente do **Dia 1 / Edição #01** e só sejam arquivados **após** a publicação de cada um:

* **Dia 1 de Publicação:**
  * O painel principal exibe a **Edição #01**.
  * O **Acervo de Dicas** abre contendo **apenas a Edição #01** (as edições futuras não vazam nem aparecem antes do dia).
  * O painel exibe o **Artigo Semanal #01**.
  * O **Acervo de Reflexões** abre contendo **apenas o Artigo #01**.
* **Dia 2 de Publicação:**
  * O painel avança automaticamente para a **Edição #02**.
  * O acervo passa a exibir **Edição #01 e Edição #02**.
* **Semana 2 (Dia 8 em diante):**
  * O painel avança automaticamente para o **Artigo Semanal #02** e as edições diárias continuam sequenciais sem repetir.
  * O acervo de artigos libera o Artigo #01 e o Artigo #02.

---

## ⚙️ 2. Como Ativar a Data de Lançamento no Arquivo

No arquivo [`conteudo_diario.json`](file:///c:/Users/Renato/Desktop/SITE%20DERMALINE/Site%20Dermaline%203/conteudo_diario.json), logo no início você encontra o bloco `"config"`:

```json
"config": {
  "rotacao_automatica": true,
  "total_dias": 32,
  "data_publicacao_site": "2026-10-01",
  "descricao": "Base de dados do Diário Dermaline..."
}
```

* **Para iniciar:** Basta preencher o campo `"data_publicacao_site"` com o dia em que o site for ao ar no formato `"AAAA-MM-DD"` (exemplo: `"2026-10-01"`).
* **Se deixar vazio (`""`):** O site inicia automaticamente no **Dia 1 (Edição #01)** como padrão de segurança.

---

## ➕ 3. Como Acrescentar Novas Matérias sem Bagunçar o Projeto

Quando estiver se aproximando do final das 32 pílulas (por exemplo, no dia 25 ou 28), você tem **duas formas extremamente seguras** de acrescentar novas edições:

### Método A: O Mais Fácil e Confortável (Direto no Chat)
Você não precisa mexer em nenhuma linha de código! Basta enviar aqui no chat:
> *"Antigravity, acrescente mais 15 pílulas diárias a partir da Edição #33 com foco em [Temas desejados ou livres]."*

O assistente insere as novas edições diretamente no banco de dados com formatação médica impecável, atualiza a contagem e o site continuará sequencialmente para o dia 33, 34, 35... **sem repetir e sem alterar nenhum outro arquivo do projeto**.

### Método B: Inserção Manual no `conteudo_diario.json`
Se preferir editar diretamente:
1. Abra o arquivo [`conteudo_diario.json`](file:///c:/Users/Renato/Desktop/SITE%20DERMALINE/Site%20Dermaline%203/conteudo_diario.json).
2. Vá até o final da lista `"dicas_diarias"`.
3. Adicione o novo objeto com `"dia": 33`, `"dia_semana": "Edição #33"`, preenchendo os 3 blocos (`nutriente`, `dermatologia`, `beleza`).
4. Atualize o campo `"total_dias"` no topo (ex: de 32 para 47).
5. Salve o arquivo. Pronto! O site reconhece o novo total na mesma hora.

---

## 🛡️ 4. Garantia de Estabilidade
* As edições futuras **nunca são exibidas no acervo antes da data**.
* O layout, o CSS e o HTML não precisam ser alterados quando novos conteúdos são inseridos.
* Todo o conteúdo continua protegido por fallback offline caso haja oscilações de rede.
