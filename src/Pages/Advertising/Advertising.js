import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import User from "../../api/services/User";

const Advertising = () => {
  const { i18n } = useTranslation();
  const [content, setContent] = useState({ en: "", fr: "", de: "" });

  useEffect(() => {
    getPageSettingContent();
  }, []);

  const getPageSettingContent = async () => {
    const pageResponse = await User.info().json();

    // TODO: Create a new endpoint for user to get pageSettings by key - page name
    const pageSetting = pageResponse.data.find(
      (item) => item.key === "advertising"
    );
    setContent({ en: "", fr: "", de: "", ...pageSetting?.content });
  };

  return (
    <>
      <main>
        <div className="wrapper cms-pages">
          <Container>
            <Row>
              <Col>
                <div className="tiny-content"
                  dangerouslySetInnerHTML={{
                    __html: content[i18n.resolvedLanguage || "en"],
                  }}
                ></div>
              </Col>
            </Row>
          </Container>
        </div>
      </main>
    </>
  );
};

export default Advertising;
