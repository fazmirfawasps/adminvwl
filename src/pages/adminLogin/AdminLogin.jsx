import React, { useState } from "react";
import classes from "./adminLogin.module.css";
import loginImage from "../../assets/images/Login-BG.png";
import kxenceLogo from "../../assets/images/kxenceLogo.png";
import Input from "../../components/Input/Input";
import { Button } from "@mui/material";
import { adminLogin } from "../../services/adminservices";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email is required"
    ),
  password: Yup.string().required("Password is required"),
  // .min(4, 'Password must be at least 4 characters'),
});

const initialValues = {
  email: "",
  password: "",
};

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialValues);
  const dispatch = useDispatch();

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    try {
      await Yup.reach(schema, name).validate(value);
      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [name]: error.message });
    }
    setFormValues({ ...formValues, [name]: value });
  };
  
  const handleSubmit = async () => {
    try {
      await schema.validate(formValues, { abortEarly: false });
      const { data } = await adminLogin(formValues);
      if (data.token) {
        localStorage.setItem("adminToken", data?.token);
        localStorage.setItem("adminId", data?.data?._id);
        window.location.reload();
      }
    } catch (error) {
      const validationErrors = {};
      if (error.adminErrorMessage) {
        validationErrors.adminErrorMessage = error.adminErrorMessage;
        setFormErrors(validationErrors);
      } else if (error.passwordErrorMessage) {
        validationErrors.passwordErrorMessage = error.passwordErrorMessage;
        setFormErrors(validationErrors);
      } else {
        error.inner.forEach((innerError) => {
          validationErrors[innerError.path] = innerError.message;
        });
        setFormErrors(validationErrors);
      }
    }
  };
  const handlePasswordKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className={classes.container}>
        <img src={loginImage} alt="" />
        <div className={classes.card_container}>
          <div className="tw-flex tw-flex-col tw-gap-9 tw-py-2 "
          >
            <div className="tw-flex tw-flex-col tw-gap-[3px] tw-w-full tw-items-center"
            >
              <img
                src={kxenceLogo}
                alt=""
                style={{
                  width: "30%",
                  aspectRatio: "3/2",
                  objectFit: "contain",
                }}
              />
              <h3 className={classes.signInText}>Sign in to your account</h3>
            </div>
            <div className={classes.input_container}>
              <Input
                label={"Email"}
                placeholder={"Enter your email"}
                name={"email"}
                type={"email"}
                value={formValues.email}
                onChange={handleInputChange}
                onKeyDown={handlePasswordKeyDown} 
                errorMessage={
                  formErrors.adminErrorMessage
                    ? formErrors.adminErrorMessage
                    : formErrors.email
                }
                autoComplete={"off"} // Add this line
                style={{
                  border:
                    formErrors.adminErrorMessage || formErrors.email
                      ? "1px solid #FF0000"
                      : "",
                  marginBottom: "20px",
                  fontSize: "12px",
                  lineHeight: "16px",
                }}
              />
              <div>
                <Input
                  label={"Password"}
                  name={"password"}
                  type={showPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  onKeyDown={handlePasswordKeyDown} 
                  value={formValues.password}
                  errorMessage={
                    formErrors.passwordErrorMessage
                      ? formErrors.passwordErrorMessage
                      : formErrors.password
                  }
                  placeholder={"Enter your password"}
                  style={{
                    border:
                      formErrors.passwordErrorMessage || formErrors.password
                        ? "1px solid #FF0000"
                        : "",
                    fontSize: "12px",
                    lineHeight: "16px",
                  }}
                />
                <div className="tw-flex tw-gap-2.5 tw-mt-2.5"
                >
                  <input
                    style={{
                      height: "15px",
                      width: "fit-content",
                      cursor: "pointer",
                    }}
                    type={"checkbox"}
                    onClick={handleCheckboxChange}
                  />
                  <label htmlFor="">show Password</label>
                </div>
              </div>
            </div>
            <div className={classes.login_button}>
              <Button onClick={handleSubmit} variant="contained">
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
