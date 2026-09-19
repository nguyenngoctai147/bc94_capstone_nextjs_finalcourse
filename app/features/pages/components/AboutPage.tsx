"use client";

/* eslint-disable @next/next/no-img-element -- static Hotux about markup. */
import { useEffect } from "react";
import { legacyScriptBundles, loadLegacyScripts } from "@/lib/legacy/scripts";

const faqs = [
  ["How can I improve my oral hygiene?", "Everyone’s needs are different, so have a chat to your dentist about how often you need to have your teeth checked by them based on the condition of your mouth, teeth and gums."],
  ["How do I know if my teeth are healthy?", "Everyone’s needs are different, so have a chat to your dentist about how often you need to have your teeth checked by them based on the condition of your mouth, teeth and gums."],
  ["Why are regular dental assessments so important?", "Everyone’s needs are different, so have a chat to your dentist about how often you need to have your teeth checked by them based on the condition of your mouth, teeth and gums."],
  ["What if I have to cancel my appointment?", "Sometimes the unexpected happens and you need to cancel your appointment make sure you call us or email us 1 day ago before cancellation."],
  ["What do I need to bring to my appointment?", "Sometimes the unexpected happens and you need to cancel your appointment make sure you call us or email us 1 day ago before cancellation."],
  ["What are the facilities available in the hospital?", "Sometimes the unexpected happens and you need to cancel your appointment make sure you call us or email us 1 day ago before cancellation."],
] as const;

const team = [
  ["team1.jpg", "John Anderson", "Ceo and Founder"],
  ["team2.jpg", "Erina Gray", "Managing Director"],
  ["team3.jpg", "Micheal Carter", "Supervisor"],
  ["team4.jpg", "Nelson Roar", "Project Manager"],
] as const;

const services = [
  ["service1.jpg", "Restaurant", "Breakfast and Dinner"],
  ["service2.jpg", "Massage", "Opens Daily"],
  ["service3.jpg", "Conference Room", "Air Conditioning"],
] as const;

const reviews = [
  { id: "micheal-clordy-germany-primary", image: "review1.jpg", name: "Micheal Clordy", country: "Germany" },
  { id: "ketty-perry-australia", image: "review2.jpg", name: "Ketty Perry", country: "Australia" },
  { id: "micheal-clordy-germany-featured", image: "review1.jpg", name: "Micheal Clordy", country: "Germany" },
] as const;

function SocialLinks() {
  return <ul className="social-links"><li><a href="#"><i className="fa fa-facebook" aria-hidden="true" /></a></li><li><a href="#"><i className="fa fa-twitter" aria-hidden="true" /></a></li><li><a href="#"><i className="fa fa-instagram" aria-hidden="true" /></a></li><li><a href="#"><i className="fa fa-linkedin" aria-hidden="true" /></a></li></ul>;
}

export function AboutPage() {
  useEffect(() => {
    void loadLegacyScripts(legacyScriptBundles.hotuxAbout);
  }, []);

  return (
    <>
      <section className="about">
        <div className="container"><div className="row">
          <div className="col-lg-8"><div className="about-para mar-top-50">
            <h3>About Hotux</h3><h4>Pick a room that best suits your taste and budget</h4>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam.</p>
            <h5 className="text-capitalize">eque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incid dolor sit amet, consectetur, adipisci velit</h5>
            <div className="about-para-list mar-top-20"><div className="row"><div className="col-md-4 col-sm-4 col-xs-4"><div className="about-icon"><i className="fa fa-chess-queen" /> Awesome Nature</div></div><div className="col-md-4 col-sm-4 col-xs-4"><div className="about-icon"><i className="fa fa-chess-queen" /> Awaded Best Hotel</div></div><div className="col-md-4 col-sm-4 col-xs-4"><div className="about-icon"><i className="fa fa-chess-queen" /> Online Booking</div></div></div></div>
          </div></div>
          <div className="col-lg-4"><div className="about-us-image mar-top-50"><img src="/assets/images/gallery/gallery1.jpg" alt="image" /></div></div>
        </div></div>
      </section>

      <section className="about-faq"><div className="container"><div className="row">
        <div className="col-lg-5"><div className="about-us-image"><img src="/assets/images/gallery/gallery2.jpg" alt="image" /></div></div>
        <div className="col-lg-7"><div className="info-detail"><div className="accrodion-grp" data-grp-name="faq-accrodion">
          {faqs.map(([question, answer], index) => <div className={`accrodion${index === 0 ? " active" : ""}`} key={question}><div className="accrodion-title"><h4>{question}</h4></div><div className="accrodion-content" style={{ display: index === 0 ? "block" : "none" }}><div className="inner"><p>{answer}</p></div></div></div>)}
        </div></div></div>
      </div></div></section>

      <section className="video-box"><div className="container"><div className="section-title"><h3 className="white mar-0">Take a Tour</h3><div className="call-button"><button type="button" className="play-btn js-video-button" data-video-id="347309186" data-channel="vimeo"><i className="fa fa-play" /></button></div><div className="video-figure" /><h4 className="white mar-0">0f our wounderfull resort</h4></div></div></section>

      <section className="about-team"><div className="container"><div className="section-title"><h2>Explore <span>Team</span></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis</p></div><div className="row team-slider">
        {team.map(([image, name, role]) => <div className="col-md-4" key={name}><div className="team-item"><div className="team-image"><img src={`/assets/images/${image}`} alt="image" /></div><div className="team-content"><h4>{name}</h4><p>{role}</p><SocialLinks /></div></div></div>)}
      </div></div></section>

      <section className="reviews"><div className="container"><div className="section-title title-white"><h2>Explore <span>Reviews</span></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis</p></div><div className="review-slider">
        {reviews.map(({ id, image, name, country }) => <div className="slider-item" key={id}><div className="slider-image"><img src={`/assets/images/${image}`} alt="image" /></div><div className="slider-content"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod tortor vitae nisi pharetra egestas. Sed egestas sapien libero.</p><h4>{name}</h4><span>{country}</span></div><div className="slider-quote"><img src="/assets/images/icons/quote.png" alt="Image" /></div></div>)}
      </div></div></section>

      <section className="services pad-bottom-70"><div className="container"><div className="section-title"><h2>Explore <span>Services</span></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis</p></div><div className="service-outer"><div className="row">
        {services.map(([image, name, detail], index) => <div className={index === 0 ? "col-lg-4 col-md-12 mar-bottom-30" : "col-lg-4 col-md-6 mar-bottom-30"} key={name}><div className="service-item"><div className="service-image"><img src={`/assets/images/${image}`} alt="Image" /></div><div className="service-content"><h4><a href="#">{name}</a></h4><p>{detail}</p></div></div></div>)}
      </div></div></div></section>
    </>
  );
}
