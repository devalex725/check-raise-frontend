import React, { useEffect, useState } from "react";

import { Row, Col, Card, Table, Modal, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminPageSetting from "../../../api/services/AdminService/AdminPageSetting";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import MultiLangTinyEditor from "../../../components/MultiLangTinyEditor/MultiLangTinyEditor";

const imageUrl = process.env.REACT_APP_BANNER_IMAGE_URL;
const pageKeys = ["main_info", "player_info", "tournament_info"];

const AdminInfo = () => {
  const [errors, setErrors] = useState("");
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [messageModalShow, setMessageModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [file, setFile] = useState("");

  useEffect(() => {
    getPages();
  }, []);

  const getPages = async () => {
    try {
      const responseData = await AdminPageSetting.index({
        key: pageKeys,
      }).json();

      setIsLoading(false);
      if (responseData.status === true) {
        setPages(responseData.data);
      }
    } catch (error) {
      setIsLoading(false);

      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setErrors(errorJson.message);
      }
    }
  };

  const handleEdit = async (element) => {
    setSelectedPage(element);
    setEditModalShow(true);
  };

  const handleCloseEditModal = () => {
    setEditModalShow(false);
    setSelectedPage(false);
  };

  const handleChangeContent = ({ value }) => {
    setSelectedPage((prev) => ({ ...prev, content: value }));
  };

  const handleChangeImage = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);

    fileReader.onload = () => {
      var image = fileReader.result;
      setFile(image);
    };
  };

  const handleUpdate = async () => {
    try {
      const userData = {
        ...selectedPage,
        image: file ? file.split(",")[1] : null,
      };
      const data = await AdminPageSetting.update(userData).json();

      if (data.status === true) {
        setModalMessage(data.msg);
        setMessageModalShow(true);
        handleCloseEditModal();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2">
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">Info Details</h1>
      </nav>
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
                >
                  <path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" />
                </svg>
                Info Details
              </Card.Header>
              <Card.Body>
                <Table responsive className="profile-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Key</th>
                      <th>Content</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((element, index) => (
                      <tr key={index}>
                        <td>{index + 1} .</td>
                        <td>{element.key}</td>
                        <td>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: element.content?.en || element.content,
                            }}
                          />
                        </td>
                        <td>
                          <img
                            src={element.image ? imageUrl + element.image : ""}
                            className="rounded-lg me-2"
                            width="70"
                            alt=""
                          />{" "}
                        </td>
                        <td>
                          <Link
                            to=""
                            className="badge badge-success"
                            onClick={() => handleEdit(element)}
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          {/*  */}
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader />}
      <Modal show={editModalShow}>
        <Modal.Header>
          <Modal.Title>Saved</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Key *</Form.Label>
            <Form.Control
              type="text"
              placeholder={"Title"}
              name="key"
              disabled
              defaultValue={selectedPage.key}
            />
          </Form.Group>

          {selectedPage && (
            <MultiLangTinyEditor
              initialValue={selectedPage.content}
              onChange={handleChangeContent}
            />
          )}
          <input name="logo" type="file" onChange={handleChangeImage} />
        </Modal.Body>
        <Modal.Footer>
          <p>{errors}</p>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={messageModalShow}>
        <Modal.Header>
          <Modal.Title>Saved</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setMessageModalShow(false);
              setIsLoading(true);
              getPages();
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminInfo;
