window.ko = require('knockout');
let $ = require('jquery');
const KEY = 'AIzaSyAvh8ouG5Ow6mon95VUSeFFWMBAPrFAD1U';
const APP_ROOT_ID = 'map-app';
const APP_ROOT = document.getElementById(APP_ROOT_ID);
const BREW_BASE = 'https://api.brewerydb.com/v2/';
const BREW_KEY = 'd64d6b3db7955a685cf1b5486a326fd4';
//https://api.brewerydb.com/v2/locations/?region=nevada&key=d64d6b3db7955a685cf1b5486a326fd4&format=json
let mapTag = document.createElement('script');
mapTag.src = "https://maps.googleapis.com/maps/api/js?key="+KEY+"&callback=initMap";

window.initMap = function() {
  var nevada = {lat: 38.8026, lng: -116.4194};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: nevada
  });
};
// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
  let appView = this;
  this.locations = ko.observableArray([]);
  this.brewTypes = ko.observableArray([]);
  this.getData = function() {
    let promise = $.getJSON('http://localhost/map/assets/js/testData.json');
    promise.done(function(data) {
      return appView.processData(data);
    });
    promise.fail(function() {
      return false;
    });
  };

  this.processData = function(data) {
      let tempObj = {};
      for(let i = 0; i < data.data.length; i++) {
        appView.locations.push(data.data[i]);
        tempObj[data.data[i].locationType] = data.data[i].locationTypeDisplay;
      }
      appView.brewTypes(tempObj);

      appView.test();
  };

  this.init = function() {
    this.getData();
    this.test();
  };

  this.test = function() {
    console.log("test function");
    console.log(this.brewTypes());
  }

  this.init();
};

// Activates knockout.js
ko.applyBindings(new AppViewModel());

APP_ROOT.append(mapTag);

