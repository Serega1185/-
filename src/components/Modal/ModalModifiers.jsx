import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import * as alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import "./Modal.css";
import { getConfig, instance } from "../../Api/init";
import QuantityButtonTwo from "../QuantityButton/QuantityButtonTwo";

export default function ModalModifiers(props) {
  const dispatch = useDispatch();
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [roastLevel, setRoastLevel] = useState(false);
  const [cacheOrder, setCacheOrder] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const ALERT_CHECK_ICON =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.9987 14.6654C11.6654 14.6654 14.6654 11.6654 14.6654 7.9987C14.6654 4.33203 11.6654 1.33203 7.9987 1.33203C4.33203 1.33203 1.33203 4.33203 1.33203 7.9987C1.33203 11.6654 4.33203 14.6654 7.9987 14.6654Z" stroke="#BAC10A" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.16797 7.99995L7.05464 9.88661L10.8346 6.11328" stroke="#BAC10A" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  useEffect(() => {
    let cacheOrderLocal =
      localStorage.getItem("orderPush") != "undefined" &&
      JSON.parse(localStorage.getItem("orderPush"));
    if (cacheOrderLocal) {
      setCacheOrder(cacheOrderLocal);
    } else {
      setCacheOrder(false);
    }

    if (props.product != false) {
      setQuantity(1);
      document.querySelector("body").addEventListener("click", closeModal);
    }
    return () => {
      document.querySelector("body").removeEventListener("click", closeModal);
    };
  }, [props.product]);

  function addNewProduct() {
    ///alert
    var delay = alertify.get("notifier", "delay");
    alertify.set("notifier", "delay", 3);
    let message = ALERT_CHECK_ICON + "Добавлен в корзину";
    alertify.success(message);
    alertify.set("notifier", "position", "top-left", "delay", delay);

    ///alert

    let ordersLocal = cacheOrder ? cacheOrder.products : [];
    const newProduct = {
      id: props.product.id,
      quantity: quantity,
      foundation: { id: roastLevel },
    };

    let isOrder = ordersLocal.filter((product) => {
      if (product.id == props.product.id) {
        if (product.foundation) {
          if (product.foundation.id == roastLevel) {
            return product;
          }
        } else {
          return product;
        }
      } else {
      }
    });

    console.log("isOrder", isOrder);
    if (isOrder.length < 1) {
      ordersLocal.push(newProduct);
    }
    cacheOrder.products = ordersLocal;

    dispatch({
      type: "USER_UPDATE_ONLY_ORDER",
      payload: cacheOrder,
    });
    if (cacheOrder && cacheOrder.status.slug != "order_in_progress") {
      //Update bd orders end
      instance
        .put(
          `orders/${cacheOrder.id}`,
          {
            table_id: cacheOrder.table_id,
            products: ordersLocal,
            guests: cacheOrder.guests,
          },
          getConfig()
        )
        .then((resp) => {
          if (resp.data.message == "success") {
          }
        });
      //Update bd orders end
    }
    props.closeModal();
    setQuantity(1);
  }

  const clickButtonQuantity = (item) => {
    let quantityValueLocal = quantity;
    if (item == "plus") {
      quantityValueLocal++;
    } else {
      quantityValueLocal--;
    }
    if (quantityValueLocal > 0) {
      setQuantity(quantityValueLocal);
    }
  };

  const closeModal = (e) => {
    if (e.target.classList[0] == "ReactModal__Content") {
      props.closeModal();
      setQuantity(1);
    }
  };

  const updateRoast = (i) => {
    setRoastLevel(i);
  };

  ////load price
  let priceLocal =
    props.product.price_new != 0
      ? props.product.price_new
      : props.product.price;
  priceLocal = (priceLocal * quantity).toFixed(2);

  return (
    <Modal
      isOpen={props.product && true}
      onRequestClose={props.closeModal}
      className="modal-custom"
      ariaHideApp={false}
    >
      <div className="modal-custom__container">
        <div className="modal-custom__top">
          <div className="modal-custom__title">{props.product.name}</div>
          <QuantityButtonTwo
            quantity={quantity}
            clickButtonQuantity={clickButtonQuantity}
          />
        </div>
        {props.product.foundations && props.product.foundations.length > 0 && (
          <div className="modal-custom__inner">
            <div className="modal-custom__option">
              <div className="modal-custom__name">Roast level</div>
              <div className="modal-custom__option-list">
                {props.product.foundations.map((item) => {
                  return (
                    <div
                      onClick={() => updateRoast(item.id)}
                      className={`modal-custom__option-item ${
                        roastLevel == item.id && "active"
                      }`}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* <div className="modal-custom__modifiers">
            <div className="modal-custom__name">Additional modifiers</div>
            <div className="modal-custom__modifiers-list">
              <CardModifiers />
              <CardModifiers />
              <CardModifiers />
              <CardModifiers />
            </div>
          </div> */}
          </div>
        )}
        <div className="modal-custom__total">
          <div className="modal-custom__total-text">Total</div>
          <div className="modal-custom__total-price">€{priceLocal}</div>
        </div>
        <div className="modal-custom__bottom">
          <button
            className="modal-custom__bottom-btn"
            onClick={props.closeModal}
          >
            Cancel
          </button>
          <button className="modal-custom__bottom-btn" onClick={addNewProduct}>
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
}
