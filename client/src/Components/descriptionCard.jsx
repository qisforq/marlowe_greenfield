import React from 'react';
import moment from 'moment';
import {Popover} from 'react-bootstrap';

//This modal pops up when the user clicks a specifie list item
const DescriptionCard = ({featuredItem, claimHandler}) => {
  let {id, title, description, address, lng, lat} = featuredItem;
  console.log(featuredItem)
	return (
    <Popover className="pop" id="popover-positioned-right" title="Recent Donation">
        <button onClick={()=> console.log(props)}></button>
      <div>
        <h2>{title}</h2>
        <p>{address}</p>
        <p>posted on: {moment(featuredItem.createdAt * 1000).format('MMMM Do YYYY')}</p>
        <p>{description}</p>
        <p>Reach me at: {featuredItem.phone}</p>
        <img height='150px' src={featuredItem.photoUrl}/>
        <div>
        <button onClick={() => claimHandler(id)}>Claim</button>
        </div>
      </div>
    </Popover>
	)
}


export default DescriptionCard;
