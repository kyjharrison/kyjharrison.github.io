import '@fontsource-variable/recursive/full.css'
import { marked } from 'marked'
import { splitFrontmatter } from './utils.js'
import { slugify } from './utils.js'

const main = document.querySelector('main')

const metadata = await fetch('./index.json').then(r => r.json())

const openPanes = new Map()

const PANE_WIDTH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--pane-width')
)

// takes a note slug, fetches content, creates a new pane
async function renderPane(slug) {
    const response = await fetch(`/build/${slug}`)
    const raw = await response.text()

    const parser = new DOMParser()
    const page = parser.parseFromString(raw, 'text/html')
    const pane = page.querySelector('article')
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
    document.title = `${metadata.title} | Ky Harrison`
    pane.scrollIntoView({ behavior: 'smooth', inline: 'nearest' })
}


// TODO function closePane() {} 
// when X is clicked in pane corner, drops from Map

// TODO scroll listener

// TODO async function loadFromURL {}

// window.addEventListener('popstate', loadFromURL) bUT NOT RELOADING THE WHOLE THING

main.addEventListener('click', (event) => {
    const link = event.target.closest('a')
    if (!link) return
    
    const href = link.getAttribute('href').slice(2)
    if (!href || href.startsWith('http')) return
    
    event.preventDefault()
    
    appendPane(href)
})

appendPane('home')