  import "./homepage.css"; 
  import sit from ".././pages/images/sitlogo.png";
  function HomePage() {
    function gologin(){
      window.location.href = "/booking";
    }
    return (
      <div className="homepage">
        <div className="hero-container">
          <div className="hero-overlay"></div>
          <div>
            <div className="hero-content">
              <h1 className="hero-title">
              <img src={sit} alt="" />

              </h1>
              <div className="right-content">
                  <h1 className="neon-text">Booking</h1>
              <p className="hero-description">
              King Mongkut's University of Technology Thonburi
            </p>
              </div>
              
            </div>
            
          </div>
        <button className="btn hero-button " onClick={gologin} >START</button>
        </div>
      </div>
    );
  }

  export default HomePage;
