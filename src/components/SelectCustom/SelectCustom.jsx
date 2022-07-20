import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./SelectCustom.css";

export default function SelectCustom(props) {
  const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",
  });

  const colourStyles = {
    ValueContainer: (styles) => ({
      ...styles,
      display: "none",
      backgroundColor: "#000",
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "none",
      outline: 0,
      border: 0,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : undefined,
        color: isDisabled ? "#ccc" : isSelected ? "#ccc" : data.color,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : undefined
            : undefined,
        },
      };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };


  return (
    <Select
      isClearable
      className={`select-custom ${props.style ? 'select-custom--'+props.style : ''}`}
      options={props.options}
      defaultValue={props.optionsActive}
      styles={colourStyles}
      onChange={props.selectTextChange}
    />
  );
}
