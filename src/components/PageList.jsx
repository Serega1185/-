import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import ModalNotification from "../components/Modal/ModalNotification";
import CheckOrder from "../pages/CheckOrder";
import Order from "../pages/Order";
import OrderCook from "../pages/OrderCook";
import Pin from "../pages/Pin";
import RestaurantList from "../pages/RestaurantList";
import Supplement from "../pages/Supplement";
import TablesList from "../pages/TablesList";
import "../static/style/App.css";
import Footer from "./Footer/Footer";

export default function PageList(props) {
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [modalNotification, setModalNotification] = useState(false);

  const location = useLocation();

  function openModalNotification() {
    setModalNotification(true);
    setTimeout(() => {
      const scrollableElement = document.querySelector(".modal-custom");
      disablePageScroll(scrollableElement);
    }, 500);
  }

  function closeModalNotification() {
    setModalNotification(false);
    const scrollableElement = document.querySelector("body");
    enablePageScroll(scrollableElement);
    setTimeout(() => {
      enablePageScroll(scrollableElement);
    }, 500);
  }
  ////modal end

  const ifUserRole =
    userSettingsReducer.userProfile &&
    (userSettingsReducer.userProfile.user.role.name == "cook" ||
      userSettingsReducer.userProfile.user.role.name == "sushi_man" ||
      userSettingsReducer.userProfile.user.role.name == "bartender")
      ? true
      : false;

  const exeptLocationFooterButton = [
    "/",
    "/order",
    "/restaurant-list",
    "/tables-list",
  ];
  let footerActive = false;
  userSettingsReducer.openOrder &&
    userSettingsReducer.openOrder.orders.map((order) => {
      if (
        order.products.length > 0 &&
        (order.status.slug == "new_order" || order.status.slug == "cancel")
      ) {
        footerActive = true;
      }
    });
  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Pin />} />
        <Route exact path="/restaurant-list" element={<RestaurantList />} />
        <Route exact path="/tables-list" element={<TablesList />} />
        <Route
          exact
          path="/order"
          element={ifUserRole ? <OrderCook /> : <Order />}
        />
        <Route
          exact
          path="/check-order"
          element={<CheckOrder openModalNotification={openModalNotification} />}
        />
        <Route
          exact
          path="/supplement"
          element={
            <Supplement
              activeCatalog={userSettingsReducer.activeCatalog}
              openModalModifiers={props.openModalModifiers}
            />
          }
        />
        <Route element={<Pin />} status={404} />
      </Routes>
      <ModalNotification
        isOpen={modalNotification}
        closeModal={closeModalNotification}
      />
      {exeptLocationFooterButton.indexOf(location.pathname) == -1 &&
        footerActive && (
          <Footer openModalNotification={openModalNotification} />
        )}
    </>
  );
}
