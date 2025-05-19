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
const jsx_runtime_1 = require("react/jsx-runtime");
// PhyloTree.tsx
const react_1 = require("react");
const d3 = __importStar(require("d3"));
const newick_js_1 = require("newick-js");
// RawNode → TreeNode に変換
const toTreeNode = (node) => ({
    name: node.name || "",
    length: node.length,
    children: node.branchset // newick-js の branchset
        ? node.branchset.map(toTreeNode)
        : undefined,
});
const PhyloTree = ({ nwkText, width = 800, height = 600 }) => {
    const svgRef = (0, react_1.useRef)(null);
    const [root, setRoot] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        try {
            // parse の返り値を any で受けてマッピング
            const raw = (0, newick_js_1.parse)(nwkText);
            setRoot(toTreeNode(raw));
        }
        catch (err) {
            console.error(err);
        }
    }, [nwkText]);
    (0, react_1.useEffect)(() => {
        if (!root || !svgRef.current)
            return;
        const hierarchy = d3
            .hierarchy(root, (d) => d.children)
            .sum(() => 1);
        const treeLayout = d3.tree().size([height - 40, width - 100]);
        const treeData = treeLayout(hierarchy);
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        svg
            .append("g")
            .attr("transform", "translate(50,20)")
            .selectAll("path")
            .data(treeData.links())
            .enter()
            .append("path")
            .attr("d", d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x))
            .attr("fill", "none")
            .attr("stroke", "#555");
        const nodeG = svg
            .append("g")
            .attr("transform", "translate(50,20)")
            .selectAll("g")
            .data(treeData.descendants())
            .enter()
            .append("g")
            .attr("transform", (d) => `translate(${d.y},${d.x})`);
        nodeG
            .append("circle")
            .attr("r", 3)
            .attr("fill", (d) => (d.children ? "#555" : "#999"));
        nodeG
            .append("text")
            .attr("dx", (d) => (d.children ? -8 : 8))
            .attr("dy", 3)
            .attr("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d) => d.data.name);
    }, [root, width, height]);
    return ((0, jsx_runtime_1.jsx)("svg", { ref: svgRef, width: width, height: height, style: { border: "1px solid #ccc" } }));
};
exports.default = PhyloTree;
