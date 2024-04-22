
import React, {
  useEffect,
  useState,
  useMemo
} from 'react';
import DataTable from 'react-data-table-component';
import customeStyle from '../../Admin/customstyle';
import MyProfileLeftNavManager from '../../../components/MyProfileLeftNav/MyProfileLeftNavManager';
import { Row, Col, Form, Card, Button, Table, Modal } from 'react-bootstrap';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import BannerService from '../../../api/services/BannerService';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import moment from 'moment';
const Banner = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [futureBanners, setFutureBanners] = useState([]);
  const [pastBanners, setPastBanners] = useState([]);
  const [currentBanners, setCurrentBanners] = useState([]);
  const [Modalshow, setModelShow] = useState(false);
  const [ModalshowCurrent, setModelShowCurrent] = useState(false);
  const [Error, setError] = useState('');
  const [isLoading, setisloading] = useState(true);
  const [DeleteId, setDeleteId] = useState('')
  const [modalmessage, setModalMessage] = useState('');
  const [Delete, setDelete] = useState(false)
  const getBanner = async () => {
    try {
      let responseData = await BannerService.index().json()
      console.log(responseData)
      
      var futureBanner = responseData && responseData.data.filter(function (item) {
        return new Date() <= new Date(item.startdate)  
      })
      setFutureBanners(futureBanner)

      var currentBanner = responseData && responseData.data.filter(function (item) {
        return new Date() >= new Date(item.startdate) && new Date() <= new Date(item.enddate)      
      })
      setCurrentBanners(currentBanner)

      var pastBanner = responseData && responseData.data.filter(function (item) {
        return new Date() >= new Date(item.startdate) && new Date() >= new Date(item.enddate)      
      })
      setPastBanners(pastBanner)

      setBanners(responseData.data);

      setisloading(false)
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setError(errorJson.message)
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem('usertype') === 'Room Manager') {
      getBanner();
    }
    else {
      navigate('/');
    }
  }, [navigate])
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL"
  };
  const columns = useMemo(
    () => [
      {
        name: 'No.',
        selector: (row, index) => index + 1,
        sortable: true,

      },
      {
        name: 'Position',
        cell: (row) => row ? row.location == 1 ? 'Top' : 'Center' : '',
        selector: row => row ? row.location == 1 ? 'Top' : 'Center' : '',
        sortable: true,

      },
      {
        name: 'Image',
        cell: (row) => (
          <><td><img
            src={row ? process.env.REACT_APP_BANNER_IMAGE_URL
              + '' + row.image : ''}
            height="50" width="50"
          /></td></>

        ),
        selector: row => (
          <>  <td><img
            src={row ? process.env.REACT_APP_BANNER_IMAGE_URL
              + '' + row.image : ''}
            height="50" width="50"
          /></td></>

        ),
        sortable: true,
      },
      {

        name: 'Start Date',
        cell: (row) => row ? moment(row.startdate).format('DD.MM.YYYY HH:mm') : '',
        selector: row => row ? moment(row.startdate).format('DD.MM.YYYY HH:mm') : '',
        sortable: true,

      },
      {

        name: 'End Date',
        cell: (row) => row ? moment(row.enddate).format('DD.MM.YYYY HH:mm') : '',
        selector: row => row ? moment(row.enddate).format('DD.MM.YYYY HH:mm') : '',
        sortable: true,

      },
      {
        name: "Action",
        cell: (row) => <>
          <td>
            <Link className='action-link green-link mb-1' to={`/manager/editbanner/${row.id}`}>Edit</Link>
            <Link className='action-link red-link mb-1' onClick={(e) => handleDelete(row.id)}>Delete</Link>
          </td>
        </>
      }

    ], [],
  );
  const currentColumns = useMemo(
    () => [
      {
        name: 'No.',
        selector: (row, index) => index + 1,
        sortable: true,

      },
      {
        name: 'Position',
        cell: (row) => row ? row.location == 1 ? 'Top' : 'Center' : '',
        selector: row => row ? row.location == 1 ? 'Top' : 'Center' : '',
        sortable: true,

      },
      {
        name: 'Image',
        cell: (row) => (
          <><td><img
            src={row ? process.env.REACT_APP_BANNER_IMAGE_URL
              + '' + row.image : ''}
            height="50" width="50"
          /></td></>

        ),
        selector: row => (
          <>  <td><img
            src={row ? process.env.REACT_APP_BANNER_IMAGE_URL
              + '' + row.image : ''}
            height="50" width="50"
          /></td></>

        ),
        sortable: true,
      },
      {

        name: 'Start Date',
        cell: (row) => row ? moment(row.startdate).format('DD.MM.YYYY HH:mm') : '',
        selector: row => row ? moment(row.startdate).format('DD.MM.YYYY HH:mm') : '',
        sortable: true,

      },
      {

        name: 'End Date',
        cell: (row) => row ? moment(row.enddate).format('DD.MM.YYYY HH:mm') : '',
        selector: row => row ? moment(row.enddate).format('DD.MM.YYYY HH:mm') : '',
        sortable: true,

      },
      {
        name: "Action",
        cell: (row) => <>
          <td>
            <Link className='action-link green-link mb-1' to={`/manager/editbanner/${row.id}`}>Edit</Link>
            <Link className='action-link red-link mb-1' onClick={(e) => handleDeleteCurrent(row.id)}>Delete</Link>
          </td>
        </>
      }

    ], [],
  );
  const pastColumns = useMemo(
    () => [
      {
        name: 'No.',
        selector: (row, index) => index + 1,
        sortable: true,

      },
      {
        name: 'Position',
        cell: (row) => row ? row.location == 1 ? 'Top' : 'Center' : '',
        selector: row => row ? row.location == 1 ? 'Top' : 'Center' : '',
        sortable: true,

      },
      {
        name: 'Image',
        cell: (row) => (
          <>  <td><img
            src={row ? process.env.REACT_APP_BANNER_IMAGE_URL
              + '' + row.image : ''}
            height="50" width="50"
          /></td></>

        ),
        selector: row => (
          <>  <td><img
            src={row ? process.env.REACT_APP_BANNER_IMAGE_URL
              + '' + row.image : ''}
            height="50" width="50"
          /></td></>

        ),
        sortable: true,
      },
      {

        name: 'Start Date',
        cell: (row) => row ? moment(row.startdate).format('DD.MM.YYYY HH:mm') : '',
        selector: row => row ? moment(row.startdate).format('DD.MM.YYYY HH:mm') : '',
        sortable: true,

      },
      {

        name: 'End Date',
        cell: (row) => row ? moment(row.enddate).format('DD.MM.YYYY HH:mm') : '',
        selector: row => row ? moment(row.enddate).format('DD.MM.YYYY HH:mm') : '',
        sortable: true,

      },
      {
        name: "Action",
        cell: (row) => <>
          <td>
            <Link className='action-link red-link mb-1' onClick={(e) => handleDeletePast(row.id)}>Delete</Link>
          </td>
        </>
      }

    ], [],
  );
  
  const handleDelete = (e) => {
    setDeleteId(e)
    setModelShow(true)
  }
  const handleDeleteCurrent = (e) => {
    setDeleteId(e)
    setModelShowCurrent(true)
  }
  const handleDeleteBanner = async () => {
    try {
      let responseData = await BannerService.destroyBanner(DeleteId).json()
      if (responseData.status === true) {
        setModalMessage(responseData.message)
        setDelete(true)
      }
      setModelShow(false)
      setModelShowCurrent(false)
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setError(errorJson.message)
      }
    }
  }
  const handleDeletePast = async (e) => {
    try {
      let responseData = await BannerService.destroyBanner(e).json()
      if (responseData.status === true) {
        setModalMessage(responseData.message)
        setDelete(true)
      }
      setModelShow(false)
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setError(errorJson.message)
      }
    }
  }
  return (
    <>
      <div className='wrapper my-profile-wrapper'>
        <Row className='my-5'>
          <Col md={2}>
            {/* <MyProfileLeftNavManager /> */}
          </Col>
          <Col md={10} lg={12}>
            <Card>
              <Card.Header>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                My Banner
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row className='m-2'>
                    <Col md={4} sm={12}>
                    </Col>
                    <Col md={4} sm={12}>
                    </Col>
                  </Row>
                  <Row className='m-2'>
                    <Col md={12} className='text-end'>
                      <Button varient="primary" onClick={() => navigate('/manager/addbanner')}>Create a Banner</Button>
                    </Col>
                  </Row>
                </Form>
                <h3>Future Banners </h3>
                <DataTable
                  data={futureBanners}
                  columns={columns}
                  theme="dark"
                  selectableRowsComponentProps={{ inkDisabled: true }}
                  defaultSortFieldId={1}
                  pagination
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                  customStyles={customeStyle}
                  responsive className="alltournamenttable"
                />
                <h3>Current Banners </h3>
                <DataTable
                  data={currentBanners}
                  columns={currentColumns}
                  theme="dark"
                  selectableRowsComponentProps={{ inkDisabled: true }}
                  defaultSortFieldId={1}
                  pagination
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                  customStyles={customeStyle}
                  responsive className="alltournamenttable"
                />
                <h3>Past Banners </h3>
                <DataTable
                  data={pastBanners}
                  columns={pastColumns}
                  theme="dark"
                  selectableRowsComponentProps={{ inkDisabled: true }}
                  defaultSortFieldId={1}
                  pagination
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                  customStyles={customeStyle}
                  responsive className="alltournamenttable"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader />}
      {Delete ? (
        <Modal show={Delete}>
          <>
            <Modal.Header>
              <Modal.Title>Deleted</Modal.Title>
            </Modal.Header>

            <Modal.Body>{modalmessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  getBanner()
                  setDelete(false)
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        </Modal>
      ) : (
        ''
      )}
      <Modal show={Modalshow}>
        <>
          <Modal.Header>
            <Modal.Title>Alert - Money Back</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setModelShow(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete banner?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setModelShow(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteBanner()}>
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>
      <Modal show={ModalshowCurrent}>
        <>
          <Modal.Header>
            <Modal.Title>Alert - No Money Back</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setModelShowCurrent(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete banner?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setModelShowCurrent(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteBanner()}>
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>
    </>
  )
}

export default Banner
