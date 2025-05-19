"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function loadDataFromJson(filePath) {
    const fullPath = path.resolve(filePath);
    const jsonData = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(jsonData);
}
function flattenData(rawData) {
    const flatArray = [];
    for (const hypomyces in rawData) {
        const hostGenusMap = rawData[hypomyces];
        for (const hostGenus in hostGenusMap) {
            const entries = hostGenusMap[hostGenus];
            entries.forEach((entry) => flatArray.push(entry));
        }
    }
    return flatArray;
}
function generateHtmlTableGrouped(data) {
    // Hypomyces speciesでグループ化
    const grouped = data.reduce((acc, entry) => {
        if (!acc[entry.hypomyces_species])
            acc[entry.hypomyces_species] = [];
        acc[entry.hypomyces_species].push(entry);
        return acc;
    }, {});
    let html = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<title>Hypomyces Hosts Table (Grouped)</title>
<style>
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #444; padding: 8px; text-align: left; }
  th { background-color: #eee; }
</style>
</head>
<body>
<h1>Hypomyces Hosts Table (Grouped)</h1>
<table>
  <thead>
    <tr>
      <th>Hypomyces Species</th>
      <th>Host Genus</th>
      <th>Host Species</th>
      <th>Distribution</th>
      <th>Source</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
`;
    for (const [hypomyces_species, entries] of Object.entries(grouped)) {
        const rowspan = entries.length;
        entries.forEach((entry, i) => {
            html += "<tr>\n";
            if (i === 0) {
                html += `<td rowspan="${rowspan}">${hypomyces_species || ""}</td>\n`;
            }
            html += `
      <td>${entry.host_genus || ""}</td>
      <td>${entry.host_species || ""}</td>
      <td>${entry.distribution || ""}</td>
      <td>${entry.source || ""}</td>
      <td>${entry.notes || ""}</td>
`;
            html += "</tr>\n";
        });
    }
    html += `
  </tbody>
</table>
</body>
</html>
`;
    return html;
}
function main() {
    try {
        // JSONファイル名（カレントディレクトリにorganized.jsonがある想定）
        const inputFile = "organized.json";
        const outputFile = "output.html";
        console.log(`Loading data from ${inputFile}...`);
        const rawData = loadDataFromJson(inputFile);
        console.log("Flattening data...");
        const flatData = flattenData(rawData);
        console.log("Generating HTML grouped table...");
        const html = generateHtmlTableGrouped(flatData);
        console.log(`Saving to ${outputFile}...`);
        fs.writeFileSync(path.resolve(outputFile), html, "utf-8");
        console.log("Done!");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
main();
