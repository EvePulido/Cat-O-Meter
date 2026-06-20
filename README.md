<h1 align="center">Cat-O-Meter 🐱</h1>

<p align="center">
  <i>Read this in other languages: <a href="https://github.com/EvePulido/Cat-O-Meter/blob/main/README.es.md">Español</a></i>
</p>

<p align="center">
  <b>Cat reactions based on how broken your code is.</b>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=EvePulido.cat-o-meter">
    <img src="https://img.shields.io/badge/VS_Code_Marketplace-Install-blue?style=flat-square&logo=visual-studio-code" alt="VS Code Marketplace">
  </a>
  <a href="https://open-vsx.org/extension/EvePulido/cat-o-meter">
    <img src="https://img.shields.io/open-vsx/v/EvePulido/cat-o-meter?style=flat-square&color=purple" alt="Open VSX">
  </a>
  <a href="https://github.com/EvePulido/Cat-O-Meter/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/EvePulido/Cat-O-Meter?style=flat-square" alt="License">
  </a>
</p>

<p align="center">
  <img src="media/cat-o-meter.gif" alt="Cat-O-Meter Demo" width="600">
</p>

## Table of Contents
- [Features](#features)
- [Severity Levels](#severity-levels)
- [How to Use](#how-to-use)
- [Customization & Contributions](#customization--contributions)
- [Development Setup](#development-setup)

---

Cat-O-Meter is a VS Code extension that anchors a dynamic panel of cats to your sidebar. This collection of cats reacts in real-time to the number of errors in the file you are currently editing. Clean code? You'll see happy and relaxed cats. Errors piling up? Get ready for a variety of cats reacting to the absolute collapse of your code.

## Features

* **Dynamic Selection:** Each error level has its own pool of cats. The extension randomly selects one when the status changes.
* **Real-time Updates:** Reactions update as you type or save, reflecting the current file state.
* **4 Severity Levels:** From clean code to total chaos, with a distinct cat collection for each level.
* **Unobtrusive Integration:** Works from the sidebar panel without interrupting your workflow.
* **Privacy-Focused:** Runs 100% offline. Zero network requests, keeping your code completely private.
* **Performance-Optimized:** Highly compressed WebP media assets ensure instantaneous loading and a minimal extension footprint.
* **Smooth Transitions:** Gentle CSS crossfades make state transitions satisfying and seamless.

## Severity Levels

The type of cat that appears depends on the number of errors in your active file:

| Level | Errors | Collection Description |
| :--- | :--- | :--- |
| `zen` | 0 | Don't touch it 😎 |
| `mild` | 1 - 3 | Nothing a console.log can't fix 🤔 |
| `stressed` | 4 - 7 | Minor changes 😌 |
| `chaos` | 8+ | This worked yesterday... 😰 |

## How to Use

1. Click on the **Cat-O-Meter** icon in the Activity Bar (sidebar on the left).
2. Open any code file in your editor.
3. Start coding! The cat will automatically update its reaction depending on the errors found in your active file.

## Customization & Contributions

If you want to expand the collection and add your own cats or memes:

1. Add your images to the `/media` folder. (Using a square layout and WebP format is recommended for the best visual experience and size optimization).
2. Open `src/severityLevels.ts` and modify the `SEVERITY_LEVELS` array. Simply add the filenames of your new files to the `assets` array of the corresponding level. The code automatically handles the randomness.

*Tip: Pull Requests are welcome! Feel free to share your favorite cats with the community.*

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
