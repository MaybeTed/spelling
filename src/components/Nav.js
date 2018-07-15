import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import Actions from '../actions/index';

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

class Nav extends React.Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout() {
    axios.get('/api/logout')
      .then(() => {
        Actions.fetchUser();
        this.props.history.push('/');
      })
  }

  render() {
    return (
      <div className="nav">
        <div className="nav-left">
          <img src="/images/spellingbee.png" alt="logo" />
        </div>
        <div className="nav-right">
          <div><Link to="/"><span>Home</span></Link></div>
          <div><Link to={`/profile/${this.props.auth.user.username}`}><span>Profile</span></Link></div>
          <div><Link to="/leaderboard"><span>Leaderboard</span></Link></div>
          <div onClick={this.logout}><span>Logout</span></div>
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Nav));
