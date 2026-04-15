# CWAI Social Template Generator — Progress Log

**Project**: Reusable Social Media Post Template System for CrowdWiseAI  
**Client**: Callie (via Freelancer)  
**Date started**: 2026-04-15  

---

## Phase 1: Analysis & Design System Extraction

### Source files analyzed
| File | Type | Key findings |
|------|------|-------------|
| `CWAI Hero.html` | Hero graphic sample | 1200x675px card, centered layout, pulse ring animations, gradient text, metric pills, dark bg with cyan/teal accents |
| `templatesbreakout_table.html` | Leaderboard sample | 5-row ranked table, grid columns (rank, tool, score, growth, signal), editable `<input>` fields, momentum bars, HOT/RISING/WATCH signals |
| `X Post Template A/B/C.pptx` | Surging tool samples | 3 PowerPoint slide examples of surging/tool spotlight posts (referenced for style direction) |
| `chat.md` | Client conversation | Full scope: hero graphics, surging tools, leaderboards, insight cards, compare cards, newsletter promos |

### Design system extracted
- **Backgrounds**: `#0a0e1a` body, gradient card `#0b1026 → #0d1530 → #091220`
- **Primary accent**: `#00d2c8` (cyan)
- **Secondary accents**: `#38e6b4` (teal), `#00b4dc` (blue)
- **Fonts**: Outfit (headings/body, weights 300-800), JetBrains Mono (data/labels/code)
- **Visual effects**: Grid background, radial gradient orbs, pulse ring animations, scanline sweep, corner bracket decorations, floating particles, signal lines
- **Layout constants**: 44px horizontal padding, 28px vertical padding, 16px corner insets
- **Signal system**: HOT (teal, 🔥), RISING (cyan, ↑), WATCH (muted cyan, ●)

---

## Phase 2: Architecture & Stack Decision

### Chosen stack
| Component | Choice | Rationale |
|-----------|--------|-----------|
| Language | Python 3.10+ | Client requirement |
| Templating | Jinja2 | Variable injection, template inheritance, filters |
| Rendering | Playwright (Chromium) | High-fidelity HTML→PNG, supports web fonts/CSS |
| CLI | Click | Clean argument parsing, help text, validation |
| Data format | JSON | Simple, human-editable, Python-native |
| Config | Python module (config.py) | Design tokens centralized, importable |

### Key design decisions
1. **Template inheritance** — All templates extend `partials/base.html` which contains the shared design system CSS (grid bg, glows, corners, bottom bar, etc.)
2. **Size-adaptive rendering** — Font sizes adjust via Jinja2 conditionals based on `size_key` (x_landscape / ig_square / ig_portrait)
3. **Auto-discovery** — Generator scans template subdirectories automatically; adding a new template requires no code changes to `generate.py`
4. **JSON-driven content** — All editable fields (titles, metrics, rows, etc.) come from JSON files, never hardcoded in templates

---

## Phase 3: Implementation

### Files created

#### Core infrastructure
| File | Purpose | Status |
|------|---------|--------|
| `config.py` | Design tokens, output sizes, path constants | ✅ Done |
| `generate.py` | CLI generator — loads JSON, renders Jinja2, exports PNG via Playwright | ✅ Done |
| `requirements.txt` | Python dependencies (jinja2, playwright, pyyaml, click) | ✅ Done |
| `README.md` | Full documentation with setup, usage, field reference | ✅ Done |

#### Templates (9 total across 6 families)
| Template | File | Matches sample | Status |
|----------|------|----------------|--------|
| Hero A (centered + pulse rings) | `templates/hero/hero_a.html` | Direct match to `CWAI Hero.html` | ✅ Done |
| Hero B (left-aligned + features) | `templates/hero/hero_b.html` | New variant, same design language | ✅ Done |
| Surging A (single tool spotlight) | `templates/surging/surging_a.html` | Inspired by X Post Templates | ✅ Done |
| Surging B (multi-tool list) | `templates/surging/surging_b.html` | Ranked list variant | ✅ Done |
| Leaderboard A (table layout) | `templates/leaderboard/leaderboard_a.html` | Direct match to `templatesbreakout_table.html` | ✅ Done |
| Leaderboard B (card grid) | `templates/leaderboard/leaderboard_b.html` | Alternative card-based layout | ✅ Done |
| Insight A (quote + data) | `templates/insight/insight_a.html` | Quote card with data highlights | ✅ Done |
| Compare A (versus card) | `templates/compare/compare_a.html` | Side-by-side tool comparison | ✅ Done |
| Newsletter A (report promo) | `templates/newsletter/newsletter_a.html` | CTA-driven promo card | ✅ Done |

#### Sample data files (9 JSON files)
| Data file | Template | Status |
|-----------|----------|--------|
| `data/hero_a.json` | hero_a | ✅ Done |
| `data/hero_b.json` | hero_b | ✅ Done |
| `data/surging_a.json` | surging_a | ✅ Done |
| `data/surging_b.json` | surging_b | ✅ Done |
| `data/leaderboard_a.json` | leaderboard_a | ✅ Done |
| `data/leaderboard_b.json` | leaderboard_b | ✅ Done |
| `data/insight_a.json` | insight_a | ✅ Done |
| `data/compare_a.json` | compare_a | ✅ Done |
| `data/newsletter_a.json` | newsletter_a | ✅ Done |

#### Shared base template
| File | Purpose | Status |
|------|---------|--------|
| `templates/partials/base.html` | Design system CSS, grid bg, glows, corners, bottom bar, top bar, metric pills, gradient text, scanline | ✅ Done |

---

## Phase 4: Testing

- **Python not installed** on the current development machine (Windows Store alias only)
- **Structural validation**: All 23 files verified present in correct directory structure
- **Template syntax**: All templates use valid Jinja2 inheritance (`{% extends %}`, `{% block %}`)
- **JSON data**: All 9 data files contain valid JSON with correct field names matching template variables

### To test on a machine with Python:
```bash
cd cwai-social-templates
pip install -r requirements.txt
python -m playwright install chromium
python generate.py -t hero_a -d data/hero_a.json --html-only   # quick HTML test
python generate.py -t all -d data/                              # full PNG render
```

---

## Compliance with project_status&plan.md

| Requirement | Status | Notes |
|-------------|--------|-------|
| Python-based generator | ✅ | `generate.py` with Click CLI |
| HTML/CSS templates | ✅ | Jinja2 templates extending shared base |
| Jinja2 for variable injection | ✅ | Template inheritance + variable context |
| Playwright for PNG export | ✅ | `export_png()` in generate.py |
| Clean asset folder structure | ✅ | templates/, data/, output/, assets/ |
| JSON content input | ✅ | 9 sample JSON files |
| CLI command for generation | ✅ | `python generate.py -t <name> -d <file>` |
| 2 hero templates | ✅ | hero_a (centered), hero_b (left-aligned) |
| 2 surging/spotlight templates | ✅ | surging_a (single), surging_b (multi) |
| 2 breakout leaderboard templates | ✅ | leaderboard_a (table), leaderboard_b (cards) |
| 1 insight/quote/data template | ✅ | insight_a |
| 1 compare/versus template | ✅ | compare_a |
| 1 report/newsletter promo template | ✅ | newsletter_a |
| Dark premium tech aesthetic | ✅ | Matches CWAI Hero.html palette |
| Glowing cyan/teal accents | ✅ | #00d2c8, #38e6b4, gradient text |
| Futuristic data-grid feel | ✅ | Grid bg, scanlines, pulse rings, particles |
| Modern clean typography | ✅ | Outfit + JetBrains Mono |
| X landscape size | ✅ | 1200x675 |
| Instagram square size | ✅ | 1080x1080 |
| Instagram portrait size | ✅ | 1080x1350 |
| Editable text fields via JSON | ✅ | All content driven by JSON data |
| requirements.txt | ✅ | jinja2, playwright, pyyaml, click |
| README.md | ✅ | Full docs with setup, usage, field reference |

---

## Phase 5: Web UI (Flask App)

### Why
Re-reading the client's request: *"editable templates integrated into a Python program"* — the client is non-technical (*"stuff I blundered through with tools beyond my capabilities"*). They need a visual UI, not a CLI with JSON files.

### What was built
| File | Purpose | Status |
|------|---------|--------|
| `app.py` | Flask web server with API routes (preview, export, template list) | ✅ Done |
| `web/index.html` | Main UI page — 3-column layout (templates, preview, edit fields) | ✅ Done |
| `web/static/style.css` | Dark/cyan aesthetic matching the template design system | ✅ Done |
| `web/static/app.js` | Frontend logic — template selection, form binding, live preview, PNG export | ✅ Done |

### UI features
- **Left sidebar**: Template picker (9 templates, grouped by family with icons), output size selector (X landscape, IG square, IG portrait), Preview and Export buttons
- **Center**: Live preview of the rendered template in a scaled iframe
- **Right panel**: Dynamic edit fields that change based on selected template — text inputs, textareas, dropdowns, array editors (for metrics/rows/tools/stats) with add/remove buttons
- **Export**: Renders to PNG via Playwright server-side, auto-downloads the file, and saves to `output/` folder

### API routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET | Serve the main UI page |
| `/api/templates` | GET | Return list of templates with default data |
| `/api/sizes` | GET | Return available output sizes |
| `/api/preview` | POST | Render template HTML for live preview |
| `/api/export` | POST | Render template to PNG and return as download |
| `/api/export-preview` | POST | Render PNG and return as base64 (for in-page display) |

### How to run
```bash
cd cwai-social-templates
python app.py
# Open http://localhost:5000
```

### Testing results
- Flask server: starts on port 5000, stays alive across multiple requests ✅
- `/` returns 200 with full UI page ✅
- `/api/templates` returns JSON with all 9 templates + default data ✅
- `/api/preview` renders template HTML correctly ✅
- `/static/style.css` and `/static/app.js` served correctly ✅
- Browser opened and UI loaded ✅

---

## What's left for future phases

1. **Add client logo** — Place the actual CrowdWiseAI logo SVG/PNG in `assets/` and update `logo_path` in JSON files
2. **Expand template count** — Add more variants to reach the upper end of client requirements (up to 8 surging, 5 leaderboard, 3 insight, 3 compare, 2 newsletter)
3. **PPTX integration** — If client wants to import/export to PowerPoint, add python-pptx support
4. **Batch generation** — Add support for generating posts from CSV/spreadsheet data
5. **Preview server** — Add a local Flask/FastAPI server for live template preview while editing JSON
