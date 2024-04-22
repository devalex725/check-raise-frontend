import React from "react";
import TournamentService from "../../../../api/services/TournamentService";
import { Button, Modal, Table } from "react-bootstrap";

const TemplateSelectModal = ({ show, templates, onLoadTemplates, onHide, onSelect }) => {
  const handleRemove = async (id) => {
    try {
      await TournamentService.deleteTemplate(id).json();
      onLoadTemplates()
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        console.error(errorJson.message);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Templates</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {templates.map((template) => (
          <div key={template.id} className="mb-4">
            <h4>{template.title}</h4>
            <Table bordered style={{ color: "white" }}>
              <thead>
                <tr>
                  <th>SB</th>
                  <th>BB</th>
                  <th>ANTE</th>
                  <th>Duration [min]</th>
                </tr>
              </thead>
              <tbody>
                {(template.structure || []).map((item) => (
                  <tr key={item.id}>
                    <td>{item.sb}</td>
                    <td>{item.bb}</td>
                    <td>{item.ante}</td>
                    <td>{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button
              variant="primary"
              size="sm"
              className="me-2"
              onClick={() => onSelect(template.id)}
            >
              Select
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleRemove(template.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default TemplateSelectModal;
