function extractAllText(str) {
  const re = /'(.*?)'/g;
  const result = [];
  let current;
  while ((current = re.exec(str))) {
    result.push(current.pop());
  }
  return result.length > 0 ? result : [str];
}

module.exports = {
  extractAllText: extractAllText
};
