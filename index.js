function replaceByIndex(str, l, r, newStr) {
    return str.slice(0, l) + newStr + str.slice(r+1)
}

function renderKatex(html) {
    const katex = require('katex')

    let allP = html.getElementsByTagName('p')
    for(let i = 0; i < allP.length; i++) {
        md = allP[i].innerHTML
        let katexDia = []
        for(let i = 0; i < md.length; ++i) {
            if(md[i] == '$') {
                if(i-1 >= 0) {
                    if(md[i-1] == '\\') {
                        md = replaceByIndex(md, i-1, i-1, '')
                        continue
                    }
                }
                katexDia.push(i)
            }
        }
        let mv = 0      // warning overflow
        for(let i = 0; i < katexDia.length; i += 2) {
            let originString = md.substring(katexDia[i]+1+mv, katexDia[i+1]+mv)
            let katexString = katex.renderToString(originString, {
                throwOnError: false
            });
            md = replaceByIndex(md, katexDia[i]+mv, katexDia[i+1]+mv, katexString)
            mv += katexString.length-(katexDia[i+1]-katexDia[i]+1)
        }
        allP[i].set_content(md)
    }
    return html
}

function getDigitLength(number) {
    return Math.floor(Math.log(number)/Math.log(10)) + 1
}

function addLineNumbers(code) {
    const lines = code.split('\n')

    const maxDigitLength = getDigitLength(lines.length)

    const rows = lines.map((line, idx) => {
        const lineNumber = idx + 1
        const lineNumberDigitLength = getDigitLength(lineNumber)

        return `<span class="lineNumber">${' '.repeat(maxDigitLength-lineNumberDigitLength)}${lineNumber}</span><span>${line}</span>`
    })

    rows.pop()
    return rows.join('\n')
}

function addMdTag(doc) {

    let headingTags = ['h1', 'h2', 'h3']
    
    headingTags.forEach((tag) => {
        let headings = doc.getElementsByTagName(tag)

        for (let i = 0; i < headings.length; i++) {
            headings[i].set_content(`${headings[i].textContent} <a id="${headings[i].textContent}" href="#${headings[i].textContent}"><i class="bi bi-link" style="color: rgb(26, 83, 255);"></i></a>`)
        }
    })

    return doc
}

function setAutoChangeLine(mdString) {
    let lines = mdString.split('\n')
    let res = ''
    let changeLine = true
    for(let i = 0; i < lines.length; i++) {
        if(lines[i].indexOf('```') != -1)
            changeLine = !changeLine
        if(changeLine)
            res += lines[i] + '\n\n'
        else
            res += lines[i] + '\n'
    }
    return res
}

exports.renderMdToHtml = function renderMdToHtml(mdString, options={}) {
    const htmlParser = require('node-html-parser')
    const matter = require('gray-matter')
    const hljs = require('highlight.js')
    const emoji = require('markdown-it-emoji')
    const container = require('markdown-it-container')
    const md = require('markdown-it')({
        highlight: function(str, lang, attrRaw = '') {
            const attrs = attrRaw.split(/\s+/g)
            const showLineNumbers = attrs.includes(':setNumber')

            if (lang && hljs.getLanguage(lang)) {
                try {
                    let code = hljs.highlight(str, { language: lang }).value

                    if(showLineNumbers) {
                        code = addLineNumbers(code)
                    }

                    return code
                } catch (__) {}
            }

            return ''; // use external default escaping
        }
    })
    .use(emoji)
    .use(container, 'spoiler', {
        validata: function(params) {
            return params.trim().match(/^spoiler\s+(.*)$/)
        },

        render: function(tokens, idx) {
            let m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/)

            if(tokens[idx].nesting == 1) {
                return '<details><summary>' + md.renderInline(md.utils.escapeHtml(m[1])) + '</summary>\n'
            } else {
                return '</details>\n'
            }
        }
    })

    // set default option value
    if(!('autoChangeLine' in options))
        options.autoChangeLine = false
    if(!('withIndent' in options))
        options.autoChangeLine = false

    let matterResult = matter(mdString)

    mdString = matterResult.content

    if(options.autoChangeLine)
        mdString = setAutoChangeLine(mdString)

    let mdHTML = md.render(mdString)
    if(options.withIndent)
        mdHTML = `<div class="markdown-body markdown-indent" id="markdown-body">${mdHTML}</div>`
    else
        mdHTML = `<div class="markdown-body" id="markdown-body">${mdHTML}</div>`
    mdHTML = htmlParser.parse(mdHTML)
    mdHTML = mdHTML.getElementById('markdown-body')

    mdHTML = renderKatex(mdHTML)
    mdHTML = addMdTag(mdHTML)

    return {
        content: mdHTML.outerHTML,
        data: matterResult.data
    }
}