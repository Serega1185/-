import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./QuantityButton.css";

export default function QuantityButtonCheckOrder(props) {

  ///Update orders waiter
  const clickButton = (item) => {
    let quantityValueLocal = props.quantity;
    if (item == "plus") {
      quantityValueLocal++;
    } else {
      quantityValueLocal--;
    }
    props.updateQuantity(quantityValueLocal)
  };

  return (
    <div className="quantity-button">
      <button
        onClick={() => clickButton("min")}
        className="quantity-button__min"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H19"
            stroke="#080433"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <input
        readOnly
        className="quantity-button__input"
        value={props.quantity}
      />
      <button
        onClick={() => clickButton("plus")}
        className="quantity-button__plus"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19"
            stroke="#080433"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 12H19"
            stroke="#080433"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
