import { connectToDatabase } from "../util/mongodb";
import React from "react";

import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

const ObjectId = require("mongodb").ObjectID;

const libraries = ["places"]; //libraries to avoid rerender?
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 40.7128,
  lng: -74.006,
};

const options = {}; // Leave this just in case.

export default function mApp({ current_vendor, vendors, customers }) {
  //NOTE BAD PRACTICE TO SHOEHORN API KEY IN USE ENVLOCAL MAYBE

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyClhKv-XaZs679aVBkHB2dqTsQ1asckVx4",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]); //MAYBE A BETTER WAY TO DO THIS

  const [selected, setSelected] = React.useState(null); //FOR INFO BOX

  // Send updated coords to database for given vendor
  // current_vendor is a vendor object
  const sendLatLon = async (current_vendor, latitude, longitude) => {
    const id_str = current_vendor._id.toString();
    await fetch(
      `http://localhost:3000/api/sendLatLon?_id=${id_str}&latitude=${latitude}&longitude=${longitude}&test=1231231`
    );
  };

  if (loadError) return "Error loading Maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <>
      <h1> My current location </h1>
      <div>
        <h1>Top 1 Vendors of All Time</h1>
        <p>
          <small>(According to Notacritic)</small>
        </p>
        <ul>
          {vendors.map((vendor) => (
            <li>
              <h2>{vendor.business_name}</h2>
              <h3>{vendor.first_name + " " + vendor.last_name}</h3>
              <p>{vendor.cuisine}</p>
              <p> Lat: {vendor.current_location.coordinates[0]} </p>
              <p> Lon: {vendor.current_location.coordinates[1]} </p>
            </li>
          ))}
        </ul>
        <ul>
          {customers.map((customer) => (
            <li>
              <h3>{customer.first_name + " " + customer.last_name}</h3>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
          onClick={(event) => {
            setMarkers((current) => [
              {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                time: new Date(),
              },
            ]);
            sendLatLon(current_vendor, event.latLng.lat(), event.latLng.lng());
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
          {selected ? (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div>
                <p> Lat: {selected.lat} </p>
                <p> Lon: {selected.lng} </p>
              </div>
            </InfoWindow>
          ) : null}{" "}
          //ternary
        </GoogleMap>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { db } = await connectToDatabase();

  //HARDCODED
  const test_id_str = "6072359ab6856651fcb451c1";
  const test_id = new ObjectId(test_id_str);

  const current_vendor = await db
    .collection("vendors")
    .find({ _id: test_id })
    .sort({ average_rating: -1 })
    .limit(1)
    .toArray();

  const vendors = await db
    .collection("vendors")
    .find({ _id: test_id })
    .sort({ average_rating: -1 })
    .limit(20)
    .toArray();

  const customers = await db
    .collection("customers")
    .find({})
    .sort({})
    .limit(20)
    .toArray();

  return {
    props: {
      vendors: JSON.parse(JSON.stringify(vendors)),
      customers: JSON.parse(JSON.stringify(customers)),
      current_vendor: JSON.parse(JSON.stringify(current_vendor[0])),
    },
  };
}
