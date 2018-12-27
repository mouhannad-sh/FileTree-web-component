function parentsList(target, breakRule) {
  let nodes = [];
  nodes.push(target);
  while (target && !!breakRule(target)) {
    nodes.unshift(target.parentNode);
    target = target.parentNode;
  }
  return nodes;
}
export default function findParent(target, rule) {
  const node = parentsList(target, target => !rule(target))[0];
  return !node || node.documentElement ? false : node;
}
