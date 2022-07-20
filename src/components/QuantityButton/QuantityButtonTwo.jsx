import React from "react";
import "./QuantityButton.css";
import MinusCircleSvg from "../../static/images/svg/minus-circle1.svg";
import PlusCircle1Svg from "../../static/images/svg/plus-circle1.svg";

export default function QuantityButtonTwo(props) {


  return (
   
    <div className="quantity-button-two">
    <button
      onClick={() => props.clickButtonQuantity("min")}
      className="quantity-button-two__button"
    >
      <img src={MinusCircleSvg} />
    </button>
    <input
      className="quantity-button-two__input"
      readOnly
      value={props.quantity}
    />
    <button
      onClick={() => props.clickButtonQuantity("plus")}
      className="quantity-button-two__button"
    >
      <img src={PlusCircle1Svg} />
    </button>
  </div>
  );
}
