# Cat-O-Meter 🐱

*Read this in other languages: [Español](README.es.md)*

**Cat reactions based on how broken your code is.**

Cat-O-Meter is a VS Code extension that anchors a dynamic panel of cats to your sidebar. This collection of cats reacts in real-time to the number of errors in the file you are currently editing. Clean code? You'll see happy and relaxed cats. Errors piling up? Get ready for a variety of cats reacting to the absolute collapse of your code.

## Features

* **Dynamic Selection:** Each error level has its own pool of cats. The extension randomly selects one when the status changes.
* **Real-time Updates:** Reactions update as you type or save, reflecting the current file state.
* **4 Severity Levels:** From clean code to total chaos, with a distinct cat collection for each level.
* **Unobtrusive Integration:** Works from the sidebar panel without interrupting your workflow.

## Severity Levels

The type of cat that appears depends on the number of errors in your active file:

| Level | Errors | Collection Description |
| :--- | :--- | :--- |
| `zen` | 0 | Don't touch it 😎 |
| `mild` | 1 - 3 | Nothing a console.log can't fix 🤔 |
| `stressed` | 4 - 7 | Minor changes 😌 |
| `chaos` | 8+ | This worked yesterday... 😰 |

## Customization

If you want to expand the collection and add your own cats or memes:

1. Add your images to the `/media` folder. (Using a square layout and WebP format is recommended for the best visual experience and size optimization).
2. Open `src/severityLevels.ts` and modify the `SEVERITY_LEVELS` array. Simply add the filenames of your new files to the `assets` array of the corresponding level. The code automatically handles the randomness.

## Development Setup

If you want to clone the repository and play with the source code in your local environment:

```bash
# 1. Clone the repository
git clone https://github.com/EvePulido/Cat-O-Meter.git
cd cat-o-meter

# 2. Install dependencies
npm install

# 3. Compile the code
npm run compile

# 4. Open the folder in VS Code and press F5
# This will open a new window (Extension Development Host) to test the extension.
```

Clean code = happy cats.  
Errors = quality content 🐱💥

---

Enjoy some feline company while coding!
