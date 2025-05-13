import * as fs from "fs";
import * as path from "path";
const pdf = require("html-pdf");

// JSONデータを取得
const data = JSON.parse(fs.readFileSync("output.json", "utf-8"));

// ヘッダーとデータ行をHTMLに埋め込む
const headers = Object.keys(data[0]);

const tableHeaders = headers.map((key) => `<th>${key}</th>`).join("");
const tableRows = data
  .map((row: any) => {
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
pdf.create(html).toFile("output.pdf", (err: any, res: any) => {
  if (err) return console.error(err);
  console.log("PDF created:", res.filename);
});
