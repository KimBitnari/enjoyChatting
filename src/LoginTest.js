import React, { useState } from 'react';

function LoginTest() {
  // 스테이트 선언
  // 선언하는 방법 : const [nameOfState, setNameOfState] = useState(초기값)
  // camel case : 소문자로 시작을 하되, 다음단어는 대문자로 적는 형식
  const [email, setEmail] = useState("");
	const [pw, setPw] = useState("");
	const [nickName, setNickName] = useState("");
	const [isAgreeInfo, setIsAgreeInfo] = useState(false);
	const [signupPath, setSignupPath] = useState("");
  const [gender, setGender] = useState("")

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

  const updateGender = (radioBtnName) => {
    setGender(radioBtnName)
  }

  const updateIsAgreeInfo = () => {
    setIsAgreeInfo(prev => !prev)
    // (or) setIsAgreeInfo(!isAgreeInfo)
  }

  const onSignupPathChange = (e) => {
    setSignupPath(e.target.value)
  }

  const submit = () => {
    if(pw.length < 6) {
      alert('password가 너무 짧습니다.')
      return
    }

    if(!validateEmail(email)){
      alert('올바른 이메일을 입력해주세요');
      return
    }	

    const payload = {
      email: email,
      pw: pw,
      nickName: nickName,
      gender: gender,
      isAgreeInfo: isAgreeInfo,
      signupPath: signupPath
    }
    
    console.log(payload)
    //call api!
  }

  return (
    <div>
      <label>이메일 : </label>
      <input value={email} onChange={e => onEmailChange(e)} placeholder="이메일을 여기에"/> 
      <br/><br/>

      <label>비밀번호 : </label>
      <input type="password" value={pw} onChange={e => onPwChange(e)} placeholder="비밀번호를 여기에"/> 
      <br/><br/>
      
      <label>닉네임 : </label>
      <input value={nickName} onChange={e => onNickNameChange(e)} placeholder="닉네임을 여기에"/> 
      <br/><br/>

      <label>성별 : </label>
      <label>
        <input type="radio" name="gender" id='man' checked={gender === 'man'} onClick={() => updateGender('man')}/>
        남자
      </label>
      <label>
        <input type="radio" name="gender" id='woman' checked={gender === 'woman'} onClick={() => updateGender('woman')}/>
        여자
      </label>
      <br/><br/>
      
      <label>정보 제공 동의 : </label>
      <input checked={isAgreeInfo} type="checkbox" onClick={e => updateIsAgreeInfo()}/> 
      <br/><br/>
      
      <label>관심사 : </label>
      <select value={signupPath} onChange={e => onSignupPathChange(e)}> 
        <option value={"search"}>검색</option>
        <option value={"ads"}>광고</option>
        <option value={"etc"}>이외</option>
      </select> 
      <br/><br/>

      <button onClick={submit}>제출</button>
    </div>
  );
}

export default LoginTest;
