export type TreeNode = {
  name?: string;
  children?: TreeNode[];
};

export function parseNewick(newick: string): TreeNode {
  let index = 0;

  function parseNode(): TreeNode {
    let node: TreeNode = {};
    if (newick[index] === "(") {
      index++;
      node.children = [];
      while (newick[index] !== ")") {
        node.children.push(parseNode());
        if (newick[index] === ",") index++;
      }
      index++;
    }

    let name = "";
    while (index < newick.length && ![",", ")", ";"].includes(newick[index])) {
      name += newick[index];
      index++;
    }
    if (name.trim().length > 0) node.name = name.trim();

    return node;
  }

  return parseNode();
}
