const path = require("path");
const os = require("os");
const fs = require("fs");
const { execSync } = require("child_process");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "https-cert-"));
const certFile = path.join(tempDir, "localhost.crt");
const keyFile = path.join(tempDir, "localhost.key");

try {
    console.log("Generating new development certificate...");
    execSync(`dotnet dev-certs https -ep ${certFile} --no-password --format PEM --trust`, { stdio: "inherit" });

    const eol = os.EOL;
    const envFilePath = path.join(process.cwd(), ".env.development.local");
    let envContent = "";

    if (fs.existsSync(envFilePath)) {
        console.log("Updating existing .env.development.local file...");
        const existingContent = fs.readFileSync(envFilePath, { encoding: "utf8" });
        const lines = existingContent.split(eol);
        const updatedLines = lines.map(line => {
            if (line.startsWith("HTTPS=")) return `HTTPS=true`;
            if (line.startsWith("SSL_CRT_FILE=")) return `SSL_CRT_FILE=${certFile}`;
            if (line.startsWith("SSL_KEY_FILE=")) return `SSL_KEY_FILE=${keyFile}`;
            return line;
        });
        if (!updatedLines.some(line => line.startsWith("HTTPS="))) {
            updatedLines.push(`HTTPS=true`);
        }
        if (!updatedLines.some(line => line.startsWith("SSL_CRT_FILE="))) {
            updatedLines.push(`SSL_CRT_FILE=${certFile}`);
        }
        if (!updatedLines.some(line => line.startsWith("SSL_KEY_FILE="))) {
            updatedLines.push(`SSL_KEY_FILE=${keyFile}`);
        }
        envContent = updatedLines.join(eol);
    } else {
        console.log("Creating new .env.development.local file...");
        envContent = `HTTPS=true${eol}SSL_CRT_FILE=${certFile}${eol}SSL_KEY_FILE=${keyFile}${eol}`;
    }

    fs.writeFileSync(envFilePath, envContent, { encoding: "utf8" });
    console.log("Certificate paths and HTTPS setting written to .env.development.local:");
    console.log(envContent);
} catch (error) {
    console.error("Failed to generate or trust the certificate:", error);
    process.exit(1);
}
