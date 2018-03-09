import React from 'react';
import {Jumbotron, Button} from 'react-bootstrap';

const Maintron = (props) => {
  return (
    <Jumbotron >
    <div className="mainText">
      <h1>Support your community today.</h1>
      <p>
       Kindly is a last minute resource aiming to reducing food waste and feeding our hungry communites
      </p>
      <p>
        <Button onClick={() => props.scrollTo()}bsStyle="primary">Help Your Community</Button>
      </p>
      </div>
    </Jumbotron>
  )

}

export default Maintron
