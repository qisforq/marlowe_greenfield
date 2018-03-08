import React from 'react';
import moment from 'moment';
import {Popover} from 'react-bootstrap';

//This modal pops up when the user clicks a specifie list item
const DescriptionCard = ({featuredItem, claimHandler, tab}) => {
  let {id, title, description, address, lng, lat} = featuredItem;
  console.log(tab)
  console.log('fuck', featuredItem)
  const myImages = featuredItem.photoUrl.slice(1, featuredItem.photoUrl.length - 1).split(',');
	return (
    <Popover className="pop" id="popover-positioned-right" title="Recent Donation">
        <button onClick={()=> console.log(props)}></button>
      <div>
        <h2>{title}</h2>
        <p>{address}</p>
        <p>posted on: {moment(featuredItem.createdAt * 1000).format('MMMM Do YYYY')}</p>
        <p>{description}</p>
        <p>Reach me at: {featuredItem.phone}</p>
        {
          myImages.map((photo) => <img height='150px' width='150px' src={photo} />)
        }
        <div>
        {tab !== 'My Posts' && <button onClick={() => claimHandler(featuredItem)}>Claim</button>}
        </div>
      </div>
    </Popover>
	)
}


export default DescriptionCard;
