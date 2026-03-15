"use client";

import Link from "next/link";
import "./globals.css";
import { FaGithub,FaTwitter,FaWhatsapp } from "react-icons/fa";


export default function Home() {


    const subscribe = async () => {

const email = document.getElementById("newsletter-email").value;
const website = document.getElementById("website").value;

const res = await fetch("/api/newsletter",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
website
})
});

if(res.ok){
alert("Subscribed successfully!");
}else{
alert("Something went wrong");
}

};









  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="fade-up">Elevate Your Health Journey</h1>
          <p className="fade-up delay">
            Horizon helps you track your BMI, monitor nutrition status,
            and stay informed with reliable health insights.
          </p>

          <div className="hero-buttons fade-up delay-2">
            <Link href="/calculator">
              <button className="primary-btn">Start Now</button>
            </Link>
            <Link href="/dashboard">
              <button className="secondary-btn">View Progress</button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="section">
        <h2 className="section-title">What We Offer</h2>

        <div className="card-grid">
          <div className="card slide-up">
            <h3>BMI & Health Calculator</h3>
            <p>
              Instantly calculate BMI, ideal body weight,
              and daily calorie requirements.
            </p>
          </div>

          <div className="card slide-up delay">
            <h3>Monthly Progress Tracking</h3>
            <p>
              Visualize your BMI and calorie trends with
              interactive analytics.
            </p>
          </div>

          <div className="card slide-up delay-2">
            <h3>Nutrition Education</h3>
            <p>
              Learn evidence-based nutrition knowledge
              to improve your lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="section light">
        <h2 className="section-title">Designed For</h2>
        <div className="audience">
          <p>✔ Individuals tracking health progress</p>
          <p>✔ Anyone checking their nutrition status</p>
          <p>✔ People seeking general nutrition awareness</p>
          <p>✔ Students & professionals interested in health data</p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <h2 className="section-title">What Users Say</h2>

        <div className="card-grid">
          <div className="card glass">
            <p>
              &ldquo;Horizon helped me understand my BMI trends and improve my eating habits.&rdquo;
            </p>
            <strong>- Amina K.</strong>
          </div>

          <div className="card glass">
            <p>
              &ldquo;The dashboard keeps me motivated and accountable.&rdquo;
            </p>
            <strong>- Daniel M.</strong>
          </div>

          <div className="card glass">
            <p>
              &ldquo;Simple, elegant, and informative.&rdquo;
            </p>
            <strong>- Faith N.</strong>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="cta">
        <h2>Take Control of Your Health Today</h2>
        <Link href="/calculator">
          <button className="primary-btn large">Get Started</button>
        </Link>
      </section>





            {/* FOOTER */}
<footer className="footer">

  <div className="footer-grid">

    {/* BRAND */}
    <div className="footer-brand">
      <h3>Horizon</h3>
      <p>
        Empowering better nutrition awareness through smart
        health tracking and AI-powered insights.
      </p>
    </div>

    {/* QUICK LINKS */}
    <div className="footer-column">
      <h4>Quick Links</h4>
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/chatbot">AI Nutrition</Link>
    </div>

    {/* TOOLS */}
    <div className="footer-column">
      <h4>Tools</h4>
      <Link href="/calculator">BMI Calculator</Link>
      <Link href="/calculator">Energy Calculator</Link>
    </div>

    {/* SHOP */}
    <div className="footer-column">
      <h4>Shop</h4>
      <Link href="/shop">Hoodies</Link>
      <Link href="/shop">T-Shirts</Link>
      <Link href="/shop">Beanies</Link>
      <Link href="/shop">Tote Bags</Link>
    </div>




    








    {/* NEWSLETTER */}
    <div className="footer-column">
      <h4>Stay Updated</h4>
      <p>Get nutrition tips & Horizon updates.</p>

      <div className="newsletter">
        <input id="newsletter-email" type="email" placeholder="example@gmail.com"/>

              {/* BOT TRAP */}
      <input
      type="text"
      id="website"
      style={{display:"none"}}
      />




        <button onClick={subscribe}>Subscribe</button>

      </div>


      <div className="social-icons">

      <a href="https://github.com/Abdub46">
      <FaGithub/>
      </a>

      <a href="https://twitter.com/Abdub134">
      <FaTwitter/>
      </a>

      <a href="https://wa.me/254719644609">
      <FaWhatsapp/>
      </a>

      </div>




    </div>

  </div>

  <div className="footer-bottom">
    <p>© {new Date().getFullYear()} Horizon Health App</p>
  </div>

</footer>









    </div>
  );
}



