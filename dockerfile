# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=development

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the migrations, seed the database, and then start the application in development mode
CMD ["sh", "-c", "npx knex migrate:latest && npx knex seed:run && npm run dev"]