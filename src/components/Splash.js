import React from 'react';
import { Link } from 'react-router-dom';

const Splash = () => {
  return (
    <div className="splash-page">
      <div className="parallax splash-img1">
        <div className="splash-login-links">
          <Link to="/register"><h1>Get Started</h1></Link>
          <Link to ="/login"><h1>Login</h1></Link>
          <h5>or scroll down to learn more</h5>
        </div>
      </div>
      <section>
        <div className="splash-page-intro">
          <h2>What is Spelling Bee A-Z</h2>
          <p>Spelling Bee A-Z is a place to practice spelling. Make sure your volume is on because this app uses your computers speakers to voice a word. You will then type in what you think the correct spelling is. You will be notified if you are correct or incorrect. Your scores will be saved and you will be able to monitor your progress. Spelling Bee A-Z is for people of all skill levels. There are easy, medium, and difficult levels that you can choose from.</p>
        </div>
      </section>
      <div className="parallax splash-img2"></div>
      <section>
        <div className="splash-page-quotes">
          <p>"Spelling Bee A-Z has improved my spelling!" <span>-edward white</span></p>
        </div>
      </section>
      <footer>
        <img src="/images/spellingbee3.png" />
      </footer>
    </div>
  )
}

export default Splash;
