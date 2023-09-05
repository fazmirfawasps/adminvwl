import { FormHelperText, MenuItem, Select } from "@mui/material";
import React from "react";
import { BiSearch } from "react-icons/bi";

const SelectDropDown = ({
  label,
  onChange,
  value,
  selectLabel,
  name,
  children,
  errorMessage,
  style,
  icon,
  disabled,
  placeholder
}) => {
  return (
    <>
      <div className="div">
        {label && <label>{label} </label>}
        <Select
          className="select"
          fullWidth
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={selectLabel}
          selectLabel={selectLabel}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          style={style}
          readOnly={disabled}
        >
          {errorMessage && (
            <FormHelperText sx={{ color: "red" }}>
              {errorMessage}
            </FormHelperText>
          )}
          {children}
        </Select>
        {icon === "BiSearch" && <BiSearch />}
      </div>
    </>
  );
};

export default SelectDropDown;
