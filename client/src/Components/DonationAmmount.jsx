import React from 'react'
import {Panel, ListGroup, ListGroupItem, DropdownButton, MenuItem} from 'react-bootstrap'

class DonationAmmount extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      years: [],
      selected: false
     }
  }

  handleSelect(key) {
    console.log(key)
  }

  render() { 
    return ( 
      <div>
      <DropdownButton
        title={'Years'}
        id={`dropdown-years`}
        onSelect={this.handleSelect}
      >
        <MenuItem eventKey="1">2016</MenuItem>
        <MenuItem eventKey="2">2017</MenuItem>
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