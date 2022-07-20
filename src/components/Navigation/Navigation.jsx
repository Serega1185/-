import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Navigation.css";

export default function Navigation(props) {
  const dispatch = useDispatch();
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);

  function clearkCatalog() {
    dispatch({
      type: "ACTIVE_CATALOG",
      payload: false,
    });
  }

  return (
    <div className="navigation">
      <div
        onClick={clearkCatalog}
        className={`navigation__item ${
          !userSettingsReducer.activeCatalog && "active"
        }`}
      >
        Menu
      </div>
      {userSettingsReducer.activeCatalog && (
        <div className="navigation__item active">
          {userSettingsReducer.activeCatalog.name}
        </div>
      )}
    </div>
  );
}
