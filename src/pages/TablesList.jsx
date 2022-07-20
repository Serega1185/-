import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getConfig, instance } from "../Api/init";
import Header from "../components/Header/Header";

export default function TablesList() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const clickTake = () => {
    const checkbox = document.querySelectorAll("input[type=checkbox]");
    let i = 0;
    let tables = [];
    for (; i < checkbox.length; i++) {
      let check = checkbox[i];
      if (check.checked) {
        tables.push(check.id);
      }
    }

    instance
      .post(
        `shifts`,
        {
          tables,
        },
        getConfig(
        )
      )
      .then((resp) => {
        if (resp.data.message == "success") {
          dispatch({ type: "ADD_TABLES", payload: resp.data.shift.tables });
          dispatch({
            type: "USER_SHIFT",
            payload: resp.data.shift,
          });
          dispatch({
            type: "USER_SHIFT_ID",
            payload: resp.data.shift.id,
          });
          localStorage.setItem("USER_SHIFT_ID", resp.data.shift.id);
          Navigate(`/order`);
        }
      });
  };

  let restaurantList = [];

  const restaurant =
    userSettingsReducer.userProfile &&
    userSettingsReducer.userProfile.restaurants.filter(
      (restaurant) => restaurant.id == userSettingsReducer.userRestaurantId
    );
    console.log(userSettingsReducer.userRestaurantId)
    console.log(userSettingsReducer.userProfile)
  restaurant &&
    restaurant[0].tables.map((item) => {
        restaurantList.push(
          <div key={item.id} className={item.user ? 'disabled' : ''}>
            <input
              type="checkbox"
              id={item.id}
              value={item.id}
              className="tables-list__input"
            />
            <label htmlFor={item.id} className="tables-list__item">
              {item.name}
            </label>
          </div>
        );
    });

  ////admin
  useEffect(() => {
    if (
      userSettingsReducer.userProfile &&
      userSettingsReducer.userProfile.user.role.name == "admin"
    ) {
      let tables = [];
      console.log(userSettingsReducer.userProfile);
      restaurant[0].tables.map((item) => {
        tables.push(item.id);
      });
      instance
        .post(
          `shifts`,
          {
            tables,
          },
          getConfig(
          )
        )
        .then((resp) => {
          if (resp.data.message == "success") {
            dispatch({ type: "ADD_TABLES", payload: resp.data.shift.tables });
            dispatch({
              type: "USER_SHIFT",
              payload: resp.data.shift,
            });
            dispatch({
              type: "USER_SHIFT_ID",
              payload: resp.data.shift.id,
            });
            localStorage.setItem("USER_SHIFT_ID", resp.data.shift.id);
            Navigate(`/order`);
          }
        });
    }
  }, []);

  return userSettingsReducer.userProfile &&
    userSettingsReducer.userProfile.user.role.name != "admin" ? (
    <div className="tables-list">
      <Header name="Выберите список столов" />
      <section>
        <div className="container">
          <div className="tables-list__box">{restaurantList}</div>
        </div>
      </section>
      <button onClick={clickTake} className="tables-list__button">
        Взять в работу
      </button>
    </div>
  ) : (
    <></>
  );
}
