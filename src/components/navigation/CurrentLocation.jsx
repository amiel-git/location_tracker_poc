import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

function CurrentLocationMap () {
    const [lat,set_lat] = React.useState(0)
    const [lon,set_lon] = React.useState(0)
    const [accuracy,set_accuracy] = React.useState(0)
    const [timestamp, set_timestamp] = React.useState(0)
    const [distance_to_target, set_distance_to_target] = React.useState(0)
    const [reqCount, set_reqCount] = React.useState(0)


    const sample_target_loc = {
        lat:14.73598,
        lon:121.03569
    }

    const locationSuccessCallback = (position) => {
        set_reqCount(reqCount + 1)
        set_lat(position.coords.latitude)
        set_lon(position.coords.longitude)
        set_accuracy(position.coords.accuracy)
        set_timestamp(position.timestamp)
        const distance__ = getDistance(
            position.coords.latitude,
            position.coords.longitude,
            sample_target_loc.lat,
            sample_target_loc.lon
        )

        set_distance_to_target(distance__)
        
        console.log({"lat":position.coords.latitude,"lon":position.coords.longitude,
            "acc":position.coords.accuracy,"time":position.timestamp,"distance":distance__
        })

    }

    const locationErrorCallback = (error) => {
        console.log("Error retrieving location: ",error)
    }

    const navigator_options = {
        enableHighAccuracy:true,
        maximumAge:3000,
        timeout:5000,
    }


    React.useEffect(() => {

        if ( navigator.geolocation ) {
            var watch_id = navigator.geolocation.watchPosition(locationSuccessCallback,locationErrorCallback,navigator_options)
        }
        else{
            alert("Unable to use geolocation")
        }
            
        },[])



    //get distance

    const getDistance = (lat1, lon1, lat2, lon2) => {
        // Radius of the earth in kilometers
        var R = 6371; 
        
        // Convert latitude and longitude from degrees to radians
        var radLat1 = Math.PI * lat1 / 180;
        var radLat2 = Math.PI * lat2 / 180;
        var radLon1 = Math.PI * lon1 / 180;
        var radLon2 = Math.PI * lon2 / 180;
        
        // Calculate the change in coordinates
        var deltaLat = radLat2 - radLat1;
        var deltaLon = radLon2 - radLon1;
        
        // Haversine formula
        var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                Math.cos(radLat1) * Math.cos(radLat2) * 
                Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        // Distance in kilometers
        var distance = R * c;
        
        return distance.toFixed(2);
    }

    return (
        <div>
            {lat !== 0 && lon !== 0 && 
                <div>
                    <h3>Latitude: {lat}</h3>
                    <h3>Longitude: {lon}</h3>
                    <h3>Accuracy: {accuracy}</h3>
                    <h3>Date: {timestamp == 0 ? "" : new Date(timestamp).toLocaleString()}</h3>
                </div>
            }
            <div>
                <h3>Distance to target: {distance_to_target}km</h3>
            </div>
            <div>
                <h4>Req count: {reqCount}</h4>
            </div>

            {lat !== 0 && lon !== 0 && 
                <div style={{width:"100%", textAlign:"-webkit-center", marginTop:"50px"}}>
                    <MapContainer style={{height:"50vh",width:"60vw"}} center={[lat, lon]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[lat, lon]}>
                        <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                    </MapContainer>
                </div>
            }

        </div>

    )
}


export default CurrentLocationMap