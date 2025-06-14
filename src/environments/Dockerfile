# Étape 1 : Build Angular
FROM node:20.12.2 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration production

# Étape 2 : Serve via Apache
FROM httpd:2.4
COPY --from=builder /app/dist/ng-messenger/ /usr/local/apache2/htdocs/

# Active Angular Routing (pour les URLs propres)
RUN sed -i '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /usr/local/apache2/conf/httpd.conf
RUN echo '<IfModule mod_rewrite.c>\n\
RewriteEngine On\n\
RewriteBase /\n\
RewriteRule ^index\\.html$ - [L]\n\
RewriteCond %{REQUEST_FILENAME} !-f\n\
RewriteCond %{REQUEST_FILENAME} !-d\n\
RewriteRule . /index.html [L]\n\
</IfModule>' > /usr/local/apache2/htdocs/.htaccess
