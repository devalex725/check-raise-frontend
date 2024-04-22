import "../style.scss";

import React, { useEffect, useState, useMemo } from "react";
import Modal from "react-bootstrap/Modal";

import { Row, Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TransactionService from "../../../api/services/AdminService/TransactionService";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import customStyle from "../customstyle";
import DataTable from "react-data-table-component";
import moment from "moment";
import { sortDate } from "../../../utils";

const Transaction = () => {
  const [isActive, setActive] = useState(false);
  const navigate = useNavigate();

  const [transactionList, setTransactionList] = useState([]);
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [modalMessage, SetModalMessage] = useState("");

  const columns = useMemo(
    () => [
      {
        name: "Id",
        selector: (transactionList) => transactionList.id,
        sortable: true,
      },
      {
        name: "Date Time",
        selector: (transactionList) =>
          transactionList.created_at ? moment(transactionList.created_at).format('DD.MM.YYYY HH:mm') : "-",
        sortable: true,
        sortFunction: (rowA, rowB) => sortDate(rowA, rowB, "created_at"),
      },
      {
        name: "Room Name",
        selector: (transactionList) => transactionList.title,
        sortable: true,
      },
      {
        name: "Description",
        selector: (transactionList) => transactionList.description,
        sortable: true,
      },
      {
        name: "Amount",
        selector: (transactionList) => transactionList.amount,
        sortable: true,
      },
      {
        name: "Paypal or Debit",
        selector: (transactionList) => transactionList.paypalorderid,
        sortable: true,
      },

      {
        name: "Action",
        cell: (transactionList) => (
          <>
            <div>
              <Link
                className="action-link green-link mb-1"
                to={`/admin/edittransaction/${transactionList.id}`}
              >
                Edit
              </Link>
            </div>
            <div>
              <Link
                className="action-link red-link mb-1"
                onClick={() => {
                  deleteTransaction(transactionList.id);
                }}
              >
                Delete
              </Link>
            </div>
          </>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      getSettingList();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getSettingList = async () => {
    try {
      let responseData = await TransactionService.adminIndex().json();

      setTransactionList(responseData.data);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };

  const toggleClass = () => {
    setActive(!isActive);
  };

  const deleteTransaction = async (discountId) => {
    setDeleteId(discountId);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      let responseData = await TransactionService.destroy(deleteId).json();
      if (responseData.status === true) setDeleteModal(false);
      setDeleteSuccess(true);

      SetModalMessage(responseData.message);
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
        <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">Transaction</h1>
      </nav>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={12}>
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
                Transaction
              </Card.Header>
              <Card.Body>
                <DataTable
                  data={transactionList}
                  columns={columns}
                  theme="dark"
                  selectableRowsComponentProps={{ inkDisabled: true }}
                  defaultSortFieldId={2}
                  defaultSortAsc={false}
                  pagination
                  paginationPerPage={100}
                  paginationRowsPerPageOptions={[100]}
                  customStyles={customStyle}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {isLoading && <LogoAnimationLoader />}
      <Modal show={deleteModal}>
        <>
          <Modal.Header>
            <Modal.Title>Alert</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setDeleteModal(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete transaction?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteUser()}>
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>
      <Modal show={deleteSuccess}>
        <Modal.Header>
          <Modal.Title>Deleted</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsLoading(true);
              getSettingList();

              setDeleteSuccess(false);
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Transaction;
