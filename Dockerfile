FROM php:8.1-apache

# Install MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Copy application files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Create uploads directory
RUN mkdir -p /var/www/html/uploads/payment_screenshots
RUN chown -R www-data:www-data /var/www/html/uploads
RUN chmod -R 777 /var/www/html/uploads

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]

