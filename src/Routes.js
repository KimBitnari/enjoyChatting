import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import App from './App';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/test" component={App}/>
          <Route exact path="/" component={Landing}/>
          <Route exact path="/users/signup" component={SignUp}/>
          <Route exact path="/users/login" component={Login}/>
          <Route exact path="/chat/list" component={ChatList}/>
          <Route exact path="/chat/room/:roomId" component={ChatRoom}/>
        </Switch>
      </Router>
    )
  }
}

export default Routes;