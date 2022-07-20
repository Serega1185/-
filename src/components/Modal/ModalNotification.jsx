import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { getConfig, instance } from "../../Api/init";
import "./Modal.css";

export default function ModalNotification(props) {
  const dispatch = useDispatch();
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const Navigate = useNavigate();

  const closeModal = (e) => {
    if (e.target.classList[0] == "ReactModal__Content") {
      props.closeModal();
    }
  };

  console.log(userSettingsReducer.openOrder.orders);
  function clickPush() {
    let pushOrder = JSON.parse(localStorage.getItem("orderPush"))
      ? JSON.parse(localStorage.getItem("orderPush"))
      : false;

    if (pushOrder) {
      confirmOrders(pushOrder);
    } else {
      userSettingsReducer.openOrder.orders.map((order) => {
        if (
          (order.status.slug == "new_order" || order.status.slug == "cancel") &&
          order.products.length > 0
        ) {
          confirmOrders(order);
        }
      });
    }
  }
  function confirmOrders(order) {
    console.log("запушили", order);
    if (order.products.length > 0) {
      instance
        .put(
          `orders/${order.id}`,
          {
            table_id: order.table_id,
            products: order.products,
            comment: order.comment,
            status_id: 2,
            guests: order.guests,
            payment_method_id: 1,
          },
          getConfig()
        )
        .then((resp) => {
          if (resp.data.message == "success") {
            dispatch({
              type: "USER_OPEN_ORDER",
              payload: resp.data.table,
            });
          }
        });
    }
    localStorage.setItem("orderPush", false);
    props.closeModal();
    Navigate(`/order`);
  }

  useEffect(() => {
    if (props.isOpen == true) {
      document.querySelector("body").addEventListener("click", closeModal);
    }
    return () => {
      document.querySelector("body").removeEventListener("click", closeModal);
    };
  }, [props.isOpen]);

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      className="modal-custom"
      ariaHideApp={false}
    >
      <div className="modal-custom__container modal-custom__container--height">
        <div className="modal-custom__title-center">Confirm order</div>
        <div className="notification-text">
          After confirmation, a new order will appear in the checkout
        </div>

        <div className="modal-custom__bottom modal-custom__bottom--mt">
          <button
            className="modal-custom__bottom-btn"
            onClick={props.closeModal}
          >
            Cancel
          </button>
          <button className="modal-custom__bottom-btn" onClick={clickPush}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
