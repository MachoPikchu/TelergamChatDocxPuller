import os
from telethon import TelegramClient, events
from dotenv import load_dotenv
from docx import Document
import shutil

# Load environment variables
load_dotenv()

api_id = int(os.getenv('TELEGRAM_API_ID'))
api_hash = os.getenv('TELEGRAM_API_HASH')
phone_number = os.getenv('TELEGRAM_PHONE_NUMBER')
target_channel = os.getenv('TARGET_CHANNEL')  # e.g., '@shadow_slave_fastes'

output_file = 'compiled_chapters.txt'
buffer_dir = 'buffer'

# Ensure buffer directory exists
os.makedirs(buffer_dir, exist_ok=True)

# Initialize client
client = TelegramClient('session_realtime', api_id, api_hash)

def extract_text_from_docx(file_path):
    """Extract and return all text from a DOCX file"""
    try:
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    except Exception as e:
        print(f"[ERROR] Failed to read {file_path}: {e}")
        return ""

@client.on(events.NewMessage(chats=target_channel))
async def handler(event):
    """Triggered on every new message in the channel"""
    if event.document and event.file.name.endswith('.docx'):
        file_name = event.file.name
        file_path = os.path.join(buffer_dir, file_name)

        try:
            print(f"\n📥 New DOCX detected: {file_name}")
            await event.download_media(file_path)

            content = extract_text_from_docx(file_path)

            if content:
                with open(output_file, 'a', encoding='utf-8') as f:
                    f.write(f"{file_name}\n\n")
                    f.write(content)
                    f.write("\n\n" + "=" * 50 + "\n\n")

                print(f"✅ Appended {file_name} to {output_file}")
            else:
                print(f"⚠️ Skipped {file_name} (empty or unreadable)")

        except Exception as e:
            print(f"[ERROR] Problem with {file_name}: {e}")

        finally:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"🗑️ Deleted {file_name} from buffer")

print("🔄 Listening for new DOCX files...")
client.start(phone_number)
client.run_until_disconnected()
