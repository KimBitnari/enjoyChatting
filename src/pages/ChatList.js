import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setUserProfile } from '../reducers/user';
import {db, firebaseApp, firebase} from '../firebase'
import { v4 as uuidv4 } from 'uuid';
import '../css/ChatList.css';
import AllChatRoom from '../components/AllChatRoom'

const ChatList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const jwtToken = useSelector((state) => state.user.userProfile);

    const [chatrooms, setChatrooms] = useState([]);
    const [toggle, setToggle] = useState(true);
    const [button, setButton] = useState("방 만들기");
    
    function result() {
        return new Promise(async (resolve, reject) => {
            const querySnapshot = await db.collection('chatrooms').get();
            const chatData = querySnapshot.docs.map(doc => doc.data());
            console.log(chatData);
            resolve(chatData);
        });
        
    }

    async function readChat() {
        const cData = await result();
        setChatrooms(cData);
    }

    useEffect(() => {
        readChat();
    },[]);

    const [title, setTitle] = useState("");
	const [pw, setPw] = useState("");
    const [participantCnt, setParticipantCnt] = useState("∞");

    const onTitleChange = (e) => {
        setTitle(e.target.value)
      }

    const onPwChange = (e) => {
        setPw(e.target.value)
      }

    const onPartiChange = (e) => {
        setParticipantCnt(e.target.value)
      }

    const submit = async (e) => {
        if(title === "") {
          alert('채팅방 제목을 입력해주세요.')
          return
        }

        e.preventDefault();

        const roomId = uuidv4();

        await db.collection('chatrooms').doc("room_" + roomId).set({
            title: title,
            pw: pw,
            admin: jwtToken.uid,
            id: roomId,
            partiCount: participantCnt,
            created: firebase.firestore.Timestamp.now().seconds,
        });

        await db.collection('chatrooms').doc("room_" + roomId).collection('participants').doc(jwtToken.uid).set({
            participant: jwtToken.uid,
            participantNickName: jwtToken.nickName,
            created: firebase.firestore.Timestamp.now().seconds,
        });

        history.push('/chat/room/'+roomId);
    }

    const onToggle = (e) => {
        if(!toggle) setButton("방 만들기")
        else setButton("취소")  

        setToggle(!toggle);
    }

    const logout = async (e) => {
        await firebaseApp.auth().signOut();
        dispatch(setUserProfile(""));
        history.push('/');
    }

	return (
        <div>
            <div className="header">
                <h1 className="chatListTitle">Chatting List</h1>
                <div className="logoutBtn" onClick={e => logout()}>로그아웃</div>
                <div className="logUser">{jwtToken.nickName}님 환영합니다!</div>
            </div>
            <div className='roomAddBtn' onClick={() => onToggle()} >{button}</div>
            <div className="sign-up-wrap" style={{ display: toggle?'none':'block' }}>
                <h4 className="title">채팅방 만들기</h4>
                <form className="sign-up-form" onSubmit={submit}>
                    <div>
                        <label>방 제목 : </label>
                        <input className="sign-up-text" type="text" name="title" value={title} onChange={e => onTitleChange(e)} placeholder="채팅방 제목을 입력하세요."/> <br/>
                        <samp>필수 아님! 입력시 private한 채팅방이 만들어집니다.</samp>
                    </div>
                    <div>
                        <label>방 비밀번호 : </label>
                        <input className="sign-up-text" type="password" name="pw" value={pw} onChange={e => onPwChange(e)} placeholder="비밀번호를 입력하세요."/><br/>
                        <samp>필수 아님! 입력시 제한된 인원만 채팅방에 참여할수있습니다.</samp>
                    </div>
                    <div>
                        <label>참여 인원 : </label>
                        <input className="sign-up-text" type="number" name="participantCnt" value={participantCnt} onChange={e => onPartiChange(e)} placeholder="참여 제한 인원을 입력하세요."/> 
                    </div>
                    <div>
                        <button type="submit" className="sign-up-submitBtn">만들기</button>
                    </div>
                </form>
            </div>
            <div>
                <div className="roomList">
                    <h3>모든 방 리스트</h3>
                    < AllChatRoom chatroomsOrigin={chatrooms} isAdmin={false} />
                </div>
                <div className="roomList">
                    <h3>내가 만든 방 리스트</h3>
                    < AllChatRoom chatroomsOrigin={chatrooms} isAdmin={true} />
                </div>
            </div>
        </div>
    );
}

export default ChatList;