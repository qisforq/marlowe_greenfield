import React from 'react';
import {Modal, Button} from 'react-bootstrap';

//This 'thank you' modal pops up when a users creates a post - feel free to write something more inspirational ;)
class Trigger extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Thank You for Listing! Your Donation Has Been Listed!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
          <p>
            You can expect to hear back from a eager recipient in a matter of days! It is thanks to 
            volunteers like you that keep our vision at Kindly alive.
          </p>
    
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default Trigger;
