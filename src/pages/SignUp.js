import React, {useState, useEffect} from 'react';
import { Link, useHistory } from "react-router-dom";
import {db, firebaseApp, firebase} from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import {setUserProfile} from '../reducers/user';
import '../css/SignUp.css';

const SignUp = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
	const [pw, setPw] = useState("");
	const [nickName, setNickName] = useState("");

    const onEmailChange = (e) => {
        setEmail(e.target.value)
      }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
      }

    const onPwChange = (e) => {
        setPw(e.target.value)
      }
    
    const onNickNameChange = (e) => {
        setNickName(e.target.value)
      }
    
    const submit = (e) => {
        if(pw.length < 6) {
          alert('password가 너무 짧습니다.')
          return
        }
    
        if(!validateEmail(email)){
          alert('올바른 이메일을 입력해주세요');
          return
        }	 

        e.preventDefault();

        firebaseApp.auth().createUserWithEmailAndPassword(email, pw)
        .then((user) => {
            const uid = (firebaseApp.auth().currentUser || {}).uid;
            
            if(uid){
                db.collection('users').doc(uid).set({
                    email: email,
                    nickName: nickName,
                    uid: uid,
                    created: firebase.firestore.Timestamp.now().seconds,
                });

                const payload = {
                    email: email,
                    pw: pw,
                    nickName: nickName,
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
            console.log(error);
        });
    }

    return (
        <div>
            <div className="backBtn" onClick={() => {
            history.push("/");
            }}>← 뒤로 가기</div>
            <div className="sign-up-wrap">
                <h1 className="title">회원가입</h1>
                <form className="sign-up-form" onSubmit={submit}>
                    <div>
                        <input className="sign-up-text" type="text" name="nickName" value={nickName} onChange={e => onNickNameChange(e)} placeholder="닉네임을 입력하세요."/> 
                    </div>
                    <div>
                        <input className="sign-up-text" type="email" name="email" value={email} onChange={e => onEmailChange(e)} placeholder="이메일을 입력하세요."/> 
                    </div>
                    <div>
                        <input className="sign-up-text" type="password" name="pw" value={pw} onChange={e => onPwChange(e)} placeholder="비밀번호를 입력하세요."/>
                    </div>
                    <div>
                        <button className="sign-up-submitBtn" type="submit">회원가입 하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp