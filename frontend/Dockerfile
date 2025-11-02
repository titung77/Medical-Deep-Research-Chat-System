FROM nginx:alpine

# Copy static files
COPY public/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 1000
EXPOSE 1000

CMD ["nginx", "-g", "daemon off;"]
