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
      "zen_1.webp",
      "zen_2.webp",
      "zen_3.webp",
      "zen_4.webp",
      "zen_5.webp",
      "zen_6.webp",
      "zen_7.webp",
      "zen_8.webp",
    ],
  },
  {
    id: "mild",
    label: "Algo huele mal...",
    minErrors: 1,
    maxErrors: 3,
    assets: [
      "midl_1.webp",
      "midl_2.webp",
      "midl_3.webp",
      "midl_4.webp",
      "midl_5.webp",
      "midl_6.webp",
      "midl_7.webp",
      "midl_8.webp",
    ],
  },
  {
    id: "stressed",
    label: "Houston, tenemos un problema",
    minErrors: 4,
    maxErrors: 9,
    assets: [
      "stressed_1.webp",
      "stressed_2.webp",
      "stressed_3.webp",
      "stressed_4.webp",
      "stressed_5.webp",
      "stressed_6.webp",
      "stressed_7.webp",
      "stressed_8.webp",
    ],
  },
  {
    id: "chaos",
    label: "CATÁSTROFE TOTAL",
    minErrors: 10,
    maxErrors: Infinity,
    assets: [
      "chaos_1.webp",
      "chaos_2.webp",
      "chaos_3.webp",
      "chaos_4.webp",
      "chaos_5.webp",
      "chaos_6.webp",
      "chaos_7.webp",
      "chaos_8.webp",
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
