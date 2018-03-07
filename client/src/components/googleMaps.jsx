import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={16}
    defaultCenter={{ lat: props.latitude, lng: props.longitude }}
    center={{ lat: props.latitude, lng: props.longitude }}
  >
  {props.isMarkerShown && <Marker position={{ lat: props.latitude, lng: props.longitude }} />}

  </GoogleMap>
))

export default MapComponent;

          // {props.markers.map(props => (
          //   <RestaurantMarker key={props.name} {...props}/>
          // ))}

          // {props.isMarkerShown && <Marker position={{ lat: props.latitude, lng: props.longitude }} />}