# Use an official Python runtime as a parent image
FROM python:3.12.2

# Install Node.js and npm (using the NodeSource Node.js Binary Distributions)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt-get install -y nodejs \
    && rm nodesource_setup.sh

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install Poetry and dependencies, set the PATH environment variable
RUN pip install poetry \
    && poetry install \
    && echo "export PATH=$(poetry env info --path)/bin:$PATH" >> $HOME/.bashrc

# Make port 80 available to the world outside this container
EXPOSE 8000

# Install frontend dependencies and build the frontend
WORKDIR /usr/src/app/frontend
ENV NODE_ENV=production
RUN npm install
RUN npm run build

# Return to the application root directory
WORKDIR /usr/src/app

# Run the Django application using the Poetry environment's Python interpreter
CMD ["/bin/bash", "-c", "source $(poetry env info --path)/bin/activate && python manage.py runserver 0.0.0.0:8000"]
