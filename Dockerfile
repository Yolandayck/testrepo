FROM node:16

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Copy common passwords file
COPY common-passwords.txt ./

EXPOSE 3000
CMD ["node", "app.js"]