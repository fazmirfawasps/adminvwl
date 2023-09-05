import { FormHelperText } from "@mui/material";
import React from "react";

const TextArea = ({
  label,
  name,
  placeholder,
  onChange,
  style,
  errorMessage,
  value,
  disabled,
}) => {
  return (
    <>
      <div className="compony-address">
        {errorMessage ? (
          <FormHelperText sx={{ color: "red" }}>{errorMessage}</FormHelperText>
        ) : (
          <label>{label}</label>
        )}
        <div className="div">
          <textarea
            value={value}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={style}
            className="tw-border"
            disabled={disabled}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default TextArea;
