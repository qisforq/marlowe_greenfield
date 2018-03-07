import React from 'react';
import ListItem from './listItem.jsx'
import {Tabs, Tab} from 'react-bootstrap'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: false
     }

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(key) {
    let handle = {
      'All Posts': this.props.getUnclaimed,
      'My Posts': this.props.getMyPosts,
      'Nearby': this.props.getNearbyUnclaimed
    }
    console.log('handle:', handle, 'key:', key);
    console.log('this.props',this.props);
    handle[key]()
      .then(()=> {
        this.setState({tab: key})
      })
  }

  render() {
    const { posts, handleClick } = this.props
    return (
      <Tabs
        activeKey={this.state.tab}
        onSelect={this.handleSelect}
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
