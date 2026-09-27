from pathlib import Path
from PIL import Image

HALLOWEEN_DIR = Path(__file__).parent / "media" / "halloween"

png_files = sorted(HALLOWEEN_DIR.glob("*.png"))

if not png_files:
    print("No se encontraron archivos .png en media/halloween")
else:
    for png_path in png_files:
        webp_path = png_path.with_suffix(".webp")
        with Image.open(png_path) as img:
            img.save(webp_path, "WEBP", quality=85)
        png_path.unlink()  # Borra el .png original
        print(f"  {png_path.name} -> {webp_path.name}")

    print(f"\nListo: {len(png_files)} imagenes convertidas.")
