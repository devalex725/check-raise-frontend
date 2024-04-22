import React, { useEffect, useState } from "react";
import { Form, Tab, Tabs } from "react-bootstrap";

const MultiLangInput = ({
  name,
  initialValue,
  onChange,
  activeLanguages = ["en", "fr", "de"],
}) => {
  const [selectedLang, setSelectedLang] = useState("en");
  const [values, setValues] = useState({
    en: "",
    fr: "",
    de: "",
    ...initialValue,
  });

  useEffect(() => {
    setSelectedLang(activeLanguages?.length > 0 ? activeLanguages[0] : "en");
  }, []);

  const handleChange = (e) => {
    const newValues = { ...values, [selectedLang]: e.target.value };
    setValues(newValues);
    onChange({ name, value: newValues });
  };

  return (
    <>
      <Tabs
        defaultActiveKey="English"
        id="uncontrolled-tab-example"
        className="mb-3"
        activeKey={selectedLang}
        onSelect={(key) => setSelectedLang(key)}
      >
        <Tab
          eventKey="en"
          title="English"
          tabClassName={activeLanguages.includes("en") ? "" : "text-muted"}
        >
          <Form.Control
            type="text"
            placeholder="Title"
            name="title"
            value={values.en}
            onChange={handleChange}
          />
        </Tab>
        <Tab
          eventKey="fr"
          title="French"
          tabClassName={activeLanguages.includes("fr") ? "" : "text-muted"}
        >
          <Form.Control
            type="text"
            placeholder="Title"
            name="title"
            value={values.fr}
            onChange={handleChange}
          />
        </Tab>
        <Tab
          eventKey="de"
          title="Deutsch"
          tabClassName={activeLanguages.includes("de") ? "" : "text-muted"}
        >
          <Form.Control
            type="text"
            placeholder="Title"
            name="title"
            value={values.de}
            onChange={handleChange}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default MultiLangInput;
