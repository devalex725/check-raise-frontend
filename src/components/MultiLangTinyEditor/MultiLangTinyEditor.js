import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

const MultiLangTinyEditor = ({
  name,
  initialValue,
  onChange,
  activeLanguages = ['en', 'fr', 'de'],
}) => {
  const [selectedLang, setSelectedLang] = useState("en");
  const [values, setValues] = useState({
    en: "",
    fr: "",
    de: "",
    ...initialValue,
  });

  useEffect(() => {
    setSelectedLang(activeLanguages?.length > 0 ? activeLanguages[0] : 'en')
  }, []);

  const handleChange = (e) => {
    const newValues = { ...values, [selectedLang]: e };
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
          <Editor
            apiKey={process.env.REACT_APP_EDITOR_KEY}
            value={values.en}
            onEditorChange={handleChange}
            init={{
              toolbar: 'undo redo | bold italic |  alignleft aligncenter alignright alignjustify | outdent indent | link',
              plugins: ['link', 'image'],
              default_link_target: "_blank",
              link_title: false,
              target_list: false
            }}
          />
        </Tab>
        <Tab
          eventKey="fr"
          title="French"
          tabClassName={activeLanguages.includes("fr") ? "" : "text-muted"}
        >
          <Editor
            apiKey={process.env.REACT_APP_EDITOR_KEY}
            value={values.fr}
            onEditorChange={handleChange}
            init={{
              toolbar: 'undo redo | bold italic |  alignleft aligncenter alignright alignjustify | outdent indent | link',
              plugins: ['link', 'image'],
              default_link_target: "_blank",
              link_title: false,
              target_list: false
            }}
          />
        </Tab>
        <Tab
          eventKey="de"
          title="Deutsch"
          tabClassName={activeLanguages.includes("de") ? "" : "text-muted"}
        >
          <Editor
            apiKey={process.env.REACT_APP_EDITOR_KEY}
            value={values.de}
            onEditorChange={handleChange}
            init={{
              toolbar: 'undo redo | bold italic |  alignleft aligncenter alignright alignjustify | outdent indent | link',
              plugins: ['link', 'image'],
              default_link_target: "_blank",
              link_title: false,
              target_list: false
            }}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default MultiLangTinyEditor;
