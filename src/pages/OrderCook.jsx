import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardOrderCook from "../components/CardOrder/CardOrderCook";
import { getConfig, instance } from "../Api/init";
import OrderCookTables from "../components/OrderCook/OrderCookTables";

export default function OrderCook() {
  const dispatch = useDispatch();
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [filter, setFilter] = useState("all");
  const [cardTables, setCardTables] = useState(Array());
  const tablesRestaurantReducer = useSelector(
    (state) => state.tablesRestaurantReducer
  );
  const allCategoriesProduct = useSelector(
    (state) => state.allCategoriesProduct
  );

  useEffect(() => {
    console.log("ОБНОВИЛИ!", tablesRestaurantReducer.tables);
    //filters end
    let cardTablesAllLocal = [];
    let tablesLocal = JSON.parse(
      JSON.stringify(tablesRestaurantReducer.tables)
    );
    tablesLocal &&
      tablesLocal.map((table) => {
        let tableLocal = JSON.parse(JSON.stringify(table));
        tableLocal.orders = tableLocal.orders.filter((order) => {
          let filterLocal;

          ///filter
          if (filter == "all") {
            filterLocal =
              (order.status.slug == "order_in_progress" ||
                order.status.slug == "order_is_ready") &&
              order.products.length >= 1;
          } else if (filter == "order_in_progress") {
            filterLocal =
              order.status.slug == "order_in_progress" &&
              order.products.length >= 1;
          } else if (filter == "order_is_ready") {
            filterLocal =
              order.status.slug == "order_is_ready" &&
              order.products.length >= 1;
          }
          ///filter
          if (filterLocal) {
            return true;
          } else {
            return false;
          }
        });
        ///сортируем по времени
        tableLocal.orders.sort(function (a, b) {
          let timeA =
            a.time_change_status &&
            Number(a.time_change_status.split(":").join(""));
          let timeB =
            b.time_change_status &&
            Number(b.time_change_status.split(":").join(""));
          return timeA > timeB ? 1 : -1;
        });
        ////end
        let ordersFilter = tableLocal.orders.filter((order) => {
          order.products = order.products.filter(
            (product) => product.need_show_cook
          );
          return order.products[0];
        });

        tableLocal.orders = ordersFilter;
        if (tableLocal.orders.length > 0) {
          cardTablesAllLocal.push(tableLocal);
        }
      });
    // /// по статусу
    // cardTablesAllLocal.sort(function (a, b) {
    //   let timeOneLocal = a.time_arrival || "";
    //   timeOneLocal = timeOneLocal.split(":").join("");
    //   let timeOTwoLocal = b.time_arrival || "";
    //   timeOTwoLocal = timeOTwoLocal.split(":").join("");
    //   return Number(timeOneLocal) > Number(timeOTwoLocal) ? -1 : 1;
    // });
    setCardTables(cardTablesAllLocal);
  }, [tablesRestaurantReducer.tables, filter]);
  return (
    <div className="order-cook">
      <div className="order-cook__header">
        <button
          onClick={() => setFilter("all")}
          className={`order-cook__header-btn ${
            filter == "all" ? "active" : ""
          }`}
        >
          Все статусы
        </button>
        <button
          onClick={() => setFilter("order_in_progress")}
          className={`order-cook__header-btn ${
            filter == "order_in_progress" ? "active" : ""
          }`}
        >
          Готовятся
        </button>
        <button
          onClick={() => setFilter("order_is_ready")}
          className={`order-cook__header-btn ${
            filter == "order_is_ready" ? "active" : ""
          }`}
        >
          Приготовленные
        </button>
      </div>
      <section>
        <div className="container order-cook__tables">
          {allCategoriesProduct.allProduct.length > 0 ? (
            <OrderCookTables cardTables={cardTables} />
          ) : (
            "загрузка..."
          )}
        </div>
      </section>
    </div>
  );
}
