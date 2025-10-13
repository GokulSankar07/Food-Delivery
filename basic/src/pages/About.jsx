import React from "react";
import "./about.css"; // import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>

      <p>
        Welcome to <strong>Foodie Express</strong> – your one-stop destination
        for delicious meals delivered right to your doorstep. We connect
        customers with their favorite local restaurants, offering a wide variety
        of cuisines at affordable prices.
      </p>

      <p>
        Our mission is to make food ordering easy, reliable, and enjoyable. With
        just a few clicks, you can browse menus, place your order, and track
        your delivery in real-time.
      </p>

      <h2>Why Choose Us?</h2>
      <ul>
        <li>Wide range of restaurants & cuisines</li>
        <li>Fast and reliable delivery</li>
        <li>Easy-to-use app with secure payments</li>
        <li>Exciting offers and discounts</li>
      </ul>

      <h2>Contact Us</h2>
      <div className="contact-info">
        <span>📍 Location: Chennai, India</span>
        <span>📧 Email: support@foodieexpress.com</span>
        <span>📞 Phone: +91 98765 43210</span>
      </div>
    </div>
  );
};

export default About;
