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
}

export function deactivate() {}