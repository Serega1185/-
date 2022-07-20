import React, { useEffect, useState } from "react";
import "./CardOrder.css";
import UserSvg from "../../static/images/svg/users1.svg";
import clipboard1 from "../../static/images/svg/clipboard1.svg";
import notification1 from "../../static/images/svg/notification1.svg";
import dollarbanknoteSvg from "../../static/images/svg/62878dollarbanknote.svg";
import { useNavigate } from "react-router-dom";
import CardOrderPanel from "./CardOrderPanel";
import { useDispatch, useSelector } from "react-redux";
import { getConfig, instance } from "../../Api/init";

export default function CardOrder(props) {
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [openPanel, setOpenPanel] = useState(false);
  const [numberOrders, setNumberOrders] = useState(false);
  const [indexOrderLast, setIndexOrderLast] = useState(0);
  const [timeReadyOrder, setTimeReadyOrder] = useState(false);
  const [waiterStatus, setWaiterStatus] = useState(0);
  const [cardGuests, setCardGuests] = useState(1);
  const [cardPrice, setCardPrice] = useState(0);
  const dispatch = useDispatch();
  const Navigate = useNavigate();


  function updateWaiterStatus(i) {
    setWaiterStatus(i);
  }
  useEffect(() => {
    //load guests
    if (props.table.orders.length > 0) {
      setCardGuests(props.table.guests);
    }
    //load guests end

    //load readyOrder готов сделать заказ
    /// 300000 = min

    updateTimeReadyOrder();
    const checkDataTime = setInterval(() => {
      updateTimeReadyOrder();
    }, 5000);
    //load readyOrder end готов сделать заказ

    //load waiter_status
    //props.table.ask_for_bill ?

    updateWaiterStatus(props.table.call_waiter_status.id);
    //load waiter_status end

    //load NumberOrders
    let indexOrderLastLocal = 0;
    let indexOrderLastidLocal = 0;
    props.table.orders.map((item, index) => {
      if (indexOrderLastidLocal < item.id) {
        indexOrderLastLocal = index;
        indexOrderLastidLocal = item.id;
      }
    });

    setIndexOrderLast(indexOrderLastLocal);

    if (props.table.orders.length > 0) {
      let orders = JSON.parse(JSON.stringify(props.table.orders));
      orders = orders.filter((order) => order.products.length > 0);
      setNumberOrders(orders.length);
    }
    //load NumberOrders end

    //load price
    let priceLocal = 0;
    props.table.orders.map((item) => {
      priceLocal = priceLocal + item.total;
    });

    setCardPrice(priceLocal.toFixed(2));
    //load price end

    return () => {
      clearInterval(checkDataTime);
    };
  }, [props.table]);

  function updateTimeReadyOrder() {
    let timeLocal = new Date().getTime() - 300000;
    if (
      props.table.time_ready_to_order != 0 &&
      props.table.time_ready_to_order < timeLocal &&
      props.table.ready_to_order
    ) {
      setTimeReadyOrder(true);
    } else {
      setTimeReadyOrder(false);
    }
  }


  function openPanelClick() {
    console.log(props.table.ask_for_bill);
    if (
      props.table.status.slug != 'no_reserved' &&
      waiterStatus == 0 &&
      props.table.ready_to_order < 1 &&
      props.table.ask_for_bill < 1 &&
      !timeReadyOrder
    ) {
      dispatch({ type: "USER_OPEN_ORDER", payload: props.table });
      localStorage.setItem("USER_OPEN_ORDER", JSON.stringify(props.table));
      Navigate(`/check-order`);
      return;
    }
    setTimeout(() => {
      setOpenPanel(!openPanel);
    }, 20);
  }

  ///updateTimeSession bd orders
  function updateWaiter(status) {
    ///local update
    props.table.call_waiter_status.id = status;
    props.table.call_waiter_status_id = status;
    dispatch({ type: "UPDATE_TABLES", payload: props.table });
    updateWaiterStatus(status);
    ///local update
    instance
      .put(
        `tables/${props.table.id}`,
        {
          call_waiter_status_id: status,
        },
        getConfig()
      )
      .then((resp) => {
        if (resp.data.message == "success") {
        }
      })
      .catch(function (error) {});
  }
  ///updateTimeSession bd orders end

  ////sort
  function getLastOrder(orders) {
    if (orders.length > 0) {
      return orders.sort(function (a, b) {
        return a.id > b.id ? -1 : 1;
      })[0];
    }
    return false;
  }
  ////sort

  function tableStatus(tables) {
    const order = getLastOrder(tables.orders);

    if (tables.status.slug == "no_reserved") {
      return "";
    } else if (tables.status.slug == "new") {
      return "card-order--new";
    } else if (
      tables.status.slug == "in_process" &&
      props.table.ready_to_order < 1
    ) {
      return "card-order--accept";
    } else if (
      order &&
      order.status.slug == "order_in_progress" &&
      !tables.in_cash
    ) {
      return "card-order--red";
    }
    return "card-order--new";
  }

  const orders = JSON.parse(JSON.stringify(props.table.orders));
  let isCook = orders.filter(
    (order) => order.status.slug == "order_is_ready" && true
  );
  isCook = props.table.cook && isCook.length > 0;

  let notificationSvgActive =
    waiterStatus > 0 ? true : props.table.ask_for_bill > 0 && true;
  return (
    <div
      className={`card-order card-order--witer-status-${
        waiterStatus > 0 ? waiterStatus : props.table.ask_for_bill
      } ${tableStatus(props.table)} ${
        props.table.ready_to_order ? "card-order--ready-order " : ""
      } ${timeReadyOrder ? "card-order--ready-order-time " : ""}${
        isCook ? "card-order--ready-cook " : ""
      }`}
    >
      {props.table.status.slug != "no_reserved" ? (
        <>
          <div onClick={openPanelClick} className={`card-order__container`}>
            <div className="card-order__top">
              <div className="">
                <div className="card-order__guests">
                  <img src={UserSvg} />
                  <span>{cardGuests}</span>
                </div>
                <div className="card-order__time">
                  {props.table.time_arrival}
                </div>
              </div>
              <div className="card-order__number">{props.table.name}</div>
            </div>
            <div className="card-order__block">
              <div className="card-order__price">
                {props.table.orders.length > 0 &&
                  props.table.orders[indexOrderLast].payment_method_id == 2 && (
                    <img
                      className="card-order__payment-svg"
                      src={dollarbanknoteSvg}
                    />
                  )}
                €{cardPrice}
              </div>
              {notificationSvgActive ? (
                <div className="card-order__additionally">
                  <img src={notification1} />
                </div>
              ) : (
                numberOrders.length > 1 && (
                  <div className="card-order__additionally">
                    <img src={clipboard1} /> {numberOrders}
                  </div>
                )
              )}
            </div>
            <div className="card-order__new">
              {props.table.ready_to_order
                ? "• Готовы сделать заказ"
                : "• Новые гости"}
            </div>
            {props.table.ask_for_bill ? (
              <div style={{ color: "#fff" }}>• Принесите счёт</div>
            ) : (
              <></>
            )}
            {isCook ? (
              props.table.cook.role.display_name == "Повар" ? (
                <div className="card-order__ready-cook">• Блюдо готово</div>
              ) : (
                <div className="card-order__ready-cook">• Напиток готов</div>
              )
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <div onClick={openPanelClick} className="card-order__top">
          <div className="card-order__block">
            <div className="card-order__text">Not reserved</div>
          </div>
          <div className="card-order__number">{props.table.name}</div>
        </div>
      )}
      {openPanel && (
        <CardOrderPanel
          openPanelClick={openPanelClick}
          table={props.table}
          timeReadyOrder={timeReadyOrder}
          waiterStatus={waiterStatus}
          indexOrderLast={indexOrderLast}
          updateWaiter={updateWaiter}
        />
      )}
    </div>
  );
}
