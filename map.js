var heading = 0;
window.navigator.standalone = true;
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
    return a.slice(1, a.length);
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

    fl_outdoor_recreation.popupTemplate = {
        title: "{SITE_NAME}",
        content: "<p></p>"
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
        heading = event.webkitCompassHeading;
        view.rotation = 360 - heading;
    }

    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-90, 0],
      zoom: 12,
      constraints: {
	  snapToZoom: true,
        rotationEnabled: true,
      },
	popup: {
	    dockEnabled: true,
	    dockOptions: {
		buttonEnabled: false,
		breakpoint: false
	    },
	    container: "popup"
	}
      });

    popup = view.popup;

    view.then(function() {

        var centerPoint = view.center.clone();

        popup.open({
          title: "just over there",
          location: centerPoint,
          content: "Select a point near you to learn more about it."
        });

        // Watch currentDockPosition of the popup and open the
        // popup at the specified position.
        popup.watch("currentDockPosition", function(value) {
          popup.visible = true;
        });
      });

      view.on("drag", function(evt){
        // prevents panning with the mouse drag event
        evt.stopPropagation();
      });

    function sizeWindow(event) {
      var diameter = Math.floor(0.96 * Math.min(window.innerHeight, window.innerWidth));
      document.getElementById("canvas").height = window.innerHeight;
      document.getElementById("canvas").width =  window.innerWidth;
      drawCicle(diameter/2);
      view.center = [longitude, latitude];
    }

    window.onresize = sizeWindow;

    window.addEventListener("deviceorientation", deviceOrientationListener);
    function deviceOrientationListener(event) {
        var heading = event.webkitCompassHeading;
        view.rotation = 360 - heading;
        // throw new Error("SHds");
    }
    sizeWindow();

    //ERROR reporting
    function printPre(obj) {
      const pre = document.createElement('pre');
      pre.innerHTML = JSON.stringify(obj, null, 2);
      document.body.appendChild(pre);
      pre.classList.add("error")
      const onClick = function () {
        document.body.removeChild(pre)
        pre.removeEventListener("click", onClick)
      }
      pre.addEventListener("click", onClick)
    }

    window.addEventListener("error", function(errorevent){
      const error = errorevent.error;
      if(error) {
        printPre({
          error : errorevent.error.toString(),
          stack : errorevent.error.stack
        })
      }
      else {
        printPre({
          error: errorevent.message
        })
      }
    })


});
