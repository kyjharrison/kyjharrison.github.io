import * as yaml from 'js-yaml'

export function splitFrontmatter(text) {
    const delimiter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!delimiter) return { frontmatter: {}, body: text}

    const frontmatter = yaml.load(delimiter[1]) || {}
    const body = text.slice(delimiter[0].length).trim()
    return { frontmatter, body} 
}

export function slugify(title) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}