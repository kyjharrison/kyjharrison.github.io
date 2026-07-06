import '@fontsource-variable/recursive/full.css'
import { marked } from 'marked'
import { splitFrontmatter } from './utils.js'
import { slugify } from './utils.js'

const main = document.querySelector('main')

const index = await fetch('./index.json').then(r => r.json())

const openPanes = new Map()

const PANE_WIDTH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--pane-width')
)

// takes a note slug, fetches content, creates a new pane
async function renderPane(slug) {
    const path = index[slug].path
    const response = await fetch(path)
    const raw = await response.text()
    const { body } = splitFrontmatter(raw)

    const cleaned = body
        // turn obsidian-embedded images into html embeds linking to the image pages
        .replace(
            /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, // looks for embeds like ![[image.jpg|alt text]]
            (match, filename, alt) => {
                const photoSlug = slugify(filename.replace(/\.[^.]+$/, '')) // strips file extension
                const entry = index[photoSlug]
                if (!entry) {
                    console.warn(`Image not found in index: ${photoSlug}`)
                    return ''
                }
                return `<a href="./${photoSlug}"><img src="photos/${filename}" alt="${alt||''}"></a>`
            })
        // turn obsidian wikilinks into markdown links
        .replace(
        /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, // finds [[link|alias]]
        (match, link, alias) => {
            const slug = slugify(link)
            return `[${alias || link }](./${slug})`
        })

    const pane = document.createElement('article')
    pane.className = "pane"
    pane.innerHTML = marked(cleaned) // feed the cleaned note body through the markdown-to-html parser and dump it into the pane  
    return pane
}

function updateURL() {
    const path = '/' + [...openPanes.keys()].join('/')
    history.pushState(null, '', path)
}

async function appendPane(slug) {
    if (openPanes.has(slug)) {
        // may need to replace with a custom scrollToPane(pane) function
        openPanes.get(slug).scrollIntoView({ behavior: 'smooth', inline: 'nearest'}) 
        return
    }
    const pane = await renderPane(slug)
    pane.dataset.ordinal = openPanes.size
    pane.dataset.naturalLeft = openPanes.size * PANE_WIDTH
    main.appendChild(pane)
    openPanes.set(slug, pane)
    updateURL()
    pane.scrollIntoView({ behavior: 'smooth', inline: 'nearest' })
}


// TODO function closePane() {} 
// when X is clicked in pane corner, drops from Map

// TODO scroll listener

// TODO async function loadFromURL {}

window.addEventListener('popstate', loadFromURL)

main.addEventListener('click', (event) => {
    const link = event.target.closest('a')
    if (!link) return
    
    const href = link.getAttribute('href').slice(2)
    if (!href || href.startsWith('http')) return
    
    event.preventDefault()
    
    appendPane(href)
})

appendPane('home')