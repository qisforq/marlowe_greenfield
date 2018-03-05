import React from 'react';
import moment from 'moment';
import {Popover} from 'react-bootstrap';

//This modal pops up when the user clicks a specifie list item
const DescriptionCard = (props) => {
	
	return (
    <Popover className="pop" id="popover-positioned-right" title="Recent Donation">
      <div >
        <h2>{props.featuredItem.title}</h2>
        <p>{props.featuredItem.city}, {props.featuredItem.state} {props.featuredItem.address}</p>
        <p>posted on: {moment(props.featuredItem.createdAt * 1000).format('MMMM Do YYYY')}</p>
        <p>{props.featuredItem.description}</p>
        <p>Reach me at: {props.featuredItem.phone}</p>
        <img height='150px' src={props.featuredItem.photoUrl}/>
        <div>
        <button onClick={() => props.claimHandler(props.featuredItem.id)}>Claim</button>
        </div>
      </div>
    </Popover>
	)
}


export default DescriptionCard;
