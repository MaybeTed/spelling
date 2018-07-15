import React from 'react';
import axios from 'axios';
import Actions from '../actions/index';
import { withRouter } from 'react-router-dom';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      firstPassword: '',
      confirmPassword: '',
      usernameError: '',
      emailError: '',
      firstPasswordError: '',
      confirmPasswordError: '',
      registrationSuccess: '',
      serverResponseError: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let name = target.name;
    this.setState({ [name]: value }, () => this.checkForErrors(name));
  }

  handleSubmit(event) {
    event.preventDefault();
    const self = this;
    if (!this.validate()) {
      return;
    }
    
    let userInfo = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.firstPassword
    }

    axios.post('/api/register', userInfo)
      .then((response) => {
        if (response.data.success) {
          this.setState({ serverResponseError: '', registrationSuccess: response.data.message }, () => {
            setTimeout(() => {
              Actions.fetchUser();
              self.props.history.push('/');
            }, 1000);
          });
        } else {
          this.setState({ serverResponseError: response.data.message, registrationSuccess: '' });
        }
      })    
  }

  checkForErrors(type) {
    if (type === 'username') {
      this.checkUsername();
    } else if (type === 'email') {
      this.checkEmail();
    } else if (type === 'firstPassword') {
      this.checkFirstPassword();
    } else if (type === 'confirmPassword') {
      this.checkConfirmPassword();
    }
  }

  checkUsername() {
    if (this.state.username.length < 3) {
      this.setState({ usernameError: 'username must be more than 2 characters' });
    } else if (this.state.username.length > 11) {
      this.setState({ usernameError: 'username must be less than 12 characters' });
    } else if (!/^[a-zA-Z0-9_]*$/.test(this.state.username)) {
      this.setState({ usernameError: 'username can not contain special characters besides underscore' });
    } else {
      this.setState({ usernameError: '' });
    }
  }

  checkEmail() {
    if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(this.state.email)) {
      this.setState({ emailError: 'this is not a valid email address' });
    } else {
      this.setState({ emailError: '' });
    }
  }

  checkFirstPassword() {
    if (this.state.firstPassword.length < 5) {
      this.setState({ firstPasswordError: 'password must be a minimum of 5 characters' });
    } else if (this.state.firstPassword.length > 20) {
      this.setState({ firstPasswordError: 'password must be a maximum of 20 characters' });
    } else if (!/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{5,20}$/.test(this.state.firstPassword)) {
      this.setState({ firstPasswordError: 'password must contain at least one uppercase letter, lowercase letter, number, and special character' });
    } else if (this.state.confirmPassword && this.state.firstPassword !== this.state.confirmPassword) {
      this.setState({ firstPasswordError: 'passwords do not match' });
    } else {
      this.setState({ firstPasswordError: '', confirmPasswordError: '' });
    }
  }

  checkConfirmPassword() {
    if (this.state.firstPassword !== this.state.confirmPassword) {
      this.setState({ confirmPasswordError: 'passwords do not match' });
    } else {
      this.setState({ confirmPasswordError: '', firstPasswordError: '' });
    }
  }

  validate() {
    if (this.state.usernameError || this.state.emailError || this.state.firstPasswordError || this.state.confirmPasswordError) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div className="register">
        <div className="page-header">
          <h1>User Registration</h1>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Username:</label>
            <input className={this.state.usernameError ? "error" : ""}
                 type="text"
                 name="username"
                 placeholder="please enter username"
                 value={this.state.username}
                 onChange={this.handleChange}
                 required
            />
            {this.state.usernameError ?
              <p>{this.state.usernameError}</p>
              :
              null
            }
          </div>
          <br />
          <div>
            <label>Email:</label>
            <input className={this.state.emailError ? "error" : ""}
                 type="text"
                 name="email"
                 placeholder="please enter email"
                 value={this.state.email}
                 onChange={this.handleChange}
                 required
            />
            {this.state.emailError ?
              <p>{this.state.emailError}</p>
              :
              null
            }
          </div>
          <br />
          <div>
            <label>Password:</label>
            <input className={this.state.firstPasswordError ? "error" : ""}
                 type="password"
                 name="firstPassword"
                 placeholder="please enter password"
                 value={this.state.firstPassword}
                 onChange={this.handleChange}
                 required
            />
            {this.state.firstPasswordError ?
              <p>{this.state.firstPasswordError}</p>
              :
              null
            }
          </div>
          <br />
          <div>
            <label>Confirm Password:</label>
            <input className={this.state.confirmPasswordError ? "error" : ""}
                 type="password"
                 name="confirmPassword"
                 placeholder="please enter password"
                 value={this.state.confirmPassword}
                 onChange={this.handleChange}
                 required
            />
            {this.state.confirmPasswordError ?
              <p>{this.state.confirmPasswordError}</p>
              :
              null
            }
          </div>
          <br />
          <button type="submit">Register</button>
        </form>

        <br />
        {this.state.registrationSuccess ? 
          <div className="registration-success">{this.state.registrationSuccess}</div>
          :
          null
        }
        {this.state.serverResponseError ? 
          <div className="registration-fail">{this.state.serverResponseError}</div>
          :
          null
        }
      </div>
    )
  }
}

export default withRouter(Register);