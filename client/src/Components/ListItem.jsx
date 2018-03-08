import React from 'react';
import {OverlayTrigger, PanelGroup, Panel} from 'react-bootstrap';
import DescriptionCard from './descriptionCard.jsx';

//This component renders each panel that is within the accordion. It takes the DescriptionCard component as it's body.
const ListItem = ({post, handleClick, tab, featuredItem, claimHandler}) => {
  let {id, title, description, address} = post;
  return (
    <Panel eventKey={id}>
      <Panel.Heading style={{backgroundColor:'#71d9ee'}}>
        <Panel.Title toggle onClick={() => handleClick(post)}>{title} - {address}</Panel.Title>
      </Panel.Heading>
      <Panel.Body collapsible>
        <DescriptionCard featuredItem={featuredItem} claimHandler={claimHandler} tab={tab}/>
      </Panel.Body>
    </Panel>

  )
}




export default ListItem;
