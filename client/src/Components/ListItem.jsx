import React from 'react';
import {OverlayTrigger} from 'react-bootstrap';
import DescriptionCard from './descriptionCard.jsx';

const ListItem = ({post, handleClick}) => {
  let {id, title, description, address} = post;
 // let location = `${props.city}, ${props.state}`;
  return (
    <OverlayTrigger trigger="click" placement="right" overlay={<DescriptionCard/>}>
      <div className="listItem" onClick={() => handleClick(post)}>
        <div>
          <div className="listHeader">{title}</div>
          <div className="listDescription">{address}</div>
        </div>
      </div>
    </OverlayTrigger>
  )
}




export default ListItem;
