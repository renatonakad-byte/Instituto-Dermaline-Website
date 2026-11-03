/**
 * Renderizador Local de Alta Definição (1080x1080 PNG) para os 3 Posts Diários
 * Utiliza o design oficial de painel_preview_card.html com Google Chrome / Edge Headless.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const root = path.join(__dirname, "..");
const cardsDir = path.join(root, "assets", "images", "cards");
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

function localizarNavegador() {
  const candidatos = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
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

    const pilares = [
      { key: "nutricao", code: "1_nutricao" },
      { key: "dermatologia", code: "2_dermatologia" },
      { key: "beleza", code: "3_beleza" },
    ];

    const diasArg = process.argv.slice(2).map(Number).filter(Boolean);
    const diasParaGerar = diasArg.length > 0 ? diasArg : [34];

    for (const dia of diasParaGerar) {
      const diaStr = String(dia).padStart(2, "0");
      for (const p of pilares) {
        const outPath = path.join(cardsDir, `card_edicao_${diaStr}_${p.code}.png`);
        const url = `http://127.0.0.1:${port}/painel_preview_card.html?render=1&dia=${dia}&pilar=${p.key}`;
        await execFileAsync(browser, [
          "--headless=new",
          "--disable-gpu",
          "--hide-scrollbars",
          "--window-size=1080,1080",
          "--force-device-scale-factor=1",
          "--virtual-time-budget=1500",
          `--screenshot=${outPath}`,
          url,
        ]);
        if (dia === diasParaGerar[diasParaGerar.length - 1]) {
          fs.copyFileSync(outPath, path.join(cardsDir, `card_hoje_${p.code}.png`));
        }
        console.log(`[✓] Card renderizado (1080x1080): ${path.basename(outPath)}`);
      }
    }

    fs.copyFileSync(
      path.join(cardsDir, "card_hoje_1_nutricao.png"),
      path.join(cardsDir, "card_hoje.png")
    );
    console.log("[✓] Todos os 3 posts diários foram atualizados com sucesso!");
  } catch (err) {
    console.error("Erro na renderização:", err);
  } finally {
    server.close();
    process.exit(0);
  }
});
