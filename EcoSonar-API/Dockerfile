# Building application in mult-stage mode to produce slimmer Docker image
FROM node:16-alpine as build

# Uncomment if you need to configure proxy.
# You can init these variables by using --build-args during docker build
# Example : docker build [...] --build-args http_proxy=http://<user>:<password>@<host>:<port>
# ENV HTTP_PROXY=$http_proxy
# ENV HTTPS_PROXY=$https_proxy
# ENV NO_PROXY=$no_proxy

#RUN apk update && apk add --no-cache \
RUN apk add --no-cache \
    wget \
    gnupg \
    git \
    build-base \
    python3 \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Create app directory
WORKDIR /app

# Copy the entire source code to the build stage
COPY . .

# Uncomment if you need to configure proxy.
# RUN npm config set proxy $HTTP_PROXY

# If you are building your code for production
# RUN npm ci --only=production
# otherwise run npm install

# Updating dependencies before building the application
RUN npm update && npm install && npm run build

# Use a temporary directory to store built artifacts
WORKDIR /tmp/app

# Copy built artifacts from the build stage to the temporary directory
RUN cp -r /app/package.json /app/server.js /app/builder.js /app/node_modules /app/routes /app/services /app/dataBase /app/utils /app/configuration .

# Use a smaller base image for the final stage
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Create a non-root user for running the application
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser

# Change ownership to the non-root user
RUN chown -R pptruser:pptruser /app

# Set the non-root user as the default user
USER pptruser

# Set the listening port 
ENV PORT=3000
EXPOSE 3000

# Copy build to the image
COPY --from=build --chown=pptruser:pptruser /tmp/* .

# Run the application
CMD ["npm", "start"]
