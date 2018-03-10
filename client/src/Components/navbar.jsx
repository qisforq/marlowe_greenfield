import React from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import {Glyphicon, Nav, Navbar, NavDropdown, NavItem, MenuItem} from 'react-bootstrap';


class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      verified: false,
      org: ''
    }
    this.getUser = this.getUser.bind(this)
  }

  getUser() {
    console.log("RUN GETUSER");
    axios.get('/settings').then((results) => {
      console.log("GET DATA FOR USER:", results.data);
      let email = results.data[0].email || '';
      let org = results.data[0].org || '';
      let verified = results.data[0].verified;
      this.setState({
        email: email,
        verified: verified,
        org: org
      }, () => console.log("navbar state:",results.data))
    })
    .catch((err) => console.log('ERROR:', err))
  }
  componentDidMount() {
    this.getUser();
  }


  render () {
    const { scrollTo, onLogout, handlePage } = this.props;
    console.log(this.props.verStatus, "verstat<<<");

    return (
      <Navbar fixedTop fluid staticTop bsStyle='pills' style={{backgroundColor: 'white'}}>
        <Navbar.Header>
          <Navbar.Brand  href="#">
            <a name={'main'} onClick={handlePage} href="#home">Kindly</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} name={'recent'} href="#" onClick={scrollTo}>
            Recent Posts
          </NavItem>
          <NavItem eventKey={2} name={'deduction'} href="#" onClick={handlePage}>
            Deductions
          </NavItem>
        </Nav>
        <Nav pullRight>
          <Navbar.Text style={{marginTop: "12px"}}>
            <div style={{color: "#7ea9d1", fontSize: "17px"}}>
              <span>
                {(this.state.org) ? (<span>Hello, {this.state.org}&nbsp;</span>): (<span>Hello, {this.state.email}&nbsp;</span>)}
              </span>
              <span>
                {this.state.verified &&
                  (<Glyphicon glyph={"ok-sign"} style={{color: "#5cb85c"}}/>)}
              </span>
            </div>

          </Navbar.Text>
          <NavItem eventKey={3} name={'settings'} href="#" onClick={handlePage}>
            Settings
          </NavItem>
          <NavItem eventKey={4} name={'logout'} href="#" onClick={onLogout}>
          Log Out
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default NavigationBar;
