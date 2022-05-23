import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import {useParams, useHistory} from 'react-router-dom';
import {db, firebaseApp, firebase} from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import '../css/ChatRoom.css';
import AllChatBoard from '../components/AllChatBoard'
import AllChatParti from '../components/AllChatParti'

const ChatRoom = () => {
	const history = useHistory();
	const jwtToken = useSelector((state) => state.user.userProfile);
	const { roomId } = useParams();
	const [chats, setChats] = useState([]);
	const [text, setText] = useState("");
	const [newCandidate, setNewCandidate] = useState(null);
	const [modifyCandidate, setModifyCandidate] = useState(null);
	const [deleteCandidate, setDeleteCandidate] = useState(null);
	const uid = uuidv4();
	const [userList, setUserList] = useState([]);
	const [roomInfo, setRoomInfo] = useState([]);

	function listUpUser() {
        return new Promise(async (resolve, reject) => {
			const userQuerySnapshot = await db.collection('chatrooms').doc('room_' + roomId).collection('participants').get();
			const userData = userQuerySnapshot.docs.map(doc => doc.data());
            resolve(userData);
        });
    }

	function findAdmin() {
        return new Promise(async (resolve, reject) => {
			const adminRef = db.collection('chatrooms').doc('room_' + roomId);
			const doc = await adminRef.get();
			resolve(doc.data());
        });
    }

	async function readUsers() {
        const uData = await listUpUser();
        setUserList(uData);
    }

	async function readAdmin() {
		const adminData = await findAdmin();
		setRoomInfo(adminData);
    }

	function isExist(element)  {
		if(element.participant === jwtToken.uid)  {
		  return true;
		}
	  }

	useEffect(() => {
		const chatRef = db.collection('chatrooms').doc('room_' + roomId).collection('messages')
		chatRef.orderBy("created").onSnapshot((snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === "added") {
					const newEntry = change.doc.data();
					newEntry.id = change.doc.id
					setNewCandidate(newEntry); 
				}
				if (change.type === "modified") {
					const data = change.doc.data();
					data.id = change.doc.id
					setModifyCandidate(data);  
				}
				if (change.type === "removed") {
					console.log("remove message: ", change.doc.data());
					const data = change.doc.data();
					data.id = change.doc.id
					setDeleteCandidate(data); 
				}
			});
		});

		const userRef = db.collection('chatrooms').doc('room_' + roomId).collection('participants')
		userRef.orderBy("created").onSnapshot((snapshot) => {
			snapshot.docChanges().forEach(async (change) => {
				if (change.type === "added") {
					readUsers();
				}
				if (change.type === "removed") {
					console.log("remove message: ", change.doc.data());
					await readUsers();
					console.log(userList);
					let res = userList.filter(isExist);
					console.log(res.length);
				}
			});
		});

		readUsers();
		readAdmin();
	}, []);

	useEffect(() => {
		const cp = [...chats]
		cp.push(newCandidate)
		setChats(cp)	      
	}, [newCandidate])

	useEffect(() => {
		const cp = [...chats]
		const index = cp.findIndex(el => el.uuid === modifyCandidate.uuid)
		cp[index] = modifyCandidate 
		setChats(cp)
	}, [modifyCandidate])

	useEffect(() => {
		setChats(chats.filter(chat => chat.uid !== deleteCandidate.id));
	}, [deleteCandidate])

	const submit = () => {
		if(text === "") {
			alert('메세지를 입력해주세요.')
			return
		}

		const payload = {
			// uidOfUser: jwtToken.uid, //user's uid
			uidOfUserNickName: jwtToken.nickName,
			uidOfUserId: jwtToken.uid,
			content: text, 
			uid: uid,
			created: firebase.firestore.Timestamp.now().seconds
		}
		
		db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(uid).set(payload)
			.then((ref) => {
				setText("");
			})
	
	}

	const outRoom = async () => {
		await db.collection('chatrooms').doc('room_' + roomId).collection('participants').doc(jwtToken.uid).delete();
		history.push("/chat/list");
	}

	const deleteRoom = async () => {
		await db.collection('chatrooms').doc('room_' + roomId).collection('messages').get().then((querySnapshot) => {
			querySnapshot.forEach(async (doc) => {
				await db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(doc.id).collection('emoticons').get().then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						doc.ref.delete();
					});
				})
				await db.collection('chatrooms').doc('room_' + roomId).collection('messages').doc(doc.id).collection('likes').get().then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						doc.ref.delete();
					});
				})
				doc.ref.delete();
			});
	  	});
		await db.collection('chatrooms').doc('room_' + roomId).collection('participants').get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				doc.ref.delete();
			});
	  	});
		await db.collection('chatrooms').doc('room_' + roomId).delete();
		history.push("/chat/list");
	}

	function countActiveRooms(users) {
		console.log("현재 방에 존재하는 user 수 : " + users.filter(user => user.participantNickName).length);
		return users.filter(user => user.participantNickName).length;
	  }

	const usersCount = useMemo(() => countActiveRooms(userList), [userList]);

	
	return (
		<div>
			<div className="header">
                <h1 className="chatListTitle">Chatting Room</h1>
                <div className="logoutBtn" onClick={e => outRoom()} style={{ display: roomInfo.admin===jwtToken.uid?'none':'block' }}>방 나가기</div>
				<div className="logoutBtn" onClick={e => deleteRoom()} style={{ display: roomInfo.admin===jwtToken.uid?'block':'none' }}>방 삭제</div>
				<div className="logoutBtn" onClick={() => { history.push("/chat/list"); }} style={{ display: roomInfo.admin===jwtToken.uid?'block':'none' }}>방 리스트 보기</div>
            </div>
			<div className="chatBoard">
                {
                    chats.map((chat,index) => {
						return < AllChatBoard chat={chat} roomId={roomId} key={index} />
                    })
                }
            </div>
			<hr/>

			<div className="sendBox">
				<input className="sendMessage" type="text" onChange={e => setText(e.target.value)} value={text} placeholder="메세지를 입력하세요" />
				<div className="sendBtn" onClick={submit}>Send</div>
			</div>
			<div className="userList">
				<ol>
					<div style={{ marginBottom:"3px"}}>현재 참여자 : {usersCount} / {roomInfo.partiCount}</div>
					< AllChatParti userList={userList} roomInfo={roomInfo} roomId={roomId} />
				</ol>
			</div>
		</div>
	);
}

export default ChatRoom;