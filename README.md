i'm hand-coding a personal website in javascript

The goal is to have a side-scrolling sliding-panes browsing experience. Internal links, when clicked, need to append a new pane to the right side as a new <article>. (in general I'm a big fan of semantic function in code and being friendly to screen readers and suchlike)

clicking a link that's already open should scroll back to the existing copy. that's also why i have special formatting on links that are currently open.
i don't want to scroll main to center the new pane, merely far enough to get the new pane right-aligned on screen. if someone is reading something and clicks a link for a definition or footnote, it should just slide in from the side and only make as much room for itself as it needs.

this is a personal website that will hold essays, project notes, photos, definitions. Every page will be a pane. Clicking the Photos link in the nav bar will slide in a gallery pane of photo thumbnails (dynamically built from all the type = photo pages, ordered chronologically). Clicking one of the thumbnails will slide in the corresponding photo pane, with its caption and hand-selected relevant links. Clicking one of those links will slide in the note pane with an essay musing on a topic that the photo reminded me of, with a link that can slide in a definition for a concept or unfamiliar word. 

the user experience is of wandering down a trail, the mix of photos and stub definitions and longer essays gives a rhythm both visually and to the experience of the content. each appended pane will add to the URL

Andy Matuschak's original sliding panes implementation had every addition to the stack permanently visible as a vertical tab-title-spine, each nibbling away at the usable screen real estate. I want to combine the sense of grounded history available with an open-endedness. It seems to me that everyone else saw Andy's sliding panes and went "ooh, vertical tab management" but to me it felt like something that COULD be this wandering garden experience, if properly implemented. 

So I want the *first* collapsed pane in the path to show a vertical tab spine, and the *last two* collapsed panes to show vertical spines, but any other collapsed panes in between them should collapse invisibly into a fixed "more" graphic, like the edges of pages in a book. so that no matter how deep a reader goes, only three tab-spines (+ fixed graphic) worth of screen is taken up. 
