import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Actions from '../actions/index';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      loginSuccess: '',
      serverResponseError: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let name = target.name;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.email !== '' && this.state.password !== '') {
      axios.post('/api/login', {
        email: this.state.email,
        password: this.state.password
      }).then((response) => {
        if (response.data.success) {
          Actions.fetchUser();
          this.props.history.push('/');
        } else {
          this.setState({ serverResponseError: response.data.message });
        }
      })
    }
  }

  render() {
    return (
      <div className="register">
        <div className="page-header">
          <h1>Login</h1>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Email:</label>
            <input type="text"
                 name="email"
                 placeholder="please enter email"
                 value={this.state.email}
                 onChange={this.handleChange}
                 required
            />
          </div>
          <br />
          <div>
            <label>Password:</label>
            <input type="password"
                 name="password"
                 placeholder="please enter password"
                 value={this.state.password}
                 onChange={this.handleChange}
                 required
            />
          </div>
          <br />
          <button type="submit">Login</button>
        </form>

        <br />
        {this.state.serverResponseError ? 
          <div className="registration-fail">{this.state.serverResponseError}</div>
          :
          null
        }
      </div>
    )
  }
}

export default withRouter(Login);
