import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const IMAGE_WIDTH = 1200 // intended as 2x var(--pane-width)
const index = JSON.parse(fs.readFileSync('index.json', 'utf-8'))

for (const [slug, metadata] of Object.entries(index)) {
    if (metadata.type !== 'photo'  ) continue // skip non-photo notes

    // Update image embed to match filename
    let note = fs.readFileSync(path.join(__dirname, metadata.path), 'utf-8')
    const embedMatch = note.match(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/)
    if (!embedMatch) continue
    const [match, filename, alt] = note.match(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/)
    if (filename === `${slug}.jpg`) continue // skip if already processed

    note = note.replace(match, `![[${slug}.jpg|${alt||''}]]`)
    fs.writeFileSync(path.join(__dirname, metadata.path), note)

    // resize, rename, and strip exifs
    await sharp(path.join(__dirname, 'images', filename))
        .resize(IMAGE_WIDTH)
        .keepIccProfile()
        .jpeg({ quality: 80 })
        .toFile(path.join(__dirname, 'images', `${slug}.jpg`))
}

// delete old files
const images = fs.readdirSync(path.join(__dirname, 'images'))
for (const file of images) {
    if (file.startsWith('PXL')) {
        fs.unlinkSync(path.join(__dirname, 'images', file))
    }
}

