function renderKatex(md) {
    const katex = require('katex')

    let katexDia = []
    for(let i = 0; i < md.length; ++i) {
        if(md[i] == '$') {
            katexDia.push(i)
        }
    }
    let mv = 0      // warning overflow
    for(let i = 0; i < katexDia.length; i += 2) {
        let originString = md.substring(katexDia[i]+1+mv, katexDia[i+1]+mv)
        let katexString = katex.renderToString(originString, {
            throwOnError: false
        });
        md = md.replace(md.substring(katexDia[i]+mv, katexDia[i+1]+1+mv), katexString)
        mv += katexString.length-(katexDia[i+1]-katexDia[i]+1)
    }
    return md
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
            headings[i].innerHTML += ' '
            headings[i].innterHTML += `<a id="${headings[i].textContent}" href="#${headings[i].textContent}"><img src="svg/link" alt="linkSvg"></img></a>`
        }
    })

    return doc
}


export function renderMdToHtml(mdString, withIndent=false) {
    const DomParser = require('dom-parser')
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

    const htmlParser = new DomParser()
    let mdHTML = md.render(mdString)

    if(withIndent)
        mdHTML = `<div class="markdown-body markdown-indent" id="markdown-body">${renderKatex(mdHTML)}</div>`
    else
        mdHTML = `<div class="markdown-body" id="markdown-body">${renderKatex(mdHTML)}</div>`
    mdHTML = htmlParser.parseFromString(mdHTML)
    //mdHTML = addMdTag(mdHTML)
    return mdHTML.getElementById('markdown-body').outerHTML
}