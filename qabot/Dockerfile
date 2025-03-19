# Use Python 3.10 for compatibility
FROM python:3.10

# Set the working directory in the container
WORKDIR /app

# Copy all files to the container's working directory
COPY . /app

# Install system dependencies, including ALSA and build tools for audio processing
RUN apt-get update && \
    apt-get install -y ffmpeg libsm6 libxext6 git libasound2-dev build-essential && \
    apt-get clean

# Install Python dependencies (without unnecessary dependencies)
RUN pip install --no-cache-dir -r requirements.txt --no-deps

# Uninstall conflicting versions of Torch, TorchVision, and Torchaudio
RUN pip uninstall -y torch torchvision torchaudio

# Install compatible versions with CUDA 11.8 support
RUN pip install torch==2.2.0+cu118 torchvision==0.17.0+cu118 torchaudio==2.2.0+cu118 --index-url https://download.pytorch.org/whl/cu118

# Expose the port on which the app runs
EXPOSE 5000

# Set the entry point for the container to run the app
CMD ["python", "app.py"]