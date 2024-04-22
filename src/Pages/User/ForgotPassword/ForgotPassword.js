import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useTranslation } from "react-i18next";
import User from "../../../api/services/User";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState(null);

  const handleSubmit = async () => {
    setErrors(null);
    if (!email) {
      setErrors("please enter valid email.");
      return;
    }

    try {
      const response = await User.forgotPassword(email).json();

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
                  {/*<h3>{t("page.forgotpassword.Forgot your password?")}</h3>*/}
                  <h3>{t("page.forgotpassword.Set a new password")}</h3>
                  <p>
                    {t(
                      "page.forgotpassword.Change your password in three easy steps. This will help you to secure your password!"
                    )}
                  </p>
                  <ol className="list-unstyled">
                    <li>
                      <span className="text-ckr text-medium">1. </span>
                      {t("page.forgotpassword.Enter your email address below")}
                    </li>
                    <li>
                      <span className="text-ckr text-medium">2. </span>
                      {t(
                        "page.forgotpassword.We send a recovery link on email"
                      )}
                    </li>
                    <li>
                      <span className="text-ckr text-medium">3. </span>
                      {t(
                        "page.forgotpassword.You can set new password in profile"
                      )}
                    </li>
                  </ol>
                  <Form>
                    <Form.Group className="mb-3 row" controlId="formBasicEmail">
                      <Col md={4} className="text-md-end">
                        <Form.Label className="col-form-label ">
                          {t("page.forgotpassword.Enter your email address")}
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="email"
                          placeholder="example@mail.com"
                          required="required"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Col>
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

export default ForgotPassword;
