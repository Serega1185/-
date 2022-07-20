import React, { useEffect, useState } from "react";
import "./CardModifiers.css";

export default function CardModifiers(props) {
  const [idOrder, setIdOrder] = useState(null);

  useEffect(() => {
    setIdOrder(props.idOrder);
  }, [props.idOrder]);

  return (
    <div className="modifiers-card">
      <div className="modifiers-card__block">
        <div className="modifiers-card__title">Modifier name</div>
        <div className="modifiers-card__price">€1,90</div>
      </div>
      <div className="modifiers-card__bottom">
        <button className="modifiers-card__button">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66699 16H25.3337"
              stroke="#080433"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <input className="modifiers-card__input" value="1" />
        <button className="modifiers-card__button">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 6.66667V25.3333"
              stroke="#080433"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.66699 16H25.3337"
              stroke="#080433"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
