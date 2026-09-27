import * as vscode from "vscode";

export interface SeverityLevel {
  id: string;
  minErrors: number;
  maxErrors: number;
  assets: string[];
}

export const IMAGE_PACKS: Record<string, SeverityLevel[]> = {
  classic: [
    {
      id: "zen",
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
        "zen_9.webp",
      ],
    },
    {
      id: "middle",
      minErrors: 1,
      maxErrors: 3,
      assets: [
        "middle_1.webp",
        "middle_2.webp",
        "middle_3.webp",
        "middle_4.webp",
        "middle_5.webp",
        "middle_6.webp",
        "middle_7.webp",
        "middle_8.webp",
        "middle_9.webp",
      ],
    },
    {
      id: "stressed",
      minErrors: 4,
      maxErrors: 7,
      assets: [
        "stressed_1.webp",
        "stressed_2.webp",
        "stressed_3.webp",
        "stressed_4.webp",
        "stressed_5.webp",
        "stressed_6.webp",
        "stressed_7.webp",
        "stressed_8.webp",
        "stressed_9.webp",
      ],
    },
    {
      id: "chaos",
      minErrors: 8,
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
        "chaos_9.webp",
      ],
    },
  ],
  halloween: [
    {
      id: "zen",
      minErrors: 0,
      maxErrors: 0,
      assets: [
        "zen_1.webp",
        "zen_2.webp",
        "zen_3.webp",
        "zen_4.webp",
        "zen_5.webp",
      ],
    },
    {
      id: "middle",
      minErrors: 1,
      maxErrors: 3,
      assets: [
        "middle_1.webp",
        "middle_2.webp",
        "middle_3.webp",
        "middle_4.webp",
        "middle_5.webp",
      ],
    },
    {
      id: "stressed",
      minErrors: 4,
      maxErrors: 7,
      assets: [
        "stressed_1.webp",
        "stressed_2.webp",
        "stressed_3.webp",
        "stressed_4.webp",
        "stressed_5.webp",
      ],
    },
    {
      id: "chaos",
      minErrors: 8,
      maxErrors: Infinity,
      assets: [
        "chaos_1.webp",
        "chaos_2.webp",
        "chaos_3.webp",
        "chaos_4.webp",
        "chaos_5.webp",
      ],
    },
  ],
};

export const DEFAULT_PACK = "classic";
export const SEVERITY_LEVELS: SeverityLevel[] = IMAGE_PACKS.classic;

export function getPack(packId: string): SeverityLevel[] {
  return IMAGE_PACKS[packId] ?? IMAGE_PACKS[DEFAULT_PACK];
}

export function getSeverityLevel(
  errorCount: number,
  packId: string = DEFAULT_PACK
): SeverityLevel {
  const levels = getPack(packId);
  return (
    levels.find(
      (level) => errorCount >= level.minErrors && errorCount <= level.maxErrors
    ) ?? levels[0]
  );
}

export function getSeasonalDefaultPack(date: Date = new Date()): string {
  return date.getMonth() === 9 ? "halloween" : "classic";
}

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