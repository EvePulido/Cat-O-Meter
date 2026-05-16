import * as vscode from "vscode";
import {
  countDiagnostics,
  getSeverityLevel,
  SeverityLevel,
} from "./severityLevels";

export interface UpdateMessage {
  command: "update";
  levelId: string;
  imageUri: string;
}

export class CatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "cat-o-meter.view";

  private view?: vscode.WebviewView;
  private readonly context: vscode.ExtensionContext;
  private lastAssetIndex: number = -1;
  private currentLevelId: string | null = null; // <-- nivel actual guardado

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "media"),
      ],
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    // Al abrir la vista, forzar actualización aunque el nivel no haya "cambiado"
    this.currentLevelId = null;

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      this.updateDiagnostics(activeEditor.document.uri);
    }
  }

  public updateDiagnostics(uri: vscode.Uri | null): void {
    if (!this.view) return;

    let errors = 0;

    if (uri) {
      const counts = countDiagnostics(uri);
      errors = counts.errors;
    }

    const level = getSeverityLevel(errors);

    // Solo cambia la imagen si el nivel es diferente al actual
    if (level.id === this.currentLevelId) return;

    this.currentLevelId = level.id;
    this.lastAssetIndex = -1; // reset para que no excluya el índice anterior del nivel viejo

    const imageUri = this.authorizeAsset(level);

    const message: UpdateMessage = {
      command: "update",
      levelId: level.id,
      imageUri,
    };

    this.view.webview.postMessage(message);
  }

  private authorizeAsset(level: SeverityLevel): string {
    let randomIndex: number;

    if (level.assets.length === 1) {
      randomIndex = 0;
    } else {
      do {
        randomIndex = Math.floor(Math.random() * level.assets.length);
      } while (randomIndex === this.lastAssetIndex);
    }

    this.lastAssetIndex = randomIndex;

    const diskUri = vscode.Uri.joinPath(
      this.context.extensionUri,
      "media",
      level.assets[randomIndex]
    );
    return this.view!.webview.asWebviewUri(diskUri).toString();
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = Array.from({ length: 32 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[
      Math.floor(Math.random() * 62)
      ]
    ).join("");

    return /* html */ `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}'; style-src 'unsafe-inline';">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: transparent;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      padding: 8px;
    }
    #cat-img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
      transition: opacity 0.6s ease;
      opacity: 0;
    }
    #cat-img.visible {
      opacity: 1;
    }
  </style>
</head>
<body>
  <img id="cat-img" src="" alt="Cat" />
  <script nonce="${nonce}">
    const img = document.getElementById('cat-img');

    window.addEventListener('message', ({ data }) => {
      if (data.command !== 'update') return;

      // Fade out suave
      img.style.opacity = '0';

      setTimeout(() => {
        img.src = data.imageUri;

        img.onload = () => {
          img.style.opacity = '1';
        };
      }, 400);
    });
  </script>
</body>
</html>`;
  }
}