import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const template = fs.readFileSync('template.html', 'utf-8')
const index = JSON.parse(fs.readFileSync('index.json', 'utf-8'))

const photos = Object.values(index)
    .filter(m => m.type === 'photo')
    .sort((a,b) => {
        const dateA = new Date(a.published || 0)
        const dateB = new Date(b.published || 0)
        return dateB - dateA // reverse chronological
    })
let grid = ''
for (const metadata of photos) {
    const filename = metadata.photos[0]
    grid += `<a href="/${metadata.slug}" class="thumbnail"><img src="/images/${filename}" alt="${metadata.title}"></a>\n`
}
const body = `<h1>photos</h1><div class="photo-grid">${grid}</div>`
const page = template
    .replace(`<!--{title}-->`, `Photos | `)
    .replace(`<!--{body}-->`, body)
    
const dir = path.join(__dirname, 'build', 'photos')
fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(path.join(dir, 'index.html'), page)

// add itself to the index 
index['photos'] = {
    slug: 'photos',
    title: 'Photos',
    path: null,
    type: 'page',
    published: null,
}
fs.writeFileSync('index.json', JSON.stringify(index, null, 2))