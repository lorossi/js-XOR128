// This script generates a coverage badge in JSON format based on the coverage-final.json file
import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const coveragePath = join(__dirname, "..", "coverage", "coverage-final.json");

// Check if coverage-final.json exists
if (!existsSync(coveragePath)) {
  console.error("coverage-final.json not found. Run `npm run test` first.");
  process.exit(1);
}
// Load coverage data
const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));

// Aggregate statements coverage across all files
let covered = 0;
let total = 0;

for (const file of Object.values(coverage)) {
  for (const count of Object.values(file.s)) {
    if (count > 0) {
      covered += 1;
    }
    total += 1;
  }
}

console.log(`Covered: ${covered}, Total: ${total}`);

const pct = total === 0 ? 0 : Math.round((covered / total) * 100);

const badge = {
  schemaVersion: 1,
  label: "coverage",
  message: `${pct}%`,
  color: pct >= 80 ? "brightgreen" : pct >= 60 ? "yellow" : "red",
};

const outputPath = join(__dirname, "..", "docs", "coverage-badge.json");
writeFileSync(outputPath, JSON.stringify(badge, null, 2));

console.log(`Badge created: ${outputPath}`);
