import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import {db, firebaseApp, firebase} from '../firebase';

export default function EachChatPartiByAdmin({ user, roomInfo, roomId }) {
    const jwtToken = useSelector((state) => state.user.userProfile);

    const deleteParti = async (id) => {
		await db.collection('chatrooms').doc('room_' + roomId).collection('participants').doc(id).delete();
	}

    return (
        <li>
            <div className="roomPartiName" style={{ width: roomInfo.admin===user.participant?'100%':'50%' }}>{user.participantNickName}</div>
            <div className="roomOutBtn" style={{ display: roomInfo.admin===user.participant?'none':'block' }} onClick={e => deleteParti(user.participant)}>강제 퇴장</div>
        </li>
    );
}