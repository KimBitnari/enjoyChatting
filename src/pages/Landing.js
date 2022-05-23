import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import '../css/Landing.css';

const Landing = () => {
  const history = useHistory();
  return <div>
    <div className="first"></div>
    <h1 className="title">Enjoy Chatting !</h1>
    <div onClick={() => {
      history.push("/users/login");
    }} className="button">로그인하러 가기</div>
    <br/><br/>

    <div onClick={() => {
      history.push("/users/signup");
    }} className="button">회원가입</div>
  </div>
}

export default Landing