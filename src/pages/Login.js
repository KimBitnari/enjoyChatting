import React, {useState, useEffect} from 'react';
import { Link, useHistory } from "react-router-dom";
import {db, firebaseApp, firebase} from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import {setUserProfile} from '../reducers/user';
import '../css/SignUp.css';

const Login = () => {
	const history = useHistory();
    const dispatch = useDispatch();

	const [email, setEmail] = useState("");
	const [pw, setPw] = useState("");

	const onEmailChange = (e) => {
        setEmail(e.target.value)
      }

    const onPwChange = (e) => {
        setPw(e.target.value)
      }

	const submit = (e) => {  
		e.preventDefault();

		firebaseApp.auth().signInWithEmailAndPassword(email, pw)
		.then(async (user) => {
			const uid = (firebaseApp.auth().currentUser || {}).uid
			if(uid){
				const userRef = db.collection('users').doc(uid);
				const doc = await userRef.get();
				var u = doc.data();

				const payload = {
					email: email,
					pw: pw,
					nickName: u.nickName,
					uid: uid
				}
				dispatch(setUserProfile(payload));

				history.push('/chat/list');
			}else{
				alert('error');
			}
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			alert('회원가입을 해주세요!');
			history.push('/users/signup');
		});
	}

	return (
        <div>
			<div className="backBtn" onClick={() => {
            history.push("/");
            }}>← 뒤로 가기</div>
            <div className="sign-up-wrap">
                <h1 className="title">로그인</h1>
                <form className="sign-up-form" onSubmit={submit}>
                    <div>
                        <input className="sign-up-text" type="email" name="email" value={email} onChange={e => onEmailChange(e)} placeholder="이메일을 입력하세요."/> 
                    </div>
                    <div>
                        <input className="sign-up-text" type="password" name="pw" value={pw} onChange={e => onPwChange(e)} placeholder="비밀번호를 입력하세요."/>
                    </div>
                    <div>
                        <button className="sign-up-submitBtn" type="submit">로그인</button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default Login