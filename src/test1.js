import React from 'react';

// parentheses ()
function test1() {
  // what is jsx?
  // javascript의 익스텐션으로, html과 Javascript를 함께 쓰게 하는 문법입니다.  앞으로 계속 쓰게 될 예정입니다.
  const element = <h1>Hello, world!</h1>;

  let companyName = "Ringle";
  const element2 = <h1>Hi! this is {companyName}</h1>

  // 아래 두개는 동일하다.
  const tag1 = <h1>Hello</h1>;
  const tag2 = React.createElement("h1", {}, "Hello"); // 1번 라인 import해줌

  var isThisChanging = "not changing";
	
	const trigger = () => {
		isThisChanging = "changing";
	}	

  // return 에 있는 div 태그로 감싸져 있는 부분도 jsx입니다.
  // {isThisChanging} 이 부분은 수정되어 보이지 않는다. 
  // 왜냐면 리액트 관점에서는 스테이트가 변한게 아니라 그저 변수가 바뀐 것이기 때문 => 뒤에서 나올 useState를 사용하여 이러한 것들을 가능하게 할 예정
  return (
    <div>
      이곳은 html영역입니다.
      {element} 
      {element2} 
      {tag1} 
      {tag2} 
      {isThisChanging} 
      <div onClick={trigger}>Try to Change</div>
    </div>
  );
}

export default test1;
