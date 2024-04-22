import '../style.scss';

import React, {
  useEffect,
  useState,
  useMemo
} from 'react';
import Modal from 'react-bootstrap/Modal';


import { Row, Col, Form, Card, Button } from 'react-bootstrap';
import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  faBars,

} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminUserService from '../../../api/services/AdminService/AdminUserService';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import customeStyle from '../customstyle';
import DataTable from 'react-data-table-component';
const User = () => {
  const [isActive, setActive] = useState(false);
  const params = useParams()
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true)
  const [suspendShow, ModalSuspendShow] = useState(false);
  const [modalMessage, SetmodalMessage] = useState('');
  const [Error, setError] = useState('');
  const [players, setPlayers] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [statusValue, setStatusValue] = useState("any");

  const [deleteId, setDeleteId] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);


  const toggleClass = () => {
    setActive(!isActive)
  }
  const getListing = async (page) => {
    try {


      let responseData = await AdminUserService.getUsers(params.type, page).json()


      setPlayers(responseData.data)

      setFilteredList(responseData.data)



      setIsLoading(false)

    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setError(errorJson.message)
      }
    }
  }
  const [searchParam] = useState([
    'username',
    'name',
    'email',



  ])
  const filterBySearch = (event) => {
    const query = event.target.value;

    var updatedList = [...players];

    updatedList = updatedList.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          item[newItem].toString().toLowerCase().indexOf(query.toLowerCase()) !== -1

        )

      })

    });

    setFilteredList(updatedList);
  };
  useEffect(() => {
    if (localStorage.getItem('admintoken')) {

      getListing(1)
    } else {
      navigate('/')
    }
  }, [navigate])
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL"
  };
  const columns = useMemo(
    () => [

      {
        name: 'id',
        selector: row => row.id,
        sortable: true,

      },
      {
        name: 'User Name',
        selector: row => row.username ? row.username : '',
        sortable: true,
      },
      {
        name: 'Name',
        selector: row => row.name,
        sortable: true,

      },
      {
        name: 'Email',
        selector: row => row.email,
        sortable: true,

      },
      {
        name: 'Is Verify ?',
        selector: row => row.isverified ? "verified" : <Link className='action-link green-link mb-1' onClick={() => handleVerifyUser(row.id)}>Verify</Link>,
        sortable: true,

      },
      {
        name: 'Status',

        cell: (row) => <>
          <td>
            {/* {
              row.status === 1
                ?
                <Link className='action-link red-link mb-1' onClick={() => handleUpdateStatus(row.id, 0)}>Deactive</Link>
                :
                <Link className='action-link green-link mb-1' onClick={() => handleUpdateStatus(row.id, 1)}>Active</Link>
            } */}
            {
              window.location.pathname === '/admin/user/Admin'
                ?
                <></>
                :
                <Link className='action-link blue-link mb-1' onClick={() => handleLoginIn(row.id)}>Login as user</Link>

            }
            <Link className='action-link green-link mb-1' to={`/admin/user/edit/${row.id}`}>Edit</Link>
            <Link className='action-link red-link mb-1' onClick={() => { deletetournament(row.id) }}>Delete</Link>
          </td>
        </>
      },
    ], [],
  );
  const deletetournament = async (tournamentid) => {
    setDeleteId(tournamentid)
    setdeleteModal(true)

  }
  const handleDeleteUser = async () => {

    try {
      let responseData = await AdminUserService.destroy(deleteId).json()
      if (responseData.status === true)
        setdeleteModal(false)
      setDeleteSuccess(true)

      SetmodalMessage("User Delete Successfully")

    }
    catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setError(errorJson.message)
      }
    }
  }
  const handleLoginIn = async (e) => {

    try {
      var userData = {

        id: e,
        device_name: "web"
      }
      let responseData = await AdminUserService.loginuser(userData).json()
      if (responseData.status === true) {

        localStorage.setItem("usertoken", JSON.stringify(responseData.token));
        localStorage.setItem("usertype", responseData.type.toString());
        localStorage.setItem("user", JSON.stringify(responseData.user));
        localStorage.setItem("adminloginasuser", 'adminloginasuser');
        window.open(process.env.REACT_APP_URL, "_blank", "noreferrer");
      }
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setError(errorJson.message)
      }
    }
  }

  const handleUpdateStatus = async (id, value) => {
    try {

      var postData = {
        status: value,
      }
      await AdminUserService.updateStatus(id, postData).json()
      getListing(1);
      ModalSuspendShow(true);
      SetmodalMessage("Status Updated!!!");

      setIsLoading(false)


    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setError(errorJson.message)
      }
    }
  }
  const handleVerifyUser = async (id) => {
    try {
      await AdminUserService.verifyUser(id).json()
      getListing(1)
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setError(errorJson.message)
      }
    }
  }
  const handlePerRowsChange = async (newPerPage, page) => {
    let responseData = await AdminUserService.getUsers(params.type, page).json()
    setPlayers(responseData.data);

  };
  const handlePageChange = page => {
    getListing(page);
  };
  function handlestatus(e) {

    if (e.target.value === '1') {
      var filtered2 = players.filter((element) => {

        return element.status == 1;
      });

      setFilteredList(filtered2);
      setStatusValue(1)

    }
    else if (e.target.value === '0') {
      var filtered2 = players.filter((element) => {

        return element.status == 0;
      });
      setFilteredList(filtered2);
      setStatusValue(0)
    }
    else {
      setFilteredList(players);
      setStatusValue('any')
    }

  }

  return (
    <>

      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">My Players</h1>
      </nav>
      <div className='wrapper my-profile-wrapper'>
        <Row className='my-5'>
          <Col md={12}>
            <Card>
              <Card.Header>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className='me-1'><path d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z" /></svg>
                My Players

              </Card.Header>
              <Card.Body>
                <Form>
                  <Row className='m-2'>
                    <Col md={4} sm={12}>
                    </Col>
                    <Col md={4} sm={12}>
                      <Form.Control type="text" className='' placeholder='Searchby'
                        onChange={filterBySearch}
                      />
                    </Col>
                  </Row>
                  <Row className='m-2'>
                    <Col md={4} sm={12}>
                      <Form.Label>Status</Form.Label>
                    </Col>
                    <Col md={4} sm={12}>
                      <Form.Select onChange={(e) => handlestatus(e)}>
                        <option value='any'>Any</option>
                        <option value='0'>Active</option>
                        <option value='1'>Suspended</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className='m-2'>
                    <Col md={12} className='text-end'>
                      <Button varient="primary" onClick={() => navigate(`/admin/addplayer/${params.type}`)}>Create a {params.type} account</Button>
                    </Col>

                  </Row>
                </Form>
                <DataTable

                  data={
                    filteredList.filter(
                      (element) => {
                        return statusValue === 'any' ? filteredList :

                          element.status === statusValue
                      })}
                  columns={columns}
                  theme="dark"

                  pagination
                  customStyles={customeStyle}
                  paginationPerPage={100}
                  paginationComponentOptions={paginationComponentOptions}
                  paginationRowsPerPageOptions={[10, 50, 100]}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}

                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <p className='error'>{Error}</p>
      </div>
      {isLoading && <LogoAnimationLoader />}
      {suspendShow ? (
        <Modal show={suspendShow}>
          <>
            <Modal.Header>
              <Modal.Title>Saved</Modal.Title>
            </Modal.Header>

            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  ModalSuspendShow(false)
                  setIsLoading(true)
                  getListing(1);

                }}
              >
                Okay
              </Button>
            </Modal.Footer>
          </>
        </Modal>
      ) : (
        ''
      )}
      <Modal show={deleteModal}>
        <>

          <Modal.Header>
            <Modal.Title>Alert</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setdeleteModal(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete user?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setdeleteModal(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteUser()}>
              Delete
            </Button>
          </Modal.Footer>


        </>
      </Modal >
      <Modal show={deleteSuccess}>
        <Modal.Header>
          <Modal.Title>Deleted</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsLoading(true)
              getListing(1)
              // setdeleteModal(false)
              setDeleteSuccess(false)
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default User
