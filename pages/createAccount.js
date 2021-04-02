import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/accountLayout'


export default function FirstPost() {
  return (
    <div>

      <div className="navbar">
        <a href="/">Home</a>
        <a href="/login">Login</a>
      </div>

      <section className="topPage">

        <Head>
          <title className="title">Create Account</title>
        </Head>
        <Layout>
          <h1 className="title">Create Account</h1>
        </Layout>
      </section>

      <section className="midPage">
        <h1 className="accountMessage">Please Select a Vendor or Customer Account </h1>
      </section>

      <section className="bottomPage">

        <select>
          <option value="Customer">Customer</option>
          <option value="Vendor">Vendor</option>
        </select>

        <form onSubmit>
          <label className="usernameLabel">
            Username: <input type="text" name="username" />
          </label>

          <div></div>

          <label className="passwordLabel">
            Password: <input type="test" name="password" />
          </label>

          <div></div>

          <input type="submit" value="Submit" />
        </form>

      </section>


      <style jsx>{`

        .navbar {
          overflow: hidden;
          background-color: #F7FFF7;
          padding: 10px;
          width: 100%;
          display: flex
          position: fixed;

          align-items: center;
        }

        .navbar a {
          float: left;
          color: #000000;
          text-align: center;
          padding: 10px 10px 10px 10px;
          text-decoration: none;
          font-size: 30px;
        }

        .navbar a:hover {
          background-color: #DDD;
          color: black;
        }
        
        .navbar a.active {
          background-color: #7289DA;
          color: white;
        }

        .title {
          font: 70px "Bungee Shade";
          color: white;
        }

        .usernameLabel {
          border: #FFE66D 30px 30px 30px 30px;
          outline: #000000 30px 30px 30px 30px;
        }

        .passwordLabel {
          border: #51B1E7 30px 30px 30px 30px;
          outline: #000000 30px 30px 30px 30px;
        }

        .topPage {
          background-color: #B3DEE5; /*#FF6B6B Red*/
          width: 100%;
          height: 575px;
          display: flex;
          align-items: center;
          text-align: center;
          
        }

        .midPage {
          background-color: #F8981D;/*#FFE66D;*/
          padding: 20px 20px 20px 30px;
          align-items: center;
          text-align: center;
        }

        .bottomPage {
          background-color: #FFE66D;/*#4ECDC4;*/
          align-items: center;
          text-align: center;
          padding 200px 200px 200px 200px;
          position: relative;
          bottom: 0;
        }

        .accountMessage {
          color: black;
        }

      `}</style>

    </div >
  );
}

// <select onChange={this.handleChange} >
// form onSubmit={this.handleSubmit}>

