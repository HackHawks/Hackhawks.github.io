function toAcronymCase(s) {
    a = s.split("");
    b = zip(tail(a), a);
    c = [a[0].toUpperCase()].concat(b.map(function(x) {
	y = x[1];
	if (y === ' ') {
	    return x[0].toUpperCase();
	} else {
	    return x[0].toLowerCase();
	}
    }));
    return c.join("");
}

// a and b must have the same length, or a must be smaller than b.
function zip(a, b) {
    return a.map(function(x, i) {return [x].concat([b[i]]);});
}

function tail(a) {
    return slice(1, a.length);
}


  require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/geometry/Point",
  "esri/geometry/Polygon",
  "esri/geometry/Circle",
  "esri/Graphic",
  "dojo/domReady!"
], function(
    Map, MapView, FeatureLayer, Legend, Point, Polygon, Graphic, Circle) {

    var latitude = 0;
    var longitude = 0;

    var fl_roadside_markers = new FeatureLayer({
        url: "http://anrmaps.vermont.gov/arcgis/rest/services/map_services/ACCD_OpenData/MapServer/12/query?outFields=*&where=1%3D1",
	outFields: ["*"]
    });
    fl_roadside_markers.renderer = {
	type: "simple",
	symbol: {
	    type: "simple-marker",
	    size: 10,
	    color: "#002b36",
	    outline: {
		width: 0,
		color: "white"
	    }
	}
    };
    //map.layers.add(fl_roadside_markers);

    fl_roadside_markers.popupTemplate = {
        title: "{name}",
        content: "<p>{description}</p>"
    };

    var fl_outdoor_recreation = new FeatureLayer({
        url: "https://anrmaps.vermont.gov/arcgis/rest/services/Open_Data/OPENDATA_ANR_TOURISM_SP_NOCACHE_v2/MapServer/166/query?outFields=*&where=1%3D1",
	outFields: ["*"]
    });
    fl_outdoor_recreation.renderer = {
	type: "simple",
	symbol: {
	    type: "simple-marker",
	    size: 10,
	    color: "#93a1a1",
	    outline: {
		width: 0,
		color: "white"
	    }
	}
    };
    //map.layers.add(fl_outdoor_recreation);

    fl_outdoor_recreation.popupTemplate = {
        title: "{SITE_NAME}",
        content: "<p>Seriously.</p>"
    };

    var map = new Map({
        basemap: "dark-gray-vector",
	layers: [fl_roadside_markers, fl_outdoor_recreation]
    });

    navigator.geolocation.getCurrentPosition(updateLocation);
    function updateLocation(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        view.center = [longitude, latitude];
    }

    window.addEventListener("deviceorientation", deviceOrientationListener);
    function deviceOrientationListener(event) {
        var heading = event.webkitCompassHeading;
        view.rotation = heading;
    }

    var stencilPolygon;

    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-90, 0],
      zoom: 15,
      constraints: {
         snapToZoom: false,
      }
      });

    function sizeWindow(event) {
      var diameter = Math.floor(0.94 * Math.min(window.innerHeight, window.innerWidth));
      document.getElementById("canvas").height = window.innerHeight;
      document.getElementById("canvas").width =  window.innerWidth;
      drawCicle(diameter/2);
      view.center = [longitude, latitude];

    }
    window.onresize = sizeWindow;

    navigator.geolocation.getCurrentPosition(updateLocation);
    function updateLocation(position) {
       latitude = position.coords.latitude;
       longitude = position.coords.longitude;
       view.center = [longitude, latitude];
    }

    window.addEventListener("deviceorientation", deviceOrientationListener);
    function deviceOrientationListener(event) {
        var heading = event.webkitCompassHeading;
        view.rotation = heading;
    }
    sizeWindow();
});
