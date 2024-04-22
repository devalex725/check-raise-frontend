import React, { useEffect, useState } from "react";
import User from "../../api/services/User";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./index.scss";

const CookieConsent = () => {
  const cookieName = 'CookieConsent';
  const { i18n, t } = useTranslation();
  const [modalShown, setModalShown] = useState(false);
  const [content, setContent] = useState({
    en: '',
    fr: '',
    de: '',
  });

  useEffect(() => {
    getContent();

    setModalShown(!localStorage.getItem(cookieName));
  }, []);

  const getContent = async () => {
    const pageResponse = await User.info().json();

    // TODO: Create a new endpoint for user to get pageSettings by key - page name
    const pageSetting = pageResponse.data.find((item) => item.key === "cookie-consent");
    setContent({ en: "", fr: "", de: "", ...pageSetting?.content });
  };

  const handleCookie = (cookieValue) => {
    localStorage.setItem(cookieName, cookieValue);
    setModalShown(false);
  };

  return (
    <Modal show={modalShown} centered className="cookie-modal">
      <Modal.Header>
        <Modal.Title>{t('page.cookie.This website uses cookies')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: content[i18n.resolvedLanguage || "en"] }}></div>
      </Modal.Body>
      <Modal.Footer>
        <Button varient="primary" onClick={() => handleCookie('accept')}>{t('page.cookie.Accept')}</Button>
        <Button variant="secondary" onClick={() => handleCookie('reject')}>{t('page.cookie.Reject')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CookieConsent;