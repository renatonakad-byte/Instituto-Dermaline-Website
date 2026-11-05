/**
 * Renderizador de Alta Definição (1080x1080 PNG) para os 3 Posts Diários
 * Funciona tanto no Windows (Chrome/Edge) quanto no Linux/GitHub Actions (google-chrome/chromium).
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const root = path.join(__dirname, "..");
const cardsDir = path.join(root, "assets", "images", "cards");
const conteudoPath = path.join(root, "conteudo_diario.json");
fs.mkdirSync(cardsDir, { recursive: true });

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ttf": "font/ttf",
};

function calcularDiaAtual() {
  try {
    const raw = fs.readFileSync(conteudoPath, "utf-8");
    const dados = JSON.parse(raw);
    const config = dados.config || {};
    const dicas = dados.dicas_diarias || [];
    const totalDias = config.total_dias || dicas.length || 64;
    const dataPubStr = config.data_publicacao_site || "";
    if (dataPubStr) {
      const [ano, mes, dia] = dataPubStr.split("-").map(Number);
      const dataPub = Date.UTC(ano, mes - 1, dia);
      const hoje = new Date();
      const hojeUTC = Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate());
      const diasPassados = Math.floor((hojeUTC - dataPub) / (1000 * 60 * 60 * 24));
      if (diasPassados >= 0) {
        return (diasPassados % totalDias) + 1;
      }
    }
  } catch (e) {
    console.error("Erro ao calcular dia atual:", e.message);
  }
  return 1;
}

function localizarNavegador() {
  const candidatos = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];
  return candidatos.find((c) => fs.existsSync(c));
}

const server = http.createServer((req, res) => {
  const cleanUrl = decodeURIComponent(req.url.split("?")[0]);
  const relPath = cleanUrl === "/" ? "painel_preview_card.html" : cleanUrl.replace(/^\/+/, "");
  const filePath = path.join(root, relPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(0, "127.0.0.1", async () => {
  try {
    const port = server.address().port;
    const browser = localizarNavegador();
    if (!browser) {
      console.error("Navegador Chrome/Edge não encontrado.");
      server.close();
      process.exit(1);
    }

    const todosPilares = [
      { key: "nutricao", code: "1_nutricao" },
      { key: "dermatologia", code: "2_dermatologia" },
      { key: "beleza", code: "3_beleza" },
    ];

    // Verifica se foi passado --pilar <nome>
    let filtroPilar = "todos";
    const idxPilar = process.argv.indexOf("--pilar");
    if (idxPilar !== -1 && process.argv[idxPilar + 1]) {
      filtroPilar = process.argv[idxPilar + 1].toLowerCase();
    }

    const pilares =
      filtroPilar === "todos"
        ? todosPilares
        : todosPilares.filter((p) => p.key === filtroPilar);

    const diasArg = process.argv
      .slice(2)
      .filter((a, i, arr) => a !== "--pilar" && arr[i - 1] !== "--pilar")
      .map(Number)
      .filter(Boolean);

    const diasParaGerar = diasArg.length > 0 ? diasArg : [calcularDiaAtual()];

    for (const dia of diasParaGerar) {
      const diaStr = String(dia).padStart(2, "0");
      for (const p of pilares) {
        const outPath = path.join(cardsDir, `card_edicao_${diaStr}_${p.code}.png`);
        const url = `http://127.0.0.1:${port}/painel_preview_card.html?render=1&dia=${dia}&pilar=${p.key}`;
        await execFileAsync(browser, [
          "--headless=new",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--hide-scrollbars",
          "--window-size=1080,1080",
          "--force-device-scale-factor=1",
          "--virtual-time-budget=1800",
          `--screenshot=${outPath}`,
          url,
        ]);
        if (dia === diasParaGerar[diasParaGerar.length - 1]) {
          fs.copyFileSync(outPath, path.join(cardsDir, `card_hoje_${p.code}.png`));
          fs.copyFileSync(outPath, path.join(cardsDir, "card_hoje.png"));
        }
        console.log(`[✓] Card HD renderizado (1080x1080): ${path.basename(outPath)}`);
      }
    }
  } catch (err) {
    console.error("Erro na renderização:", err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
