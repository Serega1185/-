import React, { useEffect, useState } from "react";
import "./CardProduct.css";
import { useDispatch, useSelector } from "react-redux";
import NoImg from "../../static/images/svg/no-img.svg";
import { getConfig, instance } from "../../Api/init";
import QuantityButtonTwo from "../QuantityButton/QuantityButtonTwo";

export default function CardProduct(props) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const [quantityDisabled, setQuantityDisabled] = useState(false);
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);

  let priceProduct =
    props.product.price_new != 0
      ? props.product.price_new
      : props.product.price;
  priceProduct = priceProduct.toFixed(2);

  useEffect(() => {
    if (
      !quantityDisabled &&
      props.cacheOrder &&
      props.cacheOrder.status.slug != "order_in_progress"
    ) {
      let product = props.cacheOrder.products.filter(
        (item) => item.id == props.product.id
      );
      if (product[0]) {
        setQuantity(product[0].quantity);
      }
    }
  }, [props.cacheOrder]);

  function addNewProduct() {
    const newProduct = {
      ...props.product,
      id: props.product.id,
      quantity: 1,
    };
    let ordersLocal = props.cacheOrder ? props.cacheOrder.products : [];

    let isOrder = ordersLocal.filter(
      (product) => product.id == props.product.id
    );
    if (isOrder.length < 1) {
      ordersLocal.push(newProduct);
    }
    props.cacheOrder.products = ordersLocal;
    dispatch({
      type: "USER_UPDATE_ONLY_ORDER",
      payload: props.cacheOrder,
    });
    if (
      props.cacheOrder &&
      props.cacheOrder.status.slug != "order_in_progress"
    ) {
      //Update bd orders end
      instance
        .put(
          `orders/${props.cacheOrder.id}`,
          {
            table_id: props.cacheOrder.table_id,
            products: ordersLocal,
            guests: props.cacheOrder.guests,
          },
          getConfig()
        )
        .then((resp) => {
          if (resp.data.message == "success") {
          }
        });
      //Update bd orders end
    } else {
      setTimeout(() => {
        addNewProduct();
      }, 500);
    }
    setQuantity(1);
  }

  useEffect(() => {
    if (quantityDisabled) {
      const timeoutQuantity = setTimeout(() => {
        setQuantityDisabled(false);
      }, 8000);
      return () => {
        clearTimeout(timeoutQuantity);
      };
    }
  }, [quantity]);
  const clickButtonQuantity = (item) => {
    let quantityValueLocal = quantity;
    if (item == "plus") {
      quantityValueLocal++;
    } else {
      quantityValueLocal--;
    }
    const newProduct = props.cacheOrder.products.map((item) => {
      if (item.id == props.product.id) {
        return { ...item, quantity: quantityValueLocal };
      } else {
        return { ...item };
      }
    });
    props.cacheOrder.products = newProduct;
    dispatch({
      type: "USER_UPDATE_ONLY_ORDER",
      payload: props.cacheOrder,
    });
    instance
      .put(
        `orders/${props.cacheOrder.id}`,
        {
          table_id: props.cacheOrder.table_id,
          products: newProduct,
          guests: props.cacheOrder.guests,
        },
        getConfig()
      )
      .then((resp) => {
        if (resp.data.message == "success") {
        }
      });
    setQuantity(quantityValueLocal);
    setQuantityDisabled(true);
  };

  const clickPopUpNodifiers = () => {
    if (props.product.foundations && props.product.foundations.length > 0) {
      return props.openModalModifiers(props.product);
    } else {
      if (!quantity) {
        return addNewProduct();
      } else {
        return false;
      }
    }
  };

  return (
    <div onClick={clickPopUpNodifiers} className="card-product">
      <img
        src={props.product.image_mob_url ? props.product.image_mob_url : NoImg}
        className="card-product__img"
      />
      <div className="card-product__block">
        <div className="card-product__title">{props.product.name}</div>
        <div className="card-product__bottom">
          <div className="card-product__price">€{priceProduct}</div>
          {!props.product.foundations ||
            (props.product.foundations.length == 0 &&
              (quantity == 0 ? (
                <></>
              ) : (
                <QuantityButtonTwo
                  quantity={quantity}
                  clickButtonQuantity={clickButtonQuantity}
                />
              )))}
        </div>
      </div>
    </div>
  );
}
