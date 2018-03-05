import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import ReactDOM from 'react-dom';
import Login from './login.jsx';
import axios from 'axios';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
       zipcode: ""
    };

    this.changeToLogin = this.changeToLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange(event){
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSignup(e){
    e.preventDefault();
    axios.post('/signup', {
      username: this.state.username,
      password: this.state.password,
      zipcode: this.state.zipcode
    }).then(() => {
      this.setState({username: '', password: '', zipcode: ''});
    }).catch((error) => {
      throw error;
    })
  }

  changeToLogin() {
    ReactDOM.render(<Login />, document.getElementById("app"));
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus
              type="Username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
            </FormGroup>
            <FormGroup controlId="zipcode" bsSize="large">
            <ControlLabel>Zipcode</ControlLabel>
            <FormControl
              value={this.state.zipcode}
              onChange={this.handleChange}
              type="zipcode"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            onClick={this.handleSignup}
          >Sign up !
          </Button>
          <Button
            block
            bsSize="large"
            type="submit"
            onClick={this.changeToLogin}
          >Already Signed Up? Login!
          </Button>
        </form>
      </div>
    );
  }
}
