import React from 'react';
import {OverlayTrigger} from 'react-bootstrap';
import DescriptionCard from './descriptionCard.jsx';

const ListItem = (props) => {
 let location = `${props.city}, ${props.state}`;
  return (
    <OverlayTrigger trigger="click" placement="right" overlay={<DescriptionCard/>}>
  	<div className="listItem" onClick={function() {
      props.handleClick(props.post);
    }}>
    <div>
      <div className="listHeader">{props.title}</div>
      <div className="listDescription">{location}</div>
    </div>
    </div>
    </OverlayTrigger>
  ) 
}



export default ListItem;
