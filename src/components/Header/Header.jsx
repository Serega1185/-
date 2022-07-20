import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SelectCustom from "../SelectCustom/SelectCustom";
import "./Header.css";

export default function Header(props) {
  const [zonaTables, setZonaTables] = useState(false);
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const tablesRestaurantReducer = useSelector(
    (state) => state.tablesRestaurantReducer
  );

  //link
  const linkOrder = () => {
    Navigate(`/order`);
  };
  const linkCheckOrder = () => {
    localStorage.setItem("orderPush", false);
    Navigate(`/check-order`);
  };
  //filters load
  useEffect(() => {
    let zonaTablesLocal = Array();
    if (
      userSettingsReducer.userProfile &&
      userSettingsReducer.userProfile.user.role.name != "admin"
    ) {
      tablesRestaurantReducer.tables.map((item) => {
        if (item.table_area && !zonaTablesLocal.includes(item.table_area.name)) {
          if (item.table_area.name) {
            zonaTablesLocal.push(item.table_area.name);
          }
        }
      });
    } else {
      tablesRestaurantReducer.tables.map((item) => {
        if (
          item.user &&
          item.user.name &&
          !zonaTablesLocal.includes(item.user.name)
        ) {
          zonaTablesLocal.push(item.user.name);
        }
      });
    }
    setZonaTables(zonaTablesLocal);
  }, [tablesRestaurantReducer.tables]);

  //filters save
  const clickZonaFilter = (zona) => {
    console.log("USER_ZONA_FILTER:", zona);
    dispatch({ type: "USER_ZONA_FILTER", payload: zona });
  };

  ///last id order
  let lastOrderId;
  if (
    userSettingsReducer.openOrder &&
    userSettingsReducer.openOrder.orders[0]
  ) {
    lastOrderId = userSettingsReducer.openOrder && userSettingsReducer.openOrder.name;
  }

  return (
    <div className="header">
      {props.name && props.name.length > 0 ? (
        <div className="header__title">
          <span>{props.name}</span>
        </div>
      ) : props.back == 1 ? (
        <div className="navigation navigation--header">
          <div
            onClick={() => clickZonaFilter(false)}
            className={`navigation__item ${
              userSettingsReducer.zonaFilter == false && "active"
            } `}
          >
            All
          </div>
          {zonaTables &&
            zonaTables.map((item) => {
              return (
                <div
                  key={item}
                  onClick={() => clickZonaFilter(item)}
                  className={`navigation__item ${
                    userSettingsReducer.zonaFilter == item && "active"
                  } `}
                >
                  {item}
                </div>
              );
            })}
        </div>
      ) : (
        <>
          <div
            onClick={props.back == 2 ? linkOrder : linkCheckOrder}
            className="header__back"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="#080433"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="#080433"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="header__order">
            <span> Стол {lastOrderId}</span>
          </div>
          <div className="header__menu"></div>
        </>
      )}
    </div>
  );
}
