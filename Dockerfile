FROM php:8.1-apache

# Copy application files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]

