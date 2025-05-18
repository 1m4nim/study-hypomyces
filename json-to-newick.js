"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
function escapeName(name) {
    // シングルクォートで囲み、内部のシングルクォートは \' に置換
    return "'".concat(name.replace(/'/g, "\\'"), "'");
}
function buildNewickForSpecies(species, hosts) {
    var escSpecies = escapeName(species);
    var escHosts = hosts.map(escapeName).join(",");
    return "".concat(escSpecies, "(").concat(escHosts, ");");
}
function main() {
    var jsonPath = path.resolve(__dirname, "organized.json");
    var raw = fs.readFileSync(jsonPath, "utf-8");
    var data = JSON.parse(raw);
    var trees = [];
    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
        var _b = _a[_i], species = _b[0], hostDict = _b[1];
        var hosts = [];
        for (var _c = 0, _d = Object.entries(hostDict); _c < _d.length; _c++) {
            var _e = _d[_c], hostName = _e[0], records = _e[1];
            if (records.length > 0)
                hosts.push(hostName);
        }
        if (hosts.length > 0) {
            trees.push(buildNewickForSpecies(species, hosts));
        }
    }
    // すべてをルートでまとめる
    var combined = "(".concat(trees.map(function (t) { return t.replace(/;$/, ""); }).join(","), ");\n");
    fs.writeFileSync(path.resolve(__dirname, "hypomyces_tree.nwk"), combined, "utf-8");
    console.log("hypomyces_tree.nwk に Newick 形式ツリーを出力しました。");
}
main();
