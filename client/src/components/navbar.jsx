import React from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import {Nav, Navbar, NavDropdown, NavItem, MenuItem} from 'react-bootstrap';


class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
  }



  render () {
    const { scrollTo, onLogout, handlePage } = this.props;

    return (
      <Navbar fixedTop fluid staticTop>
        <Navbar.Header>
          <Navbar.Brand  href="#">
            <a name={'main'} onClick={handlePage} href="#home">Kindly</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} name={'recent'} href="#" onClick={scrollTo}>
            Recent Posts
          </NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={2} name={'settings'} href="#" onClick={handlePage}>
            Settings
          </NavItem>
          <NavItem eventKey={3} name={'deduction'} href="#" onClick={handlePage}>
            Deductions
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
