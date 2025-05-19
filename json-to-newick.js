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
function escapeName(name) {
    // シングルクォートで囲み、内部のシングルクォートは \' に置換
    return `'${name.replace(/'/g, `\\'`)}'`;
}
function buildNewickForSpecies(species, hosts) {
    const escSpecies = escapeName(species);
    const escHosts = hosts.map(escapeName).join(",");
    return `${escSpecies}(${escHosts});`;
}
function main() {
    const jsonPath = path.resolve(__dirname, "organized.json");
    const raw = fs.readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(raw);
    const trees = [];
    for (const [species, hostDict] of Object.entries(data)) {
        const hosts = [];
        for (const [hostName, records] of Object.entries(hostDict)) {
            if (records.length > 0)
                hosts.push(hostName);
        }
        if (hosts.length > 0) {
            trees.push(buildNewickForSpecies(species, hosts));
        }
    }
    // すべてをルートでまとめる
    const combined = `(${trees.map((t) => t.replace(/;$/, "")).join(",")});\n`;
    fs.writeFileSync(path.resolve(__dirname, "hypomyces_tree.nwk"), combined, "utf-8");
    console.log("hypomyces_tree.nwk に Newick 形式ツリーを出力しました。");
}
main();
