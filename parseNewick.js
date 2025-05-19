"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNewick = void 0;
function parseNewick(newick) {
    let index = 0;
    function parseNode() {
        let node = {};
        if (newick[index] === "(") {
            index++;
            node.children = [];
            while (newick[index] !== ")") {
                node.children.push(parseNode());
                if (newick[index] === ",")
                    index++;
            }
            index++;
        }
        let name = "";
        while (index < newick.length && ![",", ")", ";"].includes(newick[index])) {
            name += newick[index];
            index++;
        }
        if (name.trim().length > 0)
            node.name = name.trim();
        return node;
    }
    return parseNode();
}
exports.parseNewick = parseNewick;
