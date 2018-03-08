import React from 'react';
import ListItem from './listItem.jsx'
import {Tabs, Tab} from 'react-bootstrap'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     }

  }


  

  render() {
    const { posts, handleClick, handleSelect, currentTab } = this.props
    return (
      <Tabs
        activeKey={currentTab}
        onSelect={handleSelect}
        id="controlled-tab-example"
      >
        {['All Posts', 'My Posts', 'Nearby'].map(tab =>
        <Tab key={tab} eventKey={tab} title={tab}>
          <div className="list">
            <ul>
              { posts.map((post, idx) =>
                <ListItem
                  key={idx}
                  post={post}
                  handleClick={handleClick}
                  tab={tab}
                />
              )}
            </ul>
          </div>
        </Tab>)}
      </Tabs>
     )
  }
}

export default List;
