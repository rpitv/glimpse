FROM tiangolo/nginx-rtmp:latest-2021-09-17

COPY ./apps/video-control/nginx.conf /etc/nginx/nginx.conf
