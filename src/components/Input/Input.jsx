import { FormHelperText } from "@mui/material";
import React from "react";

const Input = ({
  label,
  name,
  onChange,
  placeholder,
  type,
  hidden,
  accept,
  errorMessage,
  style,
  value,
  disabled,
  autoComplete,
  onKeyDown,
  onBlur,
  onClick,
}) => {
  return (
    <>
      <div className="div">
        {errorMessage ? (
          <FormHelperText sx={{ color: "red" }}>{errorMessage}</FormHelperText>
        ) : (
          <label>{label}</label>
        )}
        <input
          hidden={hidden}
          accept={accept}
          type={type}
          id="input"
          value={value}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          onClick={onClick}
          style={style}
        />
      </div>
    </>
  );
};

export default Input;
