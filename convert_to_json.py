import json
import re

chapters = []
with open('compiled_chapters.txt', 'r', encoding='utf-8') as f:
    text = f.read()

entries = re.split(r'=+\n+', text)
for entry in entries:
    if not entry.strip():
        continue
    lines = entry.strip().split('\n')
    title = lines[0].strip()
    content = '\n'.join(lines[1:]).strip()
    chapters.append({'title': title, 'content': content})

with open('chapter_reader/chapters.json', 'w', encoding='utf-8') as out:
    json.dump(chapters, out, ensure_ascii=False, indent=2)

print(f"✅ Exported {len(chapters)} chapters to chapters.json")
