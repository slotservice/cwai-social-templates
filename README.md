# CWAI Social Media Template Generator

A Python-based system for generating editable, reusable social media post images for **X/Twitter** and **Instagram**, built for CrowdWiseAI.

## Design System

Extracted from client sample files (`CWAI Hero.html`, `templatesbreakout_table.html`, `X Post Template A/B/C.pptx`):

- **Color palette**: Dark premium tech aesthetic — `#0a0e1a` backgrounds, cyan/teal accents (`#00d2c8`, `#38e6b4`, `#00b4dc`)
- **Typography**: Outfit (headings/body), JetBrains Mono (data/labels)
- **Visual motifs**: Grid backgrounds, glowing orbs, corner brackets, scanline animations, gradient text
- **Spacing**: 44px horizontal padding, 28px vertical padding, 16px corner inset

## Template Families

| Family | Variants | Description |
|--------|----------|-------------|
| Hero | `hero_a`, `hero_b` | Centered pulse-ring hero (matches CWAI Hero.html) and left-aligned feature list variant |
| Surging | `surging_a`, `surging_b` | Single tool spotlight card and multi-tool ranked list |
| Leaderboard | `leaderboard_a`, `leaderboard_b` | Table-style breakout ranking (matches breakout_table.html) and card-grid layout |
| Insight | `insight_a` | Quote/data card with highlighted statistics |
| Compare | `compare_a` | Side-by-side versus comparison card |
| Newsletter | `newsletter_a` | Report/newsletter promo card with CTA |

## Output Sizes

| Key | Dimensions | Platform |
|-----|-----------|----------|
| `x_landscape` | 1200 x 675 | X/Twitter |
| `ig_square` | 1080 x 1080 | Instagram square |
| `ig_portrait` | 1080 x 1350 | Instagram portrait |

## Setup

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Install Playwright browser (one-time)
python -m playwright install chromium
```

## Usage

### Generate a single post

```bash
# X/Twitter landscape (default)
python generate.py -t hero_a -d data/hero_a.json

# Instagram square
python generate.py -t hero_a -d data/hero_a.json -s ig_square

# Instagram portrait
python generate.py -t leaderboard_a -d data/leaderboard_a.json -s ig_portrait
```

### Generate all templates

```bash
python generate.py -t all -d data/
```

### Debug — output HTML instead of PNG

```bash
python generate.py -t hero_a -d data/hero_a.json --html-only
```

### Custom output path

```bash
python generate.py -t hero_a -d data/hero_a.json -o my_hero_post.png
```

## Folder Structure

```
cwai-social-templates/
├── generate.py              # CLI generator script
├── config.py                # Design tokens, sizes, paths
├── requirements.txt         # Python dependencies
├── README.md
├── templates/
│   ├── partials/
│   │   └── base.html        # Shared base template (design system CSS)
│   ├── hero/
│   │   ├── hero_a.html      # Centered hero with pulse rings
│   │   └── hero_b.html      # Left-aligned hero with feature list
│   ├── surging/
│   │   ├── surging_a.html   # Single tool spotlight
│   │   └── surging_b.html   # Multi-tool surging list
│   ├── leaderboard/
│   │   ├── leaderboard_a.html  # Table-style leaderboard
│   │   └── leaderboard_b.html  # Card-grid leaderboard
│   ├── insight/
│   │   └── insight_a.html   # Quote / data card
│   ├── compare/
│   │   └── compare_a.html   # Versus comparison
│   └── newsletter/
│       └── newsletter_a.html # Report promo card
├── data/                    # Sample JSON data files
│   ├── hero_a.json
│   ├── hero_b.json
│   ├── surging_a.json
│   ├── surging_b.json
│   ├── leaderboard_a.json
│   ├── leaderboard_b.json
│   ├── insight_a.json
│   ├── compare_a.json
│   └── newsletter_a.json
├── output/                  # Generated images go here
└── assets/                  # Logos, icons, backgrounds
```

## Editing Content

Edit the JSON data files to change post content. Each template accepts specific fields:

### Hero (`hero_a`, `hero_b`)
- `tagline_top`, `title_prefix`, `title_highlight`, `title_suffix`, `subtitle`
- `metrics[]` — array of `{label, value}`
- `features[]` — array of strings (hero_b only)
- `logo_path`, `footer_left`, `footer_right`

### Surging (`surging_a`)
- `icon`, `category`, `tool_name`, `description`
- `stats[]` — array of `{label, value}`
- `signal` — `HOT`, `RISING`, or `WATCH`

### Surging (`surging_b`)
- `tools[]` — array of `{name, description, growth, signal}`
- `title`, `title_highlight`, `title_suffix`

### Leaderboard (`leaderboard_a`, `leaderboard_b`)
- `rows[]` — array of `{name, score, growth, signal, bar_pct}`
- `title_prefix`, `title_highlight`, `title_suffix`

### Insight (`insight_a`)
- `quote`, `source`, `label`
- `data_points[]` — array of `{value, label}`

### Compare (`compare_a`)
- `tool_a` / `tool_b` — each with `{name, icon, stats[]}`
- `winner` — `"a"` or `"b"`
- `verdict` — HTML string

### Newsletter (`newsletter_a`)
- `badge`, `title_prefix`, `title_highlight`, `subtitle`
- `highlights[]` — array of `{icon, text}`
- `cta_text`, `date`

## Adding New Templates

1. Create a new folder under `templates/` (or add to existing family)
2. Create an HTML file that extends `partials/base.html`
3. Use `{% block extra_styles %}` for template-specific CSS
4. Use `{% block body %}` for template HTML
5. Create a matching JSON data file in `data/`
6. The generator auto-discovers templates by folder/filename convention
