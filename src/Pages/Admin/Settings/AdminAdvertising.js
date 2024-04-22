import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Modal, Button, Table, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

import './Settings.scss';
import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import AdminSettingService from '../../../api/services/AdminService/AdminSettingService';
import {
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const bannerTitle = {
  top_banner: 'Top Banner',
  bottom_banner: 'Central  Banner',
  premium_tournament: 'Premium Tournament',
};

const AdminAdvertiseSetting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const imageUrl = process.env.REACT_APP_BANNER_IMAGE_URL;
  const [settingTable, setSettingTable] = useState([]);
  const [settingList, setSettingList] = useState([]);
  const [topBanner, setTopBanner] = useState(0);
  const [bottomBanner, setBottomBanner] = useState(0);
  const [rollingTop, setRollingTop] = useState('');
  const [rollingBottom, setRollingBottom] = useState('');
  const [bottomDesktopInterval, setBottomDesktopInterval] = useState('');
  const [bottomMobileInterval, setBottomMobileInterval] = useState('');
  const [premiumBanner, setPremiumBanner] = useState(0);
  const [topActionBanner, setTopActionBanner] = useState(0);
  const [bottomActionBanner, setBottomActionBanner] = useState(0);
  const [paypal, setPaypal] = useState(0);
  const [errors, setErrors] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalShown, setModalShown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [importBanner, setImportBanner] = useState(0);
  const [englishLanguage, setEnglishLanguage] = useState('');
  const [FrenchLanguage, setFrenchLanguage] = useState('');
  const [DutchLanguage, setDutchLanguage] = useState('');
  const [file, setFile] = useState('');
  const [centralImage, setCentralImage] = useState('');

  useEffect(() => {
    if (localStorage.getItem('admintoken')) {
      getSettingList();
      getSettingListBanner();
    } else {
      navigate('/');
    }
  }, []);

  const getSettingList = async () => {
    try {
      const settingsResponse = await AdminSettingService.SettingIndex().json();
      setSettingList(settingsResponse.data);
      setTopActionBanner(settingsResponse.data[0].adv_top_banner);

      setTopBanner(settingsResponse.data[0].is_display_default_banner_top);
      setImportBanner(settingsResponse.data[0].is_important_message_banner);
      setBottomActionBanner(settingsResponse.data[0].adv_bottom_banner);
      setBottomBanner(settingsResponse.data[0].is_display_default_banner_bottom);
      setPremiumBanner(settingsResponse.data[0].is_premium_tournament);
      setEnglishLanguage(settingsResponse.data[0].en_msg_banner);
      setFrenchLanguage(settingsResponse.data[0].fr_msg_banner);
      setDutchLanguage(settingsResponse.data[0].db_msg_banner);
      setRollingTop(settingsResponse.data[0].rolling_time_top);
      setRollingBottom(settingsResponse.data[0].rolling_time_bottom);
      setBottomDesktopInterval(settingsResponse.data[0].bottom_desktop_interval);
      setBottomMobileInterval(settingsResponse.data[0].bottom_mobile_interval);
      setPaypal(settingsResponse.data[0].is_paypal);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setErrors(errorJson.message);
      }
    }
  };

  const getSettingListBanner = async () => {
    try {
      const responseData = await AdminSettingService.adminIndex().json();
      setSettingTable(responseData.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setErrors(errorJson.message);
      }
    }
  };

  const handleSettingMessageBanner = async (event) => {
    event.preventDefault();
    try {
      const userData = {
        is_important_message_banner: importBanner,
        en_msg_banner: englishLanguage ? englishLanguage : settingList[0].en_msg_banner,
        fr_msg_banner: FrenchLanguage ? FrenchLanguage : settingList[0].fr_msg_banner,
        db_msg_banner: DutchLanguage ? DutchLanguage : settingList[0].db_msg_banner,
        adv_top_banner: settingList[0].adv_top_banner,
        adv_bottom_banner: settingList[0].adv_bottom_banner,
        is_premium_tournament: settingList[0].is_premium_tournament,
        is_paypal: paypal,
        paypal_link: event.target.paypal_link.value ? event.target.paypal_link.value : settingList[0].paypal_link,

        top_banner_credit: settingList[0].top_banner_credit,
        top_banner_credit_discount: settingList[0].top_banner_credit_discount,
        bottom_banner_credit: settingList[0].bottom_banner_credit,
        bottom_banner_credit_discount: settingList[0].bottom_banner_credit_discount,
        premium_banner_credit: settingList[0].premium_banner_credit,
        premium_banner_credit_discount: settingList[0].premium_banner_credit_discount,
        is_banner_0: settingList[0].is_banner_0,
        is_banner_1: settingList[0].is_banner_1,
        is_banner_2: settingList[0].is_banner_2,
        is_banner_3: settingList[0].is_banner_3,
        default_banner_bottom: centralImage ? centralImage.split(',')[1] : '',
        default_banner_bottom_link: event.target.default_banner_bottom_link.value ? event.target.default_banner_bottom_link.value : '',
        default_banner_top: file ? file.split(',')[1] : '',
        default_banner_top_link: event.target.default_banner_top_link.value ? event.target.default_banner_top_link.value : "",
        rolling_time_bottom: settingList[0].rolling_time_bottom,
        rolling_time_top: settingList[0].rolling_time_top,
      };

      const data = await AdminSettingService.Settingupdate(settingList[0].id, userData).json();

      if (data.status === true) {
        setModalShown(true);
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

  function handleChangeImage(e) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);

    fileReader.onload = () => {
      const image = fileReader.result;
      setFile(image);
    };
  }

  function handleChangeImage1(e) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);

    fileReader.onload = () => {
      const image = fileReader.result;
      setCentralImage(image);
    };

  }

  const handleDefaultBanner = async (slug) => {
    const data = await AdminSettingService.defaultbanner(settingList[0].id, slug).json();
    setModalShown(true);
    setModalMessage(data.msg);
  };

  const handleAction = async (slug) => {
    const data = await AdminSettingService.actionbanner(settingList[0].id, slug).json();
    setModalShown(true);
    setModalMessage(data.msg);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between p-2">
        <Link className="d-inline-block d-lg-none p-2">
          <FontAwesomeIcon icon={faBars}/>
        </Link>
        <h1 className="ms-2">Settings Page</h1>
      </nav>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={12}>
            <Card>
              <Card.Header>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className="me-1">
                  <path
                    d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z"/>
                </svg>
                Banner Settings
              </Card.Header>
              <Card.Body>
                <Form>
                  <Table responsive>
                    <thead>
                    <tr>
                      <th className="width-auto text-center">
                      </th>
                      <th className="width-auto text-center">
                        Credit per week
                      </th>
                      <th className="width-auto text-center">
                        Maximum number
                      </th>
                      <th className="width-auto text-center">
                        Display default banner
                      </th>
                      <th className="width-auto text-center">
                        Banner Rolling time (in seconds)
                      </th>
                      <th className="width-auto text-center">
                        Desktop Banner intervals
                      </th>
                      <th className="width-auto text-center">
                        Mobile Banner intervals
                      </th>
                      <th className="width-auto text-center">
                        Edit
                      </th>
                      <th className="width-auto text-center">
                        Active
                      </th>
                    </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center', justifyContent: 'center' }}>
                    {settingTable.map((element, i) => (
                      <tr key={i}>
                        <td>{bannerTitle[element.key]}</td>
                        <td>{element.perday}</td>
                        <td>{element.discount}</td>
                        <td>
                          {element.key === "top_banner"
                            ? <div className="d-flex justify-content-center">
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                label=""
                                name="top"
                                checked={!!topBanner}
                                value={topBanner}
                                onChange={() => {
                                  setTopBanner(topBanner ? 0 : 1);
                                }}
                                onClick={() => handleDefaultBanner('top')}
                              />
                            </div>
                            : ''
                          }
                          {element.key === "bottom_banner"
                            ? <div className="d-flex justify-content-center">
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                label=""
                                checked={!!bottomBanner}
                                value={bottomBanner}
                                onChange={() => {
                                  setBottomBanner(bottomBanner ? 0 : 1);
                                }}
                                onClick={() => handleDefaultBanner('bottom')}
                              />
                            </div>
                            : ''
                          }
                        </td>
                        <td>
                          {element.key === "top_banner"
                            ? rollingTop
                            : ''
                          }
                          {element.key === "bottom_banner"
                            ? rollingBottom
                            : ''
                          }
                        </td>
                        <td>
                          {element.key === "bottom_banner"
                            ? bottomDesktopInterval
                            : ''
                          }
                        </td>
                        <td>
                          {element.key === "bottom_banner"
                            ? bottomMobileInterval
                            : ''
                          }
                        </td>
                        <td>
                          <Link className="action-link green-link mb-1" to={`/admin/editsetting/${element.id}`}>
                            Edit
                          </Link>
                        </td>
                        <td>
                          {
                            element.key === "premium_tournament"
                              ?
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                label=""
                                checked={premiumBanner}
                                value={premiumBanner}
                                onChange={() => {
                                  setPremiumBanner(premiumBanner ? 0 : 1);
                                }}
                                onClick={() => handleAction('premium')}
                              />
                              : ''}
                          {element.key === "top_banner"
                            ?
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                              label=""
                              checked={topActionBanner}
                              value={topActionBanner}
                              onChange={() => {
                                setTopActionBanner(topActionBanner ? 0 : 1);
                              }}
                              onClick={() => handleAction('top')}
                            />
                            : ''}
                          {
                            element.key === "bottom_banner"
                              ?
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                label=""
                                checked={bottomActionBanner}
                                value={bottomActionBanner}
                                onChange={() => {
                                  setBottomActionBanner(bottomActionBanner ? 0 : 1);
                                }}
                                onClick={() => handleAction('bottom')}
                              />
                              : ''}
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="my-5">
          <Col md={12}>
            <Card>
              <Card.Header>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className="me-1">
                  <path
                    d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z"/>
                </svg>
                Default Banners
              </Card.Header>
              <Card.Body>
                {settingList.map((element, i) => (
                  <Form
                    key={i}
                    // onSubmit={handleSetting}
                    onSubmit={handleSettingMessageBanner}
                  >
                    <Form.Group className="form-group" controlId="">
                      <Form.Group className="border-bottom form-group" controlId="">
                        <Form.Label>Top Banner</Form.Label>
                        <Form.Control type="text" name="default_banner_top_link"
                                      defaultValue={element.default_banner_top_link
                                      } placeholder="Top Banner" className=""/>
                        &nbsp;
                        <Form.Control type="file" name="toplogo" placeholder="" className=""
                                      onChange={handleChangeImage}/>
                        <Image
                          id="canvas"
                          src={
                            file ? file : imageUrl + element.default_banner_top
                          }
                          fluid
                        />
                      </Form.Group>

                      <Form.Group className="border-bottom form-group" controlId="">
                        <Form.Label>Central Banner</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={element.default_banner_bottom_link}
                          name="default_banner_bottom_link"
                          placeholder="Central Banner"
                          className=""
                        />
                        &nbsp;
                        <Form.Control
                          type="file"
                          name="Centrallogo"
                          placeholder=""
                          className=""
                          onChange={handleChangeImage1}
                        />
                        <Image
                          id="canvas"
                          src={
                            centralImage ? centralImage : imageUrl + element.default_banner_bottom
                          }
                          fluid
                        />
                      </Form.Group>

                      <Form.Group className="border-bottom form-group" controlId="">
                        <Form.Label>Paypal</Form.Label>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          label=""
                          checked={paypal}
                          value={paypal}
                          onChange={(e) => {
                            setPaypal(e.target.checked ? 1 : 0);
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="" controlId="" style={{ marginTop: 20 }}>
                        <Form.Label>Paypal Link</Form.Label>
                        <Form.Check
                          type="text"
                          name="paypal_link"
                          defaultValue={element.paypal_link}
                        />
                      </Form.Group>
                    </Form.Group>
                    <Col sm={12} className="text-end">
                      <Button type="submit" className="btn btn-primary btn-submit">
                        {t('page.myprofile.myprofilenav.Newsletters.Save')}
                      </Button>
                    </Col>
                  </Form>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {isLoading && <LogoAnimationLoader/>}

      <Modal show={modalShown}>
        <Modal.Header>
          <Modal.Title>Saved</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {

              setModalShown(false);
              navigate('/admin/advertisesetting');
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminAdvertiseSetting;