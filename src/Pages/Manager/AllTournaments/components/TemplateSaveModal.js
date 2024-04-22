import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const TemplateSaveModal = ({ show, templates, onHide, onSave }) => {
  const [title, setTitle] = useState("");
  const [selectedId, setSelectedId] = useState(0);

  useEffect(() => {
    if (!show) return;
    setTitle("");
    setSelectedId(0);
  }, [show]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Templates</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Template name</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-20">
          <Form.Label>Choose template to overwrite</Form.Label>
          <Form.Select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value={0}>Create new</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => onSave(title, selectedId)}>
          Save
        </Button>

        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TemplateSaveModal;
