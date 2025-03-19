import os
import numpy as np
import whisper
from transformers import pipeline
from pyannote.audio import Pipeline
import parselmouth
from parselmouth.praat import call
import pandas as pd
from datetime import timedelta

# Load models only once for efficiency
model = whisper.load_model('base')
diarization_pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.0",
    use_auth_token=os.getenv("HF_AUTH_TOKEN")
)
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    device=0
)

cuss_words_list = [
    "damn", "crap", "hell", "shoot", "frick", "jerk", "idiot",
    "bitch", "bastard", "douche", "jackass", "prick", "moron", "ass",
    "fuck", "shit", "asshole", "motherfucker", "cunt",
    "you suck", "shut up", "go to hell", "loser",
    "stupid", "useless", "worthless", "dumb", "bullshit"
]

def process_audio(input_audio_path):
    # Transcription
    result = model.transcribe(input_audio_path)
    segments = result['segments']

    # Speaker Diarization
    diarization_result = diarization_pipeline({'uri': 'audio_file', 'audio': input_audio_path})
    speaker_turns = [(turn.start, turn.end, speaker) for turn, _, speaker in diarization_result.itertracks(yield_label=True)]

    # Pitch Analysis
    sound = parselmouth.Sound(input_audio_path)
    pitch = call(sound, "To Pitch", 0.0, 75, 600)

    # Initialize Data Collection
    columns = ['transcribed_sentence', 'timestamp', 'speaker', 'pitch', 'tone', 'pace', 'cuss words', 'response time']
    data = []
    previous_end_time = 0

    # Process each segment
    for segment in segments:
        start, end, text = segment['start'], segment['end'], segment['text']
        if not text.strip():
            continue
        
        # Speaker Identification
        speaker_idx = next((i for i, (s, e, spk) in enumerate(speaker_turns) if s <= start < e), -1)
        speaker = f"Speaker {speaker_turns[speaker_idx][2]}" if speaker_idx != -1 else 'Unknown'
        
        # Sentiment Analysis
        sentiment = sentiment_pipeline(text)[0]
        tone = sentiment['label']

        # Pitch Calculation
        pitch_mean = call(pitch, "Get mean", start, end, "Hertz")

        # Speaking Pace (Words per second)
        duration = end - start
        words = len(text.split())
        pace = words / duration if duration > 0 else 0

        # Cuss Words Detection
        cuss_words = ', '.join([word for word in text.split() if word.lower() in cuss_words_list]) or 'None'

        # Response Time
        response_time = start - previous_end_time if previous_end_time > 0 else 0
        previous_end_time = end

        # Append to Data
        data.append([
            text,
            f'{str(timedelta(seconds=int(start)))} - {str(timedelta(seconds=int(end)))}',
            speaker,
            pitch_mean,
            tone,
            pace,
            cuss_words,
            response_time
        ])

    # Create and return DataFrame
    df = pd.DataFrame(data, columns=columns)
    return df
