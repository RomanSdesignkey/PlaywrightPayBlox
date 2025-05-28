# Use Playwright base image
FROM mcr.microsoft.com/playwright:v1.42.0-jammy

# Set working directory inside the container
WORKDIR /app

# Install Java (OpenJDK 17) for Allure
RUN apt update && apt install -y openjdk-17-jdk && \
    rm -rf /var/lib/apt/lists/*  # Clean up unnecessary files

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Copy package.json (no need for package-lock.json)
COPY package.json .

# Install dependencies and Playwright browsers
RUN npm install && \
    npx playwright install --with-deps && \
    npm install -g allure-commandline

# Copy all project files AFTER installing dependencies
COPY . .

# Open PORT 3000
EXPOSE 3000

# Open PORT 8080
EXPOSE 8080

# Default command for running Playwright tests in headless mode
CMD ["npm", "run", "test"]

# Default command to start Playwright UI mode
#CMD ["npx", "playwright", "test", "--ui", "--ui-host=0.0.0.0", "--ui-port=8080"]