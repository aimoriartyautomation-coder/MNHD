FROM python:3.11-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache gcc musl-dev mariadb-dev

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY . .

# Create directory for SQLite database
RUN mkdir -p /app/db && chmod 777 /app/db

# Expose Django port
EXPOSE 8000

# Run migrations, create admin user, and start development server
CMD ["sh", "-c", "python manage.py makemigrations leads && python manage.py migrate && python manage.py shell -c \"from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin123456')\" && python manage.py runserver 0.0.0.0:8000"]
