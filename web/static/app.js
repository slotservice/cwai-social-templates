/* ═══════════════════════════════════════════════════════
   CWAI Template Generator — Frontend Logic
   Responsive · Auto-preview · Mobile support
   ═══════════════════════════════════════════════════════ */

let templates = [];
let selectedTemplate = null;
let selectedSize = "x_landscape";
let currentData = {};
let previewTimer = null;
let autoPreview = true;
let activeIconPicker = null;

// ── Icon library — organized by category ──
const ICON_LIBRARY = {
  "Tech & AI": ["🤖","🧠","💻","🖥️","⚙️","🔧","🛠️","💾","📡","🔌","🧬","🔬","🧪","🏗️","📱","⌨️","🖱️","🪄","✨","🌐"],
  "Data & Charts": ["📊","📈","📉","🔢","🧮","📋","🗂️","💹","🎯","📐","🔍","🔎","📌","📍","🗃️","💡","📝","🗒️","📃","📄"],
  "Signals": ["🔥","⚡","💥","🚀","⭐","🌟","💫","🏆","🥇","🥈","🥉","🎖️","🏅","👑","💎","🔔","📣","📢","🎪","🎉"],
  "Arrows & Status": ["⬆️","⬇️","↗️","↘️","🔺","🔻","▲","▼","✅","❌","⚠️","🟢","🔴","🟡","🟠","🔵","⏫","⏬","↕️","🔄"],
  "Tools & Objects": ["🦙","🐍","🦀","🐙","🐳","🐋","🦊","🐝","🕸️","🌊","🗡️","🛡️","⚔️","🏹","🪝","🔗","🔑","🔒","🧲","🪄"],
  "Misc": ["📰","📬","📧","💌","🗞️","📖","📚","🎓","🎨","🖌️","🎭","🏷️","💬","💭","🗯️","👁️","👀","🫶","👍","🤝"],
};

const ALL_ICONS = Object.values(ICON_LIBRARY).flat();

const FAMILY_ICONS = {
  hero: "🎯",
  surging: "🚀",
  leaderboard: "🏆",
  insight: "💡",
  compare: "⚔️",
  newsletter: "📰",
};

const SIZE_LABELS = {
  x_landscape: "X / Twitter",
  ig_square: "IG Square",
  ig_portrait: "IG Portrait",
};

const SIZES_MAP = {
  x_landscape: [1200, 675],
  ig_square: [1080, 1080],
  ig_portrait: [1080, 1350],
};

// ── Schema: defines editable fields per template family ──
const FIELD_SCHEMAS = {
  hero: [
    { group: "Text", fields: [
      { key: "tagline_top", label: "Tagline", type: "text" },
      { key: "title_prefix", label: "Title Prefix", type: "text" },
      { key: "title_highlight", label: "Title Highlight", type: "text" },
      { key: "title_suffix", label: "Title Suffix", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
    ]},
    { group: "Features (Hero B)", fields: [
      { key: "features", label: "Features", type: "array_strings" },
    ]},
    { group: "Metrics", fields: [
      { key: "metrics", label: "Metrics", type: "array_objects", subfields: ["label", "value"] },
    ]},
    { group: "Footer", fields: [
      { key: "logo_path", label: "Logo URL", type: "text" },
      { key: "footer_left", label: "Footer Left", type: "text" },
      { key: "footer_right", label: "Footer Right", type: "text" },
    ]},
  ],
  surging_a: [
    { group: "Tool Info", fields: [
      { key: "icon", label: "Icon", type: "icon" },
      { key: "category", label: "Category", type: "text" },
      { key: "tool_name", label: "Tool Name", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "signal", label: "Signal", type: "select", options: ["HOT", "RISING", "WATCH"] },
    ]},
    { group: "Stats", fields: [
      { key: "stats", label: "Stats", type: "array_objects", subfields: ["label", "value"] },
    ]},
    { group: "Footer", fields: [
      { key: "footer_left", label: "Footer Left", type: "text" },
      { key: "footer_right", label: "Footer Right", type: "text" },
    ]},
  ],
  surging_b: [
    { group: "Header", fields: [
      { key: "brand", label: "Brand Name", type: "text" },
      { key: "tag", label: "Tag Badge", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "title_highlight", label: "Title Highlight", type: "text" },
      { key: "title_suffix", label: "Title Suffix", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
    ]},
    { group: "Tools", fields: [
      { key: "tools", label: "Tools", type: "array_objects", subfields: ["name", "description", "growth", "signal"] },
    ]},
    { group: "Footer", fields: [
      { key: "logo_path", label: "Logo URL", type: "text" },
      { key: "footer_left", label: "Footer Left", type: "text" },
      { key: "footer_right", label: "Footer Right", type: "text" },
    ]},
  ],
  leaderboard: [
    { group: "Header", fields: [
      { key: "brand", label: "Brand Name", type: "text" },
      { key: "tag", label: "Tag Badge", type: "text" },
      { key: "title_prefix", label: "Title Prefix", type: "text" },
      { key: "title_highlight", label: "Title Highlight", type: "text" },
      { key: "title_suffix", label: "Title Suffix", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
    ]},
    { group: "Table Columns", fields: [
      { key: "col_tool", label: "Column: Tool", type: "text" },
      { key: "col_score", label: "Column: Score", type: "text" },
      { key: "col_growth", label: "Column: Growth", type: "text" },
      { key: "col_signal", label: "Column: Signal", type: "text" },
    ]},
    { group: "Rows", fields: [
      { key: "rows", label: "Ranking Rows", type: "array_objects", subfields: ["name", "score", "growth", "signal", "bar_pct"] },
    ]},
    { group: "Footer", fields: [
      { key: "logo_path", label: "Logo URL", type: "text" },
      { key: "footer_left", label: "Footer Left", type: "text" },
      { key: "footer_right", label: "Footer Right", type: "text" },
    ]},
  ],
  insight: [
    { group: "Content", fields: [
      { key: "label", label: "Label Badge", type: "text" },
      { key: "quote", label: "Quote / Insight Text", type: "textarea" },
      { key: "source", label: "Source", type: "text" },
    ]},
    { group: "Data Points", fields: [
      { key: "data_points", label: "Data Points", type: "array_objects", subfields: ["value", "label"] },
    ]},
    { group: "Footer", fields: [
      { key: "footer_left", label: "Footer Left", type: "text" },
      { key: "footer_right", label: "Footer Right", type: "text" },
    ]},
  ],
  compare: [
    { group: "Header", fields: [
      { key: "brand", label: "Brand Name", type: "text" },
      { key: "tag", label: "Tag Badge", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
    ]},
    { group: "Tool A", fields: [
      { key: "tool_a.name", label: "Name", type: "text" },
      { key: "tool_a.icon", label: "Icon", type: "icon" },
      { key: "tool_a.stats", label: "Stats", type: "array_objects", subfields: ["label", "value"] },
    ]},
    { group: "Tool B", fields: [
      { key: "tool_b.name", label: "Name", type: "text" },
      { key: "tool_b.icon", label: "Icon", type: "icon" },
      { key: "tool_b.stats", label: "Stats", type: "array_objects", subfields: ["label", "value"] },
    ]},
    { group: "Result", fields: [
      { key: "winner", label: "Winner (a or b)", type: "select", options: ["a", "b"] },
      { key: "verdict", label: "Verdict", type: "textarea" },
    ]},
    { group: "Footer", fields: [
      { key: "logo_path", label: "Logo URL", type: "text" },
      { key: "footer_left", label: "Footer Left", type: "text" },
      { key: "footer_right", label: "Footer Right", type: "text" },
    ]},
  ],
  newsletter: [
    { group: "Content", fields: [
      { key: "badge", label: "Badge Text", type: "text" },
      { key: "title_prefix", label: "Title Prefix", type: "text" },
      { key: "title_highlight", label: "Title Highlight", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "cta_text", label: "CTA Button Text", type: "text" },
      { key: "date", label: "Date", type: "text" },
    ]},
    { group: "Highlights", fields: [
      { key: "highlights", label: "Highlights", type: "array_objects", subfields: ["icon", "text"] },
    ]},
    { group: "Footer", fields: [
      { key: "footer_left", label: "Footer Left", type: "text" },
      { key: "footer_right", label: "Footer Right", type: "text" },
    ]},
  ],
};


/* ═══════════════════════════════
   HELPERS
   ═══════════════════════════════ */
function getNestedValue(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : ""), obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split(".");
  let o = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!o[keys[i]] || typeof o[keys[i]] !== "object") o[keys[i]] = {};
    o = o[keys[i]];
  }
  o[keys[keys.length - 1]] = value;
}

function escapeAttr(str) {
  if (typeof str !== "string") return str;
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

// Auto-refresh preview with debounce
function schedulePreview() {
  if (!autoPreview) return;
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    if (selectedTemplate) refreshPreview();
  }, 350);
}


/* ═══════════════════════════════
   INIT
   ═══════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/templates");
  templates = await res.json();
  renderTemplateList();
  renderSizeButtons();

  // Default mobile tab
  if (window.innerWidth <= 640) {
    switchMobileTab("templates");
  }
});


/* ═══════════════════════════════
   TEMPLATE LIST
   ═══════════════════════════════ */
function renderTemplateList() {
  const grid = document.getElementById("templateGrid");
  grid.innerHTML = "";
  templates.forEach((tpl) => {
    const btn = document.createElement("button");
    btn.className = "template-btn";
    btn.dataset.name = tpl.name;
    btn.innerHTML = `
      <span class="tpl-icon">${FAMILY_ICONS[tpl.family] || "📄"}</span>
      <span>
        <span class="tpl-name">${tpl.name}</span>
        <span class="tpl-family">${tpl.family}</span>
      </span>
    `;
    btn.addEventListener("click", () => selectTemplate(tpl));
    grid.appendChild(btn);
  });
}


/* ═══════════════════════════════
   SIZE BUTTONS
   ═══════════════════════════════ */
function renderSizeButtons() {
  const container = document.getElementById("sizeButtons");
  container.innerHTML = "";
  Object.entries(SIZES_MAP).forEach(([key, dims]) => {
    const btn = document.createElement("button");
    btn.className = `size-btn ${key === selectedSize ? "active" : ""}`;
    btn.dataset.size = key;
    btn.innerHTML = `
      <span>${SIZE_LABELS[key] || key}</span>
      <span class="size-dims">${dims[0]}×${dims[1]}</span>
    `;
    btn.addEventListener("click", () => {
      selectedSize = key;
      document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (selectedTemplate) refreshPreview();
    });
    container.appendChild(btn);
  });
}


/* ═══════════════════════════════
   SELECT TEMPLATE
   ═══════════════════════════════ */
function selectTemplate(tpl) {
  selectedTemplate = tpl;
  currentData = JSON.parse(JSON.stringify(tpl.default_data));

  // Highlight active
  document.querySelectorAll(".template-btn").forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.template-btn[data-name="${tpl.name}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  // Enable export buttons
  document.getElementById("btnExportBoth").disabled = false;
  document.getElementById("btnExportPng").disabled = false;
  document.getElementById("btnExportSvg").disabled = false;

  renderEditFields();
  refreshPreview();

  // On mobile, switch to preview after selecting
  if (window.innerWidth <= 640) {
    switchMobileTab("preview");
  }
}


/* ═══════════════════════════════
   SCHEMA LOOKUP
   ═══════════════════════════════ */
function getSchema(tpl) {
  if (FIELD_SCHEMAS[tpl.name]) return FIELD_SCHEMAS[tpl.name];
  if (FIELD_SCHEMAS[tpl.family]) return FIELD_SCHEMAS[tpl.family];
  return [];
}


/* ═══════════════════════════════
   EDIT FIELDS
   ═══════════════════════════════ */
function renderEditFields() {
  const container = document.getElementById("editFields");
  if (!selectedTemplate) {
    container.innerHTML = `<div class="edit-placeholder">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(0,210,200,0.2)" stroke-width="1.5">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
      <span>Select a template to see editable fields</span>
    </div>`;
    return;
  }

  const schema = getSchema(selectedTemplate);
  container.innerHTML = "";

  schema.forEach((group) => {
    const groupEl = document.createElement("div");
    groupEl.className = "field-group";
    groupEl.innerHTML = `<div class="field-group-title">${group.group}</div>`;

    group.fields.forEach((field) => {
      if (field.type === "array_objects") {
        groupEl.appendChild(renderArrayObjectField(field));
      } else if (field.type === "array_strings") {
        groupEl.appendChild(renderArrayStringField(field));
      } else if (field.type === "icon") {
        groupEl.appendChild(renderIconField(field));
      } else {
        groupEl.appendChild(renderSimpleField(field));
      }
    });

    container.appendChild(groupEl);
  });
}

// Icon picker field
function renderIconField(field) {
  const div = document.createElement("div");
  div.className = "field icon-field";
  const value = getNestedValue(currentData, field.key) || "";

  div.innerHTML = `
    <label>${field.label}</label>
    <div class="icon-selector">
      <button class="icon-current" data-key="${field.key}" title="Click to pick icon">
        <span class="icon-preview">${value || "+"}</span>
        <span class="icon-label">${value ? "Change" : "Select icon"}</span>
      </button>
    </div>
  `;

  const btn = div.querySelector(".icon-current");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    openIconPicker(field.key, btn);
  });

  return div;
}

function openIconPicker(fieldKey, anchorBtn) {
  closeIconPicker();

  const picker = document.createElement("div");
  picker.className = "icon-picker";
  picker.id = "iconPicker";

  // Search bar
  const search = document.createElement("input");
  search.className = "icon-search";
  search.type = "text";
  search.placeholder = "Search icons...";

  // Category tabs
  const tabs = document.createElement("div");
  tabs.className = "icon-tabs";

  const categories = Object.keys(ICON_LIBRARY);
  let activeCategory = categories[0];

  // Icon grid
  const grid = document.createElement("div");
  grid.className = "icon-grid";

  function renderGrid(filter) {
    grid.innerHTML = "";
    let icons;
    if (filter) {
      // Search mode: show all matching (simple substring on category name for now)
      icons = ALL_ICONS;
    } else {
      icons = ICON_LIBRARY[activeCategory] || [];
    }

    icons.forEach((icon) => {
      const btn = document.createElement("button");
      btn.className = "icon-option";
      btn.textContent = icon;
      btn.title = icon;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setNestedValue(currentData, fieldKey, icon);
        // Update the anchor button display
        const preview = anchorBtn.querySelector(".icon-preview");
        const label = anchorBtn.querySelector(".icon-label");
        preview.textContent = icon;
        label.textContent = "Change";
        closeIconPicker();
        schedulePreview();
      });
      grid.appendChild(btn);
    });
  }

  function renderTabs() {
    tabs.innerHTML = "";
    categories.forEach((cat) => {
      const tab = document.createElement("button");
      tab.className = `icon-tab ${cat === activeCategory ? "active" : ""}`;
      tab.textContent = cat;
      tab.addEventListener("click", (e) => {
        e.stopPropagation();
        activeCategory = cat;
        search.value = "";
        renderTabs();
        renderGrid(false);
      });
      tabs.appendChild(tab);
    });
  }

  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    if (q) {
      // Filter by category name containing query
      grid.innerHTML = "";
      Object.entries(ICON_LIBRARY).forEach(([cat, icons]) => {
        if (cat.toLowerCase().includes(q)) {
          icons.forEach((icon) => {
            const btn = document.createElement("button");
            btn.className = "icon-option";
            btn.textContent = icon;
            btn.addEventListener("click", (e) => {
              e.stopPropagation();
              setNestedValue(currentData, fieldKey, icon);
              anchorBtn.querySelector(".icon-preview").textContent = icon;
              anchorBtn.querySelector(".icon-label").textContent = "Change";
              closeIconPicker();
              schedulePreview();
            });
            grid.appendChild(btn);
          });
        }
      });
      // If no category match, show all icons
      if (grid.children.length === 0) renderGrid(true);
    } else {
      renderGrid(false);
    }
  });

  renderTabs();
  renderGrid(false);

  picker.appendChild(search);
  picker.appendChild(tabs);
  picker.appendChild(grid);

  // Position: append inside the icon-field
  const fieldEl = anchorBtn.closest(".icon-field");
  fieldEl.appendChild(picker);
  activeIconPicker = picker;

  // Close on outside click
  setTimeout(() => {
    document.addEventListener("click", handleOutsideClick);
  }, 10);

  search.focus();
}

function closeIconPicker() {
  if (activeIconPicker) {
    activeIconPicker.remove();
    activeIconPicker = null;
    document.removeEventListener("click", handleOutsideClick);
  }
}

function handleOutsideClick(e) {
  if (activeIconPicker && !activeIconPicker.contains(e.target)) {
    closeIconPicker();
  }
}


// Simple field
function renderSimpleField(field) {
  const div = document.createElement("div");
  div.className = "field";
  const value = getNestedValue(currentData, field.key) || "";

  if (field.type === "select") {
    div.innerHTML = `
      <label>${field.label}</label>
      <select data-key="${field.key}">
        ${field.options.map((o) => `<option value="${o}" ${value === o ? "selected" : ""}>${o}</option>`).join("")}
      </select>`;
    div.querySelector("select").addEventListener("change", (e) => {
      setNestedValue(currentData, field.key, e.target.value);
      schedulePreview();
    });
  } else if (field.type === "textarea") {
    div.innerHTML = `<label>${field.label}</label><textarea data-key="${field.key}" placeholder="${field.label}">${value}</textarea>`;
    div.querySelector("textarea").addEventListener("input", (e) => {
      setNestedValue(currentData, field.key, e.target.value);
      schedulePreview();
    });
  } else {
    div.innerHTML = `<label>${field.label}</label><input type="text" data-key="${field.key}" value="${escapeAttr(value)}" placeholder="${field.label}">`;
    div.querySelector("input").addEventListener("input", (e) => {
      setNestedValue(currentData, field.key, e.target.value);
      schedulePreview();
    });
  }
  return div;
}

// Array of objects
function renderArrayObjectField(field) {
  const div = document.createElement("div");
  div.className = "field";
  div.innerHTML = `<label>${field.label}</label>`;

  const arrayDiv = document.createElement("div");
  arrayDiv.className = "array-field";

  function rebuild() {
    arrayDiv.innerHTML = "";
    const arr = getNestedValue(currentData, field.key) || [];

    // Column headers
    if (arr.length > 0) {
      const header = document.createElement("div");
      header.className = "array-header";
      field.subfields.forEach((sf) => {
        const span = document.createElement("span");
        span.textContent = sf;
        header.appendChild(span);
      });
      arrayDiv.appendChild(header);
    }

    arr.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "array-item";
      field.subfields.forEach((sf) => {
        const input = document.createElement("input");
        input.value = item[sf] || "";
        input.placeholder = sf;
        input.addEventListener("input", (e) => {
          arr[idx][sf] = e.target.value;
          schedulePreview();
        });
        row.appendChild(input);
      });
      const removeBtn = document.createElement("button");
      removeBtn.className = "array-btn remove";
      removeBtn.innerHTML = "×";
      removeBtn.addEventListener("click", () => {
        arr.splice(idx, 1);
        setNestedValue(currentData, field.key, arr);
        rebuild();
        schedulePreview();
      });
      row.appendChild(removeBtn);
      arrayDiv.appendChild(row);
    });

    const addBtn = document.createElement("button");
    addBtn.className = "array-btn";
    addBtn.innerHTML = "+";
    addBtn.style.alignSelf = "flex-start";
    addBtn.addEventListener("click", () => {
      const newItem = {};
      field.subfields.forEach((sf) => (newItem[sf] = ""));
      arr.push(newItem);
      setNestedValue(currentData, field.key, arr);
      rebuild();
      schedulePreview();
    });
    arrayDiv.appendChild(addBtn);
  }

  rebuild();
  div.appendChild(arrayDiv);
  return div;
}

// Array of strings
function renderArrayStringField(field) {
  const div = document.createElement("div");
  div.className = "field";
  div.innerHTML = `<label>${field.label}</label>`;

  const arrayDiv = document.createElement("div");
  arrayDiv.className = "array-field";

  function rebuild() {
    arrayDiv.innerHTML = "";
    const arr = getNestedValue(currentData, field.key) || [];

    arr.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "array-item";
      const input = document.createElement("input");
      input.value = item || "";
      input.placeholder = `Item ${idx + 1}`;
      input.addEventListener("input", (e) => {
        arr[idx] = e.target.value;
        schedulePreview();
      });
      row.appendChild(input);
      const removeBtn = document.createElement("button");
      removeBtn.className = "array-btn remove";
      removeBtn.innerHTML = "×";
      removeBtn.addEventListener("click", () => {
        arr.splice(idx, 1);
        setNestedValue(currentData, field.key, arr);
        rebuild();
        schedulePreview();
      });
      row.appendChild(removeBtn);
      arrayDiv.appendChild(row);
    });

    const addBtn = document.createElement("button");
    addBtn.className = "array-btn";
    addBtn.innerHTML = "+";
    addBtn.style.alignSelf = "flex-start";
    addBtn.addEventListener("click", () => {
      arr.push("");
      setNestedValue(currentData, field.key, arr);
      rebuild();
      schedulePreview();
    });
    arrayDiv.appendChild(addBtn);
  }

  rebuild();
  div.appendChild(arrayDiv);
  return div;
}


/* ═══════════════════════════════
   PREVIEW
   ═══════════════════════════════ */
async function refreshPreview() {
  if (!selectedTemplate) return;

  const frame = document.getElementById("previewFrame");
  const placeholder = document.getElementById("previewPlaceholder");
  const info = document.getElementById("previewInfo");
  const loading = document.getElementById("loadingOverlay");

  setStatus("Rendering...");
  loading.style.display = "flex";

  try {
    const res = await fetch("/api/svg-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: selectedTemplate.name,
        data: currentData,
        size: selectedSize,
      }),
    });

    const result = await res.json();
    const dims = SIZES_MAP[selectedSize];

    placeholder.style.display = "none";
    frame.style.display = "block";

    // Scale to fit container
    const container = document.getElementById("previewContainer");
    const pad = 16;
    const containerW = container.clientWidth - pad;
    const containerH = container.clientHeight - pad;
    const scale = Math.min(containerW / dims[0], containerH / dims[1], 1);

    frame.style.width = dims[0] + "px";
    frame.style.height = dims[1] + "px";
    frame.style.transform = `scale(${scale})`;

    const doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write(result.html);
    doc.close();

    info.textContent = `${selectedTemplate.name} · ${SIZE_LABELS[selectedSize]} · ${dims[0]}×${dims[1]}`;
    setStatus("Ready");
  } catch (err) {
    setStatus("Error");
    console.error("Preview error:", err);
  } finally {
    loading.style.display = "none";
  }
}


/* ═══════════════════════════════
   EXPORT
   ═══════════════════════════════ */
async function exportPng() {
  if (!selectedTemplate) return;

  const btn = document.getElementById("btnExport");
  const btnOriginalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="export-spinner"></span> Rendering...`;
  setStatus("Exporting PNG...");

  try {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: selectedTemplate.name,
        data: currentData,
        size: selectedSize,
      }),
    });

    if (!res.ok) throw new Error("Export failed");

    const savedPath = res.headers.get("X-Saved-Path") || "";
    const fileName = `${selectedTemplate.name}_${selectedSize}.png`;

    btn.innerHTML = `<span class="btn-icon">✓</span> Downloading...`;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus("Exported ✓");
    showToast("success", `Exported: ${fileName}`, savedPath ? `Saved to: ${savedPath}` : "");

    btn.innerHTML = `<span class="btn-icon">✓</span> Exported!`;
    setTimeout(() => {
      btn.innerHTML = btnOriginalHTML;
      setStatus("Ready");
    }, 3000);
  } catch (err) {
    setStatus("Export failed");
    showToast("error", "Export failed", "Check that the server is running and try again.");
    console.error("Export error:", err);
    btn.innerHTML = btnOriginalHTML;
  } finally {
    btn.disabled = false;
  }
}


/* ═══════════════════════════════
   EXPORT SVG
   ═══════════════════════════════ */
async function exportSvg() {
  if (!selectedTemplate) return;

  const btn = document.getElementById("btnExportSvg");
  btn.disabled = true;
  btn.textContent = "Exporting...";
  setStatus("Exporting SVG...");

  try {
    const res = await fetch("/api/export-svg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: selectedTemplate.name,
        data: currentData,
        size: selectedSize,
      }),
    });

    if (!res.ok) throw new Error("SVG export failed");

    const savedPath = res.headers.get("X-Saved-Path") || "";
    const fileName = `${selectedTemplate.name}_${selectedSize}.svg`;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus("Exported ✓");
    showToast("success", `Exported: ${fileName}`, savedPath ? `Saved to: ${savedPath}` : "");
    setTimeout(() => setStatus("Ready"), 2500);
  } catch (err) {
    setStatus("Export failed");
    showToast("error", "SVG export failed", err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "SVG only";
  }
}


/* ═══════════════════════════════
   EXPORT BOTH (PNG + SVG)
   ═══════════════════════════════ */
async function exportBoth() {
  if (!selectedTemplate) return;

  const btn = document.getElementById("btnExportBoth");
  const btnOriginalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="export-spinner"></span> Rendering...`;
  setStatus("Exporting PNG + SVG...");

  try {
    const res = await fetch("/api/export-both", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: selectedTemplate.name,
        data: currentData,
        size: selectedSize,
      }),
    });

    if (!res.ok) throw new Error("Export failed");

    const pngPath = res.headers.get("X-Saved-Path") || "";
    const svgPath = res.headers.get("X-SVG-Path") || "";
    const fileName = `${selectedTemplate.name}_${selectedSize}.png`;

    // Download PNG
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Also download SVG
    const svgRes = await fetch("/api/export-svg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: selectedTemplate.name,
        data: currentData,
        size: selectedSize,
      }),
    });
    if (svgRes.ok) {
      const svgBlob = await svgRes.blob();
      const svgUrl = URL.createObjectURL(svgBlob);
      const svgA = document.createElement("a");
      svgA.href = svgUrl;
      svgA.download = `${selectedTemplate.name}_${selectedSize}.svg`;
      document.body.appendChild(svgA);
      svgA.click();
      document.body.removeChild(svgA);
      URL.revokeObjectURL(svgUrl);
    }

    setStatus("Exported ✓");
    let msg = "";
    if (pngPath) msg += `PNG: ${pngPath}`;
    if (svgPath) msg += `${msg ? "\n" : ""}SVG: ${svgPath}`;
    showToast("success", "Exported PNG + SVG", msg);

    btn.innerHTML = `<span class="btn-icon">✓</span> Exported!`;
    setTimeout(() => {
      btn.innerHTML = btnOriginalHTML;
      setStatus("Ready");
    }, 3000);
  } catch (err) {
    setStatus("Export failed");
    showToast("error", "Export failed", err.message);
    btn.innerHTML = btnOriginalHTML;
  } finally {
    btn.disabled = false;
  }
}


/* ═══════════════════════════════
   TOAST NOTIFICATIONS
   ═══════════════════════════════ */
function showToast(type, title, message) {
  // Create container if not exists
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icon = type === "success" ? "✓" : type === "error" ? "✗" : "ℹ";

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ""}
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add("show"));

  // Auto-remove after 6 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 6000);
}


/* ═══════════════════════════════
   AUTO-PREVIEW TOGGLE
   ═══════════════════════════════ */
function toggleAutoPreview() {
  autoPreview = !autoPreview;
  const dot = document.querySelector(".auto-dot");
  dot.classList.toggle("active", autoPreview);
}


/* ═══════════════════════════════
   MOBILE: Tab switching
   ═══════════════════════════════ */
function switchMobileTab(panel) {
  // Update tab buttons
  document.querySelectorAll(".mobile-tab").forEach((t) => t.classList.remove("active"));
  const activeTab = document.querySelector(`.mobile-tab[data-panel="${panel}"]`);
  if (activeTab) activeTab.classList.add("active");

  // Show/hide panels
  const sidebar = document.getElementById("sidebarPanel");
  const preview = document.getElementById("previewPanel");
  const editor = document.getElementById("editorPanel");

  sidebar.classList.remove("mobile-active");
  preview.classList.remove("mobile-active");
  editor.classList.remove("mobile-active");

  if (panel === "templates") sidebar.classList.add("mobile-active");
  if (panel === "preview") preview.classList.add("mobile-active");
  if (panel === "editor") editor.classList.add("mobile-active");
}


/* ═══════════════════════════════
   TABLET: Edit panel slide-over
   ═══════════════════════════════ */
function toggleEditPanel() {
  const panel = document.getElementById("editorPanel");
  const overlay = document.getElementById("mobileOverlay");
  panel.classList.toggle("open");
  overlay.classList.toggle("visible");
}


/* ═══════════════════════════════
   MOBILE: Menu overlay
   ═══════════════════════════════ */
function toggleMobileMenu() {
  const sidebar = document.getElementById("sidebarPanel");
  const overlay = document.getElementById("mobileOverlay");

  if (window.innerWidth > 640) {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("visible");
  }
}

function closeMobileMenu() {
  document.getElementById("sidebarPanel").classList.remove("open");
  document.getElementById("editorPanel").classList.remove("open");
  document.getElementById("mobileOverlay").classList.remove("visible");
}

// Handle window resize — reset panel states
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    // Desktop: reset all mobile/tablet states
    document.querySelectorAll(".mobile-active").forEach((el) => el.classList.remove("mobile-active"));
    closeMobileMenu();
  } else if (window.innerWidth <= 640) {
    // Make sure at least one tab is active on mobile
    const hasActive = document.querySelector(".mobile-active");
    if (!hasActive) switchMobileTab("templates");
  }
});
