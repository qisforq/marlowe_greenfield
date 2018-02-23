import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import NavigationBar from "./components/navbar.jsx";
import Maintron from "./components/jumbotron.jsx";
import List from "./components/list.jsx";
import Form from "./components/form.jsx";
import DescriptionCard from "./components/descriptionCard.jsx";
import LoginPage from "./components/login.jsx"
import Signup from "./components/signup.jsx"
import MapComponent from "./components/googleMaps.jsx"
import Trigger from "./components/responsiveButton.jsx"
import { Link, DirectLink, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lgShow: false,
      posts: [],
      featuredItem: {
        title: null,
        description: null,
        id: null
      },
      show: false,
      latitude: 40.750576,
      longitude: -73.976437
    };
    this.retrievePosts = this.retrievePosts.bind(this);
    // this.savePosts = this.savePosts.bind(this);
    this.changeFeatured = this.changeFeatured.bind(this);
    this.handleClaim = this.handleClaim.bind(this);
    this.resetFormView = this.handleClaim.bind(this);
    this.lgShow = this.lgShow.bind(this);
    this.lgClose = this.lgClose.bind(this);
    this.ScrollTo = this.ScrollTo.bind(this);
  }

  componentDidMount() {
    this.retrievePosts();
  }

  changeFeatured(listItem) {
    if (this.state.show === false){
      this.setState({ featuredItem: listItem,
                    show: true
     });
      let address = `${listItem.address}, ${listItem.city}, ${listItem.state} ${listItem.zipCode}`;
      axios.post('/latlong', {address: address})
        .then(result => {
          console.log(result.data.lat, result.data.long);
          this.setState({
            latitude: Number(result.data.lat),
            longitude: Number(result.data.long)
          })
        })
    }
    else if(this.state.show === true){
      if (this.state.featuredItem.id === listItem.id){
        this.setState({
          show: false
        })
      }else{
        this.setState({
          featuredItem: listItem,
          show: true
        })
      }
    }

  }

  retrievePosts() {
    axios
      .get("/fetch")
      .then(results => {
        this.setState({
          posts: results.data
        })
      })
      .catch(function(error) {
        console.log("There was an error retrieving posts.", error);
      });
  }

  handleClaim(claimedPostID) {
    console.log("claimedPost clicked", claimedPostID);
    axios
      .post("/updateentry", {
        postID: claimedPostID
      })
      .then(done => {
        this.retrievePosts();
        this.setState({
          show:!this.state.show
        })

        axios.post('/chat', {
          title: this.state.featuredItem.title
        }).then(messageSent => console.log('text messages sent!'))
      });
  }


  lgClose() {
    this.setState({
      lgShow: false
    });
    this.retrievePosts();
  }

  lgShow(){
    this.setState({
      lgShow: true
    });
  }

  ScrollTo(){
    scroll.scrollTo(550);
  }
 

  render() {
    console.log('this is the state of show', this.state.show);
    return (
      <div>
      <NavigationBar onClick={this.ScrollTo}/>
      <Maintron scrollTo={this.ScrollTo}/>
        <ReactBootstrap.Grid className="show-grid">
          <ReactBootstrap.Row>
            <ReactBootstrap.Col md={6}>
            <h2 id='listheader'> Recent Postings </h2>
              <List
                posts={this.state.posts}
                handleClick={this.changeFeatured}
              />
            </ReactBootstrap.Col>
            <ReactBootstrap.Col className="pass" md={6}>
             {this.state.show === false
              ? <Form showModal={this.lgShow}/>
              :  <DescriptionCard
                    featuredItem = {this.state.featuredItem}
                    claimHandler={this.handleClaim}
                  /> }
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        </ReactBootstrap.Grid>
        <Trigger show={this.state.lgShow} onHide={this.lgClose} />
         <div className="map">

        <MapComponent
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }}
        />}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
        />
        </div>


      </div>
    );
  }
}

export default App
ReactDOM.render(<LoginPage />, document.getElementById("app"));
