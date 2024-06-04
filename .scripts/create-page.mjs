import process from 'node:process'
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { globSync } from 'glob'

const resolve = (p) => fileURLToPath(new URL(p, import.meta.url))
const pageName = process.argv[2]

if (!pageName) {
  genHome()
} else {
  const isExists = fs.existsSync(resolve(`../pages/${pageName}`))
  if (isExists) {
    console.log(`${pageName}已存在`)
  } else {
    fs.mkdirSync(resolve(`../pages/${pageName}`))
    genPage()
  }
  genHome()
}

function genHome() {
  const pages = globSync('./*.html', {
    cwd: resolve('../'),
  })
    .filter((v) => !v.startsWith('index'))
    .sort(new Intl.Collator('zh').sort)
  const homeHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/picocss/2.0.6/pico.min.css" />
    <title>Paint</title>
    <style>
      a {
        display: block;
        margin: 0.5rem;
      }
    </style>
  </head>
  <body>
    ${pages.map((v) => `<a href="./${v}">${v.replace(/^(.*)\.html/, '$1')}</a>`).join('\n    ')}
  </body>
</html>
`

  fs.writeFileSync(resolve(`../index.html`), homeHtml)
}

function genPage() {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/pages/${pageName}/main.js"></script>
  </body>
</html>
`

  const mainCss = `html,
body {
  background-color: #2d313c;
  color: #fcfff5;
}
`

  const mainJs = `import './main.css'
const app = document.querySelector('#app')
app.innerHTML = '${pageName}'
`

  fs.writeFileSync(resolve(`../${pageName}.html`), indexHtml)
  fs.writeFileSync(resolve(`../pages/${pageName}/main.css`), mainCss)
  fs.writeFileSync(resolve(`../pages/${pageName}/main.js`), mainJs)
}
