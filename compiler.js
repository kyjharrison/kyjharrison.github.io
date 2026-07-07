import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { marked } from 'marked'
import { splitFrontmatter } from './utils.js'
import { slugify } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const template = fs.readFileSync('index.html', 'utf-8')
const index = JSON.parse(fs.readFileSync('index.json', 'utf-8'))

for (const [slug, metadata] of Object.entries(index)) {

    // read note into memory and discard frontmatter
    const raw = fs.readFileSync(path.join(__dirname, metadata.path), 'utf-8')
    let { body } = splitFrontmatter(raw)

    // insert filename title as h1
    body = `# ${metadata.title}\n\n${body}`

    // look for obsidian image embeds like ![[image.jpg|alt text]]
    // convert to html image embeds with alt text
    // if photo page, wrap <img> in <figure> tags
    // TODO refine nuance of which pages get <figure> tags
    // if not photo page (eg gallery) wrap <img> in link to the photo page 
    body = body.replace(
        /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, 
        (match, filename, alt) => {
            const imageSlug = slugify(filename.replace(/\.[^.]+$/, '')) // strips file extension and any non-slug chars
            const entry = index[imageSlug]
            if (!entry) {
                console.warn(`Image not found in index: ${imageSlug}`)
                return `${filename} not found.`
            }
            const img = `<img src="/images/${filename}" alt="${alt||''}">`
            if (metadata.type === 'photo') return `<figure>${img}</figure>` 
            return `<a href="/${imageSlug}">${img}</a>`
        })

    // look for the closing </figure> tag left by the previous step 
    // if followed by a `> [!caption]` blockquote, insert that as the <figcaption>
    body = body.replace(
        /<\/figure>\n+> \[!caption\]\n((?:> [^\n]*\n?)*)/gm,
        (match, captionLines) => {
            const caption = captionLines
                .split('\n')
                .map(line => line.replace(/^> /, ''))
                .filter(line => line.length > 0)
                .join('\n')
            return `<figcaption>${caption}</figcaption></figure>`
        })

    // find obsidian wikilinks and turn into standard markdown links for the markdown parser
    body = body.replace(
        /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, // finds [[link|alias]]
        (match, link, alias) => {
            const slug = slugify(link)
            return `[${alias || link }](/${slug})`
        })

    const page = template
        .replace(`{{title}}`, metadata.title)
        .replace(`{{body}}`, marked(body))

    const dir = path.join(__dirname, 'build', slug)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), page)
}


