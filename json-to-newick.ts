import * as fs from "fs";
import * as path from "path";

function escapeName(name: string): string {
  // シングルクォートで囲み、内部のシングルクォートは \' に置換
  return `'${name.replace(/'/g, `\\'`)}'`;
}

function buildNewickForSpecies(species: string, hosts: string[]): string {
  const escSpecies = escapeName(species);
  const escHosts = hosts.map(escapeName).join(",");
  return `${escSpecies}(${escHosts});`;
}

function main() {
  const jsonPath = path.resolve(__dirname, "organized.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data: Record<string, Record<string, any[]>> = JSON.parse(raw);

  const trees: string[] = [];
  for (const [species, hostDict] of Object.entries(data)) {
    const hosts: string[] = [];
    for (const [hostName, records] of Object.entries(hostDict)) {
      if (records.length > 0) hosts.push(hostName);
    }
    if (hosts.length > 0) {
      trees.push(buildNewickForSpecies(species, hosts));
    }
  }

  // すべてをルートでまとめる
  const combined = `(${trees.map((t) => t.replace(/;$/, "")).join(",")});\n`;

  fs.writeFileSync(
    path.resolve(__dirname, "hypomyces_tree.nwk"),
    combined,
    "utf-8"
  );
  console.log("hypomyces_tree.nwk に Newick 形式ツリーを出力しました。");
}

main();
