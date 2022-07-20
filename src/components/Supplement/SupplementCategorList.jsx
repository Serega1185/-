import React, { Component } from "react";
import { render } from "react-dom";
import { useDispatch, useSelector } from "react-redux";

export default function SupplementCategorList(props) {
  const dispatch = useDispatch();
  const allCategoriesProduct = useSelector(
    (state) => state.allCategoriesProduct
  );

  function clickCatalog(item){
    dispatch({
      type: "ACTIVE_CATALOG",
      payload: item,
    });
  }
  return (
    <div className="supplement__list">
      {allCategoriesProduct.allCategoriesProduct.map((item) => {
        return (
          <div key={item.id} onClick={() => clickCatalog(item)} className="card-product">
            <img src={item.image_mob_url} className="card-product__img" />
              <div className="card-product__title card-product__title--font">{item.name}</div>
          </div>
        );
      })}
    </div>
  );
}
