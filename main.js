import '@fontsource-variable/recursive/full.css'
import { marked } from 'marked'
import { splitFrontmatter } from './utils.js'
import { slugify } from './utils.js'

const main = document.querySelector('main')
const metadata = await fetch('/index.json').then(r => r.json())
const openPanes = new Map()
const PANE_WIDTH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--pane-width')
)
const SPINE_WIDTH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--spine-width')
)

let allowUpdateURL = true 
function updateURL() {
    if (!allowUpdateURL) return
    const path = '/' + [...openPanes.keys()].join('/')
    history.pushState(null, '', path)
}

function updateTitle() {
    const latestSlug = [...openPanes.keys()].at(-1)
    document.title = latestSlug
        ? `${metadata[latestSlug].title} | Ky Harrison`
        : 'Ky Harrison'
}

// takes a note slug, fetches file, drops pane into map
async function appendPane(slug) {
    if (openPanes.has(slug)) {
        // may need to replace with a custom scrollToPane(pane) function
        openPanes.get(slug).scrollIntoView({ behavior: 'smooth', inline: 'nearest'}) 
        return
    }
    const response = await fetch(`/build/${slug}/`)
    const raw = await response.text()
    const parser = new DOMParser()
    const page = parser.parseFromString(raw, 'text/html')
    const pane = page.querySelector('article')
    pane.dataset.ordinal = openPanes.size
    pane.dataset.naturalLeft = openPanes.size * PANE_WIDTH
    main.appendChild(pane)
    openPanes.set(slug, pane)
    updateURL()
    updateTitle()
    pane.scrollIntoView({ behavior: 'smooth', inline: 'nearest' })
}

function removePane(slug) {
    const pane = openPanes.get(slug)
    if (!pane) return
    pane.remove()
    openPanes.delete(slug)
    updateURL()
}

async function loadFromURL() {
    allowUpdateURL = false // if loading from the URL, trying to push changes back would be circular 
    const urlSlugs = window.location.pathname.split('/').filter(s => s)
    if (urlSlugs.length === 0) { urlSlugs.push('home')}
    for (const slug of openPanes.keys()) {
        if (!urlSlugs.includes(slug)) { removePane(slug)}
    }
    for (const slug of urlSlugs) {
        await appendPane(slug)
    }
    updateTitle()
    allowUpdateURL = true
}

// intercepts internal links and opens them as panes 
main.addEventListener('click', (event) => {
    const link = event.target.closest('a')
    if (!link) return
    const href = link.getAttribute('href').slice(1)
    if (!href || href.startsWith('http')) return
    event.preventDefault()
    appendPane(href)
})

// listens for forward/back buttons
window.addEventListener('popstate', loadFromURL)

// the core overlapping spine logic
main.addEventListener('scroll', () => {
    const scrollLeft = main.scrollLeft

    // floor of (scrollLeft / var(--PANE-WIDTH)) = 
})

loadFromURL()