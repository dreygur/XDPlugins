#!/bin/sh
FFMPEG=/mnt/c/iola-user/local/ffmpeg-20200306-cfd9a65-win64-static/bin/ffmpeg.exe

${FFMPEG} -i ./icon@4x.png -s 144:144 -y ./icon@3x.png
${FFMPEG} -i ./icon@4x.png -s 48:48 -y ./icon@2x.png
${FFMPEG} -i ./icon@4x.png -s 24:24 -y ./icon@1x.png
