import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { instance } from "../Api/init";
import Header from "../components/Header/Header";

export default function RestaurantList() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const clickRestaurant = (restaurantId) => {
    localStorage.setItem("USER_RESTAURANT_ID", restaurantId);
    dispatch({ type: "USER_RESTAURANT_ID", payload: restaurantId });
    Navigate(`/tables-list`);
  };

  let restaurantList = [];
  userSettingsReducer.userProfile && userSettingsReducer.userProfile.restaurants.map((item) => {
    restaurantList.push(
      <div
        key={item.id}
        onClick={() => clickRestaurant(item.id)}
        className="restaurant-list__item"
      >
        {item.name}
      </div>
    );
  });

  return (
    <div className="restaurant-list">
      <Header name="Выберите ресторан" />
      <section>
        <div className="container">
          <div className="restaurant-list__box">{restaurantList}</div>
        </div>
      </section>
    </div>
  );
}
