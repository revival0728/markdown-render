# markdown-render
This markdown render support `katex`, `emoji`, **spoiler container** and automatically add **heading link**. (based on markdown-it)

## Installation
```
npm install @revival0728/markdown-render
```

## Adding CSS
To add CSS to your web page.

use

```css
@import url('https://cdn.jsdelivr.net/npm/@revival0728/markdown-render@1.0.0/index.css');
```
in your global css

or

```js
import 'node_modules/@revival0728/markdown-render/index.css'
```
in your javascript file

## Usage
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

## Katex Support
Only support **$** when rendering the katex syntax

```markdown
$e^{i\pi} + 1 = 0$
```
$e^{i\pi} + 1 = 0$

```markdown
$
x = \begin{cases}
   x \quad \text{if } x \geq 0 \\\\
   -x \quad \text{if } x \lt 0
\end{cases}
$
```
$
x = \begin{cases}
   x \quad \text{if } x \geq 0 \\
   -x \quad \text{if } x \lt 0
\end{cases}
$

To show character **\$** in your markdown content, use **\\\\$** instead.

## Code Box Highlight and Line Numbers
If you want to highlight the code in a code box, add the language name after the code box syntax.

The `<codebox>` below represents the code box syntax

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

## Example
Try and see the example markdown at [this web site](https://revival0728-markdown-render.vercel.app)