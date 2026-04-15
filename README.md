# CrowdWiseAI — Social Media Template Generator

Python-based system for creating editable, reusable social media post images for **X/Twitter** and **Instagram**. Includes a web UI for visual editing and exports to both **PNG** (for posting) and **SVG** (for Figma / automation).

## Quick Start

### First time setup (one-time)
Double-click **`install.bat`**  
This installs Python, dependencies, and the browser engine for image export.

### Run the app
Double-click **`run.bat`**  
Opens the template editor in your browser at `http://localhost:5000`

## Web UI

The app has a 3-panel layout:
- **Left sidebar** — Pick a template and output size
- **Center** — Live preview that updates as you edit
- **Right panel** — Edit all content fields (text, metrics, rankings, icons)

### Export options
| Button | Output |
|--------|--------|
| **Export PNG + SVG** | Downloads both files — PNG for posting, SVG for Figma/automation |
| **PNG only** | Just the image for social media |
| **SVG only** | Editable design file with labeled layers |

## Templates (16 total)

### Hero Graphics (2)
| Template | Layout |
|----------|--------|
| `hero_a` | Centered hero with pulse rings (matches CWAI Hero sample) |
| `hero_b` | Left-aligned hero with feature bullet list |

### Surging / Tool Spotlight (6)
| Template | Layout |
|----------|--------|
| `surging_a` | Single tool spotlight — centered with stats grid |
| `surging_b` | Multi-tool ranked list — 5 rows with growth arrows |
| `surging_c` | Horizontal split — big stat on left, tool info on right |
| `surging_d` | Growth bar chart — horizontal bars ranked by growth |
| `surging_e` | Minimal spotlight — tool name + massive growth number |
| `surging_f` | Category trio — 3 tools side-by-side as cards |

### Breakout Leaderboard (3)
| Template | Layout |
|----------|--------|
| `leaderboard_a` | Table-style ranking with columns (matches breakout_table sample) |
| `leaderboard_b` | Card grid — 2-column layout with rank badges |
| `leaderboard_c` | Podium style — top 3 highlighted + compact runner-up list |

### Insight / Quote / Data (2)
| Template | Layout |
|----------|--------|
| `insight_a` | Quote card with highlighted data points below |
| `insight_b` | Data stats card — 3 large number cards with change indicators |

### Compare / Versus (2)
| Template | Layout |
|----------|--------|
| `compare_a` | Side-by-side card comparison with VS badge |
| `compare_b` | Stat-by-stat horizontal bars growing from center |

### Report / Newsletter Promo (1)
| Template | Layout |
|----------|--------|
| `newsletter_a` | Report promo card with highlights and CTA button |

## Output Sizes

| Key | Dimensions | Platform |
|-----|-----------|----------|
| `x_landscape` | 1200 x 675 | X / Twitter |
| `ig_square` | 1080 x 1080 | Instagram square |
| `ig_portrait` | 1080 x 1350 | Instagram portrait |

## SVG Structure (for automation)

Every SVG template follows a clean, consistent structure for programmatic data injection:

```xml
<svg>
  <defs>                    <!-- Shared gradients, filters, patterns -->
  <g id="bg-static">       <!-- Background, grid, glow orbs — never changes -->
  <g id="decor-static">    <!-- Particles, pulse rings — never changes -->
  <g id="chrome-static">   <!-- Corner brackets, footer bar — never changes -->
  <g id="content-dynamic"> <!-- ALL data fields with labeled IDs -->
```

### Dynamic element IDs
All editable fields have clear, consistent IDs:
- `TITLE`, `TITLE_PREFIX`, `TITLE_HIGHLIGHT`, `TITLE_SUFFIX`
- `SUBTITLE`, `TAGLINE`, `DESCRIPTION`
- `TOOL_0_NAME`, `TOOL_0_GROWTH`, `TOOL_0_SIGNAL`
- `ROW_0_RANK`, `ROW_0_NAME`, `ROW_0_SCORE`
- `STAT_0_VALUE`, `STAT_0_LABEL`
- `METRIC_0_VALUE`, `METRIC_0_LABEL`
- `FOOTER_LEFT`, `FOOTER_RIGHT`

### Text behavior
- All text as editable `<text>` elements (not outlines)
- Fixed font sizes per template — no auto-resize
- Consistent fonts: Outfit (headings), JetBrains Mono (data)

## Design System

Extracted from client samples:
- **Backgrounds**: `#0a0e1a` body, gradient card `#0b1026 → #0d1530 → #091220`
- **Accents**: `#00d2c8` (cyan), `#38e6b4` (teal), `#00b4dc` (blue)
- **Fonts**: Outfit (headings/body), JetBrains Mono (data/labels)
- **Effects**: Grid background, radial glow orbs, corner brackets, scanline animation

## Folder Structure

```
cwai-social-templates/
├── install.bat              # One-time setup (installs Python + deps)
├── run.bat                  # Launch the web app
├── app.py                   # Flask web server (main entry point)
├── generate.py              # CLI generator (batch rendering)
├── config.py                # Design tokens, sizes, paths
├── requirements.txt         # Python dependencies
├── web/                     # Web UI
│   ├── index.html
│   └── static/
│       ├── app.js           # Frontend logic + icon picker
│       └── style.css        # Responsive dark theme
├── svg_templates/           # SVG templates (for automation + Figma)
│   ├── partials/            # Shared defs, backgrounds, chrome
│   ├── hero/                # hero_a.svg, hero_b.svg
│   ├── surging/             # surging_a.svg through surging_f.svg
│   ├── leaderboard/         # leaderboard_a.svg through leaderboard_c.svg
│   ├── insight/             # insight_a.svg, insight_b.svg
│   ├── compare/             # compare_a.svg, compare_b.svg
│   └── newsletter/          # newsletter_a.svg
├── templates/               # HTML/CSS templates (for web UI preview)
│   ├── partials/base.html
│   └── [same families as svg_templates]
├── data/                    # Sample JSON data (one per template)
├── output/                  # Generated PNG + SVG files
└── assets/                  # Logos, icons (add your files here)
```

## CLI Usage (alternative to web UI)

```bash
# Single template
python generate.py -t hero_a -d data/hero_a.json

# Different size
python generate.py -t hero_a -d data/hero_a.json -s ig_square

# All templates
python generate.py -t all -d data/

# HTML debug output
python generate.py -t hero_a -d data/hero_a.json --html-only
```

## Editing Content

Edit the JSON files in `data/` or use the web UI. Each template accepts specific fields — see the edit panel in the web UI for the complete field list per template.

## Adding Your Logo

1. Place your logo file (PNG or SVG) in the `assets/` folder
2. Update the `logo_path` field in the JSON data to point to your file
3. The logo will appear in templates that support it (hero, leaderboard, surging_b, compare, newsletter)
