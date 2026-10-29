import os

path = r"C:\Users\pandi\.gemini\antigravity\scratch\RADIX\generate_solution_pdf.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Replace Cover Page Role 1
text = text.replace(
    "1. <b>Shivansh Mishra</b> (Scrum Master & Role 1 — JD Analytics) — shivanshmishra6664@gmail.com",
    "1. <b>Lakshya Richhariya</b> (Role 1 — JD Analytics) — lakshrichhariyacodes@gmail.com"
)

# Replace Page 4 Table Role 1
old_p4 = '[Paragraph("1. JD Analytics", table_cell), Paragraph("Shivansh Mishra", table_cell), Paragraph("shivanshmishra6664@gmail.com", table_cell)]'
new_p4 = '[Paragraph("1. JD Analytics", table_cell), Paragraph("Lakshya Richhariya", table_cell), Paragraph("lakshrichhariyacodes@gmail.com", table_cell)]'
text = text.replace(old_p4, new_p4)

# Replace Page 5 Roles Table
old_p5 = '[Paragraph("1. JD Analytics", table_cell), Paragraph("Shivansh Mishra", table_cell),'
new_p5 = '[Paragraph("1. JD Analytics", table_cell), Paragraph("Lakshya Richhariya", table_cell),'
text = text.replace(old_p5, new_p5)

# Replace Page 11 Video Presenter
text = text.replace(
    "Shivansh Mishra<br/>(Role 1 — JD Analytics)",
    "Lakshya Richhariya<br/>(Role 1 — JD Analytics)"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Replacement complete in generate_solution_pdf.py")
