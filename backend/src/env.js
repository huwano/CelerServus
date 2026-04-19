const fs = require('node:fs');
const path = require('node:path');

function parseEnvFile(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf('=');

      if (separatorIndex === -1) {
        return acc;
      }

      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      acc[key] = value;
      return acc;
    }, {});
}

function loadBackendEnv({
  envFilePath = path.join(__dirname, '..', '.env'),
} = {}) {
  if (!fs.existsSync(envFilePath)) {
    return;
  }

  const parsedEnv = parseEnvFile(fs.readFileSync(envFilePath, 'utf8'));

  Object.entries(parsedEnv).forEach(([key, value]) => {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

module.exports = {
  loadBackendEnv,
  parseEnvFile,
};
