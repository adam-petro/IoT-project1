# Create an image for the actual application
FROM node:latest

# Install pigpio library
WORKDIR /tmp
RUN wget https://github.com/joan2937/pigpio/archive/master.zip
RUN unzip master.zip
WORKDIR /tmp/pigpio-master
RUN make
RUN make install

# Create the directory for our application
RUN mkdir /app

# Copy our application source into the image
COPY public /app/public
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
