import gradio as gr
import pandas as pd
import threading
import subprocess
import sys
from sentiment_analysis import process_audio
import os

# Function to process the uploaded audio file and return DataFrame and transcriptions for sync
def process_upload(audio_file):
    if audio_file:
        df = process_audio(audio_file)
        csv_path = "analysis_results.csv"
        df.to_csv(csv_path, index=False)

        # Generate transcriptions with color coding
        transcriptions = []
        for _, row in df.iterrows():
            color = 'green'  # Default color
            if row.get('cuss words', 'None') != 'None':
                color = 'red'  # Cuss words
            elif row.get('tone', 'POSITIVE') == 'NEGATIVE':
                color = 'red'  # Negative sentiment

            transcriptions.append({
                "text": row["transcribed_sentence"],
                "start": row["timestamp"],
                "color": color
            })

        return df, csv_path, transcriptions, audio_file

# Function to open the Tkinter-based lyrics player with the audio file path
def open_lyrics_player(audio_file_path):
    if audio_file_path:
        def run_script():
            subprocess.Popen([sys.executable, "qabot/lyrics_player.py", audio_file_path])
        threading.Thread(target=run_script).start()
        return "Lyrics Player Opened!"
    return "No audio file selected!"

# Modern UI with Gradio
with gr.Blocks(theme=gr.themes.Soft(primary_hue="red", secondary_hue="gray")) as app:
    gr.Markdown("# 🎵 ECHO - A Product By DRIFTING DEVS")
    
    with gr.Row():
        with gr.Column(scale=1):
            gr.Markdown("### 📂 Upload Section")
            audio_input = gr.Audio(type="filepath", label="Upload Audio File (.wav)")
            submit_btn = gr.Button("Process Audio")
        
        with gr.Column(scale=1):
            gr.Markdown("### 📈 Download & Analysis")
            download_button = gr.File(label="Download Analysis (.csv)")
            df_output = gr.DataFrame(label="Transcription Analysis")
    
    with gr.Row():
        with gr.Column(scale=1):
            gr.Markdown("### 🎧 Audio Player")
            audio_player = gr.Audio(label="Play Audio", interactive=True)

        with gr.Column(scale=1):
            gr.Markdown("### 📑 Flagged Transcriptions")
            sync_output = gr.HighlightedText(label="Flagged Transcriptions")

    transcription_output = gr.JSON(label="Transcriptions for Sync")

    submit_btn.click(
        fn=process_upload,
        inputs=[audio_input],
        outputs=[df_output, download_button, transcription_output, audio_player]
    )

    transcription_output.change(
        fn=lambda transcriptions: [(t['text'], t.get('color', 'green')) for t in transcriptions],
        inputs=[transcription_output],
        outputs=[sync_output]
    )

    # Button to open the external Tkinter lyrics player
    gr.Markdown("### 🎶 Additional Feature")
    open_player_btn = gr.Button("🎵 Open Scrollable Lyrics Player")
    status_output = gr.Textbox(label="Status", interactive=False)

    open_player_btn.click(
        fn=open_lyrics_player,
        inputs=[audio_input],
        outputs=[status_output]
    )

app.launch(server_name="0.0.0.0", server_port=8080)