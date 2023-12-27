FROM docker.io/nginx:stable-alpine
COPY  dist/apps/query-builder/ /usr/share/nginx/html/
COPY  apps/query-builder/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
