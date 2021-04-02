const md = require('markdown-it')();

const str = `
:::str


:::

`;

console.log(md.render(str));
