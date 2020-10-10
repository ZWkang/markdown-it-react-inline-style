const { escapeHtml } = require("markdown-it/lib/common/utils");

const REPLACE_SLOT = "REPLACE_SLOT";

function object2Stirng(obj) {
	let str = [];
	Object.keys(obj).forEach((key) => {
		str.push('"' + key + '"' + ': "' + obj[key] + '"');
	});
	return str.join(",");
}

const defaultOpts = {
	reactEnv: true,
	escape: false,
	renderAttrs: void 666,
	content: void 666,
};

/**
 *
 * @description markdown-it parse react style inline style 2 object mode
 */
module.exports = function MarkdownItReactInlineStyle(md, name, options) {
	options = Object.assign({}, defaultOpts, options);
	Object.freeze(options);

	const { reactEnv, escape, renderAttrs, content } = options;
	const defaultRenderAttribute = (token) => {
		let escapeHTML = escapeHtml;

		var i, l, result;

		if (!token.attrs) {
			return "";
		}

		result = "";

		for (i = 0, l = token.attrs.length; i < l; i++) {
			if (token.attrs[i][0] === REPLACE_SLOT && reactEnv) {
				if (!escape) {
					escapeHTML = (v) => v;
				}
				result +=
					" " + escapeHTML("style") + "=" + escapeHTML(token.attrs[i][1]);
				continue;
			}
			result +=
				" " +
				escapeHTML(token.attrs[i][0]) +
				'="' +
				escapeHTML(token.attrs[i][1]) +
				'"';
		}
		return result;
	};

	md.renderer.renderAttrs = renderAttrs || defaultRenderAttribute;

	// O3 is too bad TAT
	const defaultContent = (state) => {
		const tokens = state.tokens;
		state.tokens = tokens.map((token) => {
			if (!reactEnv) return false;
			const { attrs } = token;
			if (!attrs) return token;
			const ats = attrs.map((attr) => {
				const [style, rules] = attr;
				const cssRules = rules.split(";");
				if (style === REPLACE_SLOT) return false;

				if (style === "style") {
					let cssObject = {};
					cssRules.map((cssRule) => {
						const [left, right] = cssRule.split(":");
						const RemoveSpaceLeft = left.replace(/\s/g, "");
						const RemoveSpaceRight = right.replace(/\s/g, "");
						const CamelCaseLeftKey = RemoveSpaceLeft.replace(/-(\w)/g, (v) =>
							RegExp.$1.toUpperCase()
						);
						cssObject[CamelCaseLeftKey] = RemoveSpaceRight;
					});
					return [REPLACE_SLOT, `{{${object2Stirng(cssObject)}}}`];
				}
				return attr;
			});
			token.attrs = ats;
			return token;
		});
	};

	md.core.ruler.push("parse_2_react_inline_style", content || defaultContent);
};
