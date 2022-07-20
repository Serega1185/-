import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConfig, instance } from "../../Api/init";
import CardOrderCook from "../CardOrder/CardOrderCook";

export default function OrderCookTablesCard(props) {
  const dispatch = useDispatch();
  const [timeRender, setTimeRender] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);

  function clickReady(table, orderArray) {
    ////готов - забрали
    if (!table) {
      console.log("ошибка  !");
      return;
    }
    instance
      .put(
        `tables/${table.id}`,
        {
          cook_id: userSettingsReducer.userProfile.user.id,
        },
        getConfig()
      )
      .then((resp) => {
        if (resp.data.message == "success") {
        }
      })

      .catch(function (error) {});

    orderArray.map((order) => {
      ///local update
      table.cook = false;
      order.status_id = 3;
      order.status.slug = "order_is_ready";
      table.orders = table.orders.map((orderLocal) => {
        if (orderLocal.id == order.id) {
          return order;
        } else {
          return { ...orderLocal };
        }
      });
      ///local update

      // update bd
      instance
        .put(
          `orders/forceUpdateOrder/${order.id}`,
          {
            table_id: table.id,
            status_id: 3,
          },
          getConfig()
        )
        .then((resp) => {
          if (resp.data.message == "success") {
          }
        });
    });

    ///local update
    dispatch({ type: "UPDATE_TABLES", payload: table });
    ///local update
    return;
  }

  //link

  const takenAway = (table, orders) => {
    ////забрали
    if (orders[0]) {
      /// update bd
      orders.map((order) => {
        ///local update
        order.status_id = 4;
        order.status.slug = "order_was_taken";
        table.orders = table.orders.map((orderLocal) => {
          if (orderLocal.id == order.id) {
            return order;
          } else {
            return { ...orderLocal };
          }
        });
        //local update
        instance
          .put(
            `orders/forceUpdateOrder/${order.id}`,
            {
              table_id: order.table_id,
              status_id: 4,
            },
            getConfig()
          )
          .then((resp) => {
            if (resp.data.message == "success") {
            }
          });
      });
      ///local update
      dispatch({ type: "UPDATE_TABLES", payload: table });
    }
  };

  useEffect(() => {
    const orderProductsSort = props.order.products.sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
    setOrderProducts(orderProductsSort);
  }, []);

  useEffect(() => {
    let dataOrder = historiesTime(3);
    const interval = setInterval(() => {
      console.log(props.order.status.slug);
      const dataCurrent = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Moscow",
      });
      if (!dataOrder) {
        if (props.order.status.slug == "order_is_ready") {
          dataOrder = new Date().toLocaleString("en-US", {
            timeZone: "Europe/Moscow",
          });
        } else {
          return;
        }
      }
      let time = Date.parse(dataCurrent) - Date.parse(new Date(dataOrder));
      setTimeRender(convertMS(time));
    }, 1000);
    return () => clearInterval(interval);
  }, [props.order]);

  function convertMS(ms) {
    var h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    h = Math.floor(m / 60) % 24;
    return h
      ? ((h + "").length === 1 ? "0" + h : h) + ":"
      : "" + ("0" + (m % 60)).substr(-2) + ":" + ("0" + (s % 60)).substr(-2);
  }

  function historiesTime(statusId) {
    let historTime = props.order.status_histories.filter(
      (item) => item.new_status_id == statusId
    );
    return historTime[0] ? historTime[0].created_at : false;
  }

  return (
    <>
      {props.indexOrder == 0 && props.headerRender && (
        <div
          className={`order-cook__orders-info ${
            props.indexOrder == 0 ? "order-cook__orders-info--top" : ""
          }`}
        >
          <div className="order-cook__orders-top">
            <div className="order-cook__orders-title">
              Cтол <span>{props.table.name}</span>
            </div>
            <span className="order-cook__orders-time">
              {props.order.time_change_status &&
                props.order.time_change_status.substring(
                  0,
                  props.order.time_change_status.length - 3
                )}
              {timeRender && `/${timeRender}`}
            </span>
          </div>
          <div className="order-cook__orders-name">
            {props.table.user ? props.table.user.name : "нет официанта"}{" "}
          </div>
        </div>
      )}
      <div
        key={props.order.id}
        className={`order-cook__order ${
          props.order.status.slug == "order_is_ready" ? "is_ready" : ""
        } ${props.indexOrder == 0 ? "order-cook__order--one" : ""}`}
      >
        {props.indexOrder != 0 && props.headerRender && (
          <div className={`order-cook__orders-info`}>
            <div className="order-cook__orders-top">
              <div className="order-cook__orders-title">
                Cтол <span>{props.table.name}</span>
              </div>
              <span className="order-cook__orders-time">
                {props.order.time_change_status &&
                  props.order.time_change_status.substring(
                    0,
                    props.order.time_change_status.length - 3
                  )}
                {timeRender && `/${timeRender}`}
              </span>
            </div>
            <div className="order-cook__orders-name">
              {props.table.user ? props.table.user.name : "нет официанта"}{" "}
            </div>
          </div>
        )}

        <div className="order-cook__list">
          {props.order.comment && (
            <div className={`card-cook card-cook--comment`}>
              <div className="card-cook__title">Комментарий:</div>
              <div className="card-cook__text">{props.order.comment}</div>
            </div>
          )}
          {orderProducts.map((product) => {
            return <CardOrderCook key={product.id} product={product} />;
          })}
        </div>

        {props.isOrderBtn && (
          <button
            className="order-cook__orders-btn order-cook__orders-btn--ready"
            onClick={() => clickReady(props.table, props.orderArray)}
          >
            ГОТОВО
          </button>
        )}
        {props.isCook && (
          <button
            className="order-cook__orders-btn"
            onClick={() => takenAway(props.table, props.orderArray)}
          >
            ЗАБРАЛИ
          </button>
        )}
      </div>
    </>
  );
}
