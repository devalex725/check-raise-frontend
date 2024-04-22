import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useTranslation } from "react-i18next";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import User from "../../../api/services/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eye = <FontAwesomeIcon icon={faEye} />;
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordReShown, setPasswordReShown] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState(null);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const togglePasswordReVisibility = () => {
    setPasswordReShown(!passwordReShown);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrors(null);

    const token = searchParams.get("token") || "";
    if (!token) {
      setErrors("Invalid token.");
      return;
    }
    if (!data.email || !data.password || !data.password_confirmation) {
      setErrors("Please Fill All Fields*.");
      return;
    }
    if (data.password !== data.password_confirmation) {
      setErrors("Password and Confirm password must be same.");
      return;
    }

    try {
      const response = await User.resetPassword({ ...data, token }).json();

      if(response.status) {
        navigate('/login');
      } else {
        setErrors(response?.message || "");
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };

  return (
    <main>
      <div className="wrapper">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <div className="card-header">
                {t("page.forgotpassword.Reset Password")}
              </div>
              <Card.Body>
                <div className="forgot mx-1">
                  <h3>{t("page.forgotpassword.Reset Password")}</h3>
                  <Form>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>{t("page.registration.E-Mail")}*</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder={t("page.registration.E-Mail")}
                        value={data.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3 position-relative"
                      controlId="password"
                    >
                      <Form.Label>
                        {t("page.registration.Password")}*
                      </Form.Label>
                      <Form.Control
                        type={passwordShown ? "text" : "password"}
                        name="password"
                        placeholder={t("page.registration.Password")}
                        value={data.password}
                        onChange={handleChange}
                      />
                      <span className="faEye-icon">
                        <i onClick={togglePasswordVisibility}>
                          {passwordShown ? eye : eyeSlash}
                        </i>
                      </span>
                    </Form.Group>
                    <Form.Group
                      className="mb-3 position-relative"
                      controlId="password_confirmation"
                    >
                      <Form.Label>
                        {t("page.registration.Repeat password")}*
                      </Form.Label>
                      <Form.Control
                        type={passwordReShown ? "text" : "password"}
                        name="password_confirmation"
                        placeholder={t("page.registration.Repeat password")}
                        value={data.password_confirmation}
                        onChange={handleChange}
                      />
                      <span className="faEye-icon">
                        <i onClick={togglePasswordReVisibility}>
                          {passwordReShown ? eye : eyeSlash}
                        </i>
                      </span>
                    </Form.Group>
                    <Form.Group className="mb-3 row" controlId="formBasicEmail">
                      <Col md={4} className="text-md-end">
                        &nbsp;
                      </Col>
                      <Col md={6}>
                        <Button
                          className="btn btn-primary mb-3"
                          onClick={handleSubmit}
                        >
                          {t("page.forgotpassword.Send")}
                        </Button>
                        &nbsp;
                        <Link to="/login" className="btn btn-outline-dark mb-3">
                          {t("page.forgotpassword.Back to Login")}
                        </Link>
                      </Col>
                    </Form.Group>
                  </Form>

                  {errors ? <p className="error">{errors}</p> : ""}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
};
export default ResetPassword;
