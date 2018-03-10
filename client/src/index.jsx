import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import GoogleSearchBox from "./Components/autocomplete.jsx";
import NavigationBar from "./Components/navbar.jsx";
import Maintron from "./Components/jumbotron.jsx";
import List from "./Components/List.jsx";
import Form from "./Components/form.jsx";
import Settings from "./Components/Settings.jsx";
import DescriptionCard from "./Components/descriptionCard.jsx";
import LoginPage from "./Components/login.jsx";
import Signup from "./Components/signup.jsx";
import MapComponent from "./Components/googleMaps.jsx";
import Trigger from "./Components/responsiveButton.jsx";
import { Link, DirectLink, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import example from './example.js';
import {Grid, Row, Col} from 'react-bootstrap';
import DonationAmmount from './Components/DonationAmmount.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allLocations: [],
      lgShow: false, //this state is used to show/hide the Trigger component/modal, which is changed via lgSHow and lgHide functions
      posts: example,
      isOrg: false,
      tab: 'All Posts',
      showDeductions: false,
      featuredItem: {
        id: null,
        title: null,
        description: null,
        address: ''
        // lng: -73.833079,
        // lat: 40.767499,
      },
      show: false, //this state is used to show/hide the DescriptionCard comoponent, which is changed via changeFeatured function
      toggleSettings: false, //this toggles the settings page to show/hide
      page: false,
      latitude: 40.750487,
      longitude: -73.976401,
      renderLoader: true
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
    this.handlePage = this.handlePage.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.setState({renderLoader: false}), 1500)
    this.checkOrgStatus()
    .then(()=> this.retrievePosts())
  }

  checkOrgStatus() {
    return axios.get('/org')
    .then((data)=> {
      this.setState({isOrg: !!data.data})
    })
  }

  handleSelect(key) {
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

  handlePage(e) {
    this.setState({page: e.target.name})
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
        console.log(results);
        if (results.data.notLoggedIn) {
          ReactDOM.render(<LoginPage />, document.getElementById("app"));
          return
        } else {
          this.setState({
            posts: results.data,
          })
        }
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

  handleSettings() {
    this.setState({
      toggleSettings: !this.state.toggleSettings
    });
  }


  render() {
//     if (this.state.renderLoader === true) {
//       return (
//         <div>
//           <div id='loader' style={{display:'block', margin: '0 auto', bottom:'50%', left:'45%', position:'absolute'}}>
//             <img src='https://s3.amazonaws.com/oddjobs-best/loader.gif'/>
//           </div>
//         </div>
//       )
//     }
    const pages = {
      deduction: <DonationAmmount />,
      settings: <Settings toggleSettings={()=> this.setState({page: false})}/>,
      main: false
    }

    return(
      <div>
        <NavigationBar
          scrollTo={this.ScrollTo}
          onLogout={this.onLogout}
          handlePage={this.handlePage}
          verStatus={this.state.isOrg}
        />
        {pages[this.state.page] ||
          <div>
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
                    featuredItem = {this.state.featuredItem}
                    claimHandler={this.handleClaim}
                    tab={this.state.tab}
                  />
                </ReactBootstrap.Col>
                <ReactBootstrap.Col className="pass" md={6}>
                  <div>
                    <Form showModal={this.lgShow}/>
                  </div>
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
        }
      </div>
    );
  }
}

export default App
axios.get('/checkLogin')
      .then(status => {
        if (!status.data.notLoggedIn) {
          console.log("HALLLOOOOOO",status.data);
          ReactDOM.render(<App />, document.getElementById("app"));
        } else {
          console.log("HEY",status.data);
          ReactDOM.render(<LoginPage />, document.getElementById("app"));
        }
      })
