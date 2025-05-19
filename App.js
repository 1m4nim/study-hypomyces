"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// App.tsx
const react_1 = require("react");
const PhyloTree_1 = __importDefault(require("./PhyloTree"));
const App = () => {
    const [nwk, setNwk] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        fetch("/hypomyces_tree.nwk")
            .then((res) => {
            if (!res.ok)
                throw new Error("Failed to load NWK file");
            return res.text();
        })
            .then((text) => setNwk(text))
            .catch((err) => console.error(err));
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ style: { padding: 20 } }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Hypomyces \u7CFB\u7D71\u6A39" }), nwk ? ((0, jsx_runtime_1.jsx)(PhyloTree_1.default, { nwkText: nwk, width: 900, height: 700 })) : ((0, jsx_runtime_1.jsx)("p", { children: "\u7CFB\u7D71\u6A39\u30D5\u30A1\u30A4\u30EB\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026" }))] })));
};
exports.default = App;
