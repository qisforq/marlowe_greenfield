import React, { Component } from 'react';
import axios from 'axios';
import {Grid, Row, Col, Label, FormControl, FormGroup, ControlLabel, Button, ListGroup, ListGroupItem, PageHeader, ButtonGroup} from 'react-bootstrap';

import GoogleSearchBox from "./autocomplete.jsx"

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      email: '',
      address: '',
      lat: '',
      lng: '',
      verified: '',
      org: '',
      phone: '',
      toggleVer: false,
      togglePhone: false,
      toggleEmail: false,
      toggleAddress: false,
      toggleOrg: false,
    }
    this.saveChanges = this.saveChanges.bind(this)
    this.getUser = this.getUser.bind(this)
    this.editEmail = this.editEmail.bind(this)
    this.editPhone = this.editPhone.bind(this)
    this.editAddress = this.editAddress.bind(this)
    this.editOrg = this.editOrg.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.autocompleteHandler= this.autocompleteHandler.bind(this);
    this.verify= this.verify.bind(this);
  }

  saveChanges() {

    axios.put('/settings', {
        email: this.state.email,
        address: this.state.address,
        lng: this.state.lng,
        lat: this.state.lat,
        org: this.state.org,
        phone: this.state.phone
      }).then((response) => {
        console.log(response, 'axios response for saving settings!');
        this.props.toggleSettings();
      }).catch((error) => {
        console.log(error, 'Error: settings could not be saved');
      });
  }

  editEmail() {
    let eml = this.state.email;
    if (eml === `(none)`) {
      eml = ''
    }
    this.setState({
      toggleEmail: !this.state.toggleEmail,
      email: eml
    });
  }

  editPhone() {
    let pho = this.state.phone;
    if (pho === `(none)`) {
      pho = ''
    }
    this.setState({
      togglePhone: !this.state.togglePhone,
      phone: pho
    });
  }

  editAddress() {
    let addr = this.state.address;
    if (addr === `(none)`) {
      addr = ''
    }
    this.setState({
      toggleAddress: !this.state.toggleAddress,
      address: addr
    });
  }

  editOrg() {
    let orgn = this.state.org;
    if (orgn === `(none)`) {
      orgn = '';
    }
    this.setState({
      toggleOrg: !this.state.toggleOrg,
      org: orgn
    });
  }

  getUser() {
    axios.get('/settings')
    .then((results) => {
      let address = results.data[0].address || '';
      let email = results.data[0].email || '';
      let id = results.data[0].id || '';
      let org = results.data[0].org || '';
      let lng = results.data[0].lng || '';
      let lat = results.data[0].lat || '';
      let phone = results.data[0].phone || '';
      let verified = results.data[0].verified;

      this.setState({
        id: id,
        email: email,
        address: address,
        verified: verified,
        org: org,
        phone: phone
      }, () => {
        console.log(this.state.verified);
        if (!this.state.email) {
          this.setState({
            toggleEmail: !this.state.toggleEmail,
          })
        }
        if (!this.state.address) {
          this.setState({
            toggleAddress: !this.state.toggleAddress,
          })
        }
      });
    })
    .catch((err) => console.log('ERROR:', err))
  }

  verify() {
    axios.post('/verified/email', {
      email: this.state.email,
      id: this.state.id,
    })
    this.setState({
      toggleVer: !this.state.toggleVer
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  autocompleteHandler(locationObj) {
    this.setState({
      address: locationObj.address,
      lng:locationObj.longitude,
      lat:locationObj.latitude,
    }, () => {
      console.log(locationObj, locationObj.lat, "<<<lat and long");
    });
  }

  componentDidMount() {
    this.getUser();
  }

  componentWillMount() {
    this.getUser();
  }

  render() {
    return (
      <div style={{"margin": "50px 15px"}}>
        <div>
          <PageHeader style={{marginTop: '60px'}}>
            <small>User Settings</small>
          </PageHeader>
        </div>
        <div>
          <Grid className="pull-left" style={{"marginLeft": "15px"}}>
            <Row className="show-grid">
              <Col xs={3} md={2} style={{"width":"150px"}} className="settingsLabel">
                <ListGroup>
                  <ListGroupItem className="settingsLabel2">
                    <strong>Email Address:</strong>
                  </ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs={6} md={6} className="settingsForm2">
                <FormGroup bsClass="settings">
                  <div>
                    {this.state.toggleEmail ? (
                      <FormControl
                        id="email"
                        type="text"
                        value={this.state.email}
                        placeholder="Enter Email Address"
                        onChange={this.handleChange}
                      />
                    ) : (
                      <ListGroup>
                        <ListGroupItem className="settings settingsForm">
                          <strong>{this.state.email || `(none)`}</strong>
                        </ListGroupItem>
                      </ListGroup>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col xs={3} md={4} className="settingsButton2">
                <ListGroup>
                  <ListGroupItem className="settings">
                    {!this.state.toggleEmail ? (
                      <div className="formButton settingsButton"><Button onClick={this.editEmail}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Edit Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button></div>
                    ) : (
                      <div className="formButton settingsButton"><Button disabled >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Edit Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button></div>
                    )}
                  </ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={3} md={2} style={{"width":"150px"}} className="settingsLabel">
                <ListGroup>
                  <ListGroupItem className="settingsLabel2">
                    <strong>Street Address:</strong>
                  </ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs={6} md={6} className="settingsForm2">
                <FormGroup bsClass="settings">
                  <div>
                    {this.state.toggleAddress ? (
                      <GoogleSearchBox
                        id="address"
                        autocompleteHandler={this.autocompleteHandler}
                      />
                      // {/* <FormControl
                      //   id="address"
                      //   type="text"
                      //   value={this.state.address}
                      //   placeholder="Enter Street Address"
                      //   onChange={this.handleChange}
                      // /> */}
                    ) : (
                      <ListGroup>
                        <ListGroupItem className="settings settingsForm">
                          <strong>{this.state.address || `(none)`}</strong>
                        </ListGroupItem>
                      </ListGroup>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col xs={3} md={4} className="settingsButton2">
                <ListGroup>
                  <ListGroupItem className="settings">
                    {!this.state.toggleAddress ? (
                      <div className="formButton settingsButton"><Button onClick={this.editAddress}>&nbsp;&nbsp;&nbsp;&nbsp;Edit Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button></div>
                    ) : (
                      <div className="formButton settingsButton"><Button disabled >&nbsp;&nbsp;&nbsp;&nbsp;Edit Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button></div>
                    )}
                  </ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={3} md={2} style={{"width":"150px"}} className="settingsLabel">
                <ListGroup>
                  <ListGroupItem className="settingsLabel2">
                    <strong>Phone Number:</strong>
                  </ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs={6} md={6} className="settingsForm2">
                <FormGroup bsClass="settings">
                  <div>
                    {this.state.togglePhone ? (
                      <FormControl
                        id="phone"
                        type="text"
                        value={this.state.phone}
                        placeholder="Enter Phone Address"
                        onChange={this.handleChange}
                      />
                    ) : (
                      <ListGroup>
                        <ListGroupItem className="settings settingsForm">
                          <strong>{this.state.phone || `(none)`}</strong>
                        </ListGroupItem>
                      </ListGroup>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col xs={3} md={4} className="settingsButton2">
                <ListGroup>
                  <ListGroupItem className="settings">
                    {!this.state.togglePhone ? (
                      <div className="formButton settingsButton"><Button onClick={this.editPhone}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Edit Phone&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button></div>
                    ) : (
                      <div className="formButton settingsButton"><Button disabled>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Edit Phone&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button></div>
                    )}
                  </ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={3} md={2} style={{"width":"150px"}} className="settingsLabel">
                <ListGroup>
                  <ListGroupItem className="settingsLabel2">
                    <strong>Organization:</strong>
                  </ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs={6} md={6} className="settingsForm2">
                <FormGroup bsClass="settings">
                  <div>
                    {this.state.toggleOrg ? (
                      <FormControl
                        id="org"
                        type="text"
                        value={this.state.org}
                        placeholder="Enter Org"
                        onChange={this.handleChange}
                      />
                    ) : (
                      <ListGroup>
                        <ListGroupItem className="settings settingsForm">
                          <strong>{this.state.org || `(none)`}</strong>
                        </ListGroupItem>
                      </ListGroup>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col xs={3} md={4} className="settingsButton2">
                <ListGroup>
                  <ListGroupItem className="settings">
                    {!this.state.toggleOrg ? (
                      <div className="formButton settingsButton"><Button onClick={this.editOrg}>&nbsp;Edit Organization&nbsp;</Button></div>
                    ) : (
                      <div className="formButton settingsButton"><Button disabled>&nbsp;Edit Organization&nbsp;</Button></div>
                    )}
                  </ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={3} md={2} style={{"width":"150px"}} className="settingsLabel">
                <ListGroup>
                  <ListGroupItem className="settingsLabel2">
                    <strong>Verification Status:</strong>
                  </ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs={6} md={6}
                // className="settingsForm2"
                >
                {
                  (this.state.verfied !== 0 && this.state.verified !== null)
                  ?
                  (<h3><Label bsStyle="success">Verified</Label></h3>)
                  :
                  ((<h3><Label bsStyle="danger">Not verified</Label></h3>))
                }
              </Col>
              <Col xs={3} md={4} className="settingsButton2">
                <ListGroup>
                  <ListGroupItem className="settings">
                    {!this.state.toggleVer ? (
                      <div className="formButton settingsButton"><Button onClick={this.verify}>Verify Organization</Button></div>
                    ) : (
                      <div className="formButton settingsButton"><Button disabled>Request sent!</Button></div>
                    )}
                  </ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
            <Row>
              <div className="formButton settingsButton">
                <ButtonGroup style={{"marginTop": "25px"}}>
                  <Button bsStyle="success" onClick={this.saveChanges}>
                    Save Changes
                  </Button>
                  <Button bsStyle="warning" onClick={this.props.toggleSettings}>Cancel</Button>
                </ButtonGroup>
              </div>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Settings;
