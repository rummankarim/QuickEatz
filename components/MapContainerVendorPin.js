import React from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

export class MapContainerVendorPin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVendor: false,
      vendorID: "",
      vendorName: "",
      marker: {},
    };

    this.onMapClick = this.onMapClick.bind(this);
    this.sendLatLon = this.sendLatLon.bind(this);
  }

  componentDidMount() {
    const account_type = localStorage.getItem("quickeatz_type");
    const isVendorAccount = account_type == "vendor";
    this.setState({ isVendor: isVendorAccount });
    if (isVendorAccount) {
      const account_email = localStorage.getItem("quickeatz_email"); //Get the logged in user's email
      const vendor = fetch(`/api/getVendorSingleEmail?email=${account_email}`) //Get the vendor's data
        .then((data) => data.json())
        .then((json) => {
          this.setState({
            vendorID: json._id,
            vendorName: json.business_name,
            marker: {
              title: json.business_name,
              position: {
                lat: json.current_location.coordinates[0],
                lng: json.current_location.coordinates[1],
              },
            },
          });
        });
    }
  }

  async sendLatLon(latitude, longitude) {
    const id_str = this.state.vendorID.toString();
    await fetch(
      `/api/sendLatLon?_id=${id_str}&latitude=${latitude}&longitude=${longitude}`
    );
  }

  onMapClick(t, map, coord) {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.sendLatLon(lat, lng);
    this.setState((previousState) => {
      return {
        marker: { title: "Position updated!", position: { lat, lng } },
      };
    });
  }

  render() {
    if (this.state.isVendor == false) {
      return <p> You are not a vendor. How did you get here? </p>;
    } else {
      return (
        <>
          <h1>Set the location for {this.state.vendorName}.</h1>
          <Map
            google={this.props.google}
            zoom={11}
            initialCenter={{
              lat: 40.7128,
              lng: -74.006,
            }}
            onClick={this.onMapClick}
          >
            {
              <Marker
                title={this.state.marker.title}
                position={this.state.marker.position}
              />
            }
          </Map>
        </>
      );
    }
  }
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyClhKv-XaZs679aVBkHB2dqTsQ1asckVx4",
})(MapContainerVendorPin);
