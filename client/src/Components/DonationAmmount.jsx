import React from 'react'
import {Panel, ListGroup, ListGroupItem, DropdownButton, MenuItem} from 'react-bootstrap'
import axios from 'axios'

class DonationAmmount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      orgs: [],
      selectedYear: null,
      selectedOrg: false
     }
   axios.get('/dontations')
     .then((data) => console.log(data))
  }

  componentWillMount() {

  }

  componentWillUnmount() {
    console.log('unmount')
  }

  handleSelect(e) {
    this.setState({selectedYear: e.target.name})
  }

  render() {
    return (
      <div style={{marginTop: '55px'}}>
      <DropdownButton
        title={'Years'}
        id={`dropdown-years`}
        onSelect={this.handleSelect}
      >
        {this.state.years.map((year, i) => <MenuItem eventKey={i}>{year}</MenuItem>)}
      </DropdownButton>
      <Panel id="collapsible-panel-example-2">
          <Panel.Heading>
            <Panel.Title toggle>
              Title that functions as a collapse toggle
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
            <ListGroup>
              <ListGroupItem>Item 1</ListGroupItem>
              <ListGroupItem>Item 2</ListGroupItem>
            </ListGroup>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </div>
     )
  }
}

export default DonationAmmount;
