import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

function App() {
  const delay = (seconds) => new Promise((res) => setTimeout(res, seconds));

  const delayAndAlert = async (seconds) => {
    await delay(seconds);
    console.log("ALERT!");
  }

  delayAndAlert(5000);

  console.log("여기가 가장 마지막에 되어야 하는데 되나요");

  return(
    <div></div>
  );
}

export default App;
