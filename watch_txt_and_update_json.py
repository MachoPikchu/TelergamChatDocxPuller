import time
import json
import re
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

compiled_txt = 'compiled_chapters.txt'
compiled_json = 'chapter_reader/chapters.json'

def build_json():
    chapters = []
    with open(compiled_txt, 'r', encoding='utf-8') as f:
        text = f.read()

    entries = re.split(r'=+\n+', text)
    for entry in entries:
        if not entry.strip():
            continue
        lines = entry.strip().split('\n')
        title = lines[0].strip()
        content = '\n'.join(lines[1:]).strip()
        chapters.append({'title': title, 'content': content})

    with open(compiled_json, 'w', encoding='utf-8') as out:
        json.dump(chapters, out, ensure_ascii=False, indent=2)

    print(f"🔁 JSON updated: {len(chapters)} chapters.")

class TxtChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith(compiled_txt):
            print("📄 Detected change in TXT. Updating JSON...")
            build_json()

if __name__ == "__main__":
    event_handler = TxtChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=False)
    observer.start()
    print("👀 Watching for TXT changes... Press Ctrl+C to stop.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
