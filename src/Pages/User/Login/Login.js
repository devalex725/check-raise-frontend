import React, { useState, useEffect } from "react";

import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import User from "../../../api/services/User";
import logo from "../../../assets/images/logo-login.png";

const resetPasswordText = {
  en: "To use the new version of the check-raise website, you need to set a new password via this link. Afterwards, you will receive an email with a secure link to set it (this only needs to be done once).",
  fr: "Pour utiliser la nouvelle version du site de check-raise, vous devez définir un nouveau mot de passe via ce lien. Ensuite, vous recevrez un e-mail avec un lien sécurisé pour le définir (cela ne doit être fait qu'une seule fois).",
  de: "Um die neue Version der Check-Raise-Website zu nutzen, müssen Sie ein neues Passwort über diesen Link festlegen. Anschließend erhalten Sie eine E-Mail mit einem sicheren Link, um es festzulegen (dies muss nur einmal gemacht werden).",
};

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const eye = <FontAwesomeIcon icon={faEye}/>;
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash}/>;
  const [error, setError] = useState();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState();

  const onLogin = async (event) => {
    event.preventDefault();
    if (event.target.email.value === "") {
      setEmail("Email");
    } else if (event.target.password.value === "") {
      setEmail("");
      setPassword("Password");
    } else {
      setPassword("");
      setEmail("");
      try {
        const data = await User.login(
          event.target.email.value,
          event.target.password.value,
        ).json();
        if (data.type.toString() !== "Admin") {
          localStorage.setItem("usertoken", JSON.stringify(data.token));
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("usertype", data.type.toString());
          window.location.reload();
          navigate("/");
        } else {
          localStorage.setItem("adminuser", JSON.stringify(data.user));
          localStorage.setItem("admintoken", JSON.stringify(data.token));
          navigate("/admin/tournament");
        }
      } catch (error) {
        // Handle API errors
        console.error("error 48", error);
        setError(error);
      }
    }
  };

  // const onLogout = async (event) => {
  //     console.log("Logout Clicked");
  //     try {
  //         const data = await User.logout().json();
  //         // Do something with returned data
  //         localStorage.removeItem("user");
  //     } catch (error) {
  //         // Handle API errors
  //         console.error(error.code);
  //     }
  // }

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    if (
      localStorage.getItem("usertoken") ||
      localStorage.getItem("admintoken")
    ) {
      navigate("/");
    }
  }, []);
  return (
    <main>
      <div className="wrapper">
        <Row className="justify-content-center">
          <Col md={9}>
            <div className="login-formwrap d-flex">
              <div className="login-formwrap-left">
                <h1>{t("page.login.Login")}</h1>

                {error ? (
                  <Link to="/forgot-password" className="btn btn-link text-danger mt-3">
                    {resetPasswordText[i18n.resolvedLanguage || 'fr']}
                  </Link>
                ) : (
                  ''
                )}
                <Form onSubmit={onLogin}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{t("page.login.E-mail")}</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder={t("page.login.Enter email")}
                      className={Email ? "error" : "border-default"}
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-3 position-relative"
                    controlId="password"
                  >
                    <Form.Label>{t("page.registration.Password")}*</Form.Label>
                    <Form.Control
                      type={passwordShown ? "text" : "password"}
                      name="password"
                      placeholder={t("page.registration.Password")}
                      className={Password ? "error" : "border-default"}
                    />
                    <span className="faEye-icon">
                      <i onClick={togglePasswordVisibility}>
                        {passwordShown ? eye : eyeSlash}
                      </i>
                    </span>
                  </Form.Group>

                  <div className="text-end forgot-password-link">
                    <Link to="/forgot-password" className="btn btn-link">
                      {t("page.login.Forgot Your Password?")}
                    </Link>
                  </div>

                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                      type="checkbox"
                      label={t("page.login.Remember me")}
                    />
                  </Form.Group>
                  {error ? (
                    <p className="error">
                      {t("page.login.Wrong login or password")}
                    </p>
                  ) : (
                    ""
                  )}

                  <p className="success">
                    {t("page.login.Welcome to Check Raise")}
                  </p>

                  <div className="d-flex justify-content-between justify-content-lg-center">
                    <Button
                      type="reset"
                      className="btn btn-link btn-link-cancel"
                    >
                      {" "}
                      {t("page.login.Cancel")}
                    </Button>
                    <Button type="submit" className="btn btn-primary">
                      {t("page.login.Login")}
                    </Button>
                  </div>

                  <div className="dont-have-account text-center">
                    {t("page.login.Don’t have an account yet?")}
                    <Link to="/registration">
                      {" "}
                      {t("page.login.Create account")}
                    </Link>
                  </div>
                </Form>
              </div>
              <div className="login-formwrap-right d-none d-lg-flex align-items-center">
                <img src={logo} alt="Login Image"/>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </main>
  );
};

export default Login;
