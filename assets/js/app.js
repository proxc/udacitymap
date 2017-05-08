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


// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel(googleMap) {
  let appView = this;
  appView.map = googleMap;
  appView.locations = [];
  appView.brewTypes = ko.observableArray([]);
  appView.displayedLocations = ko.observableArray([]);
  appView.mapMarkers = [];
  appView.title = "Wheres the beer?";
  appView.infowindow = new google.maps.InfoWindow({
    content: 'kmclmsd'
  });

  appView.brewSelected = function(item) {
    appView.infowindow.setContent(appView.buildInfoBox(item));
    appView.activateMarker(item.id);
  };

  appView.buildInfoBox = function(item) {
    let name = '';
    let streetAddress = '';
    let city = '';
    let state = '';
    let zipcode = '';
    let phone = '';
    let hours = '';
    let open = '';
    let type = '';
    let description = '';
    let website = '';
    let established = '';
    let image = 'assets/images/beer.jpeg';

    if(item.brewery.name) {
      name = item.brewery.name;
    }
    if(item.streetAddress) {
      streetAddress = item.streetAddress;
    }
    if(item.locality){
      city = item.locality;
    }
    if(item.region) {
      state = item.region;
    }
    if(item.postalCode) {
      zipcode = item.postalCode;
    }
    if(item.phone) {
      phone = item.phone;
    }
    if(item.hoursOfOperation) {
      hours = item.hoursOfOperation;
    }
    if(item.openToPublic) {
      open = item.openToPublic;
    }
    if(item.locationTypeDisplay) {
      type = item.locationTypeDisplay;
    }
    if(item.brewery.description) {
      description = item.brewery.description;
    }
    if(item.brewery.website) {
      website = item.brewery.website;
    }
    if(item.brewery.established) {
      established = item.brewery.established;
    }
    if(item.brewery.images) {
      if(item.brewery.images.squareMedium) {
        image = item.brewery.images.squareMedium;
      }
    }

    return `<div class="infoBox">
            <div class="infoBox__image-container"><img src="${image}" class="infoBox__image" alt=""></div>
            <div class="infoBox__name">${name}</div>
            <div class="infoBox__description">${description}</div>
            <div class="infoBox__contact">
              <div class="infoBox__address">${streetAddress}</div>
              <div class="infoBox__address">${city}, ${state} ${zipcode}</div>
            </div>
            <div class="infoBox__contact-links">
              <div class="infoBox__phone">${phone}</div>
              <div class="infoBox__website"><a href="${website}">${website}</a></div>
            </div>
            <div class="infoBox__extras">
              <div class="infoBox__extras-line">${type} est. ${established}</div>
              <div class="infoBox__extras-line --hours">${hours}</div>
            </div>
          </div>`;


  };

  appView.brewTypeChange = function(data, event) {
    let filterType = event.target.value;
    appView.plotMapMarkers(null);
    appView.mapMarkers = [];
    appView.filterLocations(filterType);
  };

  appView.filterLocations = function(type) {
    let locationsToDisplay = appView.locations.filter((item)=>{
      if(type === 'all') {
        return item;
      } else if(item.locationType === type){
        return item;
      }
    });
    for(let i = 0; i < locationsToDisplay.length; i++) {
      appView.mapMarkers.push(appView.createMarker(locationsToDisplay[i]));
    }
    appView.displayedLocations(locationsToDisplay);
    appView.plotMapMarkers();
  };

  appView.stopMarkers = function() {
    for(let i = 0; i < appView.displayedLocations().length; i++) {
      appView.mapMarkers[i].setAnimation(null);
    }
  };

  appView.activateMarker = function(markerId) {
    for(let i = 0; i < appView.displayedLocations().length; i++) {
      if(markerId === appView.displayedLocations()[i].id) {
        if (appView.mapMarkers[i].getAnimation() !== null) {
          appView.mapMarkers[i].setAnimation(null);
          appView.infowindow.close();
        } else {
          appView.mapMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
          appView.infowindow.open(appView.map, appView.mapMarkers[i]);
        }
      } else {
        appView.mapMarkers[i].setAnimation(null);
      }
    }
  };

  appView.getData = function() {
    let promise = $.getJSON('http://localhost/map/assets/js/testData.json');
    promise.done(function(data) {
      return appView.processData(data);
    });
    promise.fail(function() {
      return false;
    });
  };

  appView.processData = function(data) {
      let tempObj = {};
      let tempTypes = [];

      for(let i = 0; i < data.data.length; i++) {
        appView.locations.push(data.data[i]);
        appView.mapMarkers.push(appView.createMarker(data.data[i]));
        tempObj[data.data[i].locationType] = data.data[i].locationTypeDisplay;
      }

      tempTypes.push({'locactionType': 'all', 'locationTypeDisplay': 'All Types'});
      Object.keys(tempObj).forEach(function(key) {
          tempTypes.push({'locactionType': key, 'locationTypeDisplay': tempObj[key]});
      });

      appView.displayedLocations(appView.locations);
      appView.brewTypes(tempTypes);
      appView.plotMapMarkers();
  };

  appView.createMarker = function(item) {
    let marker = new google.maps.Marker({
      position: {lat: item.latitude, lng: item.longitude},
      map: appView.map,
      title: item.brewery.name,
      animation: null
    });
    return marker;
  };

  appView.plotMapMarkers = function(map = appView.map) {
    for(let i = 0; i < appView.mapMarkers.length; i++) {
      appView.mapMarkers[i].setMap(map);
    }
  };

  appView.init = function() {
    appView.getData();
  };

  appView.init();

};

APP_ROOT.append(mapTag);

window.initMap = function() {
  let nevada = {lat: 38.8026, lng: -116.4194};
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: nevada
  });

  // Activates knockout.js
  ko.applyBindings(new AppViewModel(map));
};

