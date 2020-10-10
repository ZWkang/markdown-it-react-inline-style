const { strictEqual } = require("assert");
const md = require("markdown-it")();
const MarkdownItReactInlineStyle = require(".");

strictEqual(
	md
		.use(MarkdownItReactInlineStyle, "", { reactEnv: true, escape: false })
		.render(
			`
|aaa|aaa|
|:---|:---|
`
		)
		.replace(/[.\n]/g, ""),
	`<table><thead><tr><th style={{"textAlign": "left"}}>aaa</th><th style={{"textAlign": "left"}}>aaa</th></tr></thead><tbody></tbody></table>`
);
