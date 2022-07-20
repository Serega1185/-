import React, { useEffect, useState } from "react";
import UpArrow from "../../static/images/svg/up-arrow.svg";
import "./ScrollTop.css";

export default function ScrollTop(props) {
  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -30);
      setTimeout(backToTop, 0);
    }
  }
  return (
    <button onClick={backToTop} className="scroll-top">
      <div className="scroll-top__icon">
        <img src={UpArrow} />
      </div>
    </button>
  );
}
