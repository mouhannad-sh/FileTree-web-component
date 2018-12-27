export default templateNode();

function templateNode() {
  return templateWire;
}
function templateWire(strings, ...values) {
  let output = "";

  if (values.length) {
    Object.keys(values).forEach((k, i) => (output += strings[i] + values[k]));
  }

  output += strings[values.length];

  let lines = output.split(/(?:\r\n|\n|\r)/);
  const template = lines
    .map(line => {
      return line.replace(/(^\s+|\s+$)/gm, "").replace(/>\s+/gm, ">");
    })
    .join(" ")
    .trim();
  return template;
}
