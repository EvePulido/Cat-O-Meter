import * as vscode from "vscode";

// ─── CONTENT SECURITY POLICY ─────────────────────────────────────────────────
// El webview necesita un nonce único por sesión para permitir scripts inline.
// Esto evita ataques XSS mientras se permite el JS necesario.
function getNonce(): string {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  const nonce = getNonce();

  // Placeholder inicial (un pixel transparente en base64)
  const placeholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  // ─── CSP: Content Security Policy ────────────────────────────────────────
  // - default-src 'none': bloquear todo por defecto
  // - img-src ${webview.cspSource}: permitir imágenes desde vscode-resource://
  // - script-src 'nonce-${nonce}': sólo scripts con el nonce correcto
  // - style-src 'unsafe-inline': permitir estilos inline (sin nonce por simplicidad)

  return /* html */`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <meta http-equiv="Content-Security-Policy"
    content="
      default-src 'none';
      img-src ${webview.cspSource} data:;
      script-src 'nonce-${nonce}';
      style-src 'unsafe-inline';
    "
  >

  <title>Cat-O-Meter</title>
  <style>
    :root {
      --bg: #0d0d0d;
      --surface: #161616;
      --border: #2a2a2a;
      --text: #e0e0e0;
      --muted: #666;
      --zen: #4ade80;
      --mild: #facc15;
      --stressed: #fb923c;
      --chaos: #f87171;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Courier New', monospace;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0;
      overflow: hidden;
    }

    #status-bar {
      width: 100%;
      padding: 10px 16px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    #level-id {
      color: var(--muted);
      font-size: 10px;
    }

    #counters {
      display: flex;
      gap: 12px;
    }

    .counter {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .counter .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .counter.errors .dot { background: var(--chaos); }
    .counter.warnings .dot { background: var(--mild); }

    #cat-frame {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      gap: 20px;
      position: relative;
    }

    #cat-img {
      max-width: 100%;
      max-height: 55vh;
      object-fit: contain;
      border-radius: 8px;
      /* Transición suave al cambiar imagen */
      transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    #cat-img.hidden {
      opacity: 0;
      transform: scale(0.95);
    }

    #cat-img.visible {
      opacity: 1;
      transform: scale(1);
    }

    #label {
      font-size: 13px;
      letter-spacing: 0.08em;
      color: var(--muted);
      text-align: center;
      transition: color 0.4s ease;
      min-height: 18px;
    }

    /* Colores del label según nivel */
    body[data-level="zen"] #label { color: var(--zen); }
    body[data-level="mild"] #label { color: var(--mild); }
    body[data-level="stressed"] #label { color: var(--stressed); }
    body[data-level="chaos"] #label { color: var(--chaos); }

    /* Borde de acento en el frame según nivel */
    #cat-frame::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 0;
      pointer-events: none;
      transition: box-shadow 0.4s ease;
    }

    body[data-level="zen"] #cat-frame::before {
      box-shadow: inset 0 0 0 1px rgba(74, 222, 128, 0.15);
    }
    body[data-level="mild"] #cat-frame::before {
      box-shadow: inset 0 0 0 1px rgba(250, 204, 21, 0.2);
    }
    body[data-level="stressed"] #cat-frame::before {
      box-shadow: inset 0 0 0 1px rgba(251, 146, 60, 0.3);
    }
    body[data-level="chaos"] #cat-frame::before {
      box-shadow: inset 0 0 0 2px rgba(248, 113, 113, 0.4);
    }

    #waiting {
      font-size: 12px;
      color: var(--muted);
      letter-spacing: 0.1em;
    }
  </style>
</head>
<body data-level="zen">

  <div id="status-bar">
    <span id="level-id">INICIANDO...</span>
    <div id="counters">
      <div class="counter errors">
        <div class="dot"></div>
        <span id="error-count">0 errores</span>
      </div>
      <div class="counter warnings">
        <div class="dot"></div>
        <span id="warning-count">0 warnings</span>
      </div>
    </div>
  </div>

  <div id="cat-frame">
    <span id="waiting">Abriendo un archivo...</span>
    <img
      id="cat-img"
      src="${placeholder}"
      alt="Estado del gato"
      class="hidden"
      style="display:none"
    />
    <div id="label"></div>
  </div>

  <script nonce="${nonce}">
    // ─── RECEPTOR DE MENSAJES DESDE LA EXTENSIÓN ──────────────────────────
    // La extensión usa webview.postMessage(data) para enviarnos actualizaciones.
    // Aquí los escuchamos con window.addEventListener('message', ...).
    // vscode.postMessage() sería para la dirección INVERSA (webview → extensión).

    const catImg = document.getElementById('cat-img');
    const label = document.getElementById('label');
    const levelId = document.getElementById('level-id');
    const errorCount = document.getElementById('error-count');
    const warningCount = document.getElementById('warning-count');
    const waiting = document.getElementById('waiting');

    window.addEventListener('message', (event) => {
      const message = event.data;

      // Verificar que sea nuestro comando de actualización
      if (message.command !== 'update') return;

      // ── Actualizar contadores en la barra de estado ──
      errorCount.textContent = message.errors === 1
        ? '1 error'
        : message.errors + ' errores';

      warningCount.textContent = message.warnings === 1
        ? '1 warning'
        : message.warnings + ' warnings';

      levelId.textContent = message.levelId.toUpperCase();
      label.textContent = message.label;

      // ── Actualizar data-level en body para los estilos CSS ──
      document.body.dataset.level = message.levelId;

      // ── Transición suave al cambiar imagen ──
      // 1. Ocultar con fade out
      catImg.classList.remove('visible');
      catImg.classList.add('hidden');

      // 2. Esperar la transición, luego cambiar src y mostrar
      setTimeout(() => {
        waiting.style.display = 'none';
        catImg.style.display = 'block';

        // ── Actualizar src con la URI autorizada por asWebviewUri ──
        catImg.src = message.imageUri;

        // 3. Fade in cuando la imagen cargue
        catImg.onload = () => {
          catImg.classList.remove('hidden');
          catImg.classList.add('visible');
        };

        // Fallback por si onload no dispara (cache hit)
        catImg.classList.remove('hidden');
        catImg.classList.add('visible');
      }, 200);
    });
  </script>
</body>
</html>`;
}
