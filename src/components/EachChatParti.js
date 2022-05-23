import React from 'react';

export default function EachChatParti({ user }) {
    return (
        <li>
            <div className="roomPartiName" style={{ width: '100%' }}>{user.participantNickName}</div>
        </li>
    );
}