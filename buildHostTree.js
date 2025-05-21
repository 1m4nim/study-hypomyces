const fs = require("fs");

// 読み込み
const hosts = JSON.parse(fs.readFileSync("hosts.json", "utf-8"));

// 不要な空白や改行を削除して正規化
function clean(str) {
  return str.trim().replace(/\s+/g, " ");
}

// 属名の揺れを統一する（スペルミス訂正など）
function normalizeGenus(genus) {
  const corrections = {
    Lactrarius: "Lactarius",
    // 必要に応じて追加可能
  };
  return corrections[genus] || genus;
}

// ホストリストを木構造に変換
function buildHostTree(data) {
  const genusMap = {};

  for (const item of data) {
    const name = clean(item.host || "");

    // 無効な名前はスキップ
    if (!name || name === "sp.") continue;

    let genus = "";
    let species = "sp.";

    const words = name.split(" ");

    if (words.length === 1) {
      genus = normalizeGenus(words[0]);
    } else if (words.length >= 2) {
      genus = normalizeGenus(words[0]);
      species = words.slice(1).join(" ");
    }

    if (!genus) continue;

    if (!genusMap[genus]) {
      genusMap[genus] = new Set();
    }

    genusMap[genus].add(species);
  }

  const tree = {
    name: "Hosts",
    children: Object.entries(genusMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([genus, speciesSet]) => ({
        name: genus,
        children: Array.from(speciesSet)
          .sort()
          .map((species) => ({ name: species })),
      })),
  };

  return tree;
}

// 実行・保存
const tree = buildHostTree(hosts);

// JSONファイルとして保存
fs.writeFileSync("tree.json", JSON.stringify(tree, null, 2), "utf-8");
console.log("tree.json を出力しました！");
