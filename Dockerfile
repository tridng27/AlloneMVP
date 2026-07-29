FROM nginx:alpine
COPY . /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/nginx \
    /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/docker-compose.yml \
    /usr/share/nginx/html/.dockerignore \
    /usr/share/nginx/html/render.yaml
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
