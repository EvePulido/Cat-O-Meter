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
            description: vscode.l10n.t("Halloween in October, classic the rest of the year"),
            value: "auto",
          },
          {
            label: "$(circle-outline) Classic",
            description: vscode.l10n.t("Classic cats all year"),
            value: "classic",
          },
          {
            label: "$(bug) Halloween",
            description: vscode.l10n.t("Halloween cats all year"),
            value: "halloween",
          },
        ];

      const picked = await vscode.window.showQuickPick(options, {
        placeHolder: vscode.l10n.t("Select the Cat-O-Meter image pack"),
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