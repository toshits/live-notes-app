'use client'
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function Home() {

  const router = useRouter()
  const [roomId, setRoomId] = useState<string>('')
  const [showCreateRoom, setShowCreateRoom] = useState(false)

  const handleActionClick = async () => {
    if (showCreateRoom) {
      let token = Cookies.get('token')
      const createRoomRes = await fetch(`${process.env.SERVER_URL}/board/create`, {
        method: 'POST',
        headers: {
          authorization: token ? token : ''
        }
      })

      const createRoomJson = await createRoomRes.json()
      if (createRoomJson.error) {
        toast.error(createRoomJson.error.message)
        return
      }

      router.push(`/board/${createRoomJson.result.roomId}`)

    }
    else {
      if (roomId !== '') {
        router.push(`/board/${roomId}`)
      }
      else{
        toast.error('Enter room id')
      }
    }
  }

  return (
    <div className={styles.container}>
      {
        showCreateRoom ? <div className={styles.innerContainer}>
          <h1>Create Board Room</h1>
          <div className={styles.formContainer}>
            <button className={`primaryBtn ${styles.joinBtn}`} onClick={handleActionClick} >Create Room</button>
            <p className={styles.newRoomLink} onClick={() => setShowCreateRoom(false)}>Join Room</p>
          </div>
        </div> :
          <div className={styles.innerContainer}>
            <h1>Join Board</h1>
            <div className={styles.formContainer}>
              <input className={`primaryInp ${styles.roomInp}`} placeholder="Enter room id" value={roomId} onChange={(e) => setRoomId(e.target.value)} type="text" />
              <button className={`primaryBtn ${styles.joinBtn}`} onClick={handleActionClick}>Join</button>
              <p className={styles.newRoomLink} onClick={() => setShowCreateRoom(true)}>Create a new room</p>
            </div>
          </div>
      }
    </div>
  );
}
