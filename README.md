# markdown-render
A markdown render based on markown-it

## Usage
This markdown render support `katex`, `emoji`, **spoiler container** and automatically add **heading link**.

```js
const mdRender = require('@revival0728/markdown-render');

let renderResult = mdRender.renderMdtoHtml(markdownAsString)
document.getElementById('my-mdContent').innerHTML = renderResult.content
```

It also support adding data before markdown and return the data as key **data** in the return object.

If you render the following markdown text with the code above, you will get the result below.

```markdown
---
tag: 'example'
---
# H1
content
```

```js
{
    content: '<div class="markdown-body" id="markdown-body"><h1>H1 <a id="H1" href="#H1"><i class="bi bi-link" style="color: rgb(26, 83, 255);"></i></a></h1><p>content</p></div>',
    data: {tag: 'example'}
}
```

## About Render Function
The `renderMdtoHtml()` function has two arguments.

1. `mdString`: pass the markdown content as string
2. `options`: pass the object as the options for this function

### About the options object
Below are the supported options

1. `autoChangeLine` (type: boolean): automatically change line when rendering the markdown content
2. `withIndent` (type: boolean): automatically indent the markdown content

The `autoChangeLine` is useful when editing a handout or blog because you don't have to hit the enter key twice.

The `withIndent` is useful when the web page only shows the markdown content.

## Code Box Highlight and Line Numbers
If you want to highlight the code in a code box, add language name after the code box syntax.

The `<codebox>` below represents the syntax **```**

```markdown
<codebox>python
print('hello, world')
<codebox>
```

If you want to add line numbers to the code box, add `:setNumber` after the language name.

```markdown
<codebox>python :setNumber
print('hello, world')
<codebox>
```