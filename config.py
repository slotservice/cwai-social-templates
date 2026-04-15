"""
Global configuration for the CWAI Social Template Generator.
Defines output sizes, paths, and design tokens.
"""
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).parent
TEMPLATES_DIR = PROJECT_ROOT / "templates"
SVG_TEMPLATES_DIR = PROJECT_ROOT / "svg_templates"
DATA_DIR = PROJECT_ROOT / "data"
OUTPUT_DIR = PROJECT_ROOT / "output"
ASSETS_DIR = PROJECT_ROOT / "assets"

# Output size presets (width x height in pixels)
SIZES = {
    "x_landscape": (1200, 675),
    "ig_square": (1080, 1080),
    "ig_portrait": (1080, 1350),
}

# Design system tokens — extracted from client samples
DESIGN = {
    "colors": {
        "bg_primary": "#0a0e1a",
        "bg_card": "#0b1026",
        "bg_card_mid": "#0d1530",
        "bg_card_end": "#091220",
        "cyan": "#00d2c8",
        "teal": "#38e6b4",
        "blue_accent": "#00b4dc",
        "text_primary": "#ffffff",
        "text_secondary": "rgba(255,255,255,0.6)",
        "text_muted": "rgba(255,255,255,0.35)",
        "text_dim": "rgba(255,255,255,0.25)",
        "cyan_muted": "rgba(0,210,200,0.5)",
        "cyan_dim": "rgba(0,210,200,0.4)",
        "border_glow": "rgba(0,210,200,0.18)",
        "grid_line": "rgba(0,210,200,0.035)",
    },
    "fonts": {
        "heading": "'Outfit', sans-serif",
        "mono": "'JetBrains Mono', monospace",
        "body": "'Outfit', sans-serif",
    },
    "font_imports": [
        "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@300;400;600;700;800&display=swap",
    ],
}
