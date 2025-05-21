// PhyloTree.tsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { parse } from "newick-js";

// newick-js の出力を any で受ける
type RawNode = any;

interface TreeNode {
  name: string;
  length?: number;
  children?: TreeNode[];
}

// RawNode → TreeNode に変換
const toTreeNode = (node: RawNode): TreeNode => ({
  name: node.name || "", // newick-js の name
  length: node.length, // ブランチ長
  children: node.branchset // newick-js の branchset
    ? (node.branchset as RawNode[]).map(toTreeNode)
    : undefined,
});

const PhyloTree: React.FC<{
  nwkText: string;
  width?: number;
  height?: number;
}> = ({ nwkText, width = 800, height = 600 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [root, setRoot] = useState<TreeNode | null>(null);

  useEffect(() => {
    try {
      // parse の返り値を any で受けてマッピング
      const raw = parse(nwkText) as RawNode;
      setRoot(toTreeNode(raw));
    } catch (err) {
      console.error(err);
    }
  }, [nwkText]);

  useEffect(() => {
    if (!root || !svgRef.current) return;

    const hierarchy = d3
      .hierarchy<TreeNode>(root, (d) => d.children)
      .sum(() => 1);
    const treeLayout = d3.tree<TreeNode>().size([height - 40, width - 100]);
    const treeData = treeLayout(hierarchy);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // フィルター定義をここで追加
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "outline");
    filter
      .append("feDropShadow")
      .attr("dx", 0)
      .attr("dy", 0)
      .attr("stdDeviation", 1)
      .attr("flood-color", "white");

    svg
      .append("g")
      .attr("transform", "translate(50,20)")
      .selectAll("path")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .linkHorizontal<
            d3.HierarchyPointLink<TreeNode>,
            d3.HierarchyPointNode<TreeNode>
          >()
          .x((d) => d.y)
          .y((d) => d.x)
      )
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
      .attr("fill", "#111")
      .attr("filter", "url(#outline)")
      .text((d) => d.data.name);
  }, [root, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ border: "1px solid #ccc" }}
    />
  );
};

export default PhyloTree;
