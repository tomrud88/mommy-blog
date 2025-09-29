#!/usr/bin/env node

const { spawn } = require("child_process");
const net = require("net");
const fs = require("fs");
const path = require("path");

// Available ports to try
const availablePorts = [3000, 3001, 3002, 3003, 3004];

/**
 * Check if a port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.close(() => {
        resolve(true);
      });
    });

    server.on("error", () => {
      resolve(false);
    });
  });
}

/**
 * Find the first available port from the list
 */
async function findAvailablePort() {
  for (const port of availablePorts) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
  }

  // If no predefined ports are available, find any available port starting from 3005
  for (let port = 3005; port < 4000; port++) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
  }

  throw new Error("No available ports found");
}

/**
 * Update the NEXTAUTH_URL in .env.local
 */
function updateEnvFile(port) {
  const envPath = path.join(__dirname, "..", ".env.local");

  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");

    // Update NEXTAUTH_URL with the correct port
    envContent = envContent.replace(
      /NEXTAUTH_URL=.*$/m,
      `NEXTAUTH_URL=http://localhost:${port}`
    );

    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Updated NEXTAUTH_URL to http://localhost:${port}`);
  }
}

/**
 * Start the Next.js development server
 */
async function startServer() {
  try {
    console.log("🔍 Finding available port...");
    const port = await findAvailablePort();

    console.log(`🎯 Found available port: ${port}`);
    updateEnvFile(port);

    console.log("🚀 Starting Next.js development server...");

    // Start Next.js with the found port
    const nextProcess = spawn(
      "npm",
      ["run", "dev", "--", "-p", port.toString()],
      {
        stdio: "inherit",
        shell: true,
      }
    );

    // Handle process termination
    process.on("SIGINT", () => {
      console.log("\\n⏹️ Stopping development server...");
      nextProcess.kill("SIGINT");
      process.exit(0);
    });

    nextProcess.on("exit", (code) => {
      console.log(`Development server exited with code ${code}`);
      process.exit(code);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
}

// Run the server
startServer();
