import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import {db, firebaseApp, firebase} from '../firebase';

export default function RowChatRoom({ chatroom, index }) {
    const history = useHistory();
    const jwtToken = useSelector((state) => state.user.userProfile);
    
    let val;
    const [userList, setUserList] = useState([]);
    const [newCandidate, setNewCandidate] = useState(null);
	const [deleteCandidate, setDeleteCandidate] = useState(null);

    if (chatroom.pw === "") {
        val = <td className="public">오픈</td>
    } else {
        val = <td className="private">비밀</td>
    }

    function listUpUser() {
        return new Promise(async (resolve, reject) => {
			const userQuerySnapshot = await db.collection('chatrooms').doc('room_' + chatroom.id).collection('participants').get();
			const userData = userQuerySnapshot.docs.map(doc => doc.data());
            resolve(userData);
        });
    };

    async function readUsers() {
        const uData = await listUpUser();
        setUserList(uData);
    };

    useEffect(() => {
        const chatRef = db.collection('chatrooms').doc('room_' + chatroom.id).collection('participants')
		chatRef.onSnapshot((snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === "added") {
					const newEntry = change.doc.data();
					newEntry.id = change.doc.id
					setNewCandidate(newEntry); 
				}
				if (change.type === "removed") {
					console.log("remove message: ", change.doc.data());
					const data = change.doc.data();
					data.id = change.doc.id
					setDeleteCandidate(data); 
				}
			});
		});

        readUsers();
    }, []);

    useEffect(() => {
		const cp = [...userList]
		cp.push(newCandidate)
		setUserList(cp)	      
	}, [newCandidate])

	useEffect(() => {
		setUserList(userList.filter(user => user.participant !== deleteCandidate.id));
	}, [deleteCandidate])

    const enterChatRoom = async (chatroom) => { 
        if(chatroom.partiCount !== "∞") {
            if((Number(chatroom.partiCount) === userList.length) && (chatroom.admin !== jwtToken.uid)) {
                alert("이미 정원 마감되었습니다.");
                return
            }
        }
        
        if(chatroom.pw !== "") {
            var getpw = prompt("비밀번호를 입력하세요.");

            if(chatroom.pw == getpw) {
                if(jwtToken.uid == chatroom.admin) history.push("/chat/room/" + chatroom.id);
                else {
                    await db.collection('chatrooms').doc("room_" + chatroom.id).collection('participants').doc(jwtToken.uid).set({
                        participant: jwtToken.uid,
                        participantNickName: jwtToken.nickName,
                        created: firebase.firestore.Timestamp.now().seconds,
                    });

                    history.push("/chat/room/" + chatroom.id);
                }
            }
            else alert("잘못된 비밀번호 입니다.");
        }
        else {
            if(jwtToken.uid == chatroom.admin) history.push("/chat/room/" + chatroom.id);
            else {
                await db.collection('chatrooms').doc("room_" + chatroom.id).collection('participants').doc(jwtToken.uid).set({
                    participant: jwtToken.uid,
                    participantNickName: jwtToken.nickName,
                    created: firebase.firestore.Timestamp.now().seconds,
                });

                history.push("/chat/room/" + chatroom.id);
            }
        }
    };

    function countActiveRooms(users) {
		return users.filter(user => user.participantNickName).length;
	  }

	const usersCount = useMemo(() => countActiveRooms(userList), [userList]);
    
    return (
        <tr key={index}>
            <td>{index + 1}</td>
            {val}
            <td>{chatroom.title}</td>
            <td>{usersCount} / {chatroom.partiCount}</td>
            <td><div onClick={e => enterChatRoom(chatroom)} key={index} className="enterCtn">Enter</div></td>
        </tr>
    );
}