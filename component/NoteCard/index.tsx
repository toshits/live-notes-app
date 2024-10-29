'use client'
import React, { ChangeEvent, Dispatch, FormEvent, useRef } from 'react'
import styles from './styles.module.css'
import { Socket } from 'socket.io-client'
import { noteType } from '@/app/board/[id]/page'

const NoteCard = ({ note, socket, setNotes }: {
    note: {
        id: string,
        createdBy: string,
        body: string
    },
    socket: Socket | null,
    setNotes: Dispatch<React.SetStateAction<noteType[]>>
}) => {

    const bodyRef = useRef<HTMLTextAreaElement | null>(null)
    const handleAreaInput = () => {
        if (bodyRef.current) {
            bodyRef.current.style.height = `${bodyRef.current.scrollHeight}px`
        }

    }

    const handleDeleteNote = () => {
        if (socket == null) return
        socket.emit('delete-note', note.id)
    }

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (socket) {
            socket.emit('update-note', {
                id: note.id,
                body: e.target.value
            })

            setNotes((prev) => {
                return [
                    ...prev.map((currentNote) => {
                        if (note.id === currentNote.id) {
                            return {
                                id: currentNote.id,
                                createdBy: currentNote.createdBy,
                                body: e.target.value
                            }
                        }
                        return currentNote
                    })
                ]
            })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <textarea onInput={handleAreaInput} placeholder='Write your note here' ref={bodyRef} style={{ height: bodyRef.current ? `${bodyRef.current.scrollHeight}px` : 'fit-content' }} className={styles.body} name="notesCard" id={note.id} value={note.body} onChange={handleInputChange}>
                </textarea>
                <div className={styles.noteFooterContainer}>
                    <div className={styles.createdByContainer}>
                        <p><span>Created By:</span> {note.createdBy}</p>
                    </div>
                    <button onClick={handleDeleteNote}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F45C4F" style={{ width: '25px' }}>
                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NoteCard