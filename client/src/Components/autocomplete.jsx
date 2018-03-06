import React from 'react';
import axios from 'axios';
import {FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import {compose, withProps, lifecycle} from "recompose";
import {withScriptjs} from "react-google-maps";
import {StandaloneSearchBox} from "react-google-maps/lib/components/places/StandaloneSearchBox";

const GoogleSearchBox = compose(withProps({
  googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB-02gMrf0E5Df_WC4Pv6Uf9Oc0cEdiMBg&v=3.exp&libraries=geometry,drawing,places",
  loadingElement: <div/>,
  containerElement: <div/>
}),

lifecycle({
  componentWillMount() {
    const refs = {}

    this.setState({
      places: [],
      address: '',
      onSearchBoxMounted: ref => {
        refs.searchBox = ref;
      },
      onPlacesChanged: () => {
        const places = refs.searchBox.getPlaces();
        axios.post('/current/address', {location: places})
        .catch((error) => {
          throw error
        })
      }
    })
  }
}), withScriptjs)(props =>
   
      <StandaloneSearchBox ref={props.onSearchBoxMounted} bounds={props.bounds} onPlacesChanged={props.onPlacesChanged}>
        <FormControl type="text" placeholder='Enter an address'/> 
      </StandaloneSearchBox>
);

export default GoogleSearchBox;