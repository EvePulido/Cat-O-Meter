# Cat-O-Meter 🐱

**Un mosaico de reacciones felinas random para tu código.**

Cat-O-Meter es una extensión para VS Code que ancla una vista dinámica de michis en tu barra lateral (*Sidebar*). Esta colección de gatos reacciona en tiempo real a la cantidad de errores en el archivo que estás editando. ¿Código limpio? Verás gatos felices y relajados. ¿Se acumulan los errores? Prepárate para una variedad de gatos reaccionando al colapso absoluto. Nunca verás el mismo fracaso dos veces.

## ✨ Características

*   **Mosaico dinámico:** Cada nivel de error tiene su propio *pool* de diferentes gatos. La extensión elige uno aleatoriamente cada vez que cambia el estado.
*   **Reacción en tiempo real:** Un nuevo michi aparece al instante mientras escribes o guardas tu código, reflejando tu éxito o fracaso actual.
*   **4 niveles de crisis:** Desde el `zen` más absoluto hasta la `catástrofe total`, cada uno con una colección única de reacciones felinas.
*   **Cero distracciones:** Vive cómodamente en tu panel lateral para no estorbar tu flujo de trabajo.

## 📈 Niveles de Severidad

El tipo de gato que aparece depende del número de errores en tu archivo activo:

| Nivel | Errores | Descripción de la Colección |
| :--- | :--- | :--- |
| `zen` | 0 | Todo está en orden. 😌 |
| `mild` | 1 - 3 | Algo no cuadra... 🤔 |
| `stressed` | 4 - 9 | Tenemos un problema. 😰 |
| `chaos` | 10+ | TODO ESTÁ EN LLAMAS 🔥. |

## 🔧 Personalización

Si quieres expandir la colección y agregar tus propios michis o memes:

1.  Agrega tus imágenes a la carpeta `/media`. (Se recomienda usar formato cuadrado para una mejor experiencia visual).
2.  Abre el archivo `src/severityLevels.ts` y modifica el arreglo `SEVERITY_LEVELS`. Simplemente agrega los nombres de tus nuevos archivos al arreglo de `assets` del nivel correspondiente. El código se encarga de la aleatoriedad automáticamente.

## 🛠️ Instalación para Desarrollo

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

---

¡Disfruta de un poco de compañía felina mientras programas!

