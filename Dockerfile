# ====================================
# Dockerfile - مشروع مدينة مصر
# Static Website served via Nginx
# ====================================

FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy website files to nginx html directory
COPY . /usr/share/nginx/html/

# Remove unnecessary files from the container
RUN rm -f /usr/share/nginx/html/Dockerfile \
           /usr/share/nginx/html/docker-compose.yml \
           /usr/share/nginx/html/nginx.conf \
           /usr/share/nginx/html/.dockerignore \
           /usr/share/nginx/html/js/google-apps-script-template.js \
           /usr/share/nginx/html/README.md

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
