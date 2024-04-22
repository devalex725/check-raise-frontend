import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import ContactService from '../../../api/services/AdminService/AdminContactService';
const EditContact = () => {
  const [isActive, setActive] = useState(false)
  const [isLoading, setisloading] = useState(true);
  const [contactData, setContactData] = useState([])
  const params = useParams()
  const navigate = useNavigate()
  const toggleClass = () => {
    setActive(!isActive)
  }
  
  useEffect(() => {
    var id = params.id
    if (localStorage.getItem('admintoken')) {
      getContactList(id)
    } else {
      navigate('/')
    }
  }, [])

  const getContactList = async (id) => {
    try {
    
      let responseData = await ContactService.show(id).json()
      setContactData(responseData.data);
      setisloading(false)
    } catch (error) {
        setisloading(true)
    }
  }
  
  const handleUpdate = async (event) => {
    event.preventDefault();
           
    try {
            const data = await ContactService.update(
                {
                    id       :  params.id,
                    firstname:  event.target.firstname.value,
                    lastname:   event.target.lastname.value,
                    email:      event.target.email.value,
                    message:    event.target.message.value
                }
               ).json();
              if(data.status === true)
                    {
                        navigate('/admin/contact')
                    }
        }
    catch (error) {
            // Handle API errors
            console.error("error 48",error);
            // serError(error)
            
     }
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
          <FontAwesomeIcon icon={faBars} />
        </Link>
        <h1 className="ms-2">Edit Contact</h1>
      </nav>
      <main>
        <div className="wrapper contact-wrapper">
          <Container>
            <Row>
              <Col sm={12}>
                <div className="contact-form-wrapper">
                  <Card>
                    <Card.Body>
                      <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Your name *</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={'Your name'}
                            name="firstname"
                            defaultValue={contactData.firstname}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Your Surname *</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={'Your Surname'}
                            name="lastname"
                            defaultValue={contactData.lastname}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Your email *</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={'Your email'}
                            name="email"
                            defaultValue={contactData.email}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Your Message *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            name="message"
                            defaultValue={contactData.message}
                          />
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                          <Button className="btn btn-link">Cancel</Button>
                          <div className="m-1"></div>
                          <Button
                            className="btn btn-primary"
                           type='submit'
                          >
                            Send
                          </Button>
                        </div>

                        <p className="error"></p>

                        <p className="success"></p>
                      </Form>
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
  )
}

export default EditContact
