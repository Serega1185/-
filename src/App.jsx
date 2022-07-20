import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import ModalModifiers from "./components/Modal/ModalModifiers";
import "./static/style/App.css";
import Pusher from "pusher-js";
import Push from "push.js";
import { getConfig, instance, oldInstance } from "./Api/init";
import PageList from "./components/PageList";

export default function App() {
  const dispatch = useDispatch();
  const [modalModifiers, setModalModifiers] = useState(false);
  const [focusBrowser, setFocusBrowser] = useState(true);
  const [isPusher, setIsPusher] = useState(false);
  const [isPusherRefOrder, setIsPusherRefOrder] = useState(null);
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const tablesRestaurantReducer = useSelector(
    (state) => state.tablesRestaurantReducer
  );
  let location = window.location.pathname.split("/")[1] || "/";
  if (localStorage.getItem("ALL_CATEGORIES_PRODUCT")) {
    ///load cache
    dispatch({
      type: "ALL_CATEGORIES_PRODUCT",
      payload: JSON.parse(localStorage.getItem("ALL_CATEGORIES_PRODUCT")),
    });
  }

  useEffect(() => {
    if (userSettingsReducer.openOrder) {
      localStorage.setItem(
        "USER_OPEN_ORDER",
        JSON.stringify(userSettingsReducer.openOrder)
      );
    } else {
    }
  }, [userSettingsReducer.openOrder]);
  function pushNotification(text) {
    Push.config({
      serviceWorker: "./sw.js",
    });
    Push.create("menumysushi", {
      body: text,
      icon: "/favicon.ico",
      vibrate: [200, 200],
      timeout: 100000,
    });
  }

  function NotificationTablesStatus(item) {
    if (!focusBrowser) {
      let table = tablesRestaurantReducer.tables.filter(
        (table) => table.id == item.id
      );
      let text = false;
      if (table[0].status.slug == "no_reserved" && item.status.slug == "new") {
        text = `Стол ${table[0].name} новые гости`;
      } else if (
        table[0].call_waiter_status_id == null &&
        item.call_waiter_status_id > 0
      ) {
        text = `Стол ${table[0].name} позвали вас`;
      } else if (table[0].ready_to_order == null && item.ready_to_order > 0) {
        text = `Стол ${table[0].name} готовы сделать заказ`;
      } else if (!table[0].cook && table[0].cook != item.cook) {
        if (item.cook.role.display_name == "Повар") {
          text = `Блюдо от ${item.cook.name} для стола ${table[0].name} готово!`;
        } else {
          text = `Напиток от ${item.cook.name} для стола ${table[0].name} готово!`;
        }
      }
      if (text) {
        pushNotification(text);
      }
    }
  }

  useEffect(() => {
    if (userSettingsReducer.userRestaurantId && !isPusher) {
      console.log("включили пуши !", userSettingsReducer.userRestaurantId);
      const pusher = new Pusher("a024c2420dcb1b3ed7ed", {
        cluster: "eu",
      });
      setIsPusher(true);
      pusher.unsubscribe(
        `table-update-by.restaurant_id-${userSettingsReducer.userRestaurantId}`
      );
      pusher.unsubscribe(
        `shift-update-by.shift_id-${userSettingsReducer.userShiftId}`
      );

      const channel = pusher.subscribe(
        `table-update-by.restaurant_id-${userSettingsReducer.userRestaurantId}`
      );
      channel.bind("App\\Events\\TablesUpdateByRestaurant", (data) => {
        instance
          .post(`/tables/${data.table.id}`, {}, getConfig())
          .then((resp) => {
            NotificationTablesStatus(resp.data.table);
            dispatch({ type: "UPDATE_TABLES", payload: resp.data.table });
            setIsPusherRefOrder(resp.data.table);
            console.log("пушер");
          });
      });

      const channelShift = pusher.subscribe(
        `shift-update-by.shift_id-${userSettingsReducer.userShiftId}`
      );
      channelShift.bind("App\\Events\\ShiftUpdate", (data) => {
        console.log("Pusher2", data);
        loadTables();
      });
    }
  }, [userSettingsReducer.userRestaurantId, userSettingsReducer.openOrder]);

  useEffect(() => {
    if (isPusherRefOrder) {
      if (
        userSettingsReducer.openOrder &&
        userSettingsReducer.openOrder.id == isPusherRefOrder.id
      ) {
        //open order
        if (!userSettingsReducer.isUpdateBd) {
          dispatch({ type: "USER_OPEN_ORDER", payload: isPusherRefOrder });
        }
        setIsPusherRefOrder(null);
      }
    }
  }, [isPusherRefOrder]);

  useEffect(() => {
    console.log("заблочили обнову");
    const isUpdateBdTimeout = setTimeout(() => {
      if (userSettingsReducer.isUpdateBd) {
        dispatch({ type: "UPDATE_USER_IS_UPDATE_BD", payload: false });
      }
    }, 3000);
    return () => {
      clearTimeout(isUpdateBdTimeout);
    };
  }, [userSettingsReducer.isUpdateBd]);

  //////Interval load bd
  useEffect(() => {
    const interval = setInterval(() => {
      loadTables();
    }, 9000);
    return () => clearInterval(interval);
  }, [userSettingsReducer.userShiftId, userSettingsReducer.openOrder]);

  ////loadTables
  function loadTables(userShiftId) {
    let userShiftIdLocal = false;
    if (userSettingsReducer.userShiftId) {
      userShiftIdLocal = userSettingsReducer.userShiftId;
    } else if (userShiftId) {
      userShiftIdLocal = userShiftId;
    }
    if (userShiftIdLocal) {
      instance
        .post(`/shifts/${userShiftIdLocal}`, {}, getConfig())
        .then((resp) => {
          if (resp.data.message == "success") {
            console.log("из за сворачивания скачал", resp.data.shift.tables);
            dispatch({ type: "ADD_TABLES", payload: resp.data.shift.tables });
            console.log(userSettingsReducer.openOrder);
            if (userSettingsReducer.openOrder) {
              //open order
              let openOrderLocal = resp.data.shift.tables.filter(
                (item) => item.id == userSettingsReducer.openOrder.id
              );
              openOrderLocal = openOrderLocal[0];
              if (openOrderLocal) {
                console.log("обновил открытый ордер стол", openOrderLocal);
                dispatch({ type: "USER_OPEN_ORDER", payload: openOrderLocal });
              }
            }
          }
        })
        .catch(function (error) {});
    }
  }

  //load "tablesRestaurantReducer.tables" end
  useEffect(() => {
    if (userSettingsReducer.userRestaurantId > 0) {
      instance
        .get(`user/restaurants/${userSettingsReducer.userRestaurantId}`)
        .then((resp) => {
          dispatch({
            type: "ALL_CATEGORIES_PRODUCT",
            payload: resp.data.data,
          });
          localStorage.setItem(
            "ALL_CATEGORIES_PRODUCT",
            JSON.stringify(resp.data.data)
          );
        });
    }
  }, [userSettingsReducer.userPin]);

  //load "tablesRestaurantReducer.tables"
  useEffect(() => {
    if (location != "/" && !userSettingsReducer.userProfile) {
      console.log("load");
      if (localStorage.getItem("AUTH_CODE")) {
        dispatch({
          type: "AUTH_CODE",
          payload: localStorage.getItem("AUTH_CODE"),
        });
      }
      if (localStorage.getItem("USER_PROFILE")) {
        dispatch({
          type: "USER_PROFILE",
          payload: JSON.parse(localStorage.getItem("USER_PROFILE")),
        });
      }
      if (localStorage.getItem("USER_RESTAURANT_ID")) {
        dispatch({
          type: "USER_RESTAURANT_ID",
          payload: localStorage.getItem("USER_RESTAURANT_ID"),
        });
      }
      if (localStorage.getItem("USER_OPEN_ORDER")) {
        //open order
        dispatch({
          type: "USER_OPEN_ORDER",
          payload: JSON.parse(localStorage.getItem("USER_OPEN_ORDER")),
        });
      }
      if (localStorage.getItem("USER_SHIFT_ID")) {
        //open order
        dispatch({
          type: "USER_SHIFT_ID",
          payload: localStorage.getItem("USER_SHIFT_ID"),
        });
        ///load cache end
        loadTables(localStorage.getItem("USER_SHIFT_ID"));
      }
      ///focus okno Browser
      window.onfocus = function () {
        setFocusBrowser(true);
      };
      window.onblur = function () {
        setFocusBrowser(false);
      };
      Push.Permission.request(
        () => {},
        () => {}
      );
    }
  }, [userSettingsReducer.userShiftId]);

  useEffect(() => {
    if (focusBrowser) {
      loadTables();
    }
  }, [focusBrowser]);

  ///modal
  function openModalModifiers(item) {
    setModalModifiers(item);
    setTimeout(() => {
      const scrollableElement = document.querySelector(".modal-custom");
      const scrollableElementOption = document.querySelector(
        ".modal-custom__option-list"
      );
      disablePageScroll(scrollableElement);
      disablePageScroll(scrollableElementOption);
    }, 500);
  }

  function closeModalModifiers() {
    setModalModifiers(false);
    const scrollableElement = document.querySelector("body");
    enablePageScroll(scrollableElement);
    setTimeout(() => {
      enablePageScroll(scrollableElement);
    }, 500);
  }

  ////modal end
  return (
    <>
      <PageList openModalModifiers={openModalModifiers} />
      <ModalModifiers
        product={modalModifiers}
        closeModal={closeModalModifiers}
      />
    </>
  );
}
