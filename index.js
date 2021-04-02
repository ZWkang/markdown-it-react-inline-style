const { escapeHtml } = require('markdown-it/lib/common/utils');
const {
  transformObject2String,
  rowStyleToObjectStyle,
} = require('./transformContentInlineStyle');

const REPLACE_SLOT = 'REPLACE_SLOT';

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
      return '';
    }

    result = '';

    for (i = 0, l = token.attrs.length; i < l; i++) {
      if (token.attrs[i][0] === REPLACE_SLOT && reactEnv) {
        if (!escape) {
          escapeHTML = (v) => v;
        }
        result +=
          ' ' + escapeHTML('style') + '=' + escapeHTML(token.attrs[i][1]);
        continue;
      }
      result +=
        ' ' +
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
    state.tokens = state.tokens
      .map((token) => {
        const { attrs } = token || {};
        if (!reactEnv || !attrs) {
          return token;
        }
        const ats = attrs
          .map((attr) => {
            if (attr) {
              const [style, rules] = attr;
              if (style === REPLACE_SLOT) return false;
              if (style === 'style') {
                let cssObject = rowStyleToObjectStyle(rules);
                return [
                  REPLACE_SLOT,
                  `{{${transformObject2String(cssObject)}}}`,
                ];
              }
            }
            return attr;
          })
          .filter(Boolean);
        token.attrs = ats;
        return token;
      })
      .filter(Boolean);
  };

  md.core.ruler.push('parse_react_inline_style', content || defaultContent);
};
