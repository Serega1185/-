import React, { useEffect, useRef, useState } from "react";
import QuantityButtonCheckOrder from "../QuantityButton/QuantityButtonCheckOrder";
import { useDispatch, useSelector } from "react-redux";
import "./CheckOrder.css";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { getConfig, instance } from "../../Api/init";
import ModalCommentProduct from "../Modal/ModalCommentProduct";

export default function CardCheckOrder(props) {
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [cardQuantity, setCardQuantity] = useState(1);
  const [updateBdClick, setUpdateBdClick] = useState(false);
  const dispatch = useDispatch();
  const [modalCommentProduct, setModalCommentProduct] = useState(false);
  const allCategoriesProduct = useSelector(
    (state) => state.allCategoriesProduct
  );

  const cardProductRef = useRef();

  function updateQuantity(i) {
    // /Update bd orders

    const newProduct = props.orders.products.map((item) => {
      if (item.id == props.card.id) {
        if (item.foundation) {
          if (item.foundation.id == props.card.foundation.id) {
            return { ...item, quantity: i };
          }
          return { ...item };
        } else {
          return { ...item, quantity: i };
        }
      } else {
        return { ...item };
      }
    });
    props.orders.products = newProduct;
    dispatch({
      type: "USER_UPDATE_ONLY_ORDER",
      payload: props.orders,
    });
    /////локально обновляем
    if (i == 0) {
      dispatch({
        type: "UPDATE_USER_ORDER_PRODUCT",
        orderId: props.orders,
        productId: props.card,
      });
    }
    /////локально обновляем

    instance
      .put(
        `orders/${props.orders.id}`,
        {
          table_id: props.orders.table_id,
          products: newProduct,
          comment: props.orders.comment,
          guests: props.orders.guests,
        },
        getConfig()
      )
      .then((resp) => {
        if (resp.data.message == "success") {
        }
      });
    //Update bd orders end

    ////local update
    setCardQuantity(i);
    setUpdateBdClick(true);
    ///end
  }

  function updateCommits(commitPush) {
    // /Update bd orders commit
    const newProduct = props.orders.products.map((item) => {
      if (item.id == props.card.id) {
        return { ...item, comments: commitPush };
      } else {
        return { ...item };
      }
    });

    instance
      .put(
        `orders/${props.orders.id}`,
        {
          table_id: props.orders.table_id,
          products: newProduct,
          comment: props.orders.comment,
          guests: props.orders.guests,
        },
        getConfig()
      )
      .then((resp) => {
        if (resp.data.message == "success") {
        }
      });
    closeModalCommentProduct();
    ////local update
    ///end
  }

  ///update bd
  useEffect(() => {
    if (!updateBdClick) {
      setCardQuantity(props.card.quantity);
    }
  }, [props.card.quantity]);
  useEffect(() => {
    if (updateBdClick) {
      const timeoutQuantity = setTimeout(() => {
        setUpdateBdClick(false);
      }, 3000);
      return () => {
        clearTimeout(timeoutQuantity);
      };
    }
  }, [cardQuantity]);
  ///update bd

  //total price
  let totalOrice = props.card.price * cardQuantity;
  totalOrice = totalOrice.toFixed(2);
  //total price

  ///text
  let cardItem = allCategoriesProduct.allProduct.filter(
    (e) => e.id === props.card.id
  );
  cardItem = cardItem[0];
  let foundationName =
    cardItem &&
    props.card.foundation &&
    cardItem.foundations.filter((e) => props.card.foundation.id == e.id);

  foundationName =
    foundationName && foundationName[0] && foundationName[0].name;

  ///text end

  ///modalComment
  function openModalCommentProduct() {
    setModalCommentProduct(true);
    setTimeout(() => {
      const scrollableElement = document.querySelector(".modal-custom");
      disablePageScroll(scrollableElement);
    }, 500);
  }
  function closeModalCommentProduct() {
    setModalCommentProduct(false);
    setTimeout(() => {
      const scrollableElement = document.querySelector("body");
      enablePageScroll(scrollableElement);
    }, 500);
  }

  ///////////свайп
  let dragging = false;
  // В переменных startY мы будем держать координаты точки,
  let startX = 0;

  const startMove = (e) => {
    dragging = true;
    // В значения для startY мы помещаем положение курсора
    // через свойства события e.pageY.
    startX = e.changedTouches[0].pageX;
  };

  const activeMove = (e) => {
    // Если элемент не тащат, то ничего не делаем.
    if (!dragging) return;

    // Если тащат, то высчитываем новое положение,
    let i = e.changedTouches[0].pageX - startX;
    if (cardProductRef.current.scrollTop <= 0) {
      if (i >= 0) {
        cardProductRef.current &&
          cardProductRef.current.setAttribute(
            "style",
            `transform: translateX(${i}px) !important; animation: none; transition: transform 0s;`
          );
      }
    } else {
      startX = e.changedTouches[0].pageX;
    }
  };

  const endMove = (e) => {
    if (e) {
      if (
        e.changedTouches[0].pageX - startX > 110 &&
        cardProductRef.current.scrollTop <= 0
      ) {
        openModalCommentProduct();
      }
      const pageX = e.changedTouches[0].pageX - startX;
      let X;
      pageX >= 1 ? (X = pageX - startX) : (X = 0);

      setTimeout(() => {
        cardProductRef.current &&
          cardProductRef.current.setAttribute(
            "style",
            `transform: translateX(0px) !important; animation: none;`
          );
      }, 0);
      dragging = false;
    }
  };
  ///свайп end

  useEffect(() => {
    if (cardProductRef.current) {
      cardProductRef.current.addEventListener("touchstart", startMove);
      cardProductRef.current.addEventListener("touchmove", activeMove);
      // Когда мы отпускаем мышь, мы отмечаем dragging как false.
      cardProductRef.current.addEventListener("touchend", endMove);

      return () => {
        if (cardProductRef.current) {
          cardProductRef.current.removeEventListener("touchstart", startMove);
          cardProductRef.current.removeEventListener("touchend", endMove);
          cardProductRef.current.removeEventListener("touchmove", activeMove);
        }
      };
    }
  }, [cardProductRef]);

  return cardItem && cardQuantity > 0 ? (
    <>
      <div ref={cardProductRef} className="card-check">
        <div className="card-check__title">
          {cardItem.name}
          {props.card.foundation && (
            <div className="card-check__foundation">{foundationName}</div>
          )}
        </div>
        <div className="card-check__bottom">
          <QuantityButtonCheckOrder
            updateQuantity={updateQuantity}
            quantity={cardQuantity}
          />
          <div className="card-check__block">
            <div className="card-check__price">
              {cardQuantity}×{props.card.price}€
            </div>
            <div className="card-check__total">€{totalOrice}</div>
          </div>
        </div>
      </div>
      <ModalCommentProduct
        key={cardItem.id}
        cardItem={cardItem}
        itemBd={props.card}
        updateCommits={updateCommits}
        isOpen={modalCommentProduct}
        closeModal={closeModalCommentProduct}
      />
    </>
  ) : (
    <></>
  );
}
