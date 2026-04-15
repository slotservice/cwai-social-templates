#!/usr/bin/env python3
"""
CWAI Social Media Template Generator — Web UI
==============================================
Flask app that lets the client visually edit templates,
preview them live, and export PNGs.

Usage:
    python app.py
    Then open http://localhost:5000
"""
import base64
import json
import io
from pathlib import Path

from flask import Flask, render_template, request, jsonify, send_file
from jinja2 import Environment, FileSystemLoader

from config import DESIGN, OUTPUT_DIR, SIZES, TEMPLATES_DIR

app = Flask(
    __name__,
    template_folder="web",
    static_folder="web/static",
)

# Jinja2 env for the social templates (separate from Flask's own templates)
social_env = Environment(
    loader=FileSystemLoader(str(TEMPLATES_DIR)),
    autoescape=False,
)


def get_all_templates() -> list[dict]:
    """Discover all available templates with their default data."""
    templates = []
    data_dir = Path(__file__).parent / "data"
    for subdir in sorted(TEMPLATES_DIR.iterdir()):
        if subdir.is_dir() and subdir.name != "partials":
            for html_file in sorted(subdir.glob("*.html")):
                name = html_file.stem
                # Load default data if exists
                data_file = data_dir / f"{name}.json"
                default_data = {}
                if data_file.exists():
                    with open(data_file, "r", encoding="utf-8") as f:
                        default_data = json.load(f)
                templates.append({
                    "name": name,
                    "family": subdir.name,
                    "path": f"{subdir.name}/{html_file.name}",
                    "default_data": default_data,
                })
    return templates


def resolve_template_path(template_name: str) -> str:
    """Find the Jinja2 path for a template name."""
    for subdir in TEMPLATES_DIR.iterdir():
        if subdir.is_dir():
            candidate = subdir / f"{template_name}.html"
            if candidate.exists():
                return f"{subdir.name}/{template_name}.html"
    return None


def render_social_html(template_name: str, data: dict, size_key: str) -> str:
    """Render a social template with data and return HTML string."""
    width, height = SIZES[size_key]
    template_path = resolve_template_path(template_name)
    if not template_path:
        return f"<p>Template '{template_name}' not found.</p>"
    template = social_env.get_template(template_path)
    return template.render(data=data, design=DESIGN, width=width, height=height, size_key=size_key)


def render_png_bytes(html_content: str, width: int, height: int) -> bytes:
    """Render HTML to PNG bytes using Playwright."""
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        page.set_content(html_content, wait_until="networkidle")
        page.wait_for_timeout(1000)
        png_bytes = page.screenshot(type="png")
        browser.close()
    return png_bytes


# ── Routes ──────────────────────────────────────────────

@app.route("/")
def index():
    """Main UI page."""
    return render_template("index.html")


@app.route("/api/templates")
def api_templates():
    """Return list of available templates with default data."""
    return jsonify(get_all_templates())


@app.route("/api/sizes")
def api_sizes():
    """Return available output sizes."""
    sizes = [{"key": k, "width": v[0], "height": v[1]} for k, v in SIZES.items()]
    return jsonify(sizes)


@app.route("/api/preview", methods=["POST"])
def api_preview():
    """Render template to HTML for live preview."""
    payload = request.get_json()
    template_name = payload.get("template")
    data = payload.get("data", {})
    size_key = payload.get("size", "x_landscape")
    html = render_social_html(template_name, data, size_key)
    return jsonify({"html": html})


@app.route("/api/export", methods=["POST"])
def api_export():
    """Render template to PNG and return as download."""
    payload = request.get_json()
    template_name = payload.get("template")
    data = payload.get("data", {})
    size_key = payload.get("size", "x_landscape")
    html = render_social_html(template_name, data, size_key)
    width, height = SIZES[size_key]
    png_bytes = render_png_bytes(html, width, height)

    # Also save to output folder
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_DIR / f"{template_name}_{size_key}.png"
    with open(out_path, "wb") as f:
        f.write(png_bytes)

    return send_file(
        io.BytesIO(png_bytes),
        mimetype="image/png",
        as_attachment=True,
        download_name=f"{template_name}_{size_key}.png",
    )


@app.route("/api/export-preview", methods=["POST"])
def api_export_preview():
    """Render template to PNG and return as base64 for in-page preview."""
    payload = request.get_json()
    template_name = payload.get("template")
    data = payload.get("data", {})
    size_key = payload.get("size", "x_landscape")
    html = render_social_html(template_name, data, size_key)
    width, height = SIZES[size_key]
    png_bytes = render_png_bytes(html, width, height)
    b64 = base64.b64encode(png_bytes).decode("utf-8")
    return jsonify({"image": f"data:image/png;base64,{b64}"})


if __name__ == "__main__":
    print("\n  CWAI Social Template Generator")
    print("  Open http://localhost:5000 in your browser\n")
    app.run(debug=False, host="127.0.0.1", port=5000, threaded=True)
