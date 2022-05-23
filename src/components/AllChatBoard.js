import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import {db, firebaseApp, firebase} from '../firebase';
import MessageLike from '../components/MessageLike'
import MessageEmoticon from '../components/MessageEmoticon'

export default function AllChatBoard({ chat, roomId }) {
    const jwtToken = useSelector((state) => state.user.userProfile);
    const [editBtnToggle, setEditBtnToggle] = useState(true);
    const [editMessage, setEditMessage] = useState("");

    const editText = (content) => {
        setEditBtnToggle(!editBtnToggle);
		setEditMessage(content);
	}

	const completeText = async (id) => {
		if(editMessage === "") {
			alert('메세지 내용을 입력해주세요.')
			return
		}

		const chatMassageRef = db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(id)

		chatMassageRef.get().then(doc => {
			chatMassageRef.update({
				content: editMessage
			})  
		})

		setEditBtnToggle(!editBtnToggle);
	}

    const deleteText = async (id) => {
		await db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(id).delete()
	}

    return chat.uidOfUserId==jwtToken.uid? 
        <div className="mBax">
            <div className="myMessage">
                <div style={{ display: editBtnToggle?'block':'none' }}>{chat.content}</div>
                <input type="text" onChange={e => setEditMessage(e.target.value)} value={editMessage} placeholder="메세지를 입력하세요" style={{ display: editBtnToggle?'none':'block' }} />
            </div>
            <div style={{ float:"right"}}>
                <MessageLike chat={chat} roomId={roomId} /><br/>
                <MessageEmoticon chat={chat} roomId={roomId} />
            </div>
            <p style={{ clear:'both'}}></p>
            <span className="editBtn" onClick={() => deleteText(chat.uid)}>삭제</span>
            <span className="editBtn" onClick={() => editText(chat.content)} style={{ display: editBtnToggle?'block':'none' }}>수정</span>
            <span className="editBtn" onClick={() => completeText(chat.uid)} style={{ display: editBtnToggle?'none':'block' }}>완료</span>
        </div> : 
		<div className="mBax">
            <div className="mNickName">{chat.uidOfUserNickName}</div>
            <p style={{ clear:'both'}}></p>
            <div className="otherMessage">{chat.content}</div>
            <div>
                <MessageLike chat={chat} roomId={roomId} /><br/>
                <MessageEmoticon chat={chat} roomId={roomId} />
            </div>
            <p style={{ clear:'both'}}>&nbsp;</p>
        </div>
}