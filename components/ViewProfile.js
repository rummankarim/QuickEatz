import React from "react";
import Router from "next/router";
import ViewCustomerProfile from "./ViewCustomerProfile";
import ViewVendorProfile from "./ViewVendorProfile";

import EditCustomerProfile from "./EditCustomerProfile";
import EditVendorProfile from "./EditVendorProfile";

export default class ViewProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isLoading: true,
      account_type: "",
    };
  }

  componentDidMount() {
    const storedToken = localStorage.getItem("quickeatz_token");
    const storedEmail = localStorage.getItem("quickeatz_email");
    const storedType = localStorage.getItem("quickeatz_type");
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
              account_type: storedType
            });
          } else {
            this.setState({
              isLoggedIn: false,
              isLoading: false,
            });
            Router.push("/login");
          }
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
    
    render() {
      console.log("ACCOUNT:", this.state.account_type);
      if (this.state.account_type === "vendor") {
        return <ViewVendorProfile />;
        // return <EditVendorProfile />;
      } else {
        return <ViewCustomerProfile />;
        // return <EditCustomerProfile />;
      }
  }
}
