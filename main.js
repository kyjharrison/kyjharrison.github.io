import '@fontsource-variable/recursive/full.css'

const main = document.querySelector('main')
const metadata = await fetch('/index.json').then(r => r.json())
const openPanes = new Map()

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

function updateOrdinals() {
    const totalPanes = openPanes.size
    let ordinal = 0
    for (const [slug, pane] of openPanes) {
        if (!pane) continue 

        pane.classList.remove('spine-left-0', 'spine-left-1', 'spine-left-2', 'spine-left-3') 
        pane.dataset.ordinal = ordinal
        const spineLeftClass = Math.min(ordinal, 2)
        pane.classList.add(`spine-left-${spineLeftClass}`)
        const paneLeftStop = parseFloat(getComputedStyle(pane).left)
        pane.dataset.leftStop = paneLeftStop

        pane.classList.remove('spine-right-0', 'spine-right-1', 'spine-right-2', 'spine-right-3') 
        const ordinalRight = totalPanes - ordinal - 1 // offset to zero-index like the main ordinals
        pane.dataset.ordinalRight = ordinalRight
        const spineRightClass = Math.min(ordinalRight, 2)
        pane.classList.add(`spine-right-${spineRightClass}`)
        const paneRightStop = parseFloat(getComputedStyle(pane).right)
        pane.dataset.rightStop = paneRightStop

        ordinal++ // increments ordinal by 1
    }
}

function updateStack() {
    const scrollLeft = main.scrollLeft
    const scrollRight = scrollLeft + main.clientWidth
    const panes = [...openPanes.values()]
    for (const pane of panes) {
        if(!pane) continue // to skip null reservations
        const paneWidth = pane.clientWidth

        const ordinal = Number(pane.dataset.ordinal)
        const paneNaturalLeft = ordinal * paneWidth 
        const paneLeftStop = Number(pane.dataset.leftStop)
        const isStuckLeft = scrollLeft > paneNaturalLeft - paneLeftStop
        pane.classList.toggle('stuckLeft', isStuckLeft)
        const neighborLeftStop = ordinal > 0 && panes[ordinal - 1] ? Number(panes[ordinal - 1].dataset.leftStop) : 0
        const overlappingLeft = ordinal > 0 && scrollLeft > (ordinal - 1) * paneWidth - neighborLeftStop
        pane.classList.toggle('overlappingLeft', overlappingLeft)

        const ordinalRight = Number(pane.dataset.ordinalRight)
        const paneNaturalRight = (ordinal + 1) * paneWidth
        const paneRightStop = Number(pane.dataset.rightStop)
        const isStuckRight = scrollRight < paneNaturalRight + paneRightStop
        pane.classList.toggle('stuckRight', isStuckRight)
        pane.style.zIndex = isStuckRight ? -(ordinal + 1) : '' 
        const neighborRightStop = ordinalRight > 0 && panes[ordinal + 1] ? Number(panes[ordinal + 1].dataset.rightStop) : 0
        const overlappingRight = ordinalRight > 0 && scrollRight < (ordinal + 2) * paneWidth + neighborRightStop
        pane.classList.toggle('overlappingRight', overlappingRight)
    }
}

// takes a note slug, fetches file, drops pane into map
async function appendPane(slug) {
    if (openPanes.has(slug)) {
        const existing = openPanes.get(slug)
        if (existing) main.scrollTo({
            left: existing.dataset.ordinal * existing.offsetWidth - (main.offsetWidth - existing.offsetWidth) / 2,
            behavior: 'smooth'
        }) 
        return
    }
    openPanes.set(slug, null) // reserve slot to avoid duplicate panes 
    try {
        const response = await fetch(`/build/${slug}/`)
        const raw = await response.text()
        const parser = new DOMParser()
        const page = parser.parseFromString(raw, 'text/html')
        const pane = page.querySelector('article')
        main.appendChild(pane)
        openPanes.set(slug, pane)
        updateOrdinals() 
        updateURL()
        updateTitle()
        main.scrollTo({left: Number(pane.dataset.ordinal) * pane.clientWidth, behavior: 'smooth' })
//        pane.scrollIntoView({ behavior: 'smooth', inline: 'end' })
    } catch (err) {
        openPanes.delete(slug) // delete reservation if misfire
    } 
}

function removePane(slug) {
    const pane = openPanes.get(slug)
    if (!pane) return
    pane.remove()
    openPanes.delete(slug)
    updateURL()
    updateOrdinals()
    updateStack()
}

async function loadFromURL() {
    allowUpdateURL = false // if loading from the URL, trying to push changes back would be circular 
    const urlSlugs = window.location.pathname.split('/').filter(s => s)
    if (urlSlugs.length === 0) { urlSlugs.push('home')}
    for (const slug of [...openPanes.keys()]) {
        if (!urlSlugs.includes(slug)) { removePane(slug)}
    }
    for (const slug of urlSlugs) {
        await appendPane(slug)
    }
    updateTitle()
    updateStack()
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

// listens for scroll events 
main.addEventListener('scroll', updateStack)

loadFromURL()