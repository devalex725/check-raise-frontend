import React, {
  useEffect,
  useState,
  useMemo
} from 'react';
import DataTable from 'react-data-table-component';
import customStyle from '../../Admin/customstyle';
import moment from 'moment';
import {Row, Col, Form, Card, Button, Modal} from 'react-bootstrap';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import PremiumService from '../../../api/services/PremiumService';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';

const PremiumTournament = () => {


  const navigate = useNavigate();
  const [futurePT, setFuturePT] = useState([]);
  const [currentPT, setCurrentPT] = useState([]);
  const [pastPT, setPastPT] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [currentModalShow, setCurrentModalShow] = useState(false);

  const [errors, setErrors] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [DeleteId, setDeleteId] = useState('')

  const [modalMessage, setModalMessage] = useState('');
  const [Delete, setDelete] = useState(false)

  const getPT = async () => {
    try {
      let responseData = await PremiumService.index().json()
      console.log(responseData.data);
      //setFuturePT(responseData.data);
      const futureBanner = responseData && responseData.data.filter(function (item) {
        return new Date() <= new Date(item.startdate)
      })
      setFuturePT(futureBanner)

      const currentBanner = responseData && responseData.data.filter(function (item) {
        return new Date() >= new Date(item.startdate) && new Date() <= new Date(item.enddate)
      })
      setCurrentPT(currentBanner)

      const pastBanner = responseData && responseData.data.filter(function (item) {
        return new Date() >= new Date(item.startdate) && new Date() >= new Date(item.enddate)
      })
      setPastPT(pastBanner)

      setIsLoading(false)
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setErrors(errorJson.message)
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem('usertype') === 'Room Manager') {
      getPT();
    } else {
      navigate('/');
    }

  }, [navigate])
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL"
  };
  const futureColumns = useMemo(
    () => [
      {
        name: 'No.',
        selector: (row, index) => index + 1,
        sortable: true,
        width: '100px',
      },
      {
        name: 'Tournament',
        selector: (row, index) =>
          row.title + ' - ' + moment(row.trnstartday).format('DD.MM.YYYY HH:mm'),
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
          <Link className='action-link red-link mb-1' onClick={() => handleDelete(row.id)}>Delete</Link>
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
        width: '100px',
      },
      {
        name: 'Tournament',
        selector: (row, index) =>
          row.title + ' - ' + moment(row.trnstartday).format('DD.MM.YYYY HH:mm'),
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
            {/* <Link className='action-link green-link mb-1' to={`/manager/editpremium-tournament/${row.id}`}>Edit</Link> */}
            <Link className='action-link red-link mb-1' onClick={(e) => currenthandleDelete(row.id)}>Delete</Link>
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
        width: '100px'
      },
      {

        name: 'Tournament',
        selector: (row, index) =>
          row.title + ' - ' + moment(row.trnstartday).format('DD.MM.YYYY HH:mm'),
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
            {/* <Link className='action-link green-link mb-1' to={`/manager/editpremium-tournament/${row.id}`}>Edit</Link> */}
            <Link className='action-link red-link mb-1' onClick={() => handleDeletePast(row.id)}>Delete</Link>
        </>
      }

    ], [],
  );

  const handleDeletePast = async (e) => {
    try {
      let responseData = await PremiumService.destroyPremiumTournament(e).json()
      if (responseData.status === true) {
        setModalMessage(responseData.message)
        setDelete(true)
      }
      setModalShow(false)
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setErrors(errorJson.message)
      }
    }
  }
  const currenthandleDelete = (e) => {
    setDeleteId(e)
    setCurrentModalShow(true)
  }
  const handleDelete = (e) => {
    setDeleteId(e)
    setModalShow(true)
  }
  const handleDeleteBanner = async () => {
    try {

      let responseData = await PremiumService.destroyPremiumTournament(DeleteId).json()
      if (responseData.status === true) {
        setIsLoading(true)
        setModalMessage(responseData.message)
        //setModalMessage("Delete director Successfully!!!")
        setModalShow(false)
        setCurrentModalShow(false)
        //setDelete(true)
        getPT()
      }

    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setErrors(errorJson.message)
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
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'>
                  <path
                    d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z"/>
                </svg>
                My Premium Tournament
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
                      <Button varient="primary" onClick={() => navigate('/manager/addpremium-tournament')}>Create
                        premium tournament</Button>
                    </Col>
                  </Row>
                </Form>
                <h3>Future Premium Tournaments </h3>
                <DataTable
                  data={futurePT}
                  columns={futureColumns}
                  theme="dark"
                  selectableRowsComponentProps={{inkDisabled: true}}
                  defaultSortFieldId={1}
                  pagination
                  customStyles={customStyle}
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                />
                <h3>Current Premium Tournaments </h3>
                <DataTable
                  data={currentPT}
                  columns={currentColumns}
                  theme="dark"
                  selectableRowsComponentProps={{inkDisabled: true}}
                  defaultSortFieldId={1}
                  pagination
                  customStyles={customStyle}
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                />
                <h3>Past Premium Tournaments </h3>
                <DataTable
                  data={pastPT}
                  columns={pastColumns}
                  theme="dark"
                  selectableRowsComponentProps={{inkDisabled: true}}
                  defaultSortFieldId={1}
                  pagination
                  customStyles={customStyle}
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {isLoading && <LogoAnimationLoader/>}
      {Delete ? (
        <Modal show={Delete}>
          <>
            <Modal.Header>
              <Modal.Title>Deleted</Modal.Title>
            </Modal.Header>

            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  getPT()
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
      <Modal show={modalShow}>
        <>
          <Modal.Header>
            <Modal.Title>Alert - Money Back</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setModalShow(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete premium tournament?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setModalShow(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteBanner()}>
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>
      <Modal show={currentModalShow}>
        <>
          <Modal.Header>
            <Modal.Title>Alert - No Money Back</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setCurrentModalShow(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete premium tournament?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setCurrentModalShow(false)}>
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

export default PremiumTournament
