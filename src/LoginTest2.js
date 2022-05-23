import React, { useState } from 'react';

function LoginTest2() {
  const [signupPayload, setSignupPayload] = useState({});

  const onChange = (e, key) => {
    const cp = {...signupPayload}
    cp[key] = e.target.value
    setSignupPayload(cp)
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  const submit = () => {
    if(signupPayload.pw.length < 6) {
      alert('password가 너무 짧습니다.')
      return
    }

    if(!validateEmail(signupPayload.email)){
      alert('올바른 이메일을 입력해주세요');
      return
    }	

    const payload = {
      email: signupPayload.email,
      pw: signupPayload.pw,
      nickName: signupPayload.nickName,
      gender: signupPayload.gender,
      isAgreeInfo: signupPayload.isAgreeInfo,
      signupPath: signupPayload.signupPath
    }
    
    console.log(payload)
  }

  return (
    <div>
      <label>이메일 : </label>
      <input onChange={e => onChange(e, "email")} value={signupPayload.email} placeholder="이메일을 여기에"/>
      <br/><br/>

      <label>비밀번호 : </label>
      <input type="password" onChange={e => onChange(e, "pw")} value={signupPayload.pw} placeholder="비밀번호를 여기에"/>
      <br/><br/>
      
      <label>닉네임 : </label>
      <input onChange={e => onChange(e, "nickName")} value={signupPayload.nickName} placeholder="닉네임을 여기에"/>
      <br/><br/>

      <label>성별 : </label>
      <label>
        <input type="radio" name="gender" id='man' checked={signupPayload.gender === 'man'} value={'man'} onChange={e => onChange(e, "gender")}/>
        남자
      </label>
      <label>
        <input type="radio" name="gender" id='woman' checked={signupPayload.gender === 'woman'} value={'woman'} onChange={e => onChange(e, "gender")}/>
        여자
      </label>
      <br/><br/>
      
      <label>정보 제공 동의 : </label>
      <input checked={signupPayload.isAgreeInfo} value={!signupPayload.isAgreeInfo} type="checkbox" onChange={e => onChange(e, "isAgreeInfo")}/> 
      <br/><br/>
      
      <label>관심사 : </label>
      <select value={signupPayload.signupPath} onChange={e => onChange(e, "signupPath")}> 
        <option value={"search"}>검색</option>
        <option value={"ads"}>광고</option>
        <option value={"etc"}>이외</option>
      </select> 
      <br/><br/>

      <button onClick={submit}>제출</button>
    </div>
  );
}

export default LoginTest2;
