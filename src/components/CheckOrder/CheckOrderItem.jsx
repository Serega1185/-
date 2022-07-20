import React, { useEffect, useRef, useState } from "react";
import QuantityButtonCheckOrder from "../QuantityButton/QuantityButtonCheckOrder";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./CheckOrder.css";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { getConfig, instance } from "../../Api/init";
import ModalCommentProduct from "../Modal/ModalCommentProduct";
import CardCheckOrder from "./CardCheckOrder";

export default function CheckOrderItem(props) {
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [orderComment, setOrderComment] = useState("");
  const [openInner, setOpenInner] = useState(props.order.status.slug == "new_order"?true: false);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setOrderComment(props.order.comment);
  }, []);

  function clickOrderPush(order) {
    localStorage.setItem("orderPush", JSON.stringify(order));
    props.openModalNotification();
  }

  function productListFilter() {
    props.order.products.sort(function (a, b) {
      let itemA = a.foundation ? a.id + a.foundation.id : a.id;
      let itemB = b.foundation ? b.id + b.foundation.id : b.id;
      return itemA > itemB ? -1 : 1;
    });
    return props.order.products;
  }
  //clearOrder
  const clearOrder = () => {
    props.order.products = [];
    dispatch({
      type: "USER_UPDATE_ONLY_ORDER",
      payload: props.order,
    });
    instance
      .put(
        `orders/${props.order.id}`,
        {
          table_id: props.order.table_id,
          products: {},
          guests: props.order.guests,
        },
        getConfig()
      )
      .then((resp) => {
        if (resp.data.message == "success") {
        }
      });
  };

  ///забрал
  const takenAway = () => {
    ///local update
    props.order.status_id = 4;
    props.order.status.slug = "order_was_taken";
    ///local update

    /// update bd
    instance
      .put(
        `orders/forceUpdateOrder/${props.order.id}`,
        {
          table_id: props.order.table_id,
          status_id: 4,
        },
        getConfig()
      )
      .then((resp) => {
        if (resp.data.message == "success") {
        }
      });

    props.cardOrder.orders.map((orderLocal) => {
      if (props.order.id == orderLocal.id) {
        return props.order;
      }
      return orderLocal;
    });
    ///local update
    dispatch({ type: "UPDATE_TABLES", payload: props.cardOrder });
  };

  function changeCommentOrder(value) {
    setOrderComment(value);
    props.order.comment = value;
  }

  let priceOrder=0;
  props.order.products.map((product)=>{
    priceOrder = priceOrder + product.price*product.quantity
  })

  return (
    <div
      className={`check-order__list ${
        (props.order.status.slug == "order_in_progress" ||
          props.order.status.slug == "order_was_taken" ||
          props.order.status.slug == "order_is_ready") &&
        "check-order__list--confirmed"
      }`}
    >
      {props.cardOrder.orders.length > 0 && (
        <div
          onClick={() => setOpenInner(!openInner)}
          className="check-order__top"
        >
          <div className="check-order__top-left">
            <div className="check-order__top-title">
              №{props.order.number ? props.order.number : props.order.id}
              {props.order.compucash_order_id ? (
                props.order.compucash_order_id ? (
                  <>
                    /<span>{props.order.compucash_order_id} </span>
                  </>
                ) : (
                  "«ошибка»"
                )
              ) : (
                ""
              )}{" "}
            </div>
            
            {priceOrder>0 &&<div className="check-order__top-price">€{priceOrder.toFixed(2)}</div>}
          </div>
          <div className="check-order__top-right">
            <div className="check-order__top-status">
              {props.order.status.slug == "new_order"
                ? "Новый"
                : ""}
              {props.order.status.slug == "order_in_progress"
                ? "Готовится"
                : ""}
              {props.order.status.slug == "order_is_ready"
                ? props.cardOrder.cook.role.display_name == "Повар"
                  ? "Блюдо готово"
                  : "Напиток готов"
                : ""}
              {props.order.status.slug == "order_was_taken" ? (
                <span className="color-taken">Подан</span>
              ) : (
                ""
              )}
            </div>
            <div className="check-order__top-payment">
              {props.order.payment_method_id == 2 ? (
                <span className="payment-paid">Оплачен</span>
              ) : (
                <span className="payment-no-paid">Не оплачен</span>
              )}
            </div>
          </div>
        </div>
      )}
      {openInner && (
        <div className="check-order__inner">
          {productListFilter().map((card) => (
            <>
              <CardCheckOrder
                key={
                  props.cardOrder.id +
                  `${card.id}` +
                  `${card.foundation && card.foundation.id}`
                }
                card={card}
                orders={props.order}
                openModalNotification={props.openModalNotification}
              />
            </>
          ))}
          <div className="card-check__comment">
            <textarea
              className="card-check__comment-text"
              type="text"
              value={orderComment}
              onChange={(e) => changeCommentOrder(e.target.value)}
              placeholder="Комментарий"
            />
          </div>
          <div className="card-check__control">
            {props.order.status.slug == "order_is_ready" && (
              <div
                onClick={() => takenAway(props.order)}
                className="card-check__btn button-one"
              >
                забрал
              </div>
            )}
            <button
              onClick={() => props.linkSupplement(props.order)}
              className="card-check__btn confirmed-hidden"
            >
              Добавить
            </button>
            <button
              onClick={() => clickOrderPush(props.order)}
              className="card-check__btn confirmed-hidden"
            >
              На кухню
            </button>
            <button
              onClick={() => clearOrder(props.order)}
              className="card-check__btn confirmed-hidden"
            >
              Очистить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
