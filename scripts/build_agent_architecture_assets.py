from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "pdf"
DOCS_DIR = ROOT / "docs"
OUT_PDF = OUT_DIR / "agent-architecture-overview.pdf"
OUT_SVG = DOCS_DIR / "agent-architecture-diagram.svg"

PAGE_W = 595.28
PAGE_H = 841.89
MARGIN = 40

ACCENT = (37 / 255, 99 / 255, 235 / 255)
ACCENT_DARK = (15 / 255, 23 / 255, 42 / 255)
SKY = (14 / 255, 165 / 255, 233 / 255)
MUTED = (71 / 255, 85 / 255, 105 / 255)
TEXT = (15 / 255, 23 / 255, 42 / 255)
LIGHT = (248 / 255, 250 / 255, 252 / 255)
BORDER = (203 / 255, 213 / 255, 225 / 255)
GREEN = (22 / 255, 163 / 255, 74 / 255)
RED = (220 / 255, 38 / 255, 38 / 255)

TITLE = "GenAi Agent Architecture"
SUBTITLE = "A 1-2 page system view of agent roles, communication, tool integrations, and failure handling"
INTRO = (
    "GenAi behaves like a focused multi-agent healthcare assistant behind one chat interface. "
    "The frontend orchestrates requests, the backend routes them to specialist agents, and each agent can call local tools or external providers while degrading safely when a dependency fails."
)

ROLE_POINTS = [
    "Frontend Conversation Orchestrator: collects intent, routes requests, and renders structured replies.",
    "Symptom Analysis Agent: detects symptoms, scores urgency, suggests facilities, and can enrich explanations with OpenAI or Groq.",
    "Facility Finder Agent: ranks nearby hospitals using district, state, specialty, and urgency.",
    "Prescription Explainer Agent: decodes shorthand such as OD, BD, TDS, AC, and PC into readable schedules.",
    "Medical Book Agent: ingests uploaded documents, checks source trust, retrieves excerpts, and answers only from the provided text.",
]

COMMUNICATION_POINTS = [
    "1. User message enters the chat UI through WorkspacePage and Messages.",
    "2. frontend/src/services/api.js chooses the matching backend endpoint.",
    "3. AppHandler and api_router dispatch the request to a focused controller.",
    "4. The controller calls one service module, which may use domain data, file parsers, localization, or an external LLM.",
    "5. Structured JSON returns to the frontend and is rendered as the next assistant message.",
]

TOOL_POINTS = [
    "OpenAI or Groq chat completions for optional symptom explanation enhancement.",
    "domain_data.py for symptoms, hospitals, facilities, and public-health reference topics.",
    "localization_service.py for multilingual labels and copy fallback.",
    "PyMuPDF plus DOCX/XML and text parsers for uploaded medical books.",
    "localStorage for browser-side session state and in-memory backend storage for uploaded books.",
]

ERROR_POINTS = [
    "requestJson normalizes backend failures into readable UI errors.",
    "Invalid service input raises ValueError and becomes a 400 JSON response.",
    "Unknown routes return 404 and static path traversal is blocked with 403.",
    "If OpenAI or Groq is missing, unavailable, or returns malformed output, symptom analysis falls back to the built-in rule-based engine.",
    "If a medical-book answer is missing, the app states that the information is not available instead of hallucinating.",
]

DIAGRAM_NODES = [
    {"id": "user", "title": "User", "subtitle": "Voice or text input", "x": 70, "y": 80, "w": 130, "h": 62, "fill": "#dbeafe", "stroke": "#2563eb"},
    {"id": "frontend", "title": "Frontend Orchestrator", "subtitle": "WorkspacePage + Messages + api.js", "x": 245, "y": 72, "w": 250, "h": 78, "fill": "#0f172a", "stroke": "#38bdf8", "text": "#f8fafc"},
    {"id": "backend", "title": "Backend HTTP Shell", "subtitle": "AppHandler + api_router", "x": 540, "y": 72, "w": 230, "h": 78, "fill": "#eff6ff", "stroke": "#2563eb"},
    {"id": "triage", "title": "Symptom Analysis Agent", "subtitle": "triage_controller -> triage_service", "x": 80, "y": 235, "w": 200, "h": 78, "fill": "#eff6ff", "stroke": "#2563eb"},
    {"id": "finder", "title": "Facility Finder Agent", "subtitle": "hospital_search + hospital ranking", "x": 305, "y": 235, "w": 200, "h": 78, "fill": "#eff6ff", "stroke": "#2563eb"},
    {"id": "rx", "title": "Prescription Explainer Agent", "subtitle": "prescription_controller -> prescription_service", "x": 530, "y": 235, "w": 250, "h": 78, "fill": "#eff6ff", "stroke": "#2563eb"},
    {"id": "book", "title": "Medical Book Agent", "subtitle": "books_controller -> book_service", "x": 305, "y": 340, "w": 250, "h": 78, "fill": "#eff6ff", "stroke": "#2563eb"},
    {"id": "llm", "title": "LLM Tool", "subtitle": "OpenAI or Groq via llm_triage_service", "x": 50, "y": 490, "w": 220, "h": 72, "fill": "#dcfce7", "stroke": "#16a34a"},
    {"id": "static", "title": "Static Knowledge Tools", "subtitle": "domain_data + localization_service", "x": 290, "y": 490, "w": 250, "h": 72, "fill": "#e0f2fe", "stroke": "#0284c7"},
    {"id": "memory", "title": "File + Session Tools", "subtitle": "PDF or DOCX parsing + localStorage + in-memory books", "x": 560, "y": 490, "w": 240, "h": 72, "fill": "#fef3c7", "stroke": "#d97706"},
    {"id": "error", "title": "Fallback and Error Layer", "subtitle": "400 or 404 handling + rule-based fallback + safe defaults", "x": 215, "y": 620, "w": 420, "h": 74, "fill": "#fee2e2", "stroke": "#dc2626"},
]

DIAGRAM_EDGES = [
    ("user", "frontend"),
    ("frontend", "backend"),
    ("backend", "triage"),
    ("backend", "finder"),
    ("backend", "rx"),
    ("backend", "book"),
    ("triage", "llm"),
    ("triage", "static"),
    ("finder", "static"),
    ("rx", "static"),
    ("book", "memory"),
    ("triage", "error"),
    ("book", "error"),
    ("backend", "error"),
]


@dataclass
class Node:
    node_id: str
    title: str
    subtitle: str
    x: float
    y: float
    w: float
    h: float
    fill: str
    stroke: str
    text: str = "#0f172a"

    @property
    def cx(self) -> float:
        return self.x + self.w / 2

    @property
    def cy(self) -> float:
        return self.y + self.h / 2


def hex_to_rgb(hex_color: str) -> tuple[float, float, float]:
    value = hex_color.lstrip("#")
    return tuple(int(value[i : i + 2], 16) / 255 for i in (0, 2, 4))


def escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def approx_text_width(text: str, size: float, bold: bool = False) -> float:
    factor = 0.57 if bold else 0.52
    return len(text) * size * factor


def wrap_text(text: str, width: float, size: float, bold: bool = False) -> list[str]:
    words = text.split()
    if not words:
        return []
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        candidate = current + " " + word
        if approx_text_width(candidate, size, bold=bold) <= width:
            current = candidate
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


class Page:
    def __init__(self, width: float = PAGE_W, height: float = PAGE_H):
        self.width = width
        self.height = height
        self.commands: list[str] = []

    def _py(self, y: float) -> float:
        return self.height - y

    def rect(self, x: float, y: float, w: float, h: float, fill=None, stroke=TEXT, line_width: float = 1) -> None:
        fill_part = f"{fill[0]:.3f} {fill[1]:.3f} {fill[2]:.3f} rg" if fill else ""
        stroke_part = f"{stroke[0]:.3f} {stroke[1]:.3f} {stroke[2]:.3f} RG" if stroke else ""
        op = "B" if fill and stroke else "f" if fill else "S"
        self.commands.append(
            f"q {line_width:.2f} w {stroke_part} {fill_part} {x:.2f} {self.height - y - h:.2f} {w:.2f} {h:.2f} re {op} Q"
        )

    def line(self, x1: float, y1: float, x2: float, y2: float, color=TEXT, width: float = 1) -> None:
        self.commands.append(
            f"q {width:.2f} w {color[0]:.3f} {color[1]:.3f} {color[2]:.3f} RG {x1:.2f} {self._py(y1):.2f} m {x2:.2f} {self._py(y2):.2f} l S Q"
        )

    def arrow(self, x1: float, y1: float, x2: float, y2: float, color=ACCENT_DARK, width: float = 1.1) -> None:
        self.line(x1, y1, x2, y2, color=color, width=width)
        dx = x2 - x1
        dy = y2 - y1
        length = (dx ** 2 + dy ** 2) ** 0.5 or 1
        ux = dx / length
        uy = dy / length
        size = 7
        left_x = x2 - ux * size - uy * 3.5
        left_y = y2 - uy * size + ux * 3.5
        right_x = x2 - ux * size + uy * 3.5
        right_y = y2 - uy * size - ux * 3.5
        self.line(left_x, left_y, x2, y2, color=color, width=width)
        self.line(right_x, right_y, x2, y2, color=color, width=width)

    def text(self, x: float, y: float, text: str, size: float = 12, font: str = "F1", color=TEXT, align: str = "left", box_width: float | None = None) -> None:
        content = escape_pdf_text(text)
        tx = x
        if align == "center" and box_width is not None:
            tx = x + max((box_width - approx_text_width(text, size, bold=(font == "F2"))) / 2, 0)
        py = self.height - y - size
        self.commands.append(
            f"BT /{font} {size:.2f} Tf {color[0]:.3f} {color[1]:.3f} {color[2]:.3f} rg 1 0 0 1 {tx:.2f} {py:.2f} Tm ({content}) Tj ET"
        )

    def paragraph(self, x: float, y: float, width: float, text: str, size: float = 11, font: str = "F1", color=TEXT, leading: float | None = None) -> float:
        current_y = y
        line_gap = leading or (size * 1.4)
        for para in text.split("\n"):
            lines = wrap_text(para, width, size, bold=(font == "F2")) if para.strip() else [""]
            for line in lines:
                if line:
                    self.text(x, current_y, line, size=size, font=font, color=color)
                current_y += line_gap
            current_y += size * 0.35
        return current_y

    def bullet_list(self, x: float, y: float, width: float, items: Iterable[str], size: float = 10.5, color=TEXT) -> float:
        current_y = y
        for item in items:
            self.text(x, current_y, "-", size=size, font="F2", color=color)
            current_y = self.paragraph(x + 12, current_y, width - 12, item, size=size, font="F1", color=color, leading=size * 1.35)
            current_y += 4
        return current_y

    def render(self) -> str:
        return "\n".join(self.commands)


class SimplePDF:
    def __init__(self):
        self.pages: list[str] = []

    def add_page(self, page: Page) -> None:
        self.pages.append(page.render())

    def save(self, path: Path) -> None:
        objects: list[bytes] = []

        def add_obj(data: bytes) -> int:
            objects.append(data)
            return len(objects)

        font_regular = add_obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
        font_bold = add_obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
        pages_id = add_obj(b"")
        content_ids = []
        for content in self.pages:
            stream = content.encode("utf-8")
            content_ids.append(add_obj(f"<< /Length {len(stream)} >>\nstream\n".encode("utf-8") + stream + b"\nendstream"))

        page_ids = []
        for content_id in content_ids:
            page_obj = (
                f"<< /Type /Page /Parent {pages_id} 0 R /MediaBox [0 0 {PAGE_W:.2f} {PAGE_H:.2f}] "
                f"/Resources << /Font << /F1 {font_regular} 0 R /F2 {font_bold} 0 R >> >> "
                f"/Contents {content_id} 0 R >>"
            ).encode("utf-8")
            page_ids.append(add_obj(page_obj))

        kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
        objects[pages_id - 1] = f"<< /Type /Pages /Count {len(page_ids)} /Kids [{kids}] >>".encode("utf-8")
        catalog_id = add_obj(f"<< /Type /Catalog /Pages {pages_id} 0 R >>".encode("utf-8"))

        output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = [0]
        for index, obj in enumerate(objects, start=1):
            offsets.append(len(output))
            output.extend(f"{index} 0 obj\n".encode("utf-8"))
            output.extend(obj)
            output.extend(b"\nendobj\n")

        xref_start = len(output)
        output.extend(f"xref\n0 {len(objects) + 1}\n".encode("utf-8"))
        output.extend(b"0000000000 65535 f \n")
        for offset in offsets[1:]:
            output.extend(f"{offset:010d} 00000 n \n".encode("utf-8"))
        output.extend(
            f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\nstartxref\n{xref_start}\n%%EOF".encode("utf-8")
        )
        path.write_bytes(output)


def draw_node_pdf(page: Page, node: Node) -> None:
    fill = hex_to_rgb(node.fill)
    stroke = hex_to_rgb(node.stroke)
    text_color = hex_to_rgb(node.text)
    page.rect(node.x, node.y, node.w, node.h, fill=fill, stroke=stroke, line_width=1.2)
    page.text(node.x + 10, node.y + 14, node.title, size=11.5, font="F2", color=text_color)
    subtitle_lines = wrap_text(node.subtitle, node.w - 20, 9.2)
    current_y = node.y + 34
    for line in subtitle_lines[:3]:
        page.text(node.x + 10, current_y, line, size=9.2, font="F1", color=text_color)
        current_y += 12


def build_page_one() -> Page:
    page = Page()
    page.rect(0, 0, PAGE_W, PAGE_H, fill=LIGHT, stroke=None)
    page.text(MARGIN, 36, TITLE, size=24, font="F2", color=ACCENT_DARK)
    page.text(MARGIN, 66, SUBTITLE, size=11.5, font="F1", color=MUTED)
    intro_y = page.paragraph(MARGIN, 95, PAGE_W - 2 * MARGIN, INTRO, size=11.5, font="F1", color=TEXT, leading=15)

    band_y = intro_y + 12
    page.rect(MARGIN, band_y, PAGE_W - 2 * MARGIN, 28, fill=ACCENT, stroke=ACCENT)
    page.text(MARGIN + 14, band_y + 8, "System view: orchestration, specialist agents, tools, and fallback paths", size=11, font="F2", color=(1, 1, 1))

    nodes = [Node(item["id"], item["title"], item["subtitle"], item["x"] * 0.62 - 5, band_y + 48 + (item["y"] - 70) * 0.70, item["w"] * 0.62, item["h"] * 0.78, item["fill"], item["stroke"], item.get("text", "#0f172a")) for item in DIAGRAM_NODES]
    node_map = {node.node_id: node for node in nodes}

    for start_id, end_id in DIAGRAM_EDGES:
        start = node_map[start_id]
        end = node_map[end_id]
        sx = start.cx
        sy = start.y + start.h
        ex = end.cx
        ey = end.y
        if end.y < start.y:
            sy = start.y
            ey = end.y + end.h
        elif abs(start.cy - end.cy) < 12:
            sy = start.cy
            ey = end.cy
            sx = start.x + start.w
            ex = end.x
        page.arrow(sx, sy, ex, ey, color=ACCENT_DARK, width=1.0)

    for node in nodes:
        draw_node_pdf(page, node)

    footer_y = band_y + 560
    page.rect(MARGIN, footer_y, PAGE_W - 2 * MARGIN, 74, fill=(1, 1, 1), stroke=BORDER, line_width=1)
    page.text(MARGIN + 14, footer_y + 12, "What this diagram shows", size=11.5, font="F2", color=ACCENT_DARK)
    page.paragraph(
        MARGIN + 14,
        footer_y + 32,
        PAGE_W - 2 * MARGIN - 28,
        "The frontend orchestrator is the single user-facing hub. Each backend capability acts like a specialist agent. External providers such as OpenAI or Groq are optional tools rather than mandatory dependencies.",
        size=10.5,
        font="F1",
        color=TEXT,
        leading=13,
    )
    page.text(PAGE_W - 70, PAGE_H - 36, "1", size=10, font="F2", color=MUTED)
    return page


def section_box(page: Page, x: float, y: float, w: float, h: float, title: str, points: list[str], accent_color: tuple[float, float, float]) -> None:
    page.rect(x, y, w, h, fill=(1, 1, 1), stroke=BORDER, line_width=1)
    page.rect(x, y, w, 30, fill=accent_color, stroke=accent_color, line_width=1)
    page.text(x + 12, y + 9, title, size=11.5, font="F2", color=(1, 1, 1))
    page.bullet_list(x + 12, y + 44, w - 24, points, size=10.1, color=TEXT)


def build_page_two() -> Page:
    page = Page()
    page.rect(0, 0, PAGE_W, PAGE_H, fill=LIGHT, stroke=None)
    page.text(MARGIN, 36, "Role, Tool, and Failure Notes", size=22, font="F2", color=ACCENT_DARK)
    page.text(MARGIN, 64, "Condensed handoff summary for implementation, review, or presentation use", size=11.5, font="F1", color=MUTED)

    half = (PAGE_W - 2 * MARGIN - 16) / 2
    section_box(page, MARGIN, 96, half, 300, "Agent roles", ROLE_POINTS, ACCENT)
    section_box(page, MARGIN + half + 16, 96, half, 240, "Communication", COMMUNICATION_POINTS, SKY)
    section_box(page, MARGIN + half + 16, 352, half, 196, "Tool integrations", TOOL_POINTS, GREEN)
    section_box(page, MARGIN, 412, half, 246, "Error handling", ERROR_POINTS, RED)

    page.rect(MARGIN, 690, PAGE_W - 2 * MARGIN, 90, fill=(1, 1, 1), stroke=BORDER, line_width=1)
    page.text(MARGIN + 14, 704, "Design summary", size=11.5, font="F2", color=ACCENT_DARK)
    page.paragraph(
        MARGIN + 14,
        726,
        PAGE_W - 2 * MARGIN - 28,
        "GenAi is intentionally built around graceful degradation. If a premium tool fails, the app still answers through built-in rules, local retrieval, and explicit safety messaging. That keeps the user experience stable while allowing the architecture to grow into a more capable agent platform over time.",
        size=10.6,
        font="F1",
        color=TEXT,
        leading=13,
    )
    page.text(PAGE_W - 70, PAGE_H - 36, "2", size=10, font="F2", color=MUTED)
    return page


def escape_xml(text: str) -> str:
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def svg_text(x: float, y: float, lines: list[str], color: str, weight: int = 400, size: int = 18, center: bool = False) -> str:
    anchor = "middle" if center else "start"
    parts = [f'<text x="{x}" y="{y}" fill="{color}" font-family="Segoe UI, Arial, sans-serif" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">']
    for index, line in enumerate(lines):
        dy = 0 if index == 0 else 22
        parts.append(f'<tspan x="{x}" dy="{dy}">{escape_xml(line)}</tspan>')
    parts.append('</text>')
    return ''.join(parts)


def build_svg() -> str:
    width = 1400
    height = 920
    nodes = [Node(item["id"], item["title"], item["subtitle"], item["x"], item["y"], item["w"], item["h"], item["fill"], item["stroke"], item.get("text", "#0f172a")) for item in DIAGRAM_NODES]
    node_map = {node.node_id: node for node in nodes}
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a" /></marker></defs>',
        '<rect width="1400" height="920" fill="#f8fafc"/>',
        '<rect x="42" y="34" width="1316" height="76" rx="18" fill="#0f172a"/>',
        svg_text(78, 68, [TITLE], '#f8fafc', weight=700, size=32),
        svg_text(78, 100, [SUBTITLE], '#cbd5e1', weight=400, size=16),
        '<rect x="42" y="132" width="1316" height="74" rx="18" fill="#eff6ff" stroke="#bfdbfe"/>',
        svg_text(68, 160, [INTRO[:112], INTRO[112:]], '#0f172a', weight=400, size=17),
    ]
    for start_id, end_id in DIAGRAM_EDGES:
        start = node_map[start_id]
        end = node_map[end_id]
        x1 = start.cx
        y1 = start.y + start.h
        x2 = end.cx
        y2 = end.y
        if end.y < start.y:
            y1 = start.y
            y2 = end.y + end.h
        elif abs(start.cy - end.cy) < 16:
            x1 = start.x + start.w
            y1 = start.cy
            x2 = end.x
            y2 = end.cy
        parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#0f172a" stroke-width="2.2" marker-end="url(#arrow)"/>')
    for node in nodes:
        parts.append(f'<rect x="{node.x}" y="{node.y}" width="{node.w}" height="{node.h}" rx="18" fill="{node.fill}" stroke="{node.stroke}" stroke-width="2.4"/>')
        title_x = node.x + 16 if node.node_id != 'user' else node.cx
        subtitle_x = node.x + 16 if node.node_id != 'user' else node.cx
        center = node.node_id == 'user'
        parts.append(svg_text(title_x, node.y + 28, [node.title], node.text, weight=700, size=18, center=center))
        subtitle_lines = wrap_text(node.subtitle, node.w - 28, 11)
        parts.append(svg_text(subtitle_x, node.y + 52, subtitle_lines[:3], node.text, weight=400, size=13, center=center))
    parts.append('<rect x="42" y="786" width="1316" height="96" rx="18" fill="#ffffff" stroke="#cbd5e1"/>')
    parts.append(svg_text(66, 820, ["Design note"], '#0f172a', weight=700, size=20))
    parts.append(svg_text(66, 850, ["The frontend is the orchestration hub, backend services behave like specialist agents,", "and every critical path has a safe fallback so the user still gets a structured answer."], '#334155', weight=400, size=16))
    parts.append('</svg>')
    return ''.join(parts)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    pdf = SimplePDF()
    pdf.add_page(build_page_one())
    pdf.add_page(build_page_two())
    pdf.save(OUT_PDF)
    OUT_SVG.write_text(build_svg(), encoding='utf-8')
    print(f'Wrote {OUT_PDF}')
    print(f'Wrote {OUT_SVG}')


if __name__ == '__main__':
    main()
