import React, { Component } from 'react';
import axios from 'axios';
import {Grid, Row, Col, FormControl, FormGroup, ControlLabel, Button, ListGroup, ListGroupItem, PageHeader, ButtonGroup} from 'react-bootstrap';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      address: '',
      verified: '',
      toggleEmail: false,
      toggleAddress: false,
    }
    this.saveChanges = this.saveChanges.bind(this)
    this.getUser = this.getUser.bind(this)
    this.editEmail = this.editEmail.bind(this)
    this.editAddress = this.editAddress.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  saveChanges() {
    axios.put('/settings', {
        email: this.state.email,
        address: this.state.address
      }).then((response) => {
        console.log(response, 'axios response for saving settings!');
        this.props.toggleSettings();
      }).catch((error) => {
        console.log(error, 'Error: settings could not be saved');
      });
  }

  editEmail() {
    this.setState({
      toggleEmail: !this.state.toggleEmail,
      email: ''
    });
  }

  editAddress() {
    this.setState({
      toggleAddress: !this.state.toggleAddress,
      address: ''
    });
  }

  getUser() {
    axios.get('/settings')
    .then((results) => {
      let address = results.data[0].address || '630 6th ave';
      let email = results.data[0].email || '';
      let verified = results.data[0].verified || '';
      this.setState({
        email: email,
        address: address,
        verified: verified
      }, () => {
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

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
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
      <div style={{"margin": "15px 15px"}}>
        <div>
          <PageHeader>
            <small>User Settings</small>
          </PageHeader>
        </div>
        <div>
          <Grid>
            <Row className="show-grid">
              <Col xs={3} className="settings">
                <ListGroup>
                  <ListGroupItem className="settings"><strong>Email Address:</strong></ListGroupItem>
                  <ListGroupItem className="settings"><strong>Street Address:</strong></ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs={6}>
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
                          <strong>{this.state.email}</strong>
                        </ListGroupItem>
                      </ListGroup>
                    )}
                  </div>
                  <div>
                    {this.state.toggleAddress ? (
                      <FormControl
                        id="address"
                        type="text"
                        value={this.state.address}
                        placeholder="Enter Street Address"
                        onChange={this.handleChange}
                      />
                    ) : (
                      <ListGroup>
                        <ListGroupItem className="settings settingsForm">
                          <strong>{this.state.address}</strong>
                        </ListGroupItem>
                      </ListGroup>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col xs={3}>
                <ListGroup>
                  <ListGroupItem className="settings">
                    {!this.state.toggleEmail ? (
                      <div className="formButton"><Button onClick={this.editEmail}>Edit Email</Button></div>
                    ) : (
                      <div style={{"padding": "10px 15px"}}></div>
                    )}
                  </ListGroupItem>
                  <ListGroupItem className="settings">
                    {!this.state.toggleAddress && (
                      <div className="formButton"><Button onClick={this.editAddress}>Edit Address</Button></div>
                    )}
                  </ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
          </Grid>
        </div>
        <div className="formButton">
          <ButtonGroup>
            <Button bsStyle="success" onClick={this.saveChanges}>
              Save Changes
            </Button>
            <Button bsStyle="warning" onClick={this.props.toggleSettings}>Cancel</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default Settings;
