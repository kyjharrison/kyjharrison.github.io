---
date-created: 2026-07-13T20:55:49
date-modified: 2026-07-15T20:14:33
---
## closed 
- [x] delete old github repo and replace with this one
- [x] write README
###  BUILD 
- [x] index compiler
- [x] photo scrubber to run at build time
    - [x] check through notes with  `type: photo`, grab their photos,  rename the photo filenames to their corresponding notes' slugs
    - [x] resize to `{var(--pane-width) * 2}`
    - [x] scrub exifs
    - [x] fix photo behavior to work with slug-titled photo files

- [x] HTML compiler to serve pre-compiled HTML so that the site is fully indexible, fully crawlable
    - [x] transform markdown files into full HTML pages
    - [x] write to a folder that the site serves from
    - [x] update renderPane to fetch the file, extract the article entity from the html file and append it to the current main
    - [x] condense renderPane and appendPane into one
    - [x] embedded `![[photo.jpg]]` photos should only get wrapped in hyperlinks if they are *not* already on their welcome `type: photo` page. 
    - [x] insert note titles as h1s
    - [x] rename `type: post` to `type: note`
###  BREADCRUMBS
- [x] define visible spine/vertical title styling
- [x] define the pane states: 
    - fully visible
    - partially hidden / overlapped
    - spine visible
    - fully hidden
- [x] first and last panes in the map, when collapsed, always get a spine
- [x] two nearest panes in the map on either side always get spines
- [x] any other collapsed panes will be fully hidden
- [x] partially hidden state doesn't really matter except for the conditional box shadow for the pane *next* to it. 
###  PANE 
- [x] fix pane shadow layering
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
- [x] suppress shadow on inner gutters
- [x] URL parser
    - [x] add `popstate` functionality to remove last pane on back button
    - [x] make it parse URL on load

## active
### font

- [x] fix font variable axes not changing
- [x] define italics and bolds 
- [x] set up defined font presets in `:root`? or split each variable axes into custom properties
- [ ] install full Recursive glyphset and settings
    - [ ] write automatic subsetting at build time
    - [x] make sure font license is included where it needs to be

### content
- [x] write welcome page compiler that self-registers in the index

### layout 
- [ ] publish date and edit date
- [x] horizontal line
- [ ] h2 as small caps with horizontal spacing
- [x] add a `source:` field to the photo page frontmatter with the raw filename so i can match back if needed. not to include in published build of page, just as internal bookkeeping. (as in `source: PXL_20260615_192304.dng`)
- [x] add `date-taken:` to all photos
- [x] add footer with paths
- [ ] update figcaption parsing 

### deployment
 - [ ] write real README
    - [ ] description/about
    - [ ] tech stack
    - [ ] how to (reach out if interested in a template)
    - [ ] roadmap
    - [ ] license
    - [ ] gif
- [ ] link domain name
- [ ] set up github actions
- [ ] set up github pages
- [ ] split repo
- [ ] set up config paths in code

## someday/maybe future

- [ ] make h1s invisible hyperlinks so that they can be right-clicked to open their panes in a new tab?
- [ ] set up codeblocks with cream-2 color
- [ ] turn off link highlight on hover for images
- [x] add update-time-on-edit plugin in Obsidian
- [ ] add an x to close a pane and surgically excise it from the url?
- [x] set up something to automatically rename the photo file to match the slug? filename? of its photo-note
- [ ] email subscribe in footer
- [x] update browser page title to reflect top pane in stack every time stack changes
- [ ] set up some kind of tagging system? Stand-alone tag pages that index all the posts that use those tags in reverse chronological order
- [ ] add a tag parsing pass, to catch any any  `#word` and turn them into a link with class=pill
- [ ]  reply field at the bottom of each pane
