import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { getConfig, instance } from "../../Api/init";
import "./Modal.css";

export default function ModalCommentProduct(props) {
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const [productCommits, setProductCommits] = useState([]);

  const closeModal = (e) => {
    if (e.target.classList[0] == "ReactModal__Content") {
      props.closeModal();
    }
  };

  useEffect(() => {
    if (props.isOpen == true) {
      if (props.itemBd.comments && props.itemBd.comments.length > 0) {
        setProductCommits(props.itemBd.comments);
      } 
      document.querySelector("body").addEventListener("click", closeModal);
    }
    return () => {
      document.querySelector("body").removeEventListener("click", closeModal);
    };
  }, [props.isOpen]);

  function changeTextarea(value, index) {
    setProductCommits((productCommits) => ({
      ...productCommits,
      [index]: value,
    }));
  }

  let commitList = [];
  for (let i = 0; i < props.itemBd.quantity; i++) {
    commitList.push(
      <textarea
        name="comment"
        id={i}
        className="comment-product__text"
        onChange={(e) => changeTextarea(e.target.value, i)}
        value={productCommits[i]}
      />
    );
  }
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      className="modal-custom comment-product"
      ariaHideApp={false}
    >
      <div className="modal-custom__container modal-custom__container--height">
        <div className="comment-product__title">
          Комментарий к {props.cardItem.name}
        </div>
        {commitList}
        <div className="modal-custom__bottom modal-custom__bottom--mt">
          <button
            className="modal-custom__bottom-btn"
            onClick={props.closeModal}
          >
            Назад
          </button>
          <button
            className="modal-custom__bottom-btn"
            onClick={() => props.updateCommits(productCommits)}
          >
            Принять
          </button>
        </div>
      </div>
    </Modal>
  );
}
