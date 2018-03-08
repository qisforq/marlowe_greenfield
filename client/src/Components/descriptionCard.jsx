import React from 'react';
import moment from 'moment';
import {Popover, Panel} from 'react-bootstrap';

//This renders the description for each panel and it goes inside the panel body..
const DescriptionCard = ({featuredItem, claimHandler, tab}) => {
  let {id, title, description, address, lng, lat} = featuredItem;
  let myImages = null;
  let showImages;
  if (featuredItem.photoUrl) {
    myImages = featuredItem.photoUrl.slice(1, featuredItem.photoUrl.length - 1).split(',');
    if(myImages.length<=1){
      myImages = []
    }
    showImages = myImages.map((photo) => <img height='150px' width='150px' src={photo} />)
  }
	return (
      <div>
        <h2>{title}</h2>
        <p>{address}</p>
        <p>posted on: {moment(featuredItem.createdAt * 1000).format('MMMM Do YYYY')}</p>
        <p>{description}</p>
        <p>Reach me at: {featuredItem.phone}</p>
          {
            myImages === null  ? <p></p> : showImages
          }
        <div>
        {tab !== 'My Posts' && <button onClick={() => claimHandler(featuredItem)}>Claim</button>}
        </div>
      </div>
	)
}


export default DescriptionCard;
