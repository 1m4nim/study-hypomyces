import { google } from "googleapis";
import fs from "fs";
import path from "path";

// サービスアカウントキーのパス
const KEYFILE = path.join(__dirname, "service-account.json");

// スプレッドシートのIDと範囲
const SPREADSHEET_ID = "1ylwJs5PDy8mgm9I0FVes4jNQHMmpvO60YJjY0LXd2kM";
const RANGE = "sheet1";

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }

  const headers = rows[0];
  const jsonData = rows.slice(1).map((row) => {
    const entry: Record<string, string> = {};
    headers.forEach((header, i) => {
      entry[header] = row[i] || "";
    });
    return entry;
  });

  fs.writeFileSync("output.json", JSON.stringify(jsonData, null, 2));
  console.log("JSON saved to output.json");
}

main().catch(console.error);
