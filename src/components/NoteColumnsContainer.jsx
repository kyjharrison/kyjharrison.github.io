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
  const [scroll, setScroll] = useState(0)

  const scrollToAmount = useCallback(
    (amount) => {
      if (scrollRef && scrollRef.current) {
        scrollRef.current.scroll(amount, 0)
      }
    },
    [scrollRef],
  )

  useEffect(() => {
      const container = scrollRef?.current
      if (!container) return
      const handleScroll = () => {
        setScroll(container.scrollLeft)
      }
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }, [scrollRef])

  const handleScrollToNote = useCallback(
    (notePath) => {
      const index = noteIds.indexOf(notePath)
      scrollToAmount((index === -1 ? noteIds.length : index) * NOTE_WIDTH)
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
        const noteIsTooFarOnTheLeft = scroll > NOTE_WIDTH * (index + 1) - 32 //originally 80
        const lastNote = index === noteIds.length - 1
        const noteIsTooFarOnTheRight =
          lastNote &&
          window.innerWidth + scroll - NOTE_WIDTH * (noteIds.length - 1) <
            150 &&
          scroll < NOTE_WIDTH * (noteIds.length - 2) - 65

        return (
          <NoteContainer
            verticalMode={noteIsTooFarOnTheLeft || noteIsTooFarOnTheRight}
            overlay={
              scroll > Math.max(NOTE_WIDTH * (index - 1), 0) ||
              (lastNote && scroll < NOTE_WIDTH * (noteIds.length - 2) - 400)
            }
            style={{left: `${Math.min(index, 3) * 40}px`, right: `-${NOTE_WIDTH}px`}}
            stackHidden={noteIsTooFarOnTheLeft && index >= 3}
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
