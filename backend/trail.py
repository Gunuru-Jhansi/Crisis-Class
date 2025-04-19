""" import subprocess

try:
    output = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True, check=True)
    print("FFmpeg is available:")
    print(output.stdout)
except Exception as e:
    print("FFmpeg not found or error occurred:", e)
 """
