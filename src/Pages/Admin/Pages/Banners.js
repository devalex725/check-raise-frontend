import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Card, Col, Container, Row } from "react-bootstrap";
import LogoAnimationLoader from "../../../components/Loading/LogoAnimationLoader";
import AdminBannerService from "../../../api/services/AdminService/AdminBannerService";
import moment from "moment/moment";
import customStyle from "../customstyle";
import DataTable from "react-data-table-component";

const AdminBanners = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [futureBanners, setFutureBanners] = useState([]);
  const [currentBanners, setCurrentBanners] = useState([]);
  const [pastBanners, setPastBanners] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    const responseData = await AdminBannerService.index().json();
    const _futureBanners = [];
    const _currentBanners = [];
    const _pastBanners = [];

    // eslint-disable-next-line array-callback-return
    responseData.banners.map(item => {
      if (new Date() <= new Date(item.startdate)) {
        _futureBanners.push(item);
      } else if (new Date() >= new Date(item.startdate) && new Date() <= new Date(item.enddate)) {
        _currentBanners.push(item);
      } else {
        _pastBanners.push(item);
      }
    });

    setFutureBanners(_futureBanners);
    setCurrentBanners(_currentBanners);
    setPastBanners(_pastBanners);

    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await AdminBannerService.destroy(id).json();

      if (response.status) {
        getBanners();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const columns = useMemo(
    () => [
      {
        name: 'No.',
        selector: (row, index) => index + 1,
        sortable: true,
      },
      {
        name: 'Room',
        selector: (row) => row.room?.title || '',
        sortable: true,
      },
      {
        name: 'Position',
        selector: row => row ? row.location === 1 ? 'Top' : 'Center' : '',
        sortable: true,
      },
      {
        name: 'Image',
        selector: row => (
          <div>
            <img
              src={row ? process.env.REACT_APP_BANNER_IMAGE_URL
                + '' + row.image : ''}
              height="50" width="50"
              alt={row.room?.title}
            />
          </div>
        ),
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
        selector: (row) => <>
          <div>
            <Link className="action-link green-link mb-1" to={`/admin/pages/banners/${row.id}`}>Edit</Link>
            <Link className="action-link red-link mb-1" onClick={() => handleDelete(row.id)}>Delete</Link>
          </div>
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
        <h1 className="ms-2">Rented Banners</h1>
      </nav>
      <main>
        <div className="wrapper my-profile-wrapper">
          <Container>
            <Row>
              <Col md={12}>
                <div className="contact-form-wrapper">
                  <Card>
                    <Card.Body>
                      <h3>Future Banners</h3>
                      <DataTable
                        data={futureBanners}
                        columns={columns}
                        theme="dark"
                        selectableRowsComponentProps={{ inkDisabled: true }}
                        defaultSortFieldId={1}
                        pagination
                        paginationPerPage={100}
                        paginationComponentOptions={{
                          selectAllRowsItem: true,
                          selectAllRowsItemText: "ALL",
                        }}
                        paginationRowsPerPageOptions={[10, 50, 100]}
                        customStyles={customStyle}
                        responsive className="alltournamenttable"
                      />
                      <h3>Current Banners</h3>
                      <DataTable
                        data={currentBanners}
                        columns={columns}
                        theme="dark"
                        selectableRowsComponentProps={{ inkDisabled: true }}
                        defaultSortFieldId={1}
                        pagination
                        paginationPerPage={100}
                        paginationComponentOptions={{
                          selectAllRowsItem: true,
                          selectAllRowsItemText: "ALL",
                        }}
                        paginationRowsPerPageOptions={[10, 50, 100]}
                        customStyles={customStyle}
                        responsive className="alltournamenttable"
                      />
                      <h3>Past Banners</h3>
                      <DataTable
                        data={pastBanners}
                        columns={columns}
                        theme="dark"
                        selectableRowsComponentProps={{ inkDisabled: true }}
                        defaultSortFieldId={1}
                        pagination
                        paginationPerPage={100}
                        paginationComponentOptions={{
                          selectAllRowsItem: true,
                          selectAllRowsItemText: "ALL",
                        }}
                        paginationRowsPerPageOptions={[10, 50, 100]}
                        customStyles={customStyle}
                        responsive className="alltournamenttable"
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

export default AdminBanners;