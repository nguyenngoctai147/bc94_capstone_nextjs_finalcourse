"use client";

import { useEffect } from "react";
import { legacyScriptBundles, loadLegacyScripts } from "@/lib/legacy/scripts";

export function ContactPage() {
  useEffect(() => {
    void loadLegacyScripts(legacyScriptBundles.hotuxContact);
  }, []);

  return (
    <section className="contact">
      <div className="container">
        <div className="contact-info"><div className="row">
          <div className="col-lg-4 col-md-12 mar-bottom-30"><div className="info-item"><div className="info-icon"><i className="fa fa-map-marker" /></div><div className="info-content"><p>445 Mount Eden Road, Mt Edenward land</p></div></div></div>
          <div className="col-lg-4 col-md-6 mar-bottom-30"><div className="info-item info-item-or"><div className="info-icon"><i className="fa fa-phone" /></div><div className="info-content"><p>977-444-666-888</p><p>977-444-222-000</p></div></div></div>
          <div className="col-lg-4 col-md-6 mar-bottom-30"><div className="info-item"><div className="info-icon"><i className="fa fa-envelope" /></div><div className="info-content"><p>info@hotux.com.np</p><p>help@hotux.com.np</p></div></div></div>
        </div></div>

        <div className="contact-support"><div className="row">
          <div className="col-lg-4 col-md-12 mar-bottom-30"><div className="support-item"><h4>Costumer Support</h4><p className="mar-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec hendrerit facilisis nisi.</p></div></div>
          <div className="col-lg-4 col-md-6 mar-bottom-30"><div className="support-item"><h4>Technical Support</h4><p className="mar-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec hendrerit facilisis nisi.</p></div></div>
          <div className="col-lg-4 col-md-6 mar-bottom-30"><div className="support-item"><h4>Booking Queries</h4><p className="mar-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec hendrerit facilisis nisi.</p></div></div>
        </div></div>

        <div className="contact-map"><div className="row">
          <div className="col-lg-6"><div id="map" style={{ height: "535px", width: "100%" }} /></div>
          <div className="col-lg-6"><div id="contact-form" className="contact-form">
            <h3>Keep in Touch</h3><div id="contactform-error-msg" />
            <form method="post" action="#" name="contactform" id="contactform">
              <div className="form-group"><input type="text" name="first_name" className="form-control" id="fname" placeholder="First Name" /></div>
              <div className="form-group"><input type="text" name="last_name" className="form-control" id="lname" placeholder="Last Name" /></div>
              <div className="form-group"><input type="email" name="email" className="form-control" id="email" placeholder="Email" /></div>
              <div className="form-group"><input type="text" name="phone" className="form-control" id="phnumber" placeholder="Phone" /></div>
              <div className="textarea"><textarea name="comments" placeholder="Enter a message" /></div>
              <div className="comment-btn text-right"><input type="submit" className="btn btn-orange" id="submit" value="Send Message" /></div>
            </form>
          </div></div>
        </div></div>
      </div>
    </section>
  );
}
