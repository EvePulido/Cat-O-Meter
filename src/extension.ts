import * as vscode from "vscode";
import { CatViewProvider } from "./catViewProvider";

export function activate(context: vscode.ExtensionContext) {
  const provider = new CatViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CatViewProvider.viewType,
      provider
    )
  );

  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics((event) => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) return;

      const activeUri = activeEditor.document.uri;
      const affected = event.uris.some(
        (uri) => uri.toString() === activeUri.toString()
      );

      if (affected) {
        provider.updateDiagnostics(activeUri);
      }
    })
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      provider.updateDiagnostics(editor?.document.uri ?? null);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("cat-o-meter.selectPack", async () => {
      const options: Array<{
        label: string;
        description: string;
        value: string;
      }> = [
          {
            label: "$(sparkle) Auto",
            description: "Halloween en octubre, clásico el resto del año",
            value: "auto",
          },
          {
            label: "$(circle-outline) Classic",
            description: "Gatos clásicos todo el año",
            value: "classic",
          },
          {
            label: "$(bug) Halloween",
            description: "Gatos de Halloween todo el año",
            value: "halloween",
          },
        ];

      const picked = await vscode.window.showQuickPick(options, {
        placeHolder: "Selecciona el paquete de imágenes de Cat-O-Meter",
      });

      if (picked) {
        await vscode.workspace
          .getConfiguration("catOMeter")
          .update(
            "imagePack",
            picked.value,
            vscode.ConfigurationTarget.Global
          );
      }
    })
  );
}

export function deactivate() { }