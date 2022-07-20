import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuantityButton from "../QuantityButton/QuantityButton";
import "./CardOrder.css";
import UserSvg from "../../static/images/svg/users1.svg";
import { getConfig, instance } from "../../Api/init";
import { useDispatch, useSelector } from "react-redux";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import ModalTableUser from "../Modal/ModalTableUser";

export default function CardOrderPanel(props) {
  const dispatch = useDispatch();
  const [tableCard, setTableCard] = useState(false);
  const [waiterStatus, setWaiterStatus] = useState(props.waiterStatus);
  const [timeReadyOrder, setTimeReadyOrder] = useState(props.timeReadyOrder);
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [modalTableUser, setModalTableUser] = useState(false);
  const Navigate = useNavigate();

  ////save order
  useEffect(() => {
    setTableCard(props.table);
  }, [props.table]);

  ///link
  const linkCheckOrderStatus = () => {
    dispatch({ type: "USER_OPEN_ORDER", payload: props.table });
    localStorage.setItem("USER_OPEN_ORDER", JSON.stringify(props.table));
    Navigate(`/check-order`);
  };

  ///create bd orders
  function createOrder() {
    ///local update
    props.table.status.slug = "new";
    props.table.orders = [
      {
        id: 9999,
        total: 0,
        status: { slug: "new" },
        guests: props.cardGuests,
        products: Array(),
      },
    ];
    dispatch({ type: "UPDATE_TABLES", payload: props.table });
    ///local update
    let id = Math.floor(Math.random() * (99999999 - 1) + 1);
    instance
      .post(
        "orders",
        {
          table_id: tableCard.id,
          guests: props.cardGuests,
          session_id: id,
        },
        getConfig()
      )
      .then((resp) => {
        if (resp.data.message == "success") {
        }
      })
      .catch(function (error) {
        setTimeout(() => {
          createOrder();
        }, 400);
      });
  }
  ///create bd orders end

  ///updateTimeSession bd orders
  function updateTimeSession() {
    ///local update
    props.table.time_ready_to_order = 0;
    dispatch({ type: "UPDATE_TABLES", payload: props.table });
    ///local update
    setTimeReadyOrder(false);
    instance
      .put(
        `tables/${tableCard.id}`,
        {
          time_ready_to_order: 0,
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

  ///updateReadyToOrder bd orders
  function resetTableByKeys(arr) {
    const obj = {};
    arr.map((key) => {
      ///local update
      obj[key] = null;
      props.table[key] = null;
    });
    dispatch({ type: "UPDATE_TABLES", payload: props.table });
    ///local update
    setTimeReadyOrder(false);
    instance
      .put(`tables/${tableCard.id}`, obj, getConfig())
      .then((resp) => {
        if (resp.data.message == "success") {
        }
      })
      .catch(function (error) {});
  }
  ///updateReadyToOrder bd orders end

  //close panel
  function closePanel(e) {
    if (!e.target.closest(".card-order__inner") && !modalTableUser) {
      props.openPanelClick(false);
    }
  }
  useEffect(() => {
    setTimeout(() => {
      window.addEventListener("click", closePanel);
    }, 100);
    return () => {
      window.removeEventListener("click", closePanel);
    };
  }, [modalTableUser]);
  //close panel end

  //updateWaiter
  function updateWaiter(i) {
    setWaiterStatus(i);
    props.updateWaiter(i);
  }

  ///modalComment
  function openModalTableUser() {
    setModalTableUser(true);
    setTimeout(() => {
      const scrollableElement = document.querySelector(".modal-custom");
      disablePageScroll(scrollableElement);
    }, 500);
  }
  function closeModalTableUser() {
    setModalTableUser(false);
    setTimeout(() => {
      const scrollableElement = document.querySelector("body");
      enablePageScroll(scrollableElement);
    }, 500);
  }

  if (!tableCard) {
    return;
  }
  return (
    <>
      <div className={`card-order__inner`}>
        {tableCard.status.slug == "no_reserved" ? (
          <>
            <button onClick={createOrder} className="card-order__inner-button">
              Взять в работу
            </button>
            {userSettingsReducer.userProfile &&
              userSettingsReducer.userProfile.user.role.name == "admin" && (
                <button
                  onClick={openModalTableUser}
                  className="card-order__inner-button"
                >
                  Передать стол
                </button>
              )}
          </>
        ) : (
          <>
            <button
              onClick={linkCheckOrderStatus}
              className="card-order__inner-button"
            >
              Изменить
            </button>
            {timeReadyOrder ? (
              <button
                onClick={updateTimeSession}
                className="card-order__inner-button"
              >
                Подойти позже
              </button>
            ) : waiterStatus >= 1 ? (
              <>
                <button
                  onClick={() => updateWaiter(null)}
                  className="card-order__inner-button"
                >
                  Сбросить
                </button>
              </>
            ) : (
              ""
            )}
            {props.table.ready_to_order ? (
              <button
                onClick={() =>
                  resetTableByKeys(["ready_to_order", "time_ready_to_order"])
                }
                className="card-order__inner-button"
              >
                Сбросить
              </button>
            ) : (
              ""
            )}
            {props.table.ask_for_bill == 1 && (
              <button
                onClick={() => resetTableByKeys(["ask_for_bill"])}
                className="card-order__inner-button"
              >
                Отнесли счёт
              </button>
            )}
            {userSettingsReducer.userProfile &&
              userSettingsReducer.userProfile.user.role.name == "admin" && (
                <button
                  onClick={openModalTableUser}
                  className="card-order__inner-button"
                >
                  Передать стол
                </button>
              )}
          </>
        )}
      </div>
      <ModalTableUser
        tables={props.table}
        isOpen={modalTableUser}
        closeModal={closeModalTableUser}
      />
    </>
  );
}
