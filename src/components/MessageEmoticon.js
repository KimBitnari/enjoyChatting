import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import {db, firebaseApp, firebase} from '../firebase';
import { FcOk, FcIdea } from "react-icons/fc";

export default function MessageEmoticon({ chat, roomId }) {
    const jwtToken = useSelector((state) => state.user.userProfile);
    const [okCount, setOkCount] = useState(0);
    const [ideaCount, setIdeaCount] = useState(0);

    function checkEmo() {
        return new Promise(async (resolve, reject) => {
			const emoQuerySnapshot = await db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(chat.uid).collection('emoticons').get();
			const emoData = emoQuerySnapshot.docs.map(doc => doc.data());
            resolve(emoData);
        });
    }

	async function readEmo() {
        const eData = await checkEmo();
        eData.map((emo,index) => {
            if(emo.emoNum == 1) {
                const changeE = okCount + 1;
                setOkCount(changeE);
            }
            else {
                const changeE = ideaCount + 1;
                setIdeaCount(changeE);
            }
        });
    }

    useEffect(() => {
        readEmo();
    }, []);

    const addEmo = async (id, emoNum) => {
        var check;
        await db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(id).collection('emoticons').doc(emoNum+"_"+jwtToken.uid).get().then((onexist) => {
            onexist.exists ? check = true : check = false;
        }); 

        if(check) {
            alert("이미 해당 이모티콘을 보냈습니다!")
            return
        }
		else await db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(id).collection('emoticons').doc(emoNum+"_"+jwtToken.uid).set({
            user: jwtToken.uid,
            emoNum: emoNum,
            created: firebase.firestore.Timestamp.now().seconds,
        });

        if(emoNum == 1) {
            const changeE = okCount + 1;
            setOkCount(changeE);
        }
        else {
            const changeE = ideaCount + 1;
            setIdeaCount(changeE);
        }
    }

    // useEffect(() => {
    //     readEmo();
    // }, [okCount]);
    // useEffect(() => {
    //     readEmo();
    // }, [ideaCount]);

    return (
        <div>
            <button className="addEmoBtn" onClick={() => addEmo(chat.uid, 1)}><FcOk size="18" /> {okCount}</button> 
            <button className="addEmoBtn" onClick={() => addEmo(chat.uid, 2)}><FcIdea size="18" /> {ideaCount}</button>  
        </div>
    );
}