import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import {db, firebaseApp, firebase} from '../firebase';
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import '../css/MessageLike.css';

export default function MessageLike({ chat, roomId }) {
    const jwtToken = useSelector((state) => state.user.userProfile);
    const [likeToggle, setLikeToggle] = useState(false);

    function listUpLike() {
        return new Promise(async (resolve, reject) => {
			const msgQuerySnapshot = await db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(chat.uid).collection('likes').doc(jwtToken.uid).get().then((onexist) => {
                onexist.exists ? resolve(true) : resolve(false);
            }); 
        });
    }

    async function checkLike() {
        const mData = await listUpLike();
        setLikeToggle(mData);
    }
    
    checkLike()

    const addLike = async (id) => {
		await db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(id).collection('likes').doc(jwtToken.uid).set({
            user: jwtToken.uid,
            created: firebase.firestore.Timestamp.now().seconds,
        });
        setLikeToggle(!likeToggle)
	}

    const delLike = async (id) => {
		await db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(id).collection('likes').doc(jwtToken.uid).delete();
        setLikeToggle(!likeToggle)
    }

    return likeToggle ? <button className="likeBtn" onClick={() => delLike(chat.uid)}><FcLike size="22" /></button> : <button className="likeBtn" onClick={() => addLike(chat.uid)}><FcLikePlaceholder size="22" /></button>
}