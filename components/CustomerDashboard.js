import React from "react";
import Router from "next/router";
import MapContainerVendorPinInitial from "./MapContainerVendorPinInitial";
import MapContainerNearbyVendorPin from "./MapContainerNearbyVendorPin";

export default class CustomerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lng: null,
      cust_id: "",
      cust_name: "Empty",
      cust_email: "",
      cust_firstname: "",
      cust_lastname: "",
      cust_review_ids: [],
      cust_review_list: [],
      isLoggedIn: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    const storedToken = localStorage.getItem("quickeatz_token");
    const storedEmail = localStorage.getItem("quickeatz_email");
    const storedState = localStorage.getItem("quickeatz");
    if (storedState) {
      const data = {
        token: storedToken,
        email: storedEmail,
      };
      console.log(JSON.stringify(data));
      fetch("/api/auth/verifyShallow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            console.log("Token verified!");
            localStorage.setItem("quickeatz", true);
            this.setState({
              isLoggedIn: true,
              isLoading: false,
            });
          } else {
            this.setState({
              isLoggedIn: false,
              isLoading: false,
            });
            Router.push("/login");
          }
        });

      const cust = fetch(`/api/getCustomerSingleEmail?email=${storedEmail}`) //Get the customer's data
        .then((data) => data.json())
        .then((json) => {
          this.setState({
            cust_id: json._id,
            cust_name: json.username,
            cust_email: json.email,
            cust_firstname: json.first_name,
            cust_lastname: json.last_name,
            cust_review_ids: json.reviews,
          }),
            json.reviews.forEach(
              (r_id) =>
                fetch(`/api/getReviewsVendor?_id=${r_id}`) //Get the reviews (structure of review system seems flawed, works for now)
                  .then((r_data) => r_data.json())
                  .then((r_json) => {
                    fetch(`/api/getVendorSingle?_id=${r_json.vendor_id}`) //Get the Vendor name of the reviewee for readability
                      .then((v_data) => v_data.json())
                      .then((v_json) => {
                        (r_json.vendor_name = v_json.business_name),
                          this.setState({
                            cust_review_list: [
                              ...this.state.cust_review_list,
                              r_json,
                            ],
                          });
                      }); //Get the name specifically
                  })
                  .catch((error) => console.log(error)) //If there is some review that doesn't exist in the table, but referenced for some reason
            );
        });
    } else {
      console.log("Token not found!");
      this.setState({
        isLoggedIn: false,
        isLoading: true,
      });
      Router.push("/login");
    }
  }

  setCoordinates(coord_pair) {
    console.log(coord_pair);
    this.setState({
      lat: coord_pair.latitude,
      lng: coord_pair.longitude,
    });
    //setCoords({lat: coord_pair.latitude, lng: coord_pair.longitude}, console.log(coords));
  }
  render() {
    if (this.state.isLoading) {
      return <div> Loading... </div>;
    } else if (this.state.isLoggedIn) {
      return (
        <div>
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto pt-6 sm:px-6 lg:px-8">
              <div className="px-4 sm:px-0">
                <div className="border-2 p-2 font-semibold border-yellow-500 rounded-sm text-center">
                  <p>
                    Set a pin at your location. Nearby vendors will be
                    displayed, and more info can be found by clicking on them.
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center px-4 py-6 sm:px-0">
                <div className="border-2 mb-4 p-2 font-semibold border-dashed border-yellow-500 rounded-sm">
                  <MapContainerNearbyVendorPin
                    containerStyle={{
                      position: "relative",
                    }}
                    style={{ height: "100vh", width: "70vw" }}
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="text-3xl font-bold px-4 sm:px-0">My Reviews</div>
              <div className="justify-center items-centerpx-4 py-6 sm:px-0">
                <div className="text-center p-4 border-4 border-yellow-600 rounded-lg">
                  {this.state.cust_review_list.length == 0 && (
                    <p>You haven't made any reviews.</p>
                  )}
                  <ul>
                    {this.state.cust_review_list.map((review) => (
                      <li className="text-left border-double border-2 border-yellow-400 p-2">
                        <p className="font-semibold text-xl">{review.vendor_name}</p>
                        <p className="inline-block pr-2 font-semibold">Your Rating:  </p>
                        {review.rating} Stars <br />
                        <p className="inline-block pr-2 font-semibold">Your Review: </p>
                        {review.review_content}
                        <div className="float-right font-bold">{new Date(review.created_at).toLocaleDateString()} {new Date(review.created_at).toLocaleTimeString()}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    } else {
      Router.push("/login");
    }
  }
}
