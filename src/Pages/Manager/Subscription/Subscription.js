import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./Subscription.scss";

import { useNavigate } from "react-router-dom";
import RoomService from "../../../api/services/RoomService";
import moment from "moment";
import User from "../../../api/services/User";

const Subscription = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      // getRoomPlayer();
    } else {
      navigate("/");
    }
  }, []);

  const [expiry, setExpiry] = useState("");
  const [content, setContent] = useState({ en: "", fr: "", de: "" });
  useEffect(() => {
    getMyRoom();
    getPageSettingContent();
  }, []);

  const getPageSettingContent = async () => {
    const pageResponse = await User.info().json();

    // TODO: Create a new endpoint for user to get pageSettings by key - page name
    const pageSetting = pageResponse.data.find(
      (item) => item.key === "subscription"
    );
    setContent({ en: "", fr: "", de: "", ...pageSetting?.content });
  };

  const getMyRoom = async () => {
    const room = await RoomService.index().json();
    const expireDate = room?.data?.[0]?.expiry || null;
    if (!expireDate) {
      setExpiry("No subscription");
      return;
    }

    const expireDateMoment = moment(expireDate);
    let expiryStr = "";

    if (moment().isAfter(expireDateMoment)) {
      expiryStr = `Finished (${expireDateMoment.format("DD.MM.YYYY")})`;
    } else {
      expiryStr = `Valid until ${expireDateMoment.format("DD.MM.YYYY")}`;
    }
    setExpiry(expiryStr);
  };

  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={10} lg={12}>
            <Card>
              <Card.Header>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  fill="#fff"
                  className="me-1"
                >
                  <path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" />
                </svg>
                {t("page.Manager.Subscription.SubscriptionTitle")}
              </Card.Header>
              <Card.Body>
                <div className="subscription-container">
                  <p>Subscription: {expiry}</p>

                  <div
                    className="tiny-content"
                    dangerouslySetInnerHTML={{
                      __html: content[i18n.resolvedLanguage || "en"],
                    }}
                  ></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Subscription;
