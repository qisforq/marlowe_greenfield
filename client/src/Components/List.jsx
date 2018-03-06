import React from 'react';
import ListItem from './listItem.jsx'
import {Tabs, Tab} from 'react-bootstrap'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: false
     }
  }

  handleSelect(key) {
    let handle = {
      'All Posts': this.props.getUnclaimed,
      'My Posts': this.props.getMyPosts,
      'Nearby': this.props.getNearbyUnclaimed
    }

    handle[e.target.name]()
      .then(()=> {
        this.setState({tab: e.target.name})
      })
    this.setState({tab: key})
  }

  render() {

    const { posts, handleClick } = this.props

    return (
      <Tabs
        activeKey={this.state.key}
        onSelect={(e)=>this.handleSelect(e)}
        id="controlled-tab-example"
      >
        {['All Posts', 'My Posts', 'Nearby'].map(tab =>
        <Tab key={tab} name={tab} title={tab}>
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
