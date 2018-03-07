import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import GoogleSearchBox from "./components/autocomplete.jsx";
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
import example from './example.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allLocations: [],
      lgShow: false, //this state is used to show/hide the Trigger component/modal, which is changed via lgSHow and lgHide functions
      posts: example,
      tab: false,
      featuredItem: {
        id: null,
        title: null,
        description: null,
        address: ''
        // lng: -73.833079,
        // lat: 40.767499,
      },
      isLogin: false,
      show: false, //this state is used to show/hide the DescriptionCard comoponent, which is changed via changeFeatured function
      latitude: 40.767499,
      longitude: -73.833079
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.retrievePosts = this.retrievePosts.bind(this);
    this.retrieveClaimsByDist = this.retrieveClaimsByDist.bind(this);
    this.retrieveMyPosts = this.retrieveMyPosts.bind(this);
    this.changeFeatured = this.changeFeatured.bind(this);
    this.handleClaim = this.handleClaim.bind(this);
    this.resetFormView = this.handleClaim.bind(this);
    this.lgShow = this.lgShow.bind(this);
    this.lgClose = this.lgClose.bind(this);
    this.ScrollTo = this.ScrollTo.bind(this);
    this.onLogout = this.onLogout.bind(this);

  }

  componentDidMount() {
    this.retrievePosts();
  }

  handleSelect(key) {
    console.log(key)
    let handle = {
      'All Posts': this.retrievePosts,
      'My Posts': this.retrieveMyPosts,
      'Nearby': this.retrieveClaimsByDist
    }
    console.log('handle:', handle, 'key:', key);
    console.log('this.props',this.props);
    handle[key]()
      .then(()=> {
        this.setState({tab: key})
      })
  }

  //This function toggles the description card to appear,
  //retrieves lat/long data from server/geo-helper function
  //sets the lat/long state, which is passed to the googleMaps component that renders the map
  changeFeatured(listItem) {
    // let {title, poster_id, description, address, lng, lat, phone, isClaimed, claimer_id, createdAt, photoUrl, estimatedValue} = listItem;
    if (this.state.show === false){
      this.setState({
        featuredItem: listItem,
        show: true,
        latitude: Number(listItem.lat),
        longitude : Number(listItem.lng),
     });
      // let address = `${listItem.address}, ${listItem.city}, ${listItem.state} ${listItem.zipCode}`;
      // axios.post('/latlong', {address: address})
      //   .then(result => {
      //     this.setState({
      //       latitude: Number(result.data.lat),
      //       longitude: Number(result.data.long)
      //     })
      //   })
      console.log(this.state)
    }
    else if(this.state.show === true){
      if (this.state.featuredItem.id === listItem.id){
        this.setState({
          show: false
        })
      } else {
        this.setState({
          featuredItem: listItem,
          show: true
        })
      }
    }
  }

  //This function retrieves all post data from the mySql database
  retrievePosts() {
    return axios
      .get("/fetch")
      .then(results => {
        if (results.data.notLoggedIn) {
          ReactDOM.render(<LoginPage />, document.getElementById("app"));
          return
        } else {
          this.setState({
            posts: results.data,
          })
        }
        console.log('COOOCOOO',results)
        this.setState({
          posts: results.data,
        })
      })
      .catch(function(error) {
        console.log("There was an error retrieving posts.", error);
      });
  }

  retrieveMyPosts() {
    console.log('begin retrieveMyPosts!');
    return axios
      .get("/fetchMyPosts")
      .then(results => {
        if (results.data.notLoggedIn) {
          ReactDOM.render(<LoginPage />, document.getElementById("app"));
          return
        }
        console.log(results.data)
        this.setState({
          posts: results.data,
        })
      })
      .catch(function(error) {
        console.log("There was an error retrieving user's posts.", error);
      });
  }

  retrieveClaimsByDist(lng, lat) {
    return axios
      .get("/fetch", {params: {lng, lat}})
      .then(results => {
        if (results.data.notLoggedIn) {
          ReactDOM.render(<LoginPage />, document.getElementById("app"));
          return
        }
        this.setState({
          posts: results.data,
        })
      })
      .catch(function(error) {
        console.log("There was an error retrieving posts.", error);
      });
  }

  //This function updates the selected post that is claimed (in database)
  handleClaim(claimedPostID) {
    console.log(claimedPostID)
    axios.post("/updateentry", claimedPostID)
      .then(done => {
        if (done.data.notLoggedIn) {
          console.log('tick')
          ReactDOM.render(<LoginPage />, document.getElementById("app"));
          return
        }
        this.retrievePosts();
        this.setState({
          show:!this.state.show
        })

        axios.post('/chat', { //Should be replaced with the send an email functionality
          title: this.state.featuredItem.title
        }).then(messageSent => console.log('text messages sent!'))
      });
  }

  //This func is being passed to the Form Compnent and closes the Trigger Component/Modal
  lgClose() {
    console.log('closed')
    this.setState({
      lgShow: false
    });
    this.retrievePosts();
  }

  //This func is being passed to the Form Compnent and Trigger Component/Modal and opens it
  lgShow(){
    this.setState({
      lgShow: true
    });
  }

  //This func scrolls from the Jumbotron to the Posts components
  ScrollTo(){
    scroll.scrollTo(550);
  }

  onLogout() {
    axios.post('/logout')
    .then(() => {
      ReactDOM.render(<LoginPage />, document.getElementById("app"));
    })
    .catch((error) => {
      throw error;
    })
  }


  render() {
    return (
      <div>
      <NavigationBar scrollTo={this.ScrollTo} onLogout={this.onLogout}/>
      <Maintron scrollTo={this.ScrollTo}/>
        <ReactBootstrap.Grid className="show-grid">
          <ReactBootstrap.Row>
            <ReactBootstrap.Col md={6}>
            <h2 id='listheader'> Recent Postings </h2>
              <List
                posts={this.state.posts}
                handleClick={this.changeFeatured}
                handleSelect={this.handleSelect}
                currentTab={this.state.tab}
              />
            </ReactBootstrap.Col>
            <ReactBootstrap.Col className="pass" md={6}>
             {this.state.show === false
              ? <div> <Form showModal={this.lgShow}/>
                 </div>
              :  <DescriptionCard
                    featuredItem = {this.state.featuredItem}
                    claimHandler={this.handleClaim}
                    tab={this.state.tab}
                  /> }
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        </ReactBootstrap.Grid>
        <Trigger show={this.state.lgShow} onHide={this.lgClose} />
         <div className="map">

        <MapComponent
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB-02gMrf0E5Df_WC4Pv6Uf9Oc0cEdiMBg&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={ { height: `100%` } } />}
          latitude= {this.state.latitude}
          longitude= {this.state.longitude}
          markers = {this.state.posts}
        />
        </div>


      </div>
    );
  }
}

export default App
axios.get('/checkLogin')
      .then(status => {
        if (!status.data.notLoggedIn) {
          ReactDOM.render(<App />, document.getElementById("app"));
        } else {
          ReactDOM.render(<LoginPage />, document.getElementById("app"));
        }
      })
