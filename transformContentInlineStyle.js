// work in markdown-it table render
// it will have some table element use style=""

const styleTagReg = /style="([^\"]*?)"/g;

module.exports = {
  transformContentInlineStyle,
  transform2CamelCase,
  rowStyleToObjectStyle,
  transformObject2String,
};

function transform2CamelCase(string) {
  return string.replace(/-(.)/g, function (match, chr) {
    return chr.toUpperCase();
  });
}

function rowStyleToObjectStyle(rawStyle) {
  const styles = {};
  const rawStyles = rawStyle.split(';');
  rawStyles.forEach((style) => {
    style = style.trim();
    const firstColon = style.indexOf(':');
    let key = style.substr(0, firstColon).trim();
    const value = style.substr(firstColon + 1).trim();
    if (key !== '' && value !== '') {
      // Style key should be case insensitive
      styles[key.toLowerCase()] = value;
    }
  });

  return styles;
}

function transformContentInlineStyle(str) {
  if (typeof str !== 'string') return str;

  return str.replace(styleTagReg, (matchText) => {
    const [, style] = styleTagReg.exec(matchText);

    const o = rowStyleToObjectStyle(style);
    const l = [];

    Object.keys(o).forEach((oo) => {
      l.push(`${transform2CamelCase(oo)}: '${o[oo]}'`);
    });

    return `style={{${l.join(', ')}}}`;
  });
}

function transformObject2String(o) {
  const l = [];

  Object.keys(o).forEach((oo) => {
    if (typeof o[oo] !== 'string') {
      return;
    }
    l.push(`${transform2CamelCase(oo)}: '${o[oo]}'`);
  });
  return l.join(', ');
}
