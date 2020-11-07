# Create an image for the actual application
FROM node:latest

# Create the directory for our application
RUN mkdir /app

# Copy our application source into the image
COPY public /app/public
COPY plugins /app/plugins
COPY resources /app/resources
COPY routes /app/routes
COPY servers /app/servers
COPY views /app/views
COPY index.js /app
COPY package.json /app
COPY package-lock.json /app

# Set the working directory
WORKDIR /app

# Install node packages
RUN npm install

# Expose the webserver port
EXPOSE 8080

# Run the application
ENTRYPOINT ["node", "index.js"]
