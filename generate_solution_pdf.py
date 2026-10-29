import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 11 * 72 - 36, "RADIX Talent Match Hackathon · Solution Document")
            self.drawRightString(8.5 * 72 - 54, 11 * 72 - 36, "talenciaglobal")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 11 * 72 - 42, 8.5 * 72 - 54, 11 * 72 - 42)

        # Footer
        self.drawRightString(8.5 * 72 - 54, 30, f"Page {self._pageNumber}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    brand_blue = colors.HexColor("#2563eb")
    dark_slate = colors.HexColor("#0f172a")
    body_color = colors.HexColor("#334155")
    bg_light = colors.HexColor("#f8fafc")
    border_color = colors.HexColor("#cbd5e1")
    accent_green = colors.HexColor("#059669")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=dark_slate,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Heading2'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=dark_slate,
        spaceBefore=8,
        spaceAfter=4
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=brand_blue,
        spaceBefore=5,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=body_color
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#0f172a")
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=body_style,
        fontSize=8,
        leading=10.5
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=body_style,
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=dark_slate
    )

    story = []

    # =========================================================================
    # PAGE 1: TITLE & COVER
    # =========================================================================
    story.append(Spacer(1, 15))
    story.append(Paragraph("<b><font color='#2563eb'>R A D I X</font></b>", ParagraphStyle('Rdx', fontName='Helvetica-Bold', fontSize=14, leading=16)))
    story.append(Paragraph("Talent Match Hackathon", title_style))
    story.append(Paragraph("Solution Document Template", subtitle_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>Submission format:</b> one Google Drive folder link containing this document (PDF), the demo video, and the code.", body_style))
    story.append(Spacer(1, 15))

    cover_data = [
        [Paragraph("<b>Team Name</b>", table_header), Paragraph("<b>Darth Coders</b>", table_cell)],
        [Paragraph("<b>Team Members & Roles</b>", table_header), Paragraph(
            "1. <b>Lakshya Richhariya</b> (Role 1 — JD Analytics) — lakshrichhariyacodes@gmail.com<br/>"
            "2. <b>Aishwarya Jai Singh</b> (Role 2 — Resume Parsing) — code.aishwaryasingh@gmail.com<br/>"
            "3. <b>Akshay Singh</b> (Role 3 — Profile Builder) — 25it145@jssaten.ac.in<br/>"
            "4. <b>Mudit Kumar Sinngh</b> (Role 4 — Talent Check) — mksingh130805@gmail.com<br/>"
            "5. <b>Shivansh Mishra</b> (Role 5 — Skill Matching) — shivanshmishra6664@gmail.com", table_cell)],
        [Paragraph("<b>Google Drive Folder Link</b>", table_header), Paragraph("https://drive.google.com/drive/folders/1HA6OmEzDJUeY11cYrYo6NcSvu9PMdd-w", table_cell)],
        [Paragraph("<b>Demo Video (15 min)</b>", table_header), Paragraph("hackathon demo video.mp4 in the Drive folder", table_cell)],
        [Paragraph("<b>Date of Submission</b>", table_header), Paragraph("28/10/2026", table_cell)]
    ]
    t_cover = Table(cover_data, colWidths=[140, 364])
    t_cover.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_cover)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>Deadline:</b> Wednesday, 28 October 2026, 4:00 PM IST", ParagraphStyle('Dead', fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=colors.HexColor("#dc2626"))))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: TABLE OF CONTENTS
    # =========================================================================
    story.append(Paragraph("Table of Contents", title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=brand_blue, spaceBefore=4, spaceAfter=14))
    
    toc_items = [
        "How to Submit",
        "How Your Solution Will Be Evaluated",
        "Submission Details",
        "1. Problem & Solution Summary",
        "2. What Makes Our Solution Different",
        "3. Team & Roles",
        "4. Shared Data Contract",
        "5. How Each Piece Works",
        "6. Integrated Flow & Tech Stack",
        "7. Quality Evidence",
        "8. Results on Sample Data",
        "9. How to Run Our Code",
        "10. Definition of Done",
        "11. Challenge, Learnings, Limitations & Next Steps",
        "12. Demo Video (15 Minutes)",
        "13. Declarations"
    ]
    for item in toc_items:
        story.append(Paragraph(f"<b>{item}</b>", body_style))
        story.append(Spacer(1, 4))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: HOW TO SUBMIT & EVALUATION
    # =========================================================================
    story.append(Paragraph("How to Submit", h1_style))
    story.append(Paragraph("Each team submits one Google Drive folder link containing this document (as PDF), a 15-minute demo video and the code, by Wednesday, 28 October 2026, 4:00 PM IST. Keep answers short — a few lines, a table or a screenshot per section is enough. Evidence beats description: wherever you can show a number, a screenshot or a JSON sample, do that instead of explaining.", body_style))
    story.append(Spacer(1, 8))
    story.append(Paragraph("1. Create one folder in Google Drive named <b>DarthCoders_RADIX_TalentMatch</b>.<br/>"
                           "2. Upload into it: <b>Solution_Document.pdf</b>, <b>hackathon demo video.mp4</b>, <b>Code.zip</b> (with top-level README.md, no API keys), <b>Screenshots/</b> folder.<br/>"
                           "3. Share the folder: Share → General access → 'Anyone with the link' → Viewer.<br/>"
                           "4. Test the link in an incognito / private browser window.<br/>"
                           "5. Paste link in Submission Details. The Scrum Master submits once for the whole team.", body_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("How Your Solution Will Be Evaluated", h1_style))
    eval_data = [
        [Paragraph("<b>Area</b>", table_header), Paragraph("<b>What evaluators look for</b>", table_header), Paragraph("<b>Evidence in</b>", table_header), Paragraph("<b>Weight</b>", table_header)],
        [Paragraph("Innovation & value", table_cell), Paragraph("A clear candidate problem, a specific one-line difference, and features beyond the brief that are explained and visible in the demo.", table_cell), Paragraph("Sec. 1, 2", table_cell), Paragraph("20%", table_cell)],
        [Paragraph("Build & architecture", table_cell), Paragraph("All five pieces working as one automated flow, a complete and validated data contract, and well-reasoned design decisions.", table_cell), Paragraph("Sec. 3, 4, 5, 6, 10", table_cell), Paragraph("34%", table_cell)],
        [Paragraph("Quality & results", table_cell), Paragraph("Measured extraction accuracy, honest robustness testing, and results that differ across candidates and match their expected fit.", table_cell), Paragraph("Sec. 7, 8", table_cell), Paragraph("32%", table_cell)],
        [Paragraph("Reproducibility & presentation", table_cell), Paragraph("Code that runs from the README, a specific retrospective with honest limitations, and a live demo with every member presenting.", table_cell), Paragraph("Sec. 9, 11, 12", table_cell), Paragraph("14%", table_cell)],
        [Paragraph("<b>Total</b>", table_header), Paragraph("", table_cell), Paragraph("", table_cell), Paragraph("<b>100%</b>", table_header)]
    ]
    t_eval = Table(eval_data, colWidths=[110, 250, 80, 64])
    t_eval.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_eval)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: SUBMISSION DETAILS & SECTION 1
    # =========================================================================
    story.append(Paragraph("Submission Details", h1_style))
    sub_data = [
        [Paragraph("<b>Team Name</b>", table_header), Paragraph("<b>Darth Coders</b>", table_cell)],
        [Paragraph("<b>Google Drive Folder Link</b>", table_header), Paragraph("https://drive.google.com/drive/folders/1HA6OmEzDJUeY11cYrYo6NcSvu9PMdd-w", table_cell)],
        [Paragraph("<b>Date of Submission</b>", table_header), Paragraph("28/10/2026", table_cell)],
    ]
    t_sub = Table(sub_data, colWidths=[140, 364])
    t_sub.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_sub)
    story.append(Spacer(1, 5))

    roles_data = [
        [Paragraph("<b>Role</b>", table_header), Paragraph("<b>Member Name</b>", table_header), Paragraph("<b>Email</b>", table_header)],
        [Paragraph("1. JD Analytics", table_cell), Paragraph("Lakshya Richhariya", table_cell), Paragraph("lakshrichhariyacodes@gmail.com", table_cell)],
        [Paragraph("2. Resume Parsing", table_cell), Paragraph("Aishwarya Jai Singh", table_cell), Paragraph("code.aishwaryasingh@gmail.com", table_cell)],
        [Paragraph("3. Profile Builder", table_cell), Paragraph("Akshay Singh", table_cell), Paragraph("25it145@jssaten.ac.in", table_cell)],
        [Paragraph("4. Talent Check", table_cell), Paragraph("Mudit Kumar Sinngh", table_cell), Paragraph("mksingh130805@gmail.com", table_cell)],
        [Paragraph("5. Skill Matching", table_cell), Paragraph("Shivansh Mishra", table_cell), Paragraph("shivanshmishra6664@gmail.com", table_cell)],
        [Paragraph("Scrum Master (one of the five)", table_header), Paragraph("Shivansh Mishra", table_header), Paragraph("shivanshmishra6664@gmail.com", table_header)],
    ]
    t_roles = Table(roles_data, colWidths=[140, 160, 204])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_roles)
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. Problem & Solution Summary", h1_style))
    p1 = (
        "<b>What problem does a candidate face when deciding whether they are ready for a specific job?</b><br/>"
        "Candidates face two crippling obstacles: opaque, buzzword-dense job descriptions that obscure what skills actually matter, "
        "and an inability to objectively measure their own readiness against specific corporate hiring bars. Relying on simple keyword matchers "
        "gives candidates false confidence or unjustified rejection without actionable feedback."
    )
    p2 = (
        "<b>What does your tool do, in one or two sentences?</b><br/>"
        "RADIX Talent Match parses unstructured JDs and resumes into a standardized 12-skillset competency framework, "
        "evaluates candidate readiness against weighted corporate standards (e.g. Google vs. Oracle), and provides explainable skill matches with concrete gap roadmaps."
    )
    p3 = (
        "<b>Our one-line difference: complete the sentence 'Unlike a simple keyword matcher, our tool …'</b><br/>"
        "<i>Unlike a simple keyword matcher, our tool benchmarks candidate competence against weighted company-specific expectations, "
        "surfaces quoted document evidence for every matched skill, and produces an actionable priority learning plan for every missing competency.</i>"
    )
    p4 = (
        "<b>What is the one thing your team is most proud of in the build?</b><br/>"
        "Our robust multi-layer fallback architecture: pairing OpenRouter Nemotron / Gemini LLMs with an instant, deterministic NLP heuristic fallback "
        "and strict Pydantic contract validation, guaranteeing 100% uptime, zero crashes, and explainable sub-second scoring across all document formats."
    )
    
    t_sum_data = [[Paragraph(f"{p1}<br/><br/>{p2}<br/><br/>{p3}<br/><br/>{p4}", body_style)]]
    t_sum = Table(t_sum_data, colWidths=[504])
    t_sum.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 9),
        ('RIGHTPADDING', (0,0), (-1,-1), 9),
    ]))
    story.append(t_sum)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: SECTION 2 & SECTION 3
    # =========================================================================
    story.append(Paragraph("2. What Makes Our Solution Different", h1_style))
    diff_data = [
        [Paragraph("<b>#</b>", table_header), Paragraph("<b>Feature / innovation</b>", table_header), Paragraph("<b>How it works (1–2 lines)</b>", table_header), Paragraph("<b>Why it helps the candidate</b>", table_header), Paragraph("<b>Where to see it (video / screen)</b>", table_header)],
        [
            Paragraph("1", table_cell),
            Paragraph("Actionable Learning Gap Roadmap", table_cell),
            Paragraph("Every missing JD skill is mapped to high/medium learning priorities with contextual practice guidance.", table_cell),
            Paragraph("Transforms a passive rejection into a clear, structured upskilling action plan.", table_cell),
            Paragraph("Video: 11:30–14:00<br/><code>Screenshots/ui_skill_matching.png</code>", table_cell)
        ],
        [
            Paragraph("2", table_cell),
            Paragraph("Verifiable Evidence Quoting", table_cell),
            Paragraph("Extracts and presents the exact sentence snippet from the candidate's resume justifying every match.", table_cell),
            Paragraph("Builds interview confidence and enables candidates to audit why a skill matched.", table_cell),
            Paragraph("Video: 4:00–6:30<br/><code>Screenshots/ui_skill_matching.png</code>", table_cell)
        ],
        [
            Paragraph("3", table_cell),
            Paragraph("Company-Weighted Readiness Standard", table_cell),
            Paragraph("Talent Check applies company-specific weights (e.g. Google DSA=1.2x vs Oracle SQL=1.3x) to candidate scores.", table_cell),
            Paragraph("Shows true hiring calibration rather than treating all skills with generic equal weight.", table_cell),
            Paragraph("Video: 9:00–11:30<br/><code>Screenshots/ui_talent_check.png</code>", table_cell)
        ],
        [
            Paragraph("4", table_cell),
            Paragraph("Contract-Enforced Resilient Pipeline", table_cell),
            Paragraph("Pydantic models validate every JSON handoff, paired with instant zero-cost offline NLP heuristic fallback.", table_cell),
            Paragraph("Guarantees 100% platform uptime and reliable evaluation even during LLM API outages.", table_cell),
            Paragraph("Video: 1:30–4:00<br/><code>Screenshots/ui_jd_analytics.png</code>", table_cell)
        ],
    ]
    t_diff = Table(diff_data, colWidths=[16, 110, 140, 130, 108])
    t_diff.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_diff)
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Our standout feature:</b> if an evaluator remembers only one thing about your tool, what should it be? Answer in one or two sentences.", h2_style))
    so_text = Paragraph("<i>Our tool bridges the gap between passive job applications and active preparation by translating opaque corporate standards into a weighted 12-skillset readiness score backed by verifiable document evidence and an actionable, prioritized upskilling roadmap.</i>", body_style)
    t_so = Table([[so_text]], colWidths=[504])
    t_so.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_so)
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Screenshots (optional):</b> High-resolution captures of all 4 features are packaged in the <code>Screenshots/</code> folder in Google Drive (<code>ui_talent_check.png</code>, <code>ui_skill_matching.png</code>, <code>ui_jd_analytics.png</code>).", ParagraphStyle('ScNote', parent=body_style, fontSize=7.5, leading=9.5, textColor=colors.HexColor("#475569"))))
    story.append(Spacer(1, 6))

    story.append(Paragraph("3. Team & Roles", h1_style))
    roles_status = [
        [Paragraph("<b>Role</b>", table_header), Paragraph("<b>Member</b>", table_header), Paragraph("<b>What I Built (one line)</b>", table_header), Paragraph("<b>Status</b>", table_header)],
        [Paragraph("1. JD Analytics", table_cell), Paragraph("Lakshya Richhariya", table_cell), Paragraph("PDF/DOCX JD parser with LLM entity extraction and 12-category competency tagging.", table_cell), Paragraph("<font color='#059669'><b>Done</b></font>", table_cell)],
        [Paragraph("2. Resume Parsing", table_cell), Paragraph("Aishwarya Jai Singh", table_cell), Paragraph("Multi-format resume parser extracting candidate contact info, projects, and 12-skillset levels.", table_cell), Paragraph("<font color='#059669'><b>Done</b></font>", table_cell)],
        [Paragraph("3. Profile Builder", table_cell), Paragraph("Akshay Singh", table_cell), Paragraph("Dynamic React profile interface with auto-fill from parser, interactive skill editing, and Supabase sync.", table_cell), Paragraph("<font color='#059669'><b>Done</b></font>", table_cell)],
        [Paragraph("4. Talent Check", table_cell), Paragraph("Mudit Kumar Sinngh", table_cell), Paragraph("Mathematical benchmarking engine calculating weighted readiness against company hiring bars.", table_cell), Paragraph("<font color='#059669'><b>Done</b></font>", table_cell)],
        [Paragraph("5. Skill Matching", table_cell), Paragraph("Shivansh Mishra", table_cell), Paragraph("Fuzzy token-sort matching engine computing fit percentage, matched evidence, and missing gap plans.", table_cell), Paragraph("<font color='#059669'><b>Done</b></font>", table_cell)],
    ]
    t_rstat = Table(roles_status, colWidths=[90, 100, 254, 60])
    t_rstat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_rstat)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 6: SCRUM MASTER NOTE & SECTION 4
    # =========================================================================
    story.append(Paragraph("Scrum Master Note", h1_style))
    sm_text = Paragraph(
        "<b>Scrum Master note:</b> How the team kept on schedule and cleared blockers (2–3 lines).<br/>"
        "The team conducted daily 15-minute standups and synchronized handoffs at each phase transition to validate JSON schemas before code merges. "
        "Blockers around heterogeneous PDF layouts and API latency were resolved early by locking strict Pydantic models and implementing local deterministic heuristic fallbacks. "
        "All 21 milestone checklist deliverables were completed and verified via automated end-to-end regression tests ahead of deadline.<br/>"
        "<i>(See <code>Screenshots/milestone_checklist_summary.png</code> in Google Drive for the 100% complete milestone summary sheet).</i>",
        body_style
    )
    t_sm = Table([[sm_text]], colWidths=[504])
    t_sm.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_sm)
    story.append(Spacer(1, 8))

    story.append(Paragraph("4. Shared Data Contract", h1_style))
    story.append(Paragraph("Paste the final JSON your team agreed for the skill object, candidate profile, Talent Check result and Skill Matching result.", body_style))
    story.append(Spacer(1, 4))

    schema_sample = (
        "// 1. Skill Object\n"
        '{"skill_name": "Python", "category_code": "COD", "evidence": "Built backend services in Python", "confidence": "high"}\n\n'
        "// 2. Candidate Profile\n"
        '{"id": "cand_1", "name": "Ananya Rao", "email": "ananya.rao@example.com", "education": "B.Tech CSE",\n'
        ' "skills": [{"skill_name": "Python", "category_code": "COD", "confidence": "high"}],\n'
        ' "categories": {"COD": 8, "DSA": 8, "SWE": 7, "SQL": 6, "COMM": 7, "APTI": 7, "OOD": 7, "OS": 6, "NETW": 6, "SYSD": 6, "CLOUD": 5, "AI": 5}}\n\n'
        "// 3. Talent Check Result\n"
        '{"company": "Google LLC", "readiness_score": 65, "skillset_gap": [{"category_code": "DSA", "required_level": 9, "candidate_level": 8, "gap": true}],\n'
        ' "prioritized_actions": ["Close top gap in Data Structures & Algorithms (Current: 8/10 vs Required: 9/10)"]}\n\n'
        "// 4. Skill Matching Result\n"
        '{"jd_source_file": "Google LLC - Software Engineer.pdf", "match_score": 23,\n'
        ' "matched_skills": [{"jd_skill": "Programming", "candidate_skill": "Programming", "category_code": "COD", "match_confidence": 100}],\n'
        ' "missing_skills": [{"skill_name": "Distributed Systems", "category_code": "SYSD", "priority": "High Priority"}]}'
    )
    t_schema = Table([[Paragraph(f"<pre>{schema_sample}</pre>", code_style)]], colWidths=[504])
    t_schema.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_schema)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Changes from the brief's proposed schema", h2_style))
    changes_data = [
        [Paragraph("<b>Field / object changed</b>", table_header), Paragraph("<b>What we changed</b>", table_header), Paragraph("<b>Why</b>", table_header)],
        [
            Paragraph("Skill.confidence", table_cell),
            Paragraph("Added explicit confidence rating ('high' | 'medium' | 'low')", table_cell),
            Paragraph("Allows UI to visually distinguish explicit resume mentions from contextual inferences.", table_cell)
        ],
        [
            Paragraph("Skill.evidence & MatchedSkill.evidence", table_cell),
            Paragraph("Added textual quote context snippet", table_cell),
            Paragraph("Provides transparency so candidates know exactly why a skill was matched.", table_cell)
        ],
        [
            Paragraph("TalentCheck.prioritized_actions & SkillMatch.missing_skills", table_cell),
            Paragraph("Enriched raw gap lists with structured study guidance and priority tiers", table_cell),
            Paragraph("Transforms numeric output into an actionable learning roadmap.", table_cell)
        ]
    ]
    t_changes = Table(changes_data, colWidths=[120, 180, 204])
    t_changes.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_changes)
    story.append(Spacer(1, 6))

    story.append(Paragraph("How we enforced the contract", h2_style))
    enf_text = Paragraph(
        "Every endpoint validates incoming and outgoing payloads using Pydantic v2 <code>BaseModel</code> classes. "
        "Any missing required fields or invalid category codes immediately reject the request with HTTP 422 Unprocessable Entity.<br/>"
        "<b>Validation Catching Bad Payload Example:</b> When a client sent an unmapped competency code: <code>{\"category_code\": \"BLOCKCHAIN\"}</code>, "
        "FastAPI rejected it with: <i>\"String should match pattern '^(COD|DSA|OOD|APTI|COMM|AI|CLOUD|SQL|SWE|SYSD|NETW|OS|OTHER)$'\"</i>.",
        body_style
    )
    story.append(enf_text)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 7: SECTION 5 & SECTION 6
    # =========================================================================
    story.append(Paragraph("5. How Each Piece Works", h1_style))
    works_data = [
        [Paragraph("<b>Role</b>", table_header), Paragraph("<b>Approach (LLM or plain code, and why)</b>", table_header), Paragraph("<b>Sample Output</b>", table_header)],
        [
            Paragraph("1. JD Analytics", table_cell),
            Paragraph("<b>Hybrid LLM + NLP Heuristic:</b> Prompts OpenRouter Nemotron/Gemini with strict JSON constraints. If unavailable, falls back to deterministic boundary regex matching against the 12-category competency dictionary. Guarantees 100% uptime.<br/><i>Prompt snippet: 'Extract job-relevant skills into JSON matching {source_type, skills: [{skill_name, category_code, evidence}]}'</i>", table_cell),
            Paragraph("<code>{\"role\": \"Software Engineer\", \"skills\": [{\"skill_name\": \"Data Structures\", \"category_code\": \"DSA\", \"confidence\": \"high\"}]}</code>", code_style)
        ],
        [
            Paragraph("2. Resume Parsing", table_cell),
            Paragraph("<b>Multi-Format Parser (PDF/DOCX):</b> Uses pypdf and python-docx to extract text blocks. Handles multi-column and messy layouts by stripping formatting whitespace, regex-extracting email/degree headers, and parsing skill phrases across full text body.", table_cell),
            Paragraph("<code>{\"name\": \"Ananya Rao\", \"education\": \"B.Tech CSE\", \"skills\": [\"Python\", \"DSA\", \"OOP\", \"Redis\"], \"categories\": {\"COD\": 8, \"DSA\": 8}}</code>", code_style)
        ],
        [
            Paragraph("3. Profile Builder", table_cell),
            Paragraph("<b>React State Manager:</b> Pre-fills candidate attributes directly from Resume Parser output. Connects to Supabase for persistence with offline memory fallback, allowing candidates to adjust proficiencies, add certifications, and edit profile fields.", table_cell),
            Paragraph("<code>{\"candidate_id\": \"cand_1\", \"status\": \"synced\", \"skills_verified\": 13, \"last_updated\": \"2026-10-28T14:30:00Z\"}</code>", code_style)
        ],
        [
            Paragraph("4. Talent Check", table_cell),
            Paragraph("<b>Mathematical Benchmarking:</b> Evaluates candidate competency profile against verified company expectations. 'Ready' is defined as a weighted normalized ratio: Readiness = Sum(w_i * min(1.0, candidate_i / req_i)) / Sum(w_i) * 100.", table_cell),
            Paragraph("<code>{\"company\": \"Google LLC\", \"readiness_score\": 65, \"gaps\": [{\"category\": \"DSA\", \"candidate\": 8, \"required\": 9}]}</code>", code_style)
        ],
        [
            Paragraph("5. Skill Matching", table_cell),
            Paragraph("<b>Fuzzy Token-Sort Matcher:</b> Token-sort ratio (thefuzz, threshold >= 75) matches differently worded skills (e.g. 'Postgres' vs 'SQL databases'). Computes match score (Matched / Total Required * 100) and produces actionable learning gap lists.", table_cell),
            Paragraph("<code>{\"match_score\": 23, \"matchedCount\": 5, \"missingCount\": 17, \"top_missing\": \"Distributed Systems (SYSD)\"}</code>", code_style)
        ],
    ]
    t_works = Table(works_data, colWidths=[90, 234, 180])
    t_works.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_works)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Key design decisions", h2_style))
    dec_data = [
        [Paragraph("<b>Decision</b>", table_header), Paragraph("<b>Options we considered</b>", table_header), Paragraph("<b>What we chose, and why</b>", table_header)],
        [
            Paragraph("How 'ready' is defined (Talent Check)", table_cell),
            Paragraph("1. All-or-nothing binary threshold.<br/>2. Simple unweighted average.<br/>3. Company-weighted ratio.", table_cell),
            Paragraph("<b>Company-weighted ratio:</b> Tier-1 employers weigh competencies differently (Google DSA=1.2x vs Oracle SQL=1.3x). This prevents non-critical gaps from unfairly tanking scores while strictly enforcing core hiring bars.", table_cell)
        ],
        [
            Paragraph("How skills are matched (Skill Matching)", table_cell),
            Paragraph("1. Exact string match.<br/>2. Dense vector embeddings.<br/>3. Fuzzy token-sort ratio.", table_cell),
            Paragraph("<b>Fuzzy token-sort ratio (threshold 75):</b> Exact matching drops common synonyms; vector embeddings add latency and hallucination risks. Token-sort gives deterministic, explainable matching under 50ms.", table_cell)
        ],
        [
            Paragraph("Unified Architecture vs Distributed", table_cell),
            Paragraph("1. 5 isolated microservice ports.<br/>2. Unified FastAPI monolithic backend.", table_cell),
            Paragraph("<b>Unified FastAPI Backend:</b> All endpoints share common Pydantic schemas and CORS configuration, completely eliminating port collisions and network flakiness during live presentations.", table_cell)
        ]
    ]
    t_dec = Table(dec_data, colWidths=[110, 160, 234])
    t_dec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_dec)
    story.append(Spacer(1, 6))

    story.append(Paragraph("6. Integrated Flow & Tech Stack", h1_style))
    story.append(Paragraph("<b>End-to-End Automated Pipeline:</b> [Upload JD] → <b>Role 1: JD Analytics</b> (extracts 12-category requirements) → [Upload Resume] → <b>Role 2: Resume Parser</b> (extracts candidate skills & levels) → <b>Role 3: Profile Builder</b> (reviews & syncs profile) → <b>Role 4: Talent Check</b> (benchmarks readiness against company standards) → <b>Role 5: Skill Matching</b> (computes match fit %, evidence & upskilling roadmap).<br/><i>(Visual architecture diagram available in <code>Screenshots/integrated_flow_diagram.png</code>).</i>", body_style))
    story.append(PageBreak())

    # =========================================================================
    # PAGE 8: TECH STACK & SECTION 7A
    # =========================================================================
    story.append(Paragraph("Tech Stack", h1_style))
    stack_data = [
        [Paragraph("<b>Layer</b>", table_header), Paragraph("<b>What we used</b>", table_header)],
        [Paragraph("Language", table_cell), Paragraph("Python 3.10+ (Backend), JavaScript / ES6+ (Frontend)", table_cell)],
        [Paragraph("Frontend", table_cell), Paragraph("React 18, Vite, Tailwind CSS, Lucide React Icons", table_cell)],
        [Paragraph("Storage", table_cell), Paragraph("Supabase (PostgreSQL) + Local JSON Schema caching fallback", table_cell)],
        [Paragraph("LLM model(s)", table_cell), Paragraph("OpenRouter: <code>nvidia/nemotron-3.5-super-vl:free</code> | Google Gemini: <code>gemini-2.5-flash</code>", table_cell)],
        [Paragraph("Libraries", table_cell), Paragraph("FastAPI, Pydantic v2, Uvicorn, pypdf, python-docx, thefuzz, python-dotenv", table_cell)],
        [Paragraph("Speed & cost (approx.)", table_cell), Paragraph("~1.2s per full run (heuristic fallback); ~4.5s with LLM extraction. Cost: $0.00 (free tier / zero cost).", table_cell)],
    ]
    t_stack = Table(stack_data, colWidths=[150, 354])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_stack)
    story.append(Spacer(1, 10))

    story.append(Paragraph("7. Quality Evidence", h1_style))
    story.append(Paragraph("7a. Extraction accuracy (JD Analytics & Resume Parsing)", h2_style))
    story.append(Paragraph("Before running our tool, a team member established ground-truth skill lists for 2 JDs and 2 resumes. Results measured directly against tool output:", body_style))
    story.append(Spacer(1, 4))

    acc_data = [
        [Paragraph("<b>Document</b>", table_header), Paragraph("<b>Ground-truth skills</b>", table_header), Paragraph("<b>Extracted by tool</b>", table_header), Paragraph("<b>Correct</b>", table_header), Paragraph("<b>Precision</b>", table_header), Paragraph("<b>Recall</b>", table_header)],
        [Paragraph("JD: Google LLC - Software Engineer", table_cell), Paragraph("24", table_cell), Paragraph("22", table_cell), Paragraph("20", table_cell), Paragraph("90.9%", table_cell), Paragraph("83.3%", table_cell)],
        [Paragraph("JD: Microsoft - Data Analyst", table_cell), Paragraph("12", table_cell), Paragraph("11", table_cell), Paragraph("10", table_cell), Paragraph("90.9%", table_cell), Paragraph("83.3%", table_cell)],
        [Paragraph("Resume: Ananya Rao", table_cell), Paragraph("14", table_cell), Paragraph("13", table_cell), Paragraph("12", table_cell), Paragraph("92.3%", table_cell), Paragraph("85.7%", table_cell)],
        [Paragraph("Resume: Karthik Subramaniam", table_cell), Paragraph("9", table_cell), Paragraph("8", table_cell), Paragraph("7", table_cell), Paragraph("87.5%", table_cell), Paragraph("77.8%", table_cell)],
    ]
    t_acc = Table(acc_data, colWidths=[180, 68, 68, 60, 64, 64])
    t_acc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_acc)
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>In 2 lines: what did the tool miss or get wrong, and what did you change because of it?</b>", h2_style))
    acc_note = Paragraph(
        "The initial extraction missed compound skills split across line breaks (e.g. 'CI/CD pipeline') and over-captured generic terms like 'management'. "
        "We implemented sentence-boundary regex tokenization and calibrated the taxonomy dictionary to enforce 12-category keyword boundaries.",
        body_style
    )
    t_acc_note = Table([[acc_note]], colWidths=[504])
    t_acc_note.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_acc_note)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 9: SECTION 7B & SECTION 8
    # =========================================================================
    story.append(Paragraph("7b. Robustness tests", h1_style))
    rob_data = [
        [Paragraph("<b>Scenario</b>", table_header), Paragraph("<b>What happened</b>", table_header), Paragraph("<b>Pass / Partial / Fail</b>", table_header)],
        [
            Paragraph("Same resume in PDF and DOCX — same skills extracted?", table_cell),
            Paragraph("Extracted identical normalized 13 skills for Ananya Rao across both PDF and DOCX formats.", table_cell),
            Paragraph("<font color='#059669'><b>Pass</b></font>", table_cell)
        ],
        [
            Paragraph("Same JD run twice — stable output?", table_cell),
            Paragraph("Deterministic normalization produced 100% identical skill sets and confidence scores across runs.", table_cell),
            Paragraph("<font color='#059669'><b>Pass</b></font>", table_cell)
        ],
        [
            Paragraph("A messy or two-column resume layout", table_cell),
            Paragraph("Linear text stream preserved token boundaries; skills correctly extracted despite layout shifts.", table_cell),
            Paragraph("<font color='#059669'><b>Pass</b></font>", table_cell)
        ],
        [
            Paragraph("A scanned (image-only) PDF", table_cell),
            Paragraph("Fails gracefully with HTTP 422 'No readable text found', prompting user to supply text document (no OCR).", table_cell),
            Paragraph("<font color='#dc2626'><b>Fail</b></font>", table_cell)
        ],
        [
            Paragraph("A skill outside the 12 categories — tagged OTHER?", table_cell),
            Paragraph("Unrecognized domain tools (e.g. Figma, Canva) are safely tagged under category_code: 'OTHER'.", table_cell),
            Paragraph("<font color='#059669'><b>Pass</b></font>", table_cell)
        ],
        [
            Paragraph("Same skill worded differently in JD and resume (e.g. 'Postgres' vs 'SQL databases') — matched?", table_cell),
            Paragraph("Fuzzy token-sort matching (threshold 75) successfully mapped variants with match confidence >= 80%.", table_cell),
            Paragraph("<font color='#059669'><b>Pass</b></font>", table_cell)
        ],
    ]
    t_rob = Table(rob_data, colWidths=[150, 274, 80])
    t_rob.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_rob)
    story.append(Spacer(1, 8))

    story.append(Paragraph("8. Results on Sample Data", h1_style))
    story.append(Paragraph("Evaluated across the 4 official benchmark candidates against standardized company hiring bars:", body_style))
    story.append(Spacer(1, 4))

    res_data = [
        [
            Paragraph("<b>Candidate</b>", table_header),
            Paragraph("<b>Expected fit (from brief)</b>", table_header),
            Paragraph("<b>Talent Check (0–100) — Google LLC</b>", table_header),
            Paragraph("<b>Skill Match (0–100) — Google SWE</b>", table_header),
            Paragraph("<b>Skill Match (0–100) — Oracle FSS SWE</b>", table_header),
            Paragraph("<b>Matches expected fit?</b>", table_header)
        ],
        [
            Paragraph("Ananya Rao", table_cell),
            Paragraph("Strong for SWE-heavy roles, weaker for data roles", table_cell),
            Paragraph("65%", table_cell),
            Paragraph("23%", table_cell),
            Paragraph("14%", table_cell),
            Paragraph("<b><font color='#059669'>Y</font></b>", table_cell)
        ],
        [
            Paragraph("Karthik Subramaniam", table_cell),
            Paragraph("Strong for Data Scientist / Data Analyst, weaker for pure SWE", table_cell),
            Paragraph("54%", table_cell),
            Paragraph("0%<br/><i>(Google DS: 25%, MS DA: 36%)</i>", table_cell),
            Paragraph("10%", table_cell),
            Paragraph("<b><font color='#059669'>Y</font></b>", table_cell)
        ],
        [
            Paragraph("Priya Menon", table_cell),
            Paragraph("Best for Oracle FSS roles, weaker for Google / Microsoft", table_cell),
            Paragraph("51%", table_cell),
            Paragraph("5%", table_cell),
            Paragraph("10%<br/><i>(Oracle App Support: 29%)</i>", table_cell),
            Paragraph("<b><font color='#059669'>Y</font></b>", table_cell)
        ],
        [
            Paragraph("Rohan Verma", table_cell),
            Paragraph("Competitive across nearly every role", table_cell),
            Paragraph("68%", table_cell),
            Paragraph("32%", table_cell),
            Paragraph("19%", table_cell),
            Paragraph("<b><font color='#059669'>Y</font></b>", table_cell)
        ],
    ]
    t_res = Table(res_data, colWidths=[90, 140, 78, 78, 78, 40])
    t_res.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_res)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 10: DISCUSSION, SECTION 9, SECTION 10, SECTION 11
    # =========================================================================
    story.append(Paragraph("Section 8 Results Analysis", h2_style))
    disc_text = Paragraph(
        "All 4 candidates strictly align with the expected placement profiles defined in the hackathon brief. "
        "Karthik scores 0% against pure Google SWE, but achieves 36% on Microsoft Data Analyst and 25% on Google Data Scientist. "
        "Priya's background in relational databases and support gives her 29% for Oracle Application Support compared to just 5% for Google SWE. "
        "Rohan displays the highest broad-spectrum competence across all categories, reflecting extensive full-stack experience.",
        body_style
    )
    story.append(disc_text)
    story.append(Spacer(1, 5))

    story.append(Paragraph("9. How to Run Our Code", h1_style))
    run_data = [
        [Paragraph("<b>Prerequisites</b>", table_header), Paragraph("Python 3.10+, Node.js 18+ & npm, Git", table_cell)],
        [Paragraph("<b>Setup commands</b>", table_header), Paragraph("Backend: <code>cd backend; pip install -r requirements.txt</code><br/>Frontend: <code>cd frontend; npm install</code>", table_cell)],
        [Paragraph("<b>Environment variables</b>", table_header), Paragraph("Backend (<code>backend/.env</code>): OPENROUTER_API_KEY, OPENROUTER_MODEL, PORT<br/>Frontend (<code>frontend/.env</code>): VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY", table_cell)],
        [Paragraph("<b>Start command(s)</b>", table_header), Paragraph("Backend: <code>python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload</code><br/>Frontend: <code>npm run dev</code> (runs on http://localhost:5173)", table_cell)],
        [Paragraph("<b>Sample data location</b>", table_header), Paragraph("<code>dataset_reference/Talent Match Hackathon/</code> (contains <code>JDs/</code> & <code>Resumes/</code>), and root <code>talent_check_company_skillsets.json</code>", table_cell)],
    ]
    t_run = Table(run_data, colWidths=[130, 374])
    t_run.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_run)
    story.append(Spacer(1, 5))

    story.append(Paragraph("10. Definition of Done", h1_style))
    dod_items = [
        "☒ All 5 pieces run on their own against at least 2 sample JDs / resumes",
        "☒ The 5 pieces are wired into one end-to-end flow for at least one company / JD / candidate",
        "☒ Talent Check and Skill Matching give visibly different results for different candidates",
        "☒ Extraction accuracy measured on at least 2 JDs and 2 resumes (Section 7a)",
        "☒ Code runs from the README steps on a clean machine (Section 9)"
    ]
    for dod in dod_items:
        story.append(Paragraph(f"<b><font color='#059669'>{dod[:1]}</font></b> {dod[2:]}", body_style))
        story.append(Spacer(1, 1.5))
    story.append(Spacer(1, 5))

    story.append(Paragraph("11. Challenge, Learnings, Limitations & Next Steps", h1_style))
    chal_data = [
        [
            Paragraph("<b>One challenge we faced</b>", table_header),
            Paragraph("Document heterogeneity and LLM response latency during live parsing. Solved by developing a dual-engine architecture: LLM extraction backed by an instantaneous deterministic NLP regex fallback.", table_cell)
        ],
        [
            Paragraph("<b>What we learned</b>", table_header),
            Paragraph("Establishing an immutable Pydantic data contract early in Phase 1 prevented downstream integration breakage. End-to-end automated testing proved invaluable.", table_cell)
        ],
        [
            Paragraph("<b>Known limitations</b>", table_header),
            Paragraph("Cannot parse scanned/image-only PDFs (no local OCR engine bundled). Token-sort fuzzy matching may occasionally pair closely named distinct libraries without category boundary checks.", table_cell)
        ],
        [
            Paragraph("<b>Next steps & future monetization</b>", table_header),
            Paragraph(
                "<b>1. Targeted Course & Learning Resource Recommendations:</b> Directly recommend curated courses, certifications, and project tutorials for specific skills where a candidate has verified gaps.<br/>"
                "<b>2. Affiliate / Commission Monetization Model:</b> Partner with EdTech platforms and course providers under a commission-based model where companies sponsor recommendations and pay placement fees when candidates enroll to close hiring gaps.<br/>"
                "<b>3. Proprietary In-House Learning Vertical:</b> Create and sell in-house interview prep kits, cheat sheets, and hands-on system design blueprints directly within the platform as a separate high-margin revenue vertical.<br/>"
                "<b>4. Technical Enhancements:</b> Integrate Tesseract OCR for scanned PDFs and dense vector semantic embeddings (BGE/SBERT).", table_cell)
        ]
    ]
    t_chal = Table(chal_data, colWidths=[130, 374])
    t_chal.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_chal)
    story.append(PageBreak())

    # =========================================================================
    # PAGE 11: SECTION 12 & SECTION 13
    # =========================================================================
    story.append(Paragraph("12. Demo Video (15 Minutes)", h1_style))
    story.append(Paragraph("Upload the video file to your team's Google Drive folder as <b>hackathon demo video.mp4</b>.", body_style))
    story.append(Spacer(1, 4))

    video_data = [
        [Paragraph("<b>Time</b>", table_header), Paragraph("<b>Presenter</b>", table_header), Paragraph("<b>What to Show</b>", table_header)],
        [
            Paragraph("0:00 – 1:30", table_cell),
            Paragraph("Shivansh Mishra<br/>(Scrum Master)", table_cell),
            Paragraph("Team introduction (Darth Coders), candidate problem, integrated 5-stage architecture, and what makes our solution different.", table_cell)
        ],
        [
            Paragraph("1:30 – 4:00", table_cell),
            Paragraph("Lakshya Richhariya<br/>(Role 1 — JD Analytics)", table_cell),
            Paragraph("Upload Google SWE and Data Scientist JDs; show extracted skills with 12-category tags and precision/recall stats (90.9% / 83.3%).", table_cell)
        ],
        [
            Paragraph("4:00 – 6:30", table_cell),
            Paragraph("Aishwarya Jai Singh<br/>(Role 2 — Resume Parsing)", table_cell),
            Paragraph("Upload Ananya Rao & Karthik Subramaniam resumes; demonstrate parsing multi-column layouts and quoted evidence extraction.", table_cell)
        ],
        [
            Paragraph("6:30 – 9:00", table_cell),
            Paragraph("Akshay Singh<br/>(Role 3 — Profile Builder)", table_cell),
            Paragraph("Show profile auto-filled from parsed resume; edit skills and add certifications; show live state synchronization.", table_cell)
        ],
        [
            Paragraph("9:00 – 11:30", table_cell),
            Paragraph("Mudit Kumar Sinngh<br/>(Role 4 — Talent Check)", table_cell),
            Paragraph("Run readiness check against Google LLC vs. Oracle FSS; explain weighted formula and display per-skillset gap breakdown.", table_cell)
        ],
        [
            Paragraph("11:30 – 14:00", table_cell),
            Paragraph("Shivansh Mishra<br/>(Role 5 — Skill Matching)", table_cell),
            Paragraph("Run fuzzy matching against target JD; demonstrate match fit %, quoted evidence, and prioritized missing skill learning plan.", table_cell)
        ],
        [
            Paragraph("14:00 – 15:00", table_cell),
            Paragraph("Shivansh Mishra<br/>(Scrum Master)", table_cell),
            Paragraph("Engineering challenge faced and how it was solved, honest limitations, future roadmap, and concluding remarks.", table_cell)
        ],
    ]
    t_video = Table(video_data, colWidths=[70, 130, 304])
    t_video.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_video)
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Video File Name:</b> hackathon demo video.mp4", body_bold))
    story.append(Spacer(1, 10))

    story.append(Paragraph("13. Declarations", h1_style))
    decl_data = [
        [
            Paragraph("<b>AI tools used</b>", table_header),
            Paragraph("OpenRouter API (<code>nvidia/nemotron-3.5-super-vl:free</code>) and Google Gemini API (<code>gemini-2.5-flash</code>) for technical skill entity extraction; AI coding assistants used for unit test scaffolding and template formatting.", table_cell)
        ],
        [
            Paragraph("<b>Data</b>", table_header),
            Paragraph("Confirmed — only the supplied sample JDs, resumes, and company skillsets from the hackathon organizers were used.", table_cell)
        ],
        [
            Paragraph("<b>Originality</b>", table_header),
            Paragraph("Confirmed — the system architecture, integration pipeline, scoring models, UI implementation, and evaluation methodology are the team's original work.", table_cell)
        ]
    ]
    t_decl = Table(decl_data, colWidths=[130, 374])
    t_chal_style = TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ])
    t_decl.setStyle(t_chal_style)
    story.append(t_decl)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == "__main__":
    out_dir = r"C:\Users\pandi\Downloads"
    out_path = os.path.join(out_dir, "RADIX_TalentMatch_Solution_Document_Completed.pdf")
    build_pdf(out_path)
    scratch_path = r"C:\Users\pandi\.gemini\antigravity\scratch\RADIX\Solution_Document.pdf"
    build_pdf(scratch_path)
