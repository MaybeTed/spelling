import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Actions from '../actions/index';
import Nav from './Nav';
import Home from './Home';
import Splash from './Splash';
import Register from './Register';
import Login from './Login';
import Leaderboard from './Leaderboard';
import Profile from './Profile';

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

class App extends React.Component {
  componentDidMount() {
    Actions.fetchUser();
  }

  render() {
    return (
      <div className="app">
        {this.props.auth && this.props.auth.user && <Nav />}
        {this.props.auth && this.props.auth.user && <div className="nav-space" />}
        <Switch>
          <Route exact path="/" render={() => {
            if (this.props.auth && this.props.auth.user) {
              return (<Home />);
            } else {
              return (<Splash />);
            }
          }} />
          <Route path="/register" render={() => (<Register />)} />
          <Route path="/login" render={() => (<Login />)} />
          <Route path="/leaderboard" render={() => (<Leaderboard />)} />
          <Route path="/profile/:user" render={(props) => (<Profile {...props} />)} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(App));
