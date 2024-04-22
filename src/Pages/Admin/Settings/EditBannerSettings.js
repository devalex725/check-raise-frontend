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
  Modal,
} from 'react-bootstrap';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import AdminSettingService from '../../../api/services/AdminService/AdminSettingService';

const EditSettings = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [isActive, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [keyData, setKeyData] = useState('');
  const [perDay, setPerDay] = useState('');
  const [discount, setDiscount] = useState('');
  const [rollingBanner, setRollingBanner] = useState('');
  const [rollingName, setRollingName] = useState('');
  const [desktopInterval, setDesktopInterval] = useState(0);
  const [mobileInterval, setMobileInterval] = useState(0);
  const [errors, setErrors] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };

  useEffect(() => {
    const id = params.id;
    if (localStorage.getItem('admintoken')) {
      getNotificationList(id);
    } else {
      navigate('/');
    }
  }, []);

  const getNotificationList = async () => {
    try {
      const responseData = await AdminSettingService.adminIndex().json();
      let getsettingresponse = await AdminSettingService.SettingIndex().json();
      let getdata = responseData.data.filter(function (item) {
        return item.id == params.id;
      });

      setKeyData(getdata[0].key);
      setDiscount(getdata[0].discount);
      setPerDay(getdata[0].perday);
      if (getdata[0].key === "top_banner") {
        setRollingBanner(getsettingresponse.data[0].rolling_time_top);
        setRollingName('top');
      } else if (getdata[0].key === "bottom_banner") {
        setRollingBanner(getsettingresponse.data[0].rolling_time_bottom);
        setRollingName('bottom');
        setDesktopInterval(getsettingresponse.data[0].bottom_desktop_interval);
        setMobileInterval(getsettingresponse.data[0].bottom_mobile_interval);
      } else {
        setRollingBanner('');
      }
      setIsLoading(false);
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const userData = {
        perday: perDay,
        discount: discount,
      };
      const rollingdata = {
        rolling_time: rollingBanner,
      };
      if (rollingBanner === '') {

      } else {
        const rollingapi = await AdminSettingService.rollingtimeupdate(1, rollingName, rollingdata).json();
        await AdminSettingService.updateBannerInterval('bottom', {
          desktop_interval: desktopInterval,
          mobile_interval: mobileInterval,
        });
      }

      const data = await AdminSettingService.update(params.id, userData).json();

      if (data.status === true) {
        setModalShow(true);
        setModalMessage(data.msg);
        setErrors('');

      }
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();

        setErrors(errorJson.message);
      }

    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className=" d-inline-block d-lg-none p-2" onClick={toggleClass}>
          <FontAwesomeIcon icon={faBars}/>
        </Link>
        <h1 className="ms-2">Edit Setting</h1>
      </nav>
      <main>
        <div className="wrapper contact-wrapper">
          <Container>
            <Row>
              <Col lg={12}>

                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={12}>
                        <Form onSubmit={handleUpdate}>

                          <h3>
                            {
                              keyData === "top_banner"
                                ?
                                "Top Banner"
                                : ''
                            }
                            {
                              keyData === "bottom_banner"
                                ?
                                "Central Banner"
                                : ''
                            }
                            {
                              keyData === "premium_tournament"
                                ?
                                "  Premium Tournament"
                                : ''
                            }
                          </h3>
                          <Form.Group className="form-group" controlId="">
                          </Form.Group>
                          {/* <Form.Group className="form-group" controlId="">
                                                            <Form.Label>{t('page.myprofile.myprofilenav.Newsletters.Title')}</Form.Label>
                                                            <Form.Control type="key"
                                                                className=''
                                                                defaultValue={keyData}
                                                                disabled
                                                            />
                                                        </Form.Group> */}
                          <Form.Group className="form-group" controlId="">
                            <Form.Label>{t('page.myprofile.myprofilenav.Newsletters.Credit per week')}</Form.Label>
                            <Form.Control onWheel={(e) => e.target.blur()} type="number"
                                          className=""
                                          defaultValue={perDay}
                                          onChange={(event) => setPerDay(event.target.value)}
                            />
                          </Form.Group>
                          <Form.Group className="form-group" controlId="">
                            <Form.Label>{t('page.myprofile.myprofilenav.Newsletters.Maximum number')}</Form.Label>
                            <Form.Control onWheel={(e) => e.target.blur()} type="number"
                                          className=""
                                          defaultValue={discount}
                                          onChange={(event) => setDiscount(event.target.value)}
                            />
                          </Form.Group>
                          {
                            rollingBanner === '' ?
                              ''
                              :
                              <Form.Group className="form-group" controlId="">
                                <Form.Label>{t('page.myprofile.myprofilenav.Newsletters.Banner Rolling in time(in seconds)')}</Form.Label>
                                <Form.Control onWheel={(e) => e.target.blur()} type="number"
                                              className=""
                                              defaultValue={rollingBanner}
                                              onChange={(event) => setRollingBanner(event.target.value)}
                                />
                              </Form.Group>
                          }
                          {rollingName === 'bottom'
                            ? (<>
                              <Form.Group className="form-group">
                                <Form.Label>Desktop Banner interval</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={desktopInterval}
                                  onChange={(event) => setDesktopInterval(event.target.value)}
                                />
                              </Form.Group>
                              <Form.Group className="form-group">
                                <Form.Label>Mobile Banner interval</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={mobileInterval}
                                  onChange={(event) => setMobileInterval(event.target.value)}
                                />
                              </Form.Group>
                            </>)
                            : ''
                          }

                          <p className="error">{errors}</p>
                          <Row className="mt-2">

                            <Col sm={12} className="text-end">
                              <Button type="submit"
                                      className=" btn btn-primary btn-submit">{t('page.myprofile.myprofilenav.Newsletters.Save')}</Button>
                            </Col>
                          </Row>

                        </Form>

                      </Col>

                    </Row>
                  </Card.Body>
                </Card>
                {/* </div>   */}
              </Col>
            </Row>
          </Container>
        </div>
      </main>
      {isLoading && <LogoAnimationLoader/>}
      {modalShow ? (
        <Modal show={modalShow}>
          <>
            <Modal.Header>
              <Modal.Title>Saved</Modal.Title>
            </Modal.Header>

            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {

                  setModalShow(false);
                  navigate('/admin/advertisesetting');
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
  );
};

export default EditSettings;
