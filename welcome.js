import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const template = fs.readFileSync('template.html', 'utf-8')
const index = JSON.parse(fs.readFileSync('index.json', 'utf-8'))

const body = `
<h1>welcome</h1>
<p>Instead of teleporting to a new page with every link, what if the visible trails of our wanderings unrolled behind us?</p>
<p>Here, they do.</p>
<p>None of the existing sliding-pane implementations captured my vision, so I learned just enough JavaScript to do something about it.</p>
<p>Here are some photos I'm proud of. Have a wander. </p>
<p> ~ Ky</p>
<div class="photo-grid">
    <a href="/mushroom-tree" class="thumbnail"><img src="/images/mushroom-tree.jpg" alt="mushroom tree"></a>
    <a href="/thistle" class="thumbnail"><img src="/images/thistle.jpg" alt="thistle"></a>
    <a href="/raccoon" class="thumbnail"><img src="/images/raccoon.jpg" alt="raccoon"></a>
</div>
<p style="text-align: right"><a href="/photos">all →</a></p>
`

const page = template
    .replace(`<!--{title}-->`, `welcome | `)
    .replace(`<!--{pane}-->`, `<article class="pane">${body}<footer class="note-footer"></footer></article>`)

const dir = path.join(__dirname, 'build', 'welcome')
fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(path.join(dir, 'index.html'), page)

// add itself to the index 
index['welcome'] = {
    slug: 'welcome',
    title: 'welcome',
    path: null,
    type: 'page',
    published: null,
}
fs.writeFileSync('index.json', JSON.stringify(index, null, 2))