import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Card, Col, Container, Row } from "react-bootstrap";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import AdminPremiumTournamentService from "../../../api/services/AdminService/AdminPremiumTournamentService";
import moment from "moment/moment";
import DataTable from "react-data-table-component";
import customStyle from "../customstyle";

const AdminPremiumTournaments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [futurePT, setFuturePT] = useState([]);
  const [currentPT, setCurrentPT] = useState([]);
  const [pastPT, setPastPT] = useState([]);

  useEffect(() => {
    getPT();
  }, []);

  const getPT = async () => {
    try {
      const responseData = await AdminPremiumTournamentService.index().json();
      const premiumTournaments = responseData.data;
      console.log('premiumTournaments', premiumTournaments);

      const future = [];
      const current = [];
      const past = [];

      premiumTournaments.map(item => {
        if (new Date() <= new Date(item.startdate)) {
          future.push(item);
        } else if (new Date() >= new Date(item.startdate) && new Date() <= new Date(item.enddate)) {
          current.push(item);
        } else {
          past.push(item);
        }
      });

      setFuturePT(future);
      setCurrentPT(current);
      setPastPT(past);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setErrors(errorJson.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await AdminPremiumTournamentService.destroy(id).json();

      if (response.status) {
        getPT();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const columns = useMemo(
    () => [
      {
        name: 'No.',
        selector: (row, index) => index + 1,
        sortable: true,
        width: '100px',
      },
      {
        name: 'Tournament',
        selector: (row) =>
          row.tournament?.title + ' - ' + moment(row.tournament.detail?.startday).format('DD.MM.YYYY HH:mm'),
        sortable: true,
      },
      {
        name: 'Room',
        selector: row => row.room.title || '',
        sortable: true,
      },
      {
        name: 'Start Date',
        selector: row => row ? moment(row.startdate).format('DD.MM.YYYY HH:mm') : '',
        sortable: true,

      },
      {

        name: 'End Date',
        selector: row => row ? moment(row.enddate).format('DD.MM.YYYY HH:mm') : '',
        sortable: true,

      },
      {
        name: "Action",
        cell: (row) => <>
          {/*<Link className="action-link green-link mb-1" to={""}>Edit</Link>*/}
          <Link className="action-link red-link mb-1" onClick={() => handleDelete(row.id)}>Delete</Link>
        </>,
      },

    ], [],
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className="d-inline-block d-lg-none p-2">
          <FontAwesomeIcon icon={faBars}/>
        </Link>
        <h1 className="ms-2">Rented Premium Tournaments</h1>
      </nav>
      <main>
        <div className="wrapper my-profile-wrapper">
          <Container>
            <Row>
              <Col md={12}>
                <div className="contact-form-wrapper">
                  <Card>
                    <Card.Body>
                      <h3>Future Premium Tournaments </h3>
                      <DataTable
                        data={futurePT}
                        columns={columns}
                        theme="dark"
                        selectableRowsComponentProps={{ inkDisabled: true }}
                        defaultSortFieldId={1}
                        pagination
                        customStyles={customStyle}
                        paginationPerPage={100}
                        paginationComponentOptions={{
                          selectAllRowsItem: true,
                          selectAllRowsItemText: "ALL",
                        }}
                        paginationRowsPerPageOptions={[50, 100]}
                      />
                      <h3>Current Premium Tournaments </h3>
                      <DataTable
                        data={currentPT}
                        columns={columns}
                        theme="dark"
                        selectableRowsComponentProps={{ inkDisabled: true }}
                        defaultSortFieldId={1}
                        pagination
                        customStyles={customStyle}
                        paginationPerPage={100}
                        paginationComponentOptions={{
                          selectAllRowsItem: true,
                          selectAllRowsItemText: "ALL",
                        }}
                        paginationRowsPerPageOptions={[50, 100]}
                      />
                      <h3>Past Premium Tournaments </h3>
                      <DataTable
                        data={pastPT}
                        columns={columns}
                        theme="dark"
                        selectableRowsComponentProps={{ inkDisabled: true }}
                        defaultSortFieldId={1}
                        pagination
                        customStyles={customStyle}
                        paginationPerPage={100}
                        paginationComponentOptions={{
                          selectAllRowsItem: true,
                          selectAllRowsItemText: "ALL",
                        }}
                        paginationRowsPerPageOptions={[50, 100]}
                      />
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </main>

      {isLoading && <LogoAnimationLoader/>}
    </>
  );
};

export default AdminPremiumTournaments;