import React, { useEffect, useState } from "react";
import "./CardOrder.css";
import { useDispatch, useSelector } from "react-redux";
import { getConfig, instance } from "../../Api/init";

export default function CardOrderCook(props) {
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [active, setActive] = useState(false);
  const tablesRestaurantReducer = useSelector(
    (state) => state.tablesRestaurantReducer
  );
  const allCategoriesProduct = useSelector(
    (state) => state.allCategoriesProduct
  );

  function cardItem(id) {
    let item = allCategoriesProduct.allProduct.filter((e) => e.id === id);
    if (!item[0]) {
      return "";
    }
    return item[0];
  }

  // function getOrderIdByCartView(order) {
  //   let order_id = false;
  //   if (order.number) {
  //     order_id = order.number;
  //   } else if (order.id) {
  //     order_id = order.id;
  //   }
  //   return order_id ? "" + order_id : "";
  // }

  return (
    <>
      <div
        onClick={() => setActive(!active)}
        className={`card-cook ${active ? "active" : ""}`}
      >
        <div className="card-cook__title">
          {props.product.quantity + " x " + cardItem(props.product.id).name}
        </div>
        {props.product.foundation && (
          <div className="card-cook__foundation">
            - {props.product.foundation.name}
          </div>
        )}
        {props.product.comments.length > 0 && (
          <div className="card-cook__foundation">
            - {props.product.comments[0]}
          </div>
        )}
      </div>
    </>
  );
}
