import sys
import pandas as pd
import pygame
import time
import threading
import re
from tkinter import Tk, Label, Button, Canvas, Frame, Scrollbar, BOTH

# Get the audio file path from command line arguments
if len(sys.argv) < 2:
    print("No audio file provided!")
    sys.exit(1)

audio_file = sys.argv[1]  # Audio file path from app.py
csv_file = "analysis_results.csv"  # CSV file generated previously

# Load the transcript DataFrame
df = pd.read_csv(csv_file)

# Function to extract and convert start time from "timestamp"
def parse_start_time(timestamp):
    match = re.match(r"(\d+:\d+:\d+)", str(timestamp))
    if match:
        h, m, s = map(int, match.group(1).split(":"))
        return h * 3600 + m * 60 + s
    return 0

# Extract start time
df["start_time"] = df["timestamp"].apply(parse_start_time)

# Initialize pygame mixer for audio control
pygame.mixer.init()
pygame.mixer.music.load(audio_file)

# Control variables
is_playing = False
start_time_offset = None

# Audio control functions
def play_audio():
    global is_playing, start_time_offset
    if not is_playing:
        pygame.mixer.music.play()
        is_playing = True
        start_time_offset = time.time()
        threading.Thread(target=update_lyrics, daemon=True).start()

def pause_audio():
    global is_playing
    if is_playing:
        pygame.mixer.music.pause()
        is_playing = False

def resume_audio():
    global is_playing
    if not is_playing:
        pygame.mixer.music.unpause()
        is_playing = True

def stop_audio():
    global is_playing
    pygame.mixer.music.stop()
    is_playing = False
    for lbl in lyrics_labels:
        lbl.config(fg="black")

# Update lyrics in sync with audio
def update_lyrics():
    for idx, row in df.iterrows():
        start_time = row["start_time"]
        while is_playing and (time.time() - start_time_offset < start_time):
            time.sleep(0.05)
        if is_playing:
            for lbl in lyrics_labels:
                lbl.config(fg="black")
            lyrics_labels[idx].config(fg="#FF6B6B", font=("Arial", 16, "bold"))
            canvas.yview_moveto(idx / len(df))

# Initialize GUI
root = Tk()
root.title("🎵 Scrollable Lyrics Player")
root.geometry("850x500")
root.configure(bg="#F6F6F6")

# Frame for lyrics with scroll
frame = Frame(root, bg="#F6F6F6")
frame.pack(fill=BOTH, expand=True, padx=10, pady=10)

canvas = Canvas(frame, bg="#F6F6F6", highlightthickness=0)
scrollbar = Scrollbar(frame, orient="vertical", command=canvas.yview)
scrollable_frame = Frame(canvas, bg="#F6F6F6")

scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
canvas.configure(yscrollcommand=scrollbar.set)
canvas.pack(side="left", fill=BOTH, expand=True)
scrollbar.pack(side="right", fill="y")

# Populate lyrics labels
lyrics_labels = []
for _, row in df.iterrows():
    lbl = Label(scrollable_frame, text=row["transcribed_sentence"],
                font=("Arial", 16), fg="black", bg="#F6F6F6",
                anchor="w", justify="left", wraplength=800)
    lbl.pack(anchor="w", padx=20, pady=5)
    lyrics_labels.append(lbl)

# Control Buttons
buttons = [
    ("▶ Play", play_audio),
    ("⏸ Pause", pause_audio),
    ("▶ Resume", resume_audio),
    ("⏹ Stop", stop_audio)
]

btn_frame = Frame(root, bg="#F6F6F6")
btn_frame.pack(pady=10)

for text, command in buttons:
    btn = Button(btn_frame, text=text, font=("Arial", 14, "bold"), command=command,
                 bg="#A8DADC", fg="#1D3557", activebackground="#74C69D", activeforeground="white",
                 relief="flat", padx=15, pady=5, bd=0)
    btn.pack(side="left", padx=10, ipadx=10, ipady=5)

root.mainloop()