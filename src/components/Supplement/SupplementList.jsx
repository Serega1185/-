import React, { Component, useEffect, useState } from "react";
import { render } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import CardProduct from "../../components/CardProduct/CardProduct";

export default function SupplementList(props) {
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [listProduct, setListProduct] = useState(false);
  const [cacheOrder, setCacheOrder] = useState(false);
  const dispatch = useDispatch();
  const allCategoriesProduct = useSelector(
    (state) => state.allCategoriesProduct
  );
  let rows = [];
  let filterField = props.filterField;

  useEffect(() => {
    setCacheOrder(JSON.parse(localStorage.getItem("orderPush")));
    if (props.products == 0) {
      console.log("load filter", allCategoriesProduct.allProduct);
      setListProduct(allCategoriesProduct.allProduct);
    } else {
      console.log("load filter", props.products);
      setListProduct(props.products);
    }
  }, [props.products, userSettingsReducer.openOrder]);

  listProduct &&
    listProduct.forEach((item) => {
      //Search Filter
      if (
        item.name.toLowerCase().indexOf(filterField.toLowerCase()) === -1 &&
        item.number.toLowerCase().indexOf(filterField.toLowerCase()) === -1
      ) {
        return;
      }
      rows.push(
        <CardProduct
          openModalModifiers={props.openModalModifiers}
          product={item}
          key={item.id}
          cacheOrder={cacheOrder}
          setCacheOrder={setCacheOrder}
        />
      );
    });

  return <div className="supplement__list">{rows}</div>;
}
