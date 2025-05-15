import { google } from "googleapis";
import fs from "fs";
import path from "path";

// サービスアカウントキーのパス
const KEYFILE = path.join(__dirname, "service-account.json");

const SPREADSHEET_ID = "1ylwJs5PDy8mgm9I0FVes4jNQHMmpvO60YJjY0LXd2kM";
const RANGE = "sheet1";

// 型定義
type HypomycesRecord = {
  species: string;
  host: string;
  [key: string]: string; // その他の任意プロパティ（locationなど）
};

type OrganizedRecords = {
  [species: string]: {
    [host: string]: HypomycesRecord[];
  };
};

function organizeBySpecies(records: any[]): OrganizedRecords {
  const result: OrganizedRecords = {};

  for (const record of records) {
    const species = record.hypomyces_species;
    const host = record.host_genus || record.host_species; // 優先順位：host_genus > host_species

    if (!species || !host) continue;

    if (!result[species]) result[species] = {};
    if (!result[species][host]) result[species][host] = [];

    result[species][host].push(record);
  }

  return result;
}

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

  // ヘッダーとデータをJSON形式に変換
  const headers = rows[0];
  const jsonData: HypomycesRecord[] = rows.slice(1).map((row) => {
    const entry: Record<string, string> = {};
    headers.forEach((header, i) => {
      entry[header] = row[i] || "";
    });
    return entry as HypomycesRecord;
  });

  // 保存（必要ならコメントアウト可）
  fs.writeFileSync("output.json", JSON.stringify(jsonData, null, 2));
  console.log("✅ output.json に保存されました");

  // 分類
  const organized = organizeBySpecies(jsonData);
  fs.writeFileSync("organized.json", JSON.stringify(organized, null, 2));
  console.log("✅ 種ごとに分類した結果を organized.json に保存しました");
}

main().catch(console.error);
