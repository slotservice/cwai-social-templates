#!/usr/bin/env python3
"""
CWAI Social Media Template Generator
=====================================
Renders HTML/CSS templates with JSON data using Jinja2,
then exports PNG images via Playwright.

Usage:
    python generate.py --template hero_a --data data/hero_sample.json
    python generate.py --template hero_a --data data/hero_sample.json --size ig_square
    python generate.py --template all --data data/  # render all templates
"""
import json
import sys
from pathlib import Path

import click
from jinja2 import Environment, FileSystemLoader

from config import DESIGN, OUTPUT_DIR, SIZES, TEMPLATES_DIR


def load_data(data_path: str) -> dict:
    """Load JSON data file and return as dict."""
    path = Path(data_path)
    if not path.exists():
        click.echo(f"Error: Data file not found: {data_path}", err=True)
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def resolve_template_path(template_name: str) -> str:
    """
    Map a template name like 'hero_a' to the Jinja2 template path
    e.g. 'hero/hero_a.html'.
    """
    # Template naming convention: {family}_{variant}
    # Folder is the family name, file is the full name
    parts = template_name.rsplit("_", 1)
    if len(parts) == 2:
        family = parts[0]
        # Handle multi-word families like 'tool_spotlight'
        # Check if the folder exists with the full prefix
        candidate = TEMPLATES_DIR / family / f"{template_name}.html"
        if candidate.exists():
            return f"{family}/{template_name}.html"
        # Try just the first word as folder
        first_word = template_name.split("_")[0]
        candidate2 = TEMPLATES_DIR / first_word / f"{template_name}.html"
        if candidate2.exists():
            return f"{first_word}/{template_name}.html"

    # Fallback: search all subdirectories
    for subdir in TEMPLATES_DIR.iterdir():
        if subdir.is_dir():
            candidate = subdir / f"{template_name}.html"
            if candidate.exists():
                return f"{subdir.name}/{template_name}.html"

    click.echo(f"Error: Template '{template_name}' not found.", err=True)
    sys.exit(1)


def render_html(template_name: str, data: dict, size_key: str) -> str:
    """Render a Jinja2 template with data and return HTML string."""
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=False,
    )
    width, height = SIZES[size_key]
    template_path = resolve_template_path(template_name)
    template = env.get_template(template_path)

    context = {
        "data": data,
        "design": DESIGN,
        "width": width,
        "height": height,
        "size_key": size_key,
    }
    return template.render(**context)


def export_png(html_content: str, output_path: Path, width: int, height: int):
    """Use Playwright to render HTML to PNG."""
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height})
        page.set_content(html_content, wait_until="networkidle")
        # Wait for fonts to load
        page.wait_for_timeout(1000)
        page.screenshot(path=str(output_path), type="png")
        browser.close()


def get_all_templates() -> list[str]:
    """Discover all available template names."""
    templates = []
    for subdir in sorted(TEMPLATES_DIR.iterdir()):
        if subdir.is_dir() and subdir.name != "partials":
            for html_file in sorted(subdir.glob("*.html")):
                templates.append(html_file.stem)
    return templates


def find_data_for_template(template_name: str, data_dir: Path) -> Path | None:
    """Find the matching JSON data file for a template."""
    # Try exact match first
    exact = data_dir / f"{template_name}.json"
    if exact.exists():
        return exact
    # Try family match (e.g., hero_a -> hero_sample.json)
    family = template_name.split("_")[0]
    sample = data_dir / f"{family}_sample.json"
    if sample.exists():
        return sample
    return None


@click.command()
@click.option(
    "--template", "-t",
    required=True,
    help="Template name (e.g. hero_a) or 'all' to render everything.",
)
@click.option(
    "--data", "-d",
    required=True,
    help="Path to JSON data file, or directory of JSON files when using --template all.",
)
@click.option(
    "--size", "-s",
    default="x_landscape",
    type=click.Choice(list(SIZES.keys())),
    help="Output size preset.",
)
@click.option(
    "--output", "-o",
    default=None,
    help="Output file path. Auto-generated if omitted.",
)
@click.option(
    "--html-only",
    is_flag=True,
    default=False,
    help="Output rendered HTML instead of PNG (for debugging).",
)
def main(template, data, size, output, html_only):
    """Generate social media post images from templates."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if template == "all":
        data_dir = Path(data)
        if not data_dir.is_dir():
            click.echo("Error: When using --template all, --data must be a directory.", err=True)
            sys.exit(1)

        templates = get_all_templates()
        if not templates:
            click.echo("No templates found.", err=True)
            sys.exit(1)

        click.echo(f"Found {len(templates)} templates. Rendering all...")
        for tpl_name in templates:
            data_file = find_data_for_template(tpl_name, data_dir)
            if data_file is None:
                click.echo(f"  SKIP {tpl_name} — no data file found")
                continue
            render_single(tpl_name, data_file, size, None, html_only)
    else:
        render_single(template, Path(data), size, output, html_only)


def render_single(template_name, data_path, size_key, output_path, html_only):
    """Render a single template to PNG or HTML."""
    data = load_data(str(data_path))
    html = render_html(template_name, data, size_key)

    if output_path is None:
        ext = "html" if html_only else "png"
        output_path = OUTPUT_DIR / f"{template_name}_{size_key}.{ext}"
    else:
        output_path = Path(output_path)

    output_path.parent.mkdir(parents=True, exist_ok=True)

    if html_only:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html)
        click.echo(f"  HTML -> {output_path}")
    else:
        width, height = SIZES[size_key]
        export_png(html, output_path, width, height)
        click.echo(f"  PNG  -> {output_path}")


if __name__ == "__main__":
    main()
