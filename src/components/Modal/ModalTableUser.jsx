import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { getConfig, instance } from "../../Api/init";
import SelectCustom from "../SelectCustom/SelectCustom";
import "./Modal.css";

export default function ModalTableUser(props) {
  const [selectText, setSelectText] = useState(false);
  const userSettingsReducer = useSelector((state) => state.userSettingsReducer);
  const tablesRestaurantReducer = useSelector(
    (state) => state.tablesRestaurantReducer
  );

  const closeModal = (e) => {
    if (e.target.classList[0] == "ReactModal__Content") {
      props.closeModal();
    }
  };

  const confirm = (e) => {


    props.closeModal();
  };

  useEffect(() => {
    if (props.isOpen == true) {
      document.querySelector("body").addEventListener("click", closeModal);
    }
    return () => {
      document.querySelector("body").removeEventListener("click", closeModal);
    };
  }, [props.isOpen]);

  ///modal
  let options = [];
  tablesRestaurantReducer.tables.map((item) => {
    if (!item.user) {
      return;
    }
    const optionsLocal = {
      value: item.user.name,
      id: item.user.id,
      label: item.user.name,
    };
    if (
      optionsLocal &&
      item.user &&
      item.user.name &&
      options.filter((value) => value.id == optionsLocal.id).length == 0
    ) {
      options.push(optionsLocal);
    }
  });
  let optionsActive;
  options.map((item) => {
    if (props.tables.user && item.value == props.tables.user.name) {
      optionsActive = item;
    }
  });
  ///modal end

function selectTextChange(e){
  setSelectText(e)
}

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      className="modal-custom"
      ariaHideApp={false}
    >
      <div className="modal-custom__container modal-custom__container--height">
        <div className="modal-custom__title-center">Стол обслуживает</div>

        <div className="modal-custom__box">
          <SelectCustom optionsActive={optionsActive} options={options} selectTextChange={selectTextChange}/>
        </div>

        <div className="modal-custom__bottom modal-custom__bottom--mt">
          <button
            className="modal-custom__bottom-btn"
            onClick={props.closeModal}
          >
            Cancel
          </button>
          <button className="modal-custom__bottom-btn" onClick={confirm}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
