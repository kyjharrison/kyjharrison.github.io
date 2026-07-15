import fs from 'fs'
import path from 'path'
import * as yaml from 'js-yaml'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { splitFrontmatter } from './utils.js'
import { slugify } from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const NOTES_DIR = path.join(__dirname, 'notes')
const OUTPUT = path.join(__dirname, 'index.json')

const LINK = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g
const PHOTO = /!\[\[([^\]|]+)/g

function listLinks(body) {
    const links = []
    let l 
    while ((l = LINK.exec(body)) !== null) {
        links.push(l[1])
    }
    return links
}

function listPhotos(body) {
    const photos = []
    let p
    while ((p = PHOTO.exec(body)) !== null) {
        photos.push(p[1])
    }
    return photos
}

// walk through all files in NOTES_DIR
const files = fs.readdirSync(NOTES_DIR)
const index = {}

// extract metadata from frontmatter and links
for (const f of files) {
    const title = path.basename(f, '.md')
    const slug = slugify(title) 
    const raw = fs.readFileSync(path.join(NOTES_DIR, f), 'utf-8')
    const { frontmatter, body } = splitFrontmatter(raw)

    index[slug] = {
        slug: slug, 
        title: title,
        path: `notes/${f}`,
        type: frontmatter.type, 
        series: frontmatter.series || [], 
        published: frontmatter['date-published'] || null, 
        last_updated: frontmatter['date-last-modified'] || null,
        links: listLinks(body),
        backlinks: [],
        photos: listPhotos(body), 
        photo_embedded_in: []
    }
}

// second pass to build backlink list
for (const [slug, metadata] of Object.entries(index)) {
    for (const link of metadata.links) {
        if (index[slugify(link)]) {
        index[slugify(link)].backlinks.push(slug)
    }
    }
    for (const photo of metadata.photos) {
        if (index[slugify(photo)]) {
            index[slugify(photo)].photo_embedded_in.push(slug)
        }
    }
}

fs.writeFileSync(OUTPUT, JSON.stringify(index, null, 2))
console.log(`Indexed ${files.length} notes → ${OUTPUT}`)
