import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import {useParams, useHistory} from 'react-router-dom';
import {db, firebaseApp, firebase} from '../firebase';
import EachChatPartiByAdmin from '../components/EachChatPartiByAdmin'
import EachChatParti from '../components/EachChatParti'

export default function AllChatParti({ userList, roomInfo, roomId }) {
    const history = useHistory();
    const jwtToken = useSelector((state) => state.user.userProfile);

    function findUser() {
        return new Promise(async (resolve, reject) => {
            const userQuerySnapshot = await db.collection('chatrooms').doc('room_' + roomId).collection('participants').doc(jwtToken.uid).get().then((onexist) => {
                onexist.exists ? resolve(true) : resolve(false);
            }); 
        });
    }

    async function checkUser() {
        const uData = await findUser();
        if(!uData) history.push("/chat/list");
    }
    
    checkUser()

    return (				
        userList.map((user,index) => {
            return roomInfo.admin!==jwtToken.uid? 
                < EachChatParti user={user} key={index} /> :
                < EachChatPartiByAdmin user={user} roomInfo={roomInfo} roomId={roomId} key={index} />
        })
    );
}