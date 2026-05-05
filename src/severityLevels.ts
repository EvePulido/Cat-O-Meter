import * as vscode from "vscode";

export interface SeverityLevel {
  id: string;
  label: string;
  minErrors: number;
  maxErrors: number;
  assets: string[];
}

export const SEVERITY_LEVELS: SeverityLevel[] = [
  {
    id: "zen",
    label: "Todo perfecto",
    minErrors: 0,
    maxErrors: 0,
    assets: [
      "zen_1.jpg",
      "zen_2.jpg",
      "zen_3.jpg",
      "zen_4.jpg",
      "zen_5.jpg",
      "zen_6.jpg",
    ],
  },
  {
    id: "mild",
    label: "Algo huele mal...",
    minErrors: 1,
    maxErrors: 3,
    assets: [
      "midl_1.jpg",
      "midl_2.jpg",
      "midl_3.jpg",
      "midl_4.jpg",
      "midl_5.jpg",
      "midl_6.jpg",
    ],
  },
  {
    id: "stressed",
    label: "Houston, tenemos un problema",
    minErrors: 4,
    maxErrors: 9,
    assets: [
      "stressed_1.jpg",
      "stressed_2.jpg",
      "stressed_3.jpg",
      "stressed_4.jpg",
      "stressed_5.jpg",
      "stressed_6.jpg",
    ],
  },
  {
    id: "chaos",
    label: "CATÁSTROFE TOTAL",
    minErrors: 10,
    maxErrors: Infinity,
    assets: [
      "chaos_1.jpg",
      "chaos_2.jpg",
      "chaos_3.jpg",
      "chaos_4.jpg",
      "chaos_5.jpg",
      "chaos_6.jpg",
    ],
  },
];

export interface DiagnosticCount {
  errors: number;
  warnings: number;
}

export function countDiagnostics(uri: vscode.Uri): DiagnosticCount {
  const diagnostics = vscode.languages.getDiagnostics(uri);

  return diagnostics.reduce(
    (acc, d) => {
      if (d.severity === vscode.DiagnosticSeverity.Error) {
        acc.errors++;
      } else if (d.severity === vscode.DiagnosticSeverity.Warning) {
        acc.warnings++;
      }
      return acc;
    },
    { errors: 0, warnings: 0 }
  );
}

export function getSeverityLevel(errorCount: number): SeverityLevel {
  return (
    SEVERITY_LEVELS.find(
      (level) => errorCount >= level.minErrors && errorCount <= level.maxErrors
    ) ?? SEVERITY_LEVELS[0]
  );
}

export function pickRandomAsset(
  level: SeverityLevel,
  extensionUri: vscode.Uri
): string {
  const randomIndex = Math.floor(Math.random() * level.assets.length);
  const assetFileName = level.assets[randomIndex];

  return vscode.Uri.joinPath(extensionUri, "media", assetFileName).fsPath;
}
