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
      badSignup: false
    };

    this.changeToLogin = this.changeToLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  validateForm() {
    return this.state.username.indexOf('@') !== -1 && this.state.username.indexOf('.') !== -1 && this.state.password.length > 0;
  }

  handleChange(event){
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSignup(e){
    e.preventDefault();
    console.log(this.state)
    axios.post('/signup', this.state)
    .then(() => {
      this.setState({username: '', password: '',}, this.changeToLogin());
    }).catch((error) => {
      this.setState({
        badSignup: true
      })
      throw error;
    })
  }

  changeToLogin() {
    ReactDOM.render(<Login />, document.getElementById("app"));
  }

  render() {
    let showAlert;
    if (this.state.badSignup === true) {
      showAlert =
      <Alert bsStyle="danger" onDismiss={() => this.setState({badSignup: false})}>
        <h4>Sorry about that, we couldn't sign you up!</h4>
        <p>Please make sure you entered a valid email address and password.</p>
      </Alert>
    }

    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>E-mail</ControlLabel>
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
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            bsStyle="primary"
            onClick={this.handleSignup}
          >Sign up !
          </Button>
          <Button
            block
            bsSize="large"
            bsStyle="primary"
            type="submit"
            onClick={this.changeToLogin}
          >Already Signed Up? Login!
        </Button> <br/>
        {showAlert}
        </form>
      </div>
    );
  }
}
