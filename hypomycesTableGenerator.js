"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function loadDataFromJson(filePath) {
    var fullPath = path.resolve(filePath);
    var jsonData = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(jsonData);
}
function flattenData(rawData) {
    var flatArray = [];
    for (var hypomyces in rawData) {
        var hostGenusMap = rawData[hypomyces];
        for (var hostGenus in hostGenusMap) {
            var entries = hostGenusMap[hostGenus];
            entries.forEach(function (entry) { return flatArray.push(entry); });
        }
    }
    return flatArray;
}
function generateHtmlTableGrouped(data) {
    // Hypomyces speciesでグループ化
    var grouped = data.reduce(function (acc, entry) {
        if (!acc[entry.hypomyces_species])
            acc[entry.hypomyces_species] = [];
        acc[entry.hypomyces_species].push(entry);
        return acc;
    }, {});
    var html = "\n<!DOCTYPE html>\n<html lang=\"ja\">\n<head>\n<meta charset=\"UTF-8\" />\n<title>Hypomyces Hosts Table (Grouped)</title>\n<style>\n  table { border-collapse: collapse; width: 100%; }\n  th, td { border: 1px solid #444; padding: 8px; text-align: left; }\n  th { background-color: #eee; }\n</style>\n</head>\n<body>\n<h1>Hypomyces Hosts Table (Grouped)</h1>\n<table>\n  <thead>\n    <tr>\n      <th>Hypomyces Species</th>\n      <th>Host Genus</th>\n      <th>Host Species</th>\n      <th>Distribution</th>\n      <th>Source</th>\n      <th>Notes</th>\n    </tr>\n  </thead>\n  <tbody>\n";
    var _loop_1 = function (hypomyces_species, entries) {
        var rowspan = entries.length;
        entries.forEach(function (entry, i) {
            html += "<tr>\n";
            if (i === 0) {
                html += "<td rowspan=\"".concat(rowspan, "\">").concat(hypomyces_species || "", "</td>\n");
            }
            html += "\n      <td>".concat(entry.host_genus || "", "</td>\n      <td>").concat(entry.host_species || "", "</td>\n      <td>").concat(entry.distribution || "", "</td>\n      <td>").concat(entry.source || "", "</td>\n      <td>").concat(entry.notes || "", "</td>\n");
            html += "</tr>\n";
        });
    };
    for (var _i = 0, _a = Object.entries(grouped); _i < _a.length; _i++) {
        var _b = _a[_i], hypomyces_species = _b[0], entries = _b[1];
        _loop_1(hypomyces_species, entries);
    }
    html += "\n  </tbody>\n</table>\n</body>\n</html>\n";
    return html;
}
function main() {
    try {
        // JSONファイル名（カレントディレクトリにorganized.jsonがある想定）
        var inputFile = "organized.json";
        var outputFile = "output.html";
        console.log("Loading data from ".concat(inputFile, "..."));
        var rawData = loadDataFromJson(inputFile);
        console.log("Flattening data...");
        var flatData = flattenData(rawData);
        console.log("Generating HTML grouped table...");
        var html = generateHtmlTableGrouped(flatData);
        console.log("Saving to ".concat(outputFile, "..."));
        fs.writeFileSync(path.resolve(outputFile), html, "utf-8");
        console.log("Done!");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
main();
