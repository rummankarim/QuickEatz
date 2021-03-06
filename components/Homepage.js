import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React from "react";

export default class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    const storedToken = localStorage.getItem("quickeatz_token");
    const storedEmail = localStorage.getItem("quickeatz_email");
    const storedState = localStorage.getItem("quickeatz");
    if (storedToken && storedEmail && storedState) {
      const data = {
        token: storedToken,
        email: storedEmail,
      };
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
            localStorage.setItem("quickeatz", true);
            this.setState({
              isLoggedIn: true,
            });
            Router.push("/dashboard");
          } else {
            this.setState({
              isLoggedIn: false,
            });
          }
        });
    } else {
      this.setState({
        isLoggedIn: false,
      });
    }
  }

  render() {
    return (
      <div className="mx-auto p-6 text-center font-pridi">
        <div className="mx-auto text-center">
          <Image
            src="/images/quickeatzlogo.png" // Route of the image file
            height={300} // Desired size with correct aspect ratio
            width={300} // Desired size with correct aspect ratio
            alt="QuickEatz Logo"
          />
          <h1 className="title text-6xl font-bungee">QuickEatz</h1>
          <br />
          <p className="text-3xl">➖ Who's hungry? ➖</p>
          <br />
          <Link href="/login">
            <span>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border-4 border-yellow-500 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
                onClick={null}
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="black"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Login &rarr;
              </button>
            </span>
          </Link>
          <br />
          <br />
          <Link href="/createAccount">
            <span className="hidden sm:block">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border-4 border-red-700 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="black"
                  aria-hidden="true"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Create Account &rarr;
              </button>
            </span>
          </Link>
          <br />
        </div>
        <hr />
        <br />
        <footer>🍔 Made By the QuickEatz Team 🍜</footer>
      </div>
    );
  }
}
