import * as fs from "fs";

type DataEntry = [string, string[]];

// ファイル読み込み
const rawText = fs.readFileSync("./hypomyces_tree.nwk", "utf-8");

// 行ごとに分割し空行除去
const lines = rawText
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

// 1行ごとに親子のパース
function parseLine(line: string): DataEntry | null {
  // 例: 'Hypomyces boletuphus'('Boletaceae sp.'),
  // 正規表現で親と子を抜き出す
  const regex = /^'([^']+)'\(([^)]+)\),?$/;
  const match = regex.exec(line);
  if (!match) return null;
  const parent = match[1];
  // 子をカンマ区切りで分割し、それぞれのシングルクォートを除去
  const childrenRaw = match[2];
  const children = childrenRaw
    .split(",")
    .map((s) => s.trim().replace(/^'|'$/g, ""));
  return [parent, children];
}

const data: DataEntry[] = [];
for (const line of lines) {
  const entry = parseLine(line);
  if (entry) data.push(entry);
}

// 名前をNewick用にクリーニング（空白・記号→アンダースコア、小文字化）
function cleanName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[ ,():.-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Newick形式に変換
function toNewick(taxon: string, children: string[]): string {
  if (children.length === 0) {
    return cleanName(taxon);
  }
  const childrenNewick = children.map(cleanName).join(",");
  return `(${childrenNewick})${cleanName(taxon)}`;
}

// 全体を大括弧でくくる
function buildNewick(dataList: DataEntry[]): string {
  const entries = dataList.map(([taxon, children]) =>
    toNewick(taxon, children)
  );
  return `(${entries.join(",")});`;
}

const newickStr = buildNewick(data);

console.log(newickStr);

fs.writeFileSync("converted_tree.nwk", newickStr, "utf-8");
