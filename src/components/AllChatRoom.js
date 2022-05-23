import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import RowChatRoom from './RowChatRoom'

export default function AllChatRoom({ chatroomsOrigin, isAdmin }) {
    const history = useHistory();
    const jwtToken = useSelector((state) => state.user.userProfile);

    const chatrooms = chatroomsOrigin.filter(chat => (
        isAdmin? jwtToken.uid === chat.admin : chat
    ))

    return (
        <table>
            <thead>
                <tr className="tableHeader">
                    <th className="w1">No.</th>
                    <th className="w2">구분</th>
                    <th className="w3">방 제목</th>
                    <th className="w2">인원</th>
                    <th className="w2">참여</th>
                </tr>
            </thead>
            <tbody>
                {
                    chatrooms.map((chatroom, index) => {
                        return < RowChatRoom chatroom={chatroom} index={index} key={index} />
                    })
                }
            </tbody>
        </table>
    );
}