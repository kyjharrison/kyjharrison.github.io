
- [x] delete old github repo and replace with this one
- [x] write README
- [ ] write real README
    - [ ] description/about
    - [ ] tech stack
    - [ ] how to
    - [ ] roadmap
    - [ ] license

## BUILD 
- [x] index compiler

- [x] photo scrubber to run at build time
    - [x] check through notes with  `type: photo`, grab their photos,  rename the photo filenames to their corresponding notes' slugs
    - [x] resize to `{var(--pane-width) * 2}`
    - [x] scrub exifs
    - [ ] fix photo behavior to work with slug-titled photo files

- [x] HTML compiler to serve pre-compiled HTML so that the site is fully indexible, fully crawlable
    - [x] transform markdown files into full HTML pages
    - [x] write to a folder that the site serves from
    - [x] update renderPane to fetch the file, extract the article entity from the html file and append it to the current main
    - [x] condense renderPane and appendPane into one
    - [x] embedded `![[photo.jpg]]` photos should only get wrapped in hyperlinks if they are *not* already on their home `type: photo` page. 
    - [ ] add a `source:` field to the photo page frontmatter with the raw filename so i can match back if needed. Don't include in published build of page, just as internal bookkeeping. (as in `source: PXL_20260615_192304.dng`)
    - [x] insert note titles as h1s
    - [x] rename `type: post` to `type: note`
    - [ ] add a tag parsing pass, to catch any any  `#word` and turn them into a link with class=pill

## BREADCRUMBS
- [ ] define visible spine/vertical title styling
- [ ] define the pane states: 
    - fully visible
    - partially hidden / overlapped
    - spine visible
    - fully hidden
- [ ] first and last panes in the map, when collapsed, always get a spine
- [ ] two nearest panes in the map on either side always get spines
- [ ] any other collapsed panes will be fully hidden
- [ ] partially hidden state doesn't really matter except for the conditional box shadow for the pane *next* to it. 

## PANE 

~~ - [ ] fix pane shadow layering ~~ ditching shadows instead
- [x] get pane shadow casting upward onto header also
- [x] fix link hover wobbling pane
- [x] intercept internal links to open a new pane
- [x] center panes when there's not enough to fill the screen
- [x] append new panes to URL 
- [x] write renderPane
- [x] write updateURL (separates panes with `/` e.g. `kyjharrison.com/on-stillness/mushroom-tree/attention-is-everything`)
- [x] write title normalizer (indexer now stores a `slug` value)
    - local filenames will have capitals and spaces so that wikilinks can work naturally, embedded in sentences
    - the indexer needs to call the normalizer to lowercase and slugify, then store both slug and title in the index
    - renderPane and updateURL should both check the index to fetch the correct note contents and slug corresponding to a given title
- [x] extracted `slugify(title)` as a util. 
- [x] refactored index to key off slug instead of title. 
- [ ] suppress shadow on inner gutters
- [ ] URL parser
    - [x] add `popstate` functionality to remove last pane on back button
    - [x] make it parse URL on load

## FONT

- [x] fix font variable axes not changing
- [ ] define italics and bolds 
- [ ] set up defined font presets in `:root`? or split each variable axes into custom properties
- [ ] install full Recursive glyphset and settings
    - [ ] write automatic subsetting at build time
    - [ ] make sure font license is included where it needs to be

## FUTURE NICE-TO-HAVE
- [ ] add update-time-on-edit plugin in Obsidian
- [ ] add an x to close a pane and surgically excise it from the url
- [ ] render publish date and edit date somewhere
- [ ] set up something to automatically rename the photo file to match the slug? filename? of its photo-note
- [ ] email subscribe in footer
- [ ] reply field at the bottom of each pane
- [x] update browser page title to reflect top pane in stack every time stack changes
- [ ] set up some kind of tagging system... Stand-alone tag pages that index all the posts that use those tags in reverse chronological order