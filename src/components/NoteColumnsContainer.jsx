/* eslint-disable react/prop-types */
import {useEffect, useState, useCallback} from "react"
import {useParams, useSearchParams} from "react-router-dom"

import Db from "../db/Db"

import Popover from "./Popover"
import NoteContainer from "./NoteContainer"

import "./NoteColumnsContainer.scss"

const NOTE_WIDTH = 585

const NoteColumnsContainer = ({scrollRef}) => {
  const {entrypoint} = useParams()
  const query = useSearchParams()[0]
  const [noteIds, setNoteIds] = useState([entrypoint])
  const [title, setTitle] = useState("Loading notes...")
  const [notes, setNotes] = useState([])
  const [shownNotes, setShownNotes] = useState([])
  const [smallScreen, setSmallScreen] = useState(false)
  const [popoverData, setPopoverData] = useState()

  const scrollToAmount = useCallback(
    (amount) => {
      if (scrollRef && scrollRef.current) {
        scrollRef.current.scroll(amount, 0)
      }
    },
    [scrollRef],
  )

  const handleScrollToNote = useCallback(
    (notePath) => {
      const index = noteIds.indexOf(notePath)
      const target = (index === -1 ? noteIds.length : index) * NOTE_WIDTH
      const maxScroll = Math.max(0, noteIds.length * 625 - window.innerWidth)
      scrollToAmount(Math.min(target, maxScroll))
    },
    [noteIds, scrollToAmount],
  )

  useEffect(() => {
    setNoteIds(
      [entrypoint, ...query.getAll("stacked")].map((e) =>
        decodeURIComponent(e),
      ),
    )
  }, [entrypoint, query])

  useEffect(() => {
    Promise.all(noteIds.map((n) => Db.getNote(n))).then((notes) =>
      setNotes(notes),
    )
  }, [noteIds])

  useEffect(() => {
    setShownNotes(smallScreen ? notes.slice(-1) : [...notes])
  }, [notes, smallScreen])

  useEffect(() => {
    setTitle(
      shownNotes.length === 1
        ? shownNotes[0].title
        : shownNotes.map((n) => n.title).join(" | "),
    )
  }, [shownNotes])

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    function handleResize() {
      const isSmallScreen = window.innerWidth < 800
      setSmallScreen(isSmallScreen)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []) // Add empty dependency array

  // centers when the panes do not take up the full screen
const totalPanesWidth = noteIds.length * 625
const centerOffset = !smallScreen
  ? Math.max(0, (window.innerWidth - totalPanesWidth) / 2)
  : 0

  return (
    <div className="NoteColumnsContainer" style={{ transform: `translateX(${centerOffset}px)` }}>
      {shownNotes.map((note, index) => {
        const lastNote = index === noteIds.length - 1
        
        return (
          <NoteContainer
            style={{left: '0px'}}
            note={note}
            noteIdsStack={noteIds}
            scrollToNote={handleScrollToNote}
            showPopoverForNote={() => {}} // dummy popover
            // showPopoverForNote={setPopoverData} // uncomment to reactivate popover
            key={note.path ?? ".404"}
          />
        )
      })}
      {/* If popoverData is required in future, uncomment and use the below code */}
      {popoverData ? (
        <Popover
          elementPosition={popoverData.elementPosition}
          noteId={popoverData.noteId}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default NoteColumnsContainer
