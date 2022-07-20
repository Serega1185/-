import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardOrder from "../components/CardOrder/CardOrder";
import Header from "../components/Header/Header";
import ScrollTop from "../components/ScrollTop/ScrollTop";

export default function Order() {
  const dispatch = useDispatch();
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [cardTables, setCardTables] = useState(Array());
  const tablesRestaurantReducer = useSelector(
    (state) => state.tablesRestaurantReducer
  );
  
  useEffect(() => {
    //filters end
    let cardTablesAllLocal = tablesRestaurantReducer.tables;

    if (
      userSettingsReducer.zonaFilter &&
      userSettingsReducer.userProfile &&
      userSettingsReducer.userProfile.user.role.name != "admin"
    ) {
      cardTablesAllLocal = cardTablesAllLocal.filter(
        (item) => item.table_area.name == userSettingsReducer.zonaFilter
      );
    } else if (userSettingsReducer.zonaFilter) {
      ////admin
      cardTablesAllLocal = cardTablesAllLocal.filter(
        (item) => item.user.name && item.user.name == userSettingsReducer.zonaFilter
      );
      ////admin
    }

    /// по статусу
    cardTablesAllLocal.sort(function (a, b) {
      let timeOneLocal = a.time_arrival || "";
      timeOneLocal = timeOneLocal.split(":").join("");
      let timeOTwoLocal = b.time_arrival || "";
      timeOTwoLocal = timeOTwoLocal.split(":").join("");
      return Number(timeOneLocal) > Number(timeOTwoLocal) ? -1 : 1;
    });

    let cardTablesAllLocal2 = Array();
    cardTablesAllLocal.map((item) => {
      if (item.call_waiter_status_id == 2) {
        cardTablesAllLocal2.push(item);
      }
    });

    cardTablesAllLocal.map((item) => {
      if (item.call_waiter_status_id == 1) {
        cardTablesAllLocal2.push(item);
      }
    });

    cardTablesAllLocal.map((item) => {
      if (
        item.ready_to_order > 0 &&
        !(item.call_waiter_status_id == 2 || item.call_waiter_status_id == 1 || item.ask_for_bill > 0)
      ) {
        cardTablesAllLocal2.push(item);
      }
    });
    
    cardTablesAllLocal.map((item) => {
      if (
        item.ask_for_bill > 0 &&
        !(item.call_waiter_status_id == 2 || item.call_waiter_status_id == 1 )
      ) {
        cardTablesAllLocal2.push(item);
      }
    });

    cardTablesAllLocal.map((item) => {
      if (
        item.status.slug == 'new' &&
        !(item.call_waiter_status_id > 0 || item.ready_to_order > 0 || item.ask_for_bill > 0)
      ) {
        cardTablesAllLocal2.push(item);
      }
    });

    cardTablesAllLocal.map((item) => {
      if (
        item.status.slug == 'in_process' &&
        !(item.call_waiter_status_id > 0 || item.ready_to_order > 0 || item.ask_for_bill > 0)
      ) {
        cardTablesAllLocal2.push(item);
      }
    });
    cardTablesAllLocal.map((item) => {
      if (
        item.status.slug == 'no_reserved' &&
        !(item.call_waiter_status_id > 0 || item.ready_to_order > 0 || item.ask_for_bill > 0)
      ) {
        cardTablesAllLocal2.push(item);
      }
    });

    setCardTables(cardTablesAllLocal2);
  }, [tablesRestaurantReducer.tables, userSettingsReducer.zonaFilter]);
  return (
    <div className="order">
      <Header back="1" />
      <section>
        <div className="container">
          <div className="order__list">
            {cardTables &&
              cardTables.map((item) => {
                return <CardOrder key={item.id} table={item} />;
              })}
          </div>
        </div>
      </section>
      {tablesRestaurantReducer.tables.length > 12 && <ScrollTop />}
    </div>
  );
}
