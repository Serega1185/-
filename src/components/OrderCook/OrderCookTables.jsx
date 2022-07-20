import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConfig, instance } from "../../Api/init";
import CardOrderCook from "../CardOrder/CardOrderCook";
import OrderCookTablesCard from "./OrderCookTablesCard";

export default function OrderCookTables(props) {
  const dispatch = useDispatch();

  return (
    <div className="order-cook__content">
      {props.cardTables &&
        props.cardTables.map((table, indexTable) => {
          let timeOrder;
          let isOrderBtn = false;
          let headerRender = false;
          let orderBtn = [];
          return (
            <div key={table.id} className="order-cook__orders">
              {table.orders &&
                table.orders.map((order, indexOrder) => {
                  ///isCook
                  let isCook = false;
                  ///isCook
                  const second =
                    Date.parse(`2017.10.11 ${order.time_change_status}`) / 1000;

                  orderBtn.push(order);
                  let orderArray = JSON.parse(JSON.stringify(orderBtn));
                  let timeOrderBack = timeOrder
                    ? Date.parse(`2017.10.11 ${timeOrder}`) / 1000
                    : Date.parse(`2017.10.11 ${order.time_change_status}`) /
                      1000;

                  let timeOrderNext =
                    table.orders[indexOrder + 1] &&
                    table.orders[indexOrder + 1].time_change_status
                      ? Date.parse(
                          `2017.10.11 ${
                            table.orders[indexOrder + 1].time_change_status
                          }`
                        ) / 1000
                      : false;

                  let timeOrderLocal =
                    table.orders[indexOrder].time_change_status &&
                    Date.parse(
                      `2017.10.11 ${table.orders[indexOrder].time_change_status}`
                    ) / 1000;

                  if (indexOrder == 0) {
                    timeOrder = order.time_change_status;
                    headerRender = true;
                  } else if (
                    timeOrderBack &&
                    timeOrderBack + 600 > timeOrderLocal &&
                    table.orders[indexOrder - 1].status.slug ==
                      table.orders[indexOrder].status.slug
                  ) {
                    isOrderBtn = true;

                    headerRender = false;
                  } else {
                    headerRender = true;
                    timeOrder = order.time_change_status;
                  }

                  if (timeOrderNext) {
                    if (timeOrderNext - 600 > timeOrderLocal) {
                      isOrderBtn = true;
                    } else {
                      isOrderBtn = false;
                    }
                  } else {
                    isOrderBtn = true;
                  }
                  if (isOrderBtn) {
                    isCook = order.status.slug == "order_is_ready" && true;
                    orderBtn = [];
                  }

                  return (
                    <OrderCookTablesCard
                      key={order.id}
                      isOrderBtn={isOrderBtn}
                      isCook={isCook}
                      order={order}
                      table={table}
                      indexTable={indexTable}
                      indexOrder={indexOrder}
                      orderArray={orderArray}
                      headerRender={headerRender}
                    />
                  );
                })}
            </div>
          );
        })}
    </div>
  );
}
