import React from 'react';
import ListItem from './ListItem.jsx'
import {Tabs, Tab, PanelGroup, Panel} from 'react-bootstrap'

class List extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { posts, handleClick, handleSelect, currentTab, isOrg, featuredItem, claimHandler } = this.props
    console.log(this.props);
    return (
      <Tabs
        activeKey={currentTab}
        onSelect={handleSelect}
        id="controlled-tab-example"
      >
        {(isOrg ? ['All Posts', 'My Posts', 'Nearby', 'Claimed'] : ['My Posts', 'My Claimed', 'Nearby']).map(tab =>
        <Tab key={tab} eventKey={tab} title={tab}>
          <div className="list" style={{overflow:'auto', height:'450px'}}>
            <PanelGroup id='accordion' accordion>
              { posts.map((post, idx) =>
                <ListItem
                  key={idx}
                  post={post}
                  handleClick={handleClick}
                  tab={tab}
                  featuredItem = {featuredItem}
                  claimHandler={claimHandler}
                />
              )}
            </PanelGroup>
          </div>
        </Tab>)}
      </Tabs>
     )
  }
}

export default List;
