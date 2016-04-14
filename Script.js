/**
 * Created by Arya on 2/6/ s
 * */

var map;
var activefilter = null;
var streetview;

//var src = 'https://rawgit.com/jmwakule/COSC-310-Solar-Project/f51eabd45babd46b0e268e8c3291fc70b816cf0e/outlines.kml';
var google = {};
function initMap() {

    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, {
        center: {lat: 49.872674, lng: -119.483966},
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        labels: true

    });
    streetview = new google.maps.StreetViewPanorama(document.getElementById("streetview"),{
        position: map.getCenter(),
        visible: true,
        pov:{
            heading: 0,
            pitch: 14
        },
        enableCloseButton: true
    });
    map.setTilt(0);
    map.setStreetView(streetview);
    map.data.loadGeoJson('building_outlines_id.json');
    map.data.setStyle(function () {
        var color = 'orange';
        return ({
            fillColor: color,
            strokeColor: color,
            strokeWeight: 2
        });
    });
 map.data.setStyle(function (feature) {
                var geometry = feature.getGeometry("coordinates");
                var area;
                var geoArray;
                var geoPoly;
                var latArray;
                var sumArea = 0;
                geoArray = geometry.getArray();


                for (var i = 0; i < geoArray.length; i++) {
                    geoPoly = geoArray[i];
                    for (var j = 0; j < geoPoly.getLength(); j++) {
                        latArray = geoPoly.getAt(j).getArray();
                        area = google.maps.geometry.spherical.computeArea(latArray);

                        sumArea += area;
                    }

                    color = 'yellow';
                    if (sumArea > 0 && sumArea < 50) {
                        color = '#99ddff';
                    } else if (sumArea > 50 && sumArea < 200) {
                        color = '#FFD600';

                    }
                    else if (sumArea > 200 && sumArea < 500) {
                        color = '#FF9400';

                    }
                    else if (sumArea > 500 && sumArea < 1000) {
                        color = '#FF6200';

                    }
                    else if (sumArea > 1000) {
                        color = '#FF0400';

                    }
                }
                return ({
                    fillColor: color,
                    strokeColor: color,
                    strokeWeight: 2
                });

            });

    map.data.addListener('mouseover', function (event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {strokeWeight: 4, fillOpacity: 0.5});
    });

    map.data.addListener('mouseout', function (event) {
        map.data.revertStyle();

    });
    map.data.addListener('click', function (event) {
            var content = event.feature.getProperty("Name");
	    var description = event.feature.getProperty("id");
            var geometry = event.feature.getGeometry("coordinates");
            var area;
            var error = "";
           // var infoId = document.getElementById("active-building");
            var infoArea = document.getElementById("area");
            var geoArray;
            var geoPoly;
            var latArray;
            var sumArea = 0;
            geoArray = geometry.getArray();

	    request(description);
	    
	    //setting streetview panorama position
            streetview.setPosition(event.latLng);

            for (var i = 0; i < geoArray.length; i++) {
                geoPoly = geoArray[i];
                for (var j = 0; j < geoPoly.getLength(); j++) {
                    latArray = geoPoly.getAt(j).getArray();
                    area = google.maps.geometry.spherical.computeArea(latArray);

                    sumArea += area;
                }

                var color = 'orange';
                if (sumArea > 0 && sumArea < 100) {
                    color = '#66d9ff';
                    map.data.overrideStyle(event.feature, {strokeWeight: 3, fillColor: color, strokeColor: 'grey'});
                }
                else if (sumArea > 100 && sumArea < 200) {
                    color = '#66ff66';
                    map.data.overrideStyle(event.feature, {strokeWeight: 3, fillColor: color, strokeColor: 'grey'});
                }
                else if (sumArea > 200 && sumArea < 500) {
                    color = '#ffff1a';
                    map.data.overrideStyle(event.feature, {strokeWeight: 3, fillColor: color, strokeColor: 'grey'});
                }
                else if (sumArea > 500 && sumArea < 1000) {
                    color = '#ffd11a';
                    map.data.overrideStyle(event.feature, {strokeWeight: 3, fillColor: color, strokeColor: 'grey'});
                }
                else if (sumArea > 1000) {
                    color = '#E65100';
                    map.data.overrideStyle(event.feature, {strokeWeight: 3, fillColor: color, strokeColor: 'grey'});
                }

            }


            // output = latArray.getAt(0);
            //var area = google.maps.spherical.computeArea(geoArray[0].getPath());


            
            //infoArea.innerHTML =  sumArea.toFixed(3) + "m<sup>2</sup>";
        }
    )
    ;


}

function checkEnter(e, element){
    if(e.which === 13 || e.keyCode === 13){
        var address = element.value+" Kelowna";
        var gc = new google.maps.Geocoder();
        gc.geocode({ address: address}, function(results,status){
            if(status === google.maps.GeocoderStatus.OK){
                var latlng = results[0].geometry.location;
                //document.getElementById("hey").innerHTML = latlng;
                var geocodeMarker = new google.maps.Marker({
                    position: latlng,
                    animation: google.maps.Animation.DROP,
                    
                });
                map.setCenter(latlng);
		streetview.setPosition(latlng);
                map.setZoom(19);
                geocodeMarker.setMap(map);
                
            }
        });
    }
}

document.getElementById("search").onclick = function(){

var address = document.getElementById("searchbox").value+" kelowna";
 var gc = new google.maps.Geocoder();
        gc.geocode({ address: address}, function(results,status){
            if(status === google.maps.GeocoderStatus.OK){
                var latlng = results[0].geometry.location;
                
                var geocodeMarker = new google.maps.Marker({
                    position: latlng,
                    animation: google.maps.Animation.DROP,
                    
                });
                map.setCenter(latlng);
		streetview.setPosition(latlng);
                map.setZoom(19);
                geocodeMarker.setMap(map);
                
            }
        });
};

function activeLink(element){
    element.style.backgroundColor = "yellow";
    element.style.color = "white";
   
   if(activefilter != null){
        activefilter.style.backgroundColor = "white";
        activefilter.style.color = "black";
        activefilter = element;
   }else{
       activefilter = element;
   }
    
}

function alertchange(checkbox){
    if(checkbox.checked){
       document.getElementById("streetview").style.display = "block";
       document.getElementById("thedisplay").innerHTML = document.getElementById("streetview").style.display;
    }else{
       document.getElementById("streetview").style.display = "none";
       document.getElementById("thedisplay").innerHTML = document.getElementById("streetview").style.display;
    }
}

function request(id){
        
    $.ajax({
        type: "POST",
        url:"Query.php",
        data: {var: id},
        success:function(data) {
             handleData(data); 
        }
        });
    $.ajax({
        type: "POST",
        url:"Query2.php",
        data: {var: id},
        success:function(data) {
             handleData2(data); 
        }
        });    
    $.ajax({
        type: "POST",
        url:"Query3.php",
        data: {var: id},
        success:function(data) {
             handleData3(data); 
        }
        });    
}

function handleData(dis){
    console.log(dis);
    document.getElementById("area").innerHTML = "Area: "+Math.round(dis*10000)/10000+" m<sup>2</sup>";
    handleDataEnergy(dis);
           
}
function handleData2(dis2){
    console.log(dis2);
if(isNaN(dis2)){
    document.getElementById("slope").innerHTML = "Slope: "+dis2;
}else{
document.getElementById("slope").innerHTML = "Slope: "+Math.round(dis2*100)/100+" degrees";

}
           
}
function handleData3(dis3){
    console.log(dis3);
    document.getElementById("height").innerHTML = "Height: "+Math.round(dis3*100)/100+" m";
           
}
function handleDataEnergy(area) {
	
	var summer_Power = (1/8 * area) * 0.14 * 1800 * 0.75;
	var winter_Power = (1/8 * area) * 0.14 * 300 * 0.75;
	var spring_fall_Power = (1/8 * area) * 0.14 * 1200 * 0.75;
	document.getElementById("energy").innerHTML = "Energy: "+Math.round(summer_Power * 100) / 100+" kWh";
	handleDataSavings(summer_Power, winter_Power, spring_fall_Power);

}
function handleDataSavings(energySum, energyWin, energyFall) {
	
	var savingsSum= (energySum * 0.10)/12
	document.getElementById("summer").innerHTML = "Summer:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $"+Math.round(savingsSum*100) / 100+"/month";

	var savingsWin= (energyWin * 0.10)/12
	document.getElementById("winter").innerHTML = "Winter:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $"+Math.round(savingsWin*100) / 100+"/month";

	var savingsFall= (energyFall * 0.10)/12
	document.getElementById("spring").innerHTML = "Spring/Fall:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $"+Math.round(savingsFall*100)/100+"/month";
	
}
/*
document.getElementById("checkBox").onclick = function (){
    if(document.getElementById("checkBox").checked){
        streetviewDiv.style.display = "block";
        
    }else{
        streetviewDiv.style.display = "none";
        alert("not checked");
    }
};
*/
    //function loadKmlLayer(src, map) {
//    var kmlLayer = new google.maps.KmlLayer(src, {
//        suppressInfoWindows: false,
//        preserveViewport: false,
//        map: map
//
//    });
//    google.maps.event.addListener(kmlLayer, 'click', function (event) {
//
//        var content = event.featureData.infoWindowHtml;
//
//        var info = document.getElementById("info");
//        info.innerHTML = content;
//
//    });
//
//}
/*<div id="filter-button" class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Filters&nbsp;&nbsp;<span class="caret"></span></button>
          <ul id="filter" class="dropdown-menu">
              <li onclick="activeLink(this)"><a href="#">Spring/Fall</a></li>
              <li onclick="activeLink(this)"><a href="#">Summer</a></li>
              <li onclick="activeLink(this)"><a href="#">Winter</a></li>
          </ul>
      </div>
      */
