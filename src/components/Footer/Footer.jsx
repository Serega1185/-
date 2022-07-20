import React, { useEffect, useState } from "react";
import "./Footer.css";

export default function Footer(props) {
  return (
    <div className="footer">
      <button onClick={props.openModalNotification} className="footer__btn">На кухню</button>
    </div>
  );
}
