# Cat-O-Meter 🐱

**Reacciones de gatos según qué tan roto esté tu código.**

Cat-O-Meter es una extensión para VS Code que ancla una vista dinámica de michis en tu barra lateral (*Sidebar*). Esta colección de gatos reacciona en tiempo real a la cantidad de errores en el archivo que estás editando. ¿Código limpio? Verás gatos felices y relajados. ¿Se acumulan los errores? Prepárate para una variedad de gatos reaccionando al colapso absoluto.

## ✨ Características

* **Selección dinámica:** Cada nivel de error tiene su propio conjunto de gatos. La extensión elige uno aleatoriamente cuando cambia el estado.
* **Actualización en tiempo real:** Las reacciones se actualizan al escribir o guardar, reflejando el estado actual del archivo.
* **4 niveles de severidad:** Desde código limpio hasta caos total, con una colección distinta en cada nivel.
* **Integración discreta:** Funciona desde el panel lateral sin interrumpir tu flujo de trabajo.

## 📈 Niveles de severidad

El tipo de gato que aparece depende del número de errores en tu archivo activo:

| Nivel | Errores | Descripción de la Colección |
| :--- | :--- | :--- |
| `zen` | 0 | No lo toques 😎 |
| `mild` | 1 - 3 | Nada que un console.log no arregle 🤔 |
| `stressed` | 4 - 9 | Cambios menores 😌 |
| `chaos` | 10+ | Esto funcionaba ayer... 😰 |

## 🔧 Personalización

Si quieres expandir la colección y agregar tus propios michis o memes:

1.  Agrega tus imágenes a la carpeta `/media`. (Se recomienda usar formato cuadrado para una mejor experiencia visual).
2.  Abre el archivo `src/severityLevels.ts` y modifica el arreglo `SEVERITY_LEVELS`. Simplemente agrega los nombres de tus nuevos archivos al arreglo de `assets` del nivel correspondiente. El código se encarga de la aleatoriedad automáticamente.

## 🛠️ Instalación para desarrollo

Si quieres clonar el repositorio y jugar con el código fuente en tu entorno local:

```bash
# 1. Clona el repositorio
git clone 
cd cat-o-meter

# 2. Instala las dependencias
npm install

# 3. Compila el código
npm run compile

# 4. Abre la carpeta en VS Code y presiona F5
# Esto abrirá una nueva ventana (Extension Development Host) para probar la extensión.
```
Código limpio = gatos felices.
Errores = contenido de calidad 🐱💥

---

¡Disfruta de un poco de compañía felina mientras programas!

