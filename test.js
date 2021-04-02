const { strictEqual } = require('assert');
const md = require('markdown-it')();
const MarkdownItReactInlineStyle = require('.');

// strictEqual(
//   md
//     .use(MarkdownItReactInlineStyle, '', { reactEnv: true, escape: false })
//     .render(
//       `
// |aaa|aaa|
// |:---|:---|
// `
//     )
//     .replace(/[.\n]/g, ''),
//   `<table><thead><tr><th style={{textAlign: 'left'}}>aaa</th><th style={{textAlign: 'left'}}>aaa</th></tr></thead><tbody></tbody></table>`
// );

strictEqual(
  md
    .use(MarkdownItReactInlineStyle, '', { reactEnv: false, escape: false })
    .render(
      `
|aaa|aaa|
|:---|:---|
`
    )
    .replace(/[.\n]/g, ''),
  `<table><thead><tr><th style="text-align:left">aaa</th><th style="text-align:left">aaa</th></tr></thead><tbody></tbody></table>`
);
