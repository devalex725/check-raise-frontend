import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Col,
  Row,
  Image
} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminUser from '../../../api/services/AdminService/AdminUser';
import logo from '../../../assets/images/logo-login.png';

const AdminLogin = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (localStorage.getItem('admintoken')) {
      navigate('/admin/tournament')
    } else {
      navigate('/admin/login')
    }
  }, [])
  const eye = <FontAwesomeIcon icon={faEye} />
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />

  const [passwordShown, setPasswordShown] = useState(false)
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true)
  }
  const [error, serError] = useState('');

  const LoginSubmit = async (event) => {

    event.preventDefault();

    try {
      const data = await AdminUser.login(event.target.email.value, event.target.password.value).json();

      if (data.type.toString() === 'Admin') {
        localStorage.setItem("adminuser", JSON.stringify(data.user));
        localStorage.setItem("admintoken", JSON.stringify(data.token));
        navigate('/admin/tournament')
      }
      else {
        serError('Access Denied');
      }


    } catch (error) {
      // Handle API errors
      console.error("error 48", error);
      serError(error)

    }

  }

  return (
    <>
      <main>
        <div className="wrapper admin-login">
          <Row className="justify-content-center">
            <Col md={9}>
              <div className="login-formwrap d-flex align-align-items-center">
                <div className="login-formwrap-left">
                  <h1>Admin Login</h1>
                  <Form onSubmit={LoginSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder={'email'}
                        // className={emailerror ? 'error' : 'border-default'}
                        name="email"
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3 position-relative"
                      controlId="formBasicPassword"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type={passwordShown ? 'text' : 'password'}
                        placeholder={'Password'}
                        // className={passworderror ? 'error' : 'border-default'}
                        name="password"
                      />
                      <span className="faEye-icon">
                        <i onClick={togglePasswordVisiblity}>
                          {passwordShown ? eye : eyeSlash}
                        </i>
                      </span>
                    </Form.Group>
                    <div className="text-end forgot-password-link">
                      <Link to="/forgot-password" className="btn btn-link">
                        Forgot Your Password?
                      </Link>
                    </div>

                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check type="checkbox" label={'Remember me'} />
                    </Form.Group>

                    {
                      error ?
                        <p className="error">
                          Wrong email and password
                        </p>
                        : <p className="success">Welcome to Check Raise</p>
                    }

                    <p className="success">Welcome to Check Raise</p>

                    <div className="d-flex justify-content-between justify-content-lg-center">
                      <Button
                        type="reset"
                        onClick={() => serError('')}
                        className="btn btn-link btn-link-cancel"
                      >
                        {' '}
                        Cancel
                      </Button>
                      <Button
                        className="btn btn-primary"
                        type='submit'

                      >
                        Login
                      </Button>
                    </div>
                  </Form>
                </div>
                <div className="login-formwrap-right d-none d-lg-flex align-items-center">
                  <Image src={logo} alt="Login Image" />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </main>
    </>
  )
}

export default AdminLogin
