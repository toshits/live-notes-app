'use client'
import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useParams } from 'next/navigation'
import Cookies from 'js-cookie'
import styles from './styles.module.css'
import NoteCard from '@/component/NoteCard'
import jwt from 'jsonwebtoken'
import { toast } from 'react-toastify'


export type noteType = {
  id: string,
  createdBy: string,
  body: string
}

const Board = () => {

  const params = useParams()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [notes, setNotes] = useState<noteType[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [username, setUsername] = useState<string>('')

  const handleCreateNote = () => {
    if (socket == null) return
    socket.emit('create-new-note')
  }

  useEffect(() => {
    let roomId = params.id
    let SERVER_URL: string = process.env.SERVER_URL || ''
    let token = Cookies.get('token')

    if (token != null) {
      const decodedUser = jwt.decode(token)
      if (decodedUser != null && typeof decodedUser != 'string') {
        setUsername(decodedUser.username)
      }
    }

    const socket = io(`${SERVER_URL}/board`, {
      reconnectionDelayMax: 1000,
      query: {
        token,
        roomId
      }
    })
    setSocket(socket)

    socket.on('connect', () => {
      console.log("CONNECTED")
      socket.emit('get-all-notes')
      socket.on('render-notes', (notes) => {
        setNotes(notes)
      })
      socket.on('render-users', (users) => {
        setUsers(users)
      })

    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.userContainer}>
        <h4 className={styles.userTitle}>Users in the room</h4>
        <div className={styles.userCardContainer}>
          {
            users.map((user) => {
              return <p className={styles.userCard} key={user}>{user}</p>
            })
          }
        </div>
      </div>
      <div className={styles.addNoteContainer}>
        <button className={`primaryBtn ${styles.addNoteBtn}`} onClick={handleCreateNote}>Add Note</button>
      </div>
      <div className={styles.notesMainContainer}>
        <h2 className={styles.notesTitle}>All notes in the board</h2>
        <div className={styles.notesContainer}>
          {
            notes.map((note) => {
              return <NoteCard key={note.id} note={note} socket={socket} setNotes={setNotes} />
            })
          }
          {notes.length === 0 ? <p className={styles.noNote}>This board does not have any notes</p>: ''}
        </div>
      </div>
    </div>
  )
}

export default Board