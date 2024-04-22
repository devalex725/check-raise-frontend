import './Contact.scss';

import {
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Table,
} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import ContactService from '../../../api/services/AdminService/AdminContactService';
import {
  faBars,
  faTrash,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
const Contact = () => {
  const [contactData, setContactData] = useState([])
  const [isActive, setActive] = useState(false)
  const [modelshow, setModelShow] = useState(false)
  const [DeleteId, setDeleteId] = useState('')
  const [Delete, setDelete] = useState(false)
  const [isLoading, setisloading] = useState(true);
  const navigate = useNavigate()
  const toggleClass = () => {
    setActive(!isActive)
  }
  useEffect(() => {
    if (localStorage.getItem('admintoken')) {
      getContactList()
    } else {
      navigate('/')
    }
  }, [])

  const getContactList = async () => {
    try {

      let responseData = await ContactService.index().json()
      setContactData(responseData.data);
      setisloading(false)
    } catch (error) {


    }
  }

  const handleEdit = (e) => {
    navigate(`/admin/contact/edit/${e}`)
  }
  const handleDelete = (e) => {
    setDeleteId(e)
    setModelShow(true)
  }
  const handleDeleteItem = async () => {
    try {

      let responseData = await ContactService.destroy(DeleteId).json()
      if (responseData.status === true) {
        setisloading(true)
        setModelShow(false)
        setDelete(true)
        getContactList()
      }

    } catch (error) {
      setisloading(true)
    }

  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">Contact List</h1>
      </nav>
      <div className="table-container d-none d-md-block">
        <Table responsive>
          <thead>
            <tr>
              <th className="width-auto text-center" style={{ width: '140px' }}>
                No.
              </th>
              <th className="width-auto text-nowrap">Name</th>
              <th className="width-auto text-center text-nowrap">Surname</th>
              <th className="width-auto text-center d-md-none d-lg-table-cell">
                Email
              </th>
              <th className="width-auto text-nowrap">Message</th>
              <th className="width-auto text-nowrap" colSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {contactData.map((element, index) => (
              <tr>
                <td className="align-middle">
                  <p className="tournament-date text-nowrap">{index + 1}.</p>
                </td>
                <td className="align-middle">
                  <Link
                  // to="/tournaments-details"
                  >
                    <b>{element.firstname}</b>
                  </Link>
                </td>
                <td className="align-middle">
                  <Link
                    //   to="/room"
                    className="align-middle text-truncate w-100 room-logo"
                  >
                    <b>{element.lastname}</b>
                  </Link>
                </td>
                <td className="text-center align-middle d-md-none d-lg-table-cell">
                  <span>{element.email}</span>
                </td>

                <td className="text-center align-middle">{element.message}</td>
                <td
                  className="text-center align-middle"
                  onClick={(e) => handleEdit(element.id)}
                >
                  <FontAwesomeIcon icon={faUserEdit} color="#ffff" />
                </td>
                <td
                  className="text-center align-middle"
                  value={element.id}
                  onClick={() => handleDelete(element.id)}
                >
                  <FontAwesomeIcon icon={faTrash} color="#ffff" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {isLoading && <LogoAnimationLoader />}
      <Modal show={modelshow}>
        <>
          <Modal.Header>
            <Modal.Title>Alert</Modal.Title>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setModelShow(false)}
            ></button>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete contact?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModelShow(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteItem()}>
              Delete
            </Button>
          </Modal.Footer>
        </>
      </Modal>
      {Delete ? (
        <Modal show={Delete}>
          <>
            <Modal.Header>
              <Modal.Title>Deleted</Modal.Title>
            </Modal.Header>

            <Modal.Body>Contact Successfully</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  getContactList()
                  setDelete(false)
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
    </>
  )
}
export default Contact
