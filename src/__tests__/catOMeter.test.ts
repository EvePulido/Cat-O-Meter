import * as fs from "fs";
import * as path from "path";

// ─── MOCK de vscode (no está disponible fuera del Extension Host) ─────────────
jest.mock(
  "vscode",
  () => ({
    Uri: {
      joinPath: (uri: any, ...paths: string[]) => ({
        fsPath: paths.join("/"),
      }),
    },
    languages: {
      getDiagnostics: jest.fn(),
    },
    DiagnosticSeverity: {
      Error: 0,
      Warning: 1,
    },
  }),
  { virtual: true }
);

import {
  IMAGE_PACKS,
  SEVERITY_LEVELS,
  getSeverityLevel,
  getSeasonalDefaultPack,
} from "../severityLevels";

const MEDIA_DIR = path.resolve(__dirname, "../../media");

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRUEBAS DE ASSETS EN DISCO
// ─────────────────────────────────────────────────────────────────────────────
describe("Assets en disco", () => {
  test("la carpeta /media existe", () => {
    expect(fs.existsSync(MEDIA_DIR)).toBe(true);
  });

  test("cada nivel de cada pack tiene al menos 1 asset", () => {
    for (const [packId, levels] of Object.entries(IMAGE_PACKS)) {
      for (const level of levels) {
        expect(level.assets.length).toBeGreaterThan(0);
      }
    }
  });

  for (const [packId, levels] of Object.entries(IMAGE_PACKS)) {
    describe(`Pack: ${packId}`, () => {
      for (const level of levels) {
        describe(`Nivel: ${level.id}`, () => {
          for (const asset of level.assets) {
            test(`${asset} existe en /media/${packId}`, () => {
              const filePath = path.join(MEDIA_DIR, packId, asset);
              expect(fs.existsSync(filePath)).toBe(true);
            });

            test(`${asset} no está vacío`, () => {
              const filePath = path.join(MEDIA_DIR, packId, asset);
              const stats = fs.statSync(filePath);
              expect(stats.size).toBeGreaterThan(0);
            });
          }
        });
      }
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRUEBAS DE LÓGICA DE NIVELES
// ─────────────────────────────────────────────────────────────────────────────
describe("getSeverityLevel", () => {
  test("0 errores → zen", () => {
    expect(getSeverityLevel(0).id).toBe("zen");
  });

  test("1 error → middle", () => {
    expect(getSeverityLevel(1).id).toBe("middle");
  });

  test("3 errores → middle (límite superior)", () => {
    expect(getSeverityLevel(3).id).toBe("middle");
  });

  test("4 errores → stressed (límite inferior)", () => {
    expect(getSeverityLevel(4).id).toBe("stressed");
  });

  test("7 errores → stressed (límite superior)", () => {
    expect(getSeverityLevel(7).id).toBe("stressed");
  });

  test("8 errores → chaos (límite inferior)", () => {
    expect(getSeverityLevel(8).id).toBe("chaos");
  });

  test("100 errores → chaos", () => {
    expect(getSeverityLevel(100).id).toBe("chaos");
  });

  test("los assets del nivel corresponden al nivel correcto", () => {
    const level = getSeverityLevel(5);
    expect(level.id).toBe("stressed");
    expect(level.assets.every((a) => a.startsWith("stressed_"))).toBe(true);
  });

  test("obtiene niveles del pack halloween explícitamente", () => {
    const level = getSeverityLevel(0, "halloween");
    expect(level.id).toBe("zen");
    expect(level.assets[0]).toBe("zen_1.webp");
  });

  test("pack desconocido recurre al pack por defecto (classic)", () => {
    const level = getSeverityLevel(0, "unknown_pack");
    expect(level.id).toBe("zen");
    expect(level.assets[0]).toBe("zen_1.webp");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRUEBAS DE FECHA ESTACIONAL (getSeasonalDefaultPack)
// ─────────────────────────────────────────────────────────────────────────────
describe("getSeasonalDefaultPack", () => {
  test("septiembre devuelve classic", () => {
    expect(getSeasonalDefaultPack(new Date(2026, 8, 15))).toBe("classic");
  });

  test("octubre devuelve halloween", () => {
    expect(getSeasonalDefaultPack(new Date(2026, 9, 15))).toBe("halloween");
  });

  test("noviembre devuelve classic", () => {
    expect(getSeasonalDefaultPack(new Date(2026, 10, 15))).toBe("classic");
  });

  test("marzo devuelve classic", () => {
    expect(getSeasonalDefaultPack(new Date(2026, 2, 20))).toBe("classic");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. PRUEBA DE NO REPETICIÓN DE IMAGEN
// ─────────────────────────────────────────────────────────────────────────────
describe("Aleatoriedad de assets", () => {
  function pickWithoutRepeat(assets: string[], lastIndex: number): number {
    let index: number;
    do {
      index = Math.floor(Math.random() * assets.length);
    } while (index === lastIndex);
    return index;
  }

  test("no repite el mismo índice dos veces seguidas (100 intentos)", () => {
    const assets = SEVERITY_LEVELS[0].assets;
    let lastIndex = -1;

    for (let i = 0; i < 100; i++) {
      const newIndex = pickWithoutRepeat(assets, lastIndex);
      expect(newIndex).not.toBe(lastIndex);
      lastIndex = newIndex;
    }
  });

  test("el índice elegido siempre está dentro del rango del array", () => {
    for (const [, levels] of Object.entries(IMAGE_PACKS)) {
      for (const level of levels) {
        for (let i = 0; i < 50; i++) {
          const index = Math.floor(Math.random() * level.assets.length);
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThan(level.assets.length);
        }
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. PRUEBA DE ESTABILIDAD DE NIVEL (sin salto = misma imagen)
// ─────────────────────────────────────────────────────────────────────────────
describe("Estabilidad de nivel", () => {
  test("mismo número de errores retorna el mismo nivel", () => {
    const a = getSeverityLevel(2);
    const b = getSeverityLevel(2);
    expect(a.id).toBe(b.id);
  });

  test("cambiar de 1 a 3 errores no cambia de nivel (ambos son middle)", () => {
    const a = getSeverityLevel(1);
    const b = getSeverityLevel(3);
    expect(a.id).toBe(b.id);
    expect(a.id).toBe("middle");
  });

  test("cruzar el umbral 3→4 sí cambia de nivel", () => {
    const antes = getSeverityLevel(3);
    const despues = getSeverityLevel(4);
    expect(antes.id).not.toBe(despues.id);
    expect(antes.id).toBe("middle");
    expect(despues.id).toBe("stressed");
  });

  test("cruzar el umbral 7→8 sí cambia de nivel", () => {
    const antes = getSeverityLevel(7);
    const despues = getSeverityLevel(8);
    expect(antes.id).not.toBe(despues.id);
    expect(antes.id).toBe("stressed");
    expect(despues.id).toBe("chaos");
  });
});
