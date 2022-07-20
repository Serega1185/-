import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getConfig, instance } from "../Api/init";
import CardCheckOrder from "../components/CheckOrder/CardCheckOrder";
import CheckOrderItem from "../components/CheckOrder/CheckOrderItem";
import Header from "../components/Header/Header";
import QuantityButton from "../components/QuantityButton/QuantityButton";
import UserSvg from "../static/images/svg/users1.svg";

export default function CheckOrder(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [cardGuests, setCardGuests] = useState(
    userSettingsReducer.openOrder ? userSettingsReducer.openOrder.guests : 1
  );
  const [guestsDisabled, setGuestsDisabled] = useState(false);
  const [cardOrder, setCardOrder] = useState(false);
  const tablesRestaurantReducer = useSelector(
    (state) => state.tablesRestaurantReducer
  );
  const allCategoriesProduct = useSelector(
    (state) => state.allCategoriesProduct
  );

  //link
  const linkSupplement = (order) => {
    if (!order) {
      instance
        .post(
          `orders`,
          {
            table_id: userSettingsReducer.openOrder.id,
            guests: userSettingsReducer.openOrder.guests,
          },
          getConfig()
        )
        .then((resp) => {
          if (resp.data.message == "success") {
            dispatch({
              type: "USER_UPDATE_ONLY_ORDER",
              payload: resp.data.order,
            });
          }
        });
    } else {
      console.log("СБРОСИМ orderPush на ", order);
      localStorage.setItem("orderPush", JSON.stringify(order));
    }
    //create bd orders end
    Navigate(`/supplement`);
  };

  //link
  //link
  const linkOrder = () => {
    Navigate(`/order`);
  };

  function newCardOrder(item) {
    item && setCardOrder(item);
  }

  useEffect(() => {
    if (
      userSettingsReducer.openOrder &&
      userSettingsReducer.openOrder.orders.length == 0
    ) {
      Navigate(`/order`);
      return;
    }
    console.log("обнова check-order", userSettingsReducer.openOrder);
    newCardOrder(userSettingsReducer.openOrder);
  }, [userSettingsReducer.openOrder, tablesRestaurantReducer.tables]);

  useEffect(() => {
    ///очистка категорий
    dispatch({
      type: "ACTIVE_CATALOG",
      payload: false,
    });
  }, []);

  if (cardOrder.orders) {
    cardOrder.orders.sort(function (a, b) {
      return a.id > b.id ? -1 : 1;
    });
  }
  ////
  //last order

  ///clear bd orders
  function clearOrder() {
    ///local update
    cardOrder.status.slug = "no_reserved";
    cardOrder.ready_to_order = null;
    cardOrder.call_waiter_status_id = null;
    cardOrder.time_ready_to_order = 0;
    dispatch({ type: "UPDATE_TABLES", payload: cardOrder });
    ///local update
    instance
      .post(
        `tables/resetTable/${cardOrder.id}`,
        {
          status_id: 5,
        },
        getConfig()
      )
      .then((resp) => {})
      .catch(function (error) {
        setTimeout(() => {
          clearOrder();
        }, 400);
      });

    Navigate(`/order`);
  }

  useEffect(() => {
    if (guestsDisabled) {
      const timeoutGuests = setTimeout(() => {
        if (cardOrder.status.slug != "no_reserved") {
          ///Update bd orders
          const lastOrder = cardOrder.orders[cardOrder.orders.length - 1].id;
          instance
            .put(
              `orders/${lastOrder}`,
              {
                table_id:
                  cardOrder.orders[cardOrder.orders.length - 1].table_id,
                guests: cardGuests,
              },
              getConfig()
            )
            .then((resp) => {});
          ///Update bd orders end
        }
        setGuestsDisabled(false);
      }, 4000);
      return () => {
        clearTimeout(timeoutGuests);
      };
    }
  }, [cardGuests]);
  //update guests
  function updateGuests(i) {
    setGuestsDisabled(true);
    if (i < 1) {
      i = 1;
    }
    setCardGuests(i);
    cardOrder.guests = i;
    if (cardOrder.orders.length > 0) {
      cardOrder.orders[cardOrder.orders.length - 1].guests = i;
    }
    dispatch({ type: "UPDATE_TABLES", payload: cardOrder });
  }

  ///clear bd orders end
  return cardOrder && allCategoriesProduct.allProduct.length > 1 ? (
    <div className={`check-order`}>
      <Header back="2" />
      <section>
        <div className="container check-order__container">
          <div className="check-order__block">
            <div className="check-order__block-guests">
              {cardOrder.status.slug == "new" && (
                <button onClick={clearOrder} className="button-one">
                  гости ушли
                </button>
              )}
            </div>
            <div className="check-order__block-guests">
              <img src={UserSvg} />
              <QuantityButton
                updateGuests={updateGuests}
                cardGuests={cardGuests}
              />
            </div>
          </div>
          {cardOrder.orders &&
            cardOrder.orders.map((order) => {
              return (
                order.products.length > 0 && (
                  <CheckOrderItem
                    key={order.id}
                    order={order}
                    cardOrder={cardOrder}
                    openModalNotification={props.openModalNotification}
                    linkSupplement={linkSupplement}
                  />
                )
              );
            })}
        </div>
      </section>
      <button
        onClick={() => linkSupplement(false)}
        className="check-order__btn-new"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" width="2" height="22" rx="1" fill="white" />
          <rect
            x="22"
            y="10"
            width="2"
            height="22"
            rx="1"
            transform="rotate(90 22 10)"
            fill="white"
          />
        </svg>
      </button>
    </div>
  ) : (
    "загрузка"
  );
}
