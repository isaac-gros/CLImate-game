FROM node:current-slim

# Copy files to target path
RUN mkdir /var/climate
COPY . /var/climate