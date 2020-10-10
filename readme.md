# markdown it react inline style to react object style style

> inline style -> object style

## WHY

When we use markdown to use table, we will find that it will generate some attributes, similar to `<th style="float: left">`

When these dom strings are directly applied to react, errors will occur, so here is a layer of conversion. inline style -> object style

当我们使用 markdown 使用 table 的时候 我们会发现它会产生一下 attribute，类似 `<th style="float: left">`

当这些 dom string 直接应用到 react 上时 会产生错误，所以这里加一层转换。 inline style -> object style

```html
<th style="float: left"></th>
```

```jsx
<th style={{ float: 'left' }}></th>
```

## usage

```js

md.use(require("markdown-it-react-inline-style), "", {
    reactEnv: boolean,
    escape: boolean,
    renderAttrs: callback,
    content: callback
})

```

## license

[MIT](./License)
