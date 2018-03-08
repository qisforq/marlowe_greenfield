import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={16}
    defaultCenter={{ lat: props.latitude, lng: props.longitude }}
    center={{ lat: props.latitude, lng: props.longitude }}
  >
  {props.markers.map(prop=>(
    props.isMarkerShown && <Marker position={{lat: parseFloat(prop.lat), lng: parseFloat(prop.lng)}} />
  ))}
  </GoogleMap>
))

export default MapComponent;
