import { connectToDatabase } from "../util/mongodb";
import React from "react";
import Router from "next/router";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

const ObjectId = require("mongodb").ObjectID;

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 40.7128,
  lng: -74.006,
};

var close_vendors = [];
var geo_url = "";
var address_parts = [];
var your_address_parts = [];

export default function mApp({ vendors }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyClhKv-XaZs679aVBkHB2dqTsQ1asckVx4",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);

  const [selected, setSelected] = React.useState(null); //FOR INFO BOX

  const [nearby_vendors, setVendors] = React.useState([]);

  const searchLatLon = async (latitude, longitude) => {
    const data = await fetch(
      `http://localhost:3000/api/searchLatLon?latitude=${latitude}&longitude=${longitude}`
    );

    const res = await data.json();

    close_vendors = res;
    return res;
  };

  if (loadError) return "Error loading Maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <>
      <p id="empty_text"> </p>
      <div id="vendor_list_block">
        <ul id="vendor_list"></ul>
      </div>

      <h1> My current location </h1>
      <div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
          onClick={(event) => {
            geo_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.latLng.lat()},${event.latLng.lng()}&key=AIzaSyClhKv-XaZs679aVBkHB2dqTsQ1asckVx4`;
            fetch(geo_url)
              .then((response) => response.json())
              .then((data) => {
                your_address_parts = data.results[0].formatted_address;
                setMarkers((current) => [
                  {
                    owner: "YOU",
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                    time: new Date(),
                    buttontext: "",
                    actualaddress: your_address_parts,
                  },
                ]);
              })
              .catch((err) => console.warn(err.message));

            searchLatLon(event.latLng.lat(), event.latLng.lng()).then(() => {
              setVendors((current) => close_vendors);
            });
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.time.toISOString()}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => {
                setSelected(marker);
              }}
            />
          ))}
          {Array.from(nearby_vendors).map((single_vendor) => (
            <Marker
              key={single_vendor._id.toString()}
              position={{
                lat: single_vendor.current_location.coordinates[0],
                lng: single_vendor.current_location.coordinates[1],
              }}
              onClick={() => {
                geo_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${single_vendor.current_location.coordinates[0]},${single_vendor.current_location.coordinates[1]}&key=AIzaSyClhKv-XaZs679aVBkHB2dqTsQ1asckVx4`;
                fetch(geo_url)
                  .then((response) => response.json())
                  .then((data) => {
                    address_parts = data.results[0].formatted_address;
                    setSelected({
                      owner_id: single_vendor._id,
                      owner: single_vendor.business_name,
                      lat: single_vendor.current_location.coordinates[0],
                      lng: single_vendor.current_location.coordinates[1],
                      time: new Date(),
                      buttontext: "Go to the vendor!",
                      actualaddress: address_parts,
                    });
                  })
                  .catch((err) => console.warn(err.message));
              }}
            />
          ))}
          {selected ? (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div>
                <p> {selected.owner} </p>
                <p> Lat: {selected.lat} </p>
                <p> Lon: {selected.lng} </p>
                <p> Address: {selected.actualaddress} </p>
                <button
                  onClick={() =>
                    Router.push({
                      pathname: "/viewVendorSingle",
                      query: { vendor_id: selected.owner_id },
                    })
                  }
                >
                  {" "}
                  {selected.buttontext}{" "}
                </button>
              </div>
            </InfoWindow>
          ) : null}{" "}
        </GoogleMap>
      </div>
    </>
  );
}
