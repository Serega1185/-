import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getConfig, instance } from "../Api/init";
import Delete from "../static/images/svg/delete1.svg";

export default function Pin() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  let inputList = [];
  for (var i = 0; i < 4; i++) {
    inputList.push(<div key={i} className="page-pin__input"></div>);
  }

  const inputListAdd = (number) => {
    let inputAll = document.querySelectorAll(".page-pin__input");
    for (var i = 0; i < inputAll.length; i++) {
      if (inputAll[i].innerHTML.length == 0) {
        inputAll[i].innerHTML = number;
        i = inputAll.length;
      }
    }
    let iLength = inputAll.length - 1;
    if (inputAll[iLength].innerHTML != "") {
      const code =
        inputAll[0].innerHTML +
        inputAll[1].innerHTML +
        inputAll[2].innerHTML +
        inputAll[3].innerHTML;
      instance
        .post("login", {
          pin_code: code,
        })
        .then((resp) => {
          if (resp.data.message == "success") {
            localStorage.setItem("USER_PROFILE", JSON.stringify(resp.data));
            dispatch({ type: "USER_PROFILE", payload: resp.data });
            localStorage.setItem("AUTH_CODE", code);
            dispatch({ type: "AUTH_CODE", payload: code });

            ////employee
            if (resp.data.shift) {
              updateShift(resp.data.shift);
              Navigate(`/order`);
              return;
            }
            ////employee

            ////employee new
            if (
              resp.data.user.role.name == "cook" ||
              resp.data.user.role.name == "sushi_man" ||
              resp.data.user.role.name == "bartender"
            ) {
              console.log(resp.data.restaurants[0].id);
              instance
                .post(
                  `shifts`,
                  {},
                  getConfig(resp.data.restaurants[0].id, code)
                )
                .then((resp) => {
                  updateShift(resp.data.shift);
                  console.log(resp);
                  Navigate(`/order`);
                });
            } else {
              Navigate(`/restaurant-list`);
            }
            ////employee new
          }
        });
    }
  };

  function updateShift(shift) {
    dispatch({ type: "ADD_TABLES", payload: shift.tables });
    dispatch({
      type: "USER_SHIFT",
      payload: shift,
    });
    dispatch({
      type: "USER_SHIFT_ID",
      payload: shift.id,
    });
    localStorage.setItem("USER_RESTAURANT_ID", shift.restaurant_id);
    dispatch({
      type: "USER_RESTAURANT_ID",
      payload: shift.restaurant_id,
    });
    localStorage.setItem("USER_SHIFT_ID", shift.id);
  }

  const inputListDelet = () => {
    let inputAll = document.querySelectorAll(".page-pin__input");
    inputAll = Array.from(inputAll);
    inputAll.reverse();
    for (var i = 0; i < inputAll.length; i++) {
      if (inputAll[i].innerHTML.length >= 1) {
        inputAll[i].innerHTML = "";
        i = inputAll.length;
      }
    }
  };

  const inputListClear = () => {
    let inputAll = document.querySelectorAll(".page-pin__input");
    for (var i = 0; i < inputAll.length; i++) {
      inputAll[i].innerHTML = "";
    }
  };

  function buttonNumber(i) {
    return (
      <button key={i} onClick={() => inputListAdd(i)} className="buttom-number">
        {i}
      </button>
    );
  }
  let buttonList = [];
  for (var i = 1; i < 10; i++) {
    buttonList.push(buttonNumber(i));
  }

  return (
    <div className="page-pin">
      <div className="container">
        <div className="page-pin__title">Enter</div>
        <div className="page-pin__block">{inputList}</div>
        <div className="page-pin__box">
          {buttonList}
          <button onClick={() => inputListClear()} className="buttom-clear">
            Clear
          </button>
          <button onClick={() => inputListAdd(0)} className="buttom-number">
            0
          </button>
          <button onClick={() => inputListDelet()} className="buttom-delet">
            <img src={Delete} />
          </button>
        </div>
      </div>
    </div>
  );
}
