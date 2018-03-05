var geocoder = require('geocoder');
var axios = require('axios');
var key = require('../config.js');
key = key.googleAPI;

//As mentioned in server/index. and the form component, there are issues with guaranteeing valid addresses..
//For the most part, this function works, but notice comments below

var apiHelper = function(locationInformation, callback) {
  geocoder.geocode(locationInformation, function(err, data, key) {
    var lat = data.results[0].geometry.location.lat;
    lat = lat.toString(); //Stringifying may not be necessary here, as it's actually converted to a number on the frontend
    var long = data.results[0].geometry.location.lng;
    long = long.toString(); //Stringifying may not be necessary here, as it's actually converted to a number on the frontend
    callback(lat, long);
  });
};

module.exports = apiHelper;