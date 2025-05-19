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
const pdf = require("html-pdf");
// JSONデータを取得
const data = JSON.parse(fs.readFileSync("output.json", "utf-8"));
// ヘッダーとデータ行をHTMLに埋め込む
const headers = Object.keys(data[0]);
const tableHeaders = headers.map((key) => `<th>${key}</th>`).join("");
const tableRows = data
    .map((row) => {
    const cells = headers.map((key) => `<td>${row[key]}</td>`).join("");
    return `<tr>${cells}</tr>`;
})
    .join("");
const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #000; padding: 8px; text-align: left; }
    </style>
  </head>
  <body>
    <h1>JSON Data from Spreadsheet</h1>
    <table>
      <thead><tr>${tableHeaders}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  </body>
</html>
`;
// PDFに変換
pdf.create(html).toFile("output.pdf", (err, res) => {
    if (err)
        return console.error(err);
    console.log("PDF created:", res.filename);
});
