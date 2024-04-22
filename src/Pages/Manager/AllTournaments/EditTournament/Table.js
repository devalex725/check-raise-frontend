import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Modal, Toast, ToastContainer } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import TournamentService from "../../../../api/services/TournamentService";
import TemplateSelectModal from "../components/TemplateSelectModal";
import TemplateSaveModal from "../components/TemplateSaveModal";

function TableRows({ rows, tableRowRemove, onValUpdate, addRowTable, title }) {
  var [breakValue, setBreakValue] = useState(true);

  var [selectbreak, setselectbreak] = useState();
  var counting = 1;
  var datas = "";
  function IsImageLoaded() {
    datas = counting++;
  }

  const changeHandler = (e, index) => {
    setBreakValue(!breakValue);

    rows.map((element, i) => {
      if (e.target.checked === true) {
        if (i === index) element.isbreak = 1;
        setselectbreak(i === index ? e.target.checked : "");
      } else {
        if (i === index) element.isbreak = 0;
        setselectbreak(i === index ? breakValue : "");
      }
    });
  };

  return rows.map((rowsData, index) => {
    const { SB, BB, Ante, Duration } = rowsData;

    return (
      <>
        <tr key={index}>
          {rowsData.isbreak === 1 ? (
            <>
              <td>{/* {index + 1} */}</td>

              <td colspan="3">
                <input
                  type="text"
                  style={{ textAlign: "center" }}
                  // defaultValue="Break"
                  value={rowsData.breaktitle ? rowsData.breaktitle : ""}
                  onChange={(event) => onValUpdate(index, event)}
                  name="breaktitle"
                  className="form-control"
                />
              </td>

              <td>
                <input
                  type="number"
                  pattern="[0-9]"
                  value={rowsData.duration}
                  onChange={(event) => onValUpdate(index, event)}
                  name="duration"
                  className="form-control"
                />
              </td>
            </>
          ) : (
            <>
              <td>
                {IsImageLoaded()}
                {datas}.{/* {index + 1} */}
              </td>
              <td>
                <input
                  type="number"
                  pattern="[0-9]"
                  value={rowsData.sb}
                  onChange={(event) => onValUpdate(index, event)}
                  name="sb"
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="number"
                  pattern="[0-9]"
                  value={rowsData.bb}
                  onChange={(event) => onValUpdate(index, event)}
                  name="bb"
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="number"
                  pattern="[0-9]"
                  value={rowsData.ante}
                  onChange={(event) => onValUpdate(index, event)}
                  name="ante"
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="number"
                  pattern="[0-9]"
                  value={rowsData.duration}
                  onChange={(event) => onValUpdate(index, event)}
                  name="duration"
                  className="form-control"
                />
              </td>
            </>
          )}
          <td>
            <Form.Check
              type="checkbox"
              defaultChecked={rowsData.isbreak === 1 ? true : false}
              value={breakValue}
              label=""
              onChange={(e) => changeHandler(e, index)}
              id="default-checkbox"
              name="isbreak"
            />
          </td>

          <td>
            <span className="btn btn-white" onClick={() => addRowTable(index)}>
              +
            </span>

            <span
              className="btn btn-white"
              // value={JSON.stringify(rowsData.order)}
              onClick={() => tableRowRemove(index)}
            >
              -
            </span>
          </td>
        </tr>
      </>
    );
  });
}
function Table(props) {
  var structuredata = [];

  const { t } = useTranslation();
  const [rowsData, initRow] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [selectModalShow, setSelectModalShow] = useState(false);
  const [saveModalShow, setSaveModalShow] = useState(false);

  useEffect(() => {
    structuredata = props.structure;

    initRow(structuredata);
  }, [props.structure]);

  useEffect(() => {
    getTemplates();
  }, []);

  const getTemplates = async () => {
    try {
      const responseData = await TournamentService.templates().json();
      setTemplates(responseData.data);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        console.error(errorJson.message);
      }
    }
  };

  const addRowTable = (index) => {
    if (rowsData.length > 0) {
      const lastItem = rowsData.slice(-1)[0];
      var duration = lastItem.duration;
    } else {
      var duration = "";
    }
    const data = {
      sb: "",
      bb: "",
      ante: "",
      duration: duration,
      order: rowsData.length,
      isbreak: 0,
      breaktitle: "",
    };
    rowsData.splice(rowsData.length, 0, data);
    initRow(rowsData);
  };
  const tableRowRemove = (index, e) => {
    initRow((prev) => {
      prev.splice(index, 1);

      return [...prev];
    });
  };
  const onValUpdate = (i, event) => {
    const { name, value } = event.target;

    const data = [...rowsData];
    if (name == "sb") {
      data[i]["bb"] = value * 2;
      data[i]["ante"] = value * 2;
    }
    data[i][name] = value;
    initRow(data);
    props.parentCallback(data);
  };
  const addRowTableRow = (index) => {
    let duration = ''
    if (rowsData.length > 0) {
      const lastItem = rowsData.slice(-1)[0];
      duration = lastItem.duration;
    } else {
      duration = "";
    }

    const data = {
      sb: "",
      bb: "",
      ante: "",
      duration: duration,
      order: rowsData.length,
      isbreak: 0,
      breaktitle: "",
    };

    initRow((prev) => {
      prev.splice(index + 1, 0, data);

      return [...prev];
    });
  };

  const handleLoadTemplate = async (templateId) => {
    try {
      const responseData = await TournamentService.loadtournament(
        templateId
      ).json();

      setSelectModalShow(false);
      props.parentCallback(responseData.data);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.error(errorJson.message);
      }
    }
  };

  const handleSaveTemplate = async (title, id) => {
    const userData = {
      title,
      structure: props.structure,
    };
    try {
      await (id > 0
        ? TournamentService.updateTemplate
        : TournamentService.createTemplate)(userData, id).json();

      setSaveModalShow(false);
      setShowToast(true);
      getTemplates();
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        console.error(errorJson);
      }
    }
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table dynamic-field-table">
          <thead>
            <tr>
              <th></th>
              <th>
                {t(
                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.SB"
                )}
              </th>
              <th>
                {t(
                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.BB"
                )}
              </th>
              <th>
                {t(
                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Ante"
                )}
              </th>
              <th>
                {t(
                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Duration"
                )}
              </th>
              <th>
                {t(
                  "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.Break"
                )}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <TableRows
              rows={rowsData}
              //rows={structuredata}
              addRowTable={addRowTableRow}
              tableRowRemove={tableRowRemove}
              onValUpdate={onValUpdate}
              // title={props.title}
            />
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-end mt-2">
        <Button
          className="me-2"
          variant="primary"
          type="button"
          onClick={() => setSelectModalShow(true)}
        >
          {t(
            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.LoadTemplate"
          )}
        </Button>
        <Button className="me-2" onClick={() => setSaveModalShow(true)}>
          Save Template
        </Button>
        <Link className="btn btn-primary" onClick={addRowTable}>
          {t(
            "page.myprofile.myprofilenav.All tournaments.addtournament.tabs.TournamentDetailsTab.AddRow"
          )}
        </Link>
      </div>

      <TemplateSelectModal
        show={selectModalShow}
        templates={templates}
        onLoadTemplates={getTemplates}
        onHide={() => {
          setSelectModalShow(false);
        }}
        onSelect={handleLoadTemplate}
      />
      <TemplateSaveModal
        show={saveModalShow}
        templates={templates}
        onHide={() => {
          setSaveModalShow(false);
        }}
        onSave={handleSaveTemplate}
      />

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={1000}
          bg="success"
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>Saved successfully.</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
export default Table;
