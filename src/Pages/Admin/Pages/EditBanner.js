import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal, Image } from 'react-bootstrap';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import moment from 'moment';

import LogoAnimationLoader from '../../../components/Loading/LogoAnimationLoader';
import AdminBannerService from "../../../api/services/AdminService/AdminBannerService";
import adminBannerService from "../../../api/services/AdminService/AdminBannerService";
import RoomService from "../../../api/services/RoomService";

const AdminEditBanner = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [banner, setBanner] = useState({});
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState('');
  const [dateRange, setDateRange] = useState({
      startDate: setHours(setMinutes(new Date(), 30), 16),
    },
  );
  const Location = [
    { value: '1', label: 'Top' },
    { value: '2', label: 'Center' },
  ];

  useEffect(() => {
    getBanner();
    getRooms();
  }, []);

  const getBanner = async () => {
    try {
      const responseData = await AdminBannerService.show(params.id).json();
      setBanner(responseData.data);

      const selectedLocation = Location.filter(function (item) {
        return item.value === responseData.data.location.toString();
      });
      setLocation(selectedLocation);
      setDateRange({ ...dateRange, startDate: new Date(responseData.data.startdate) });
      setRoomId(responseData.data.room_id);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        console.error(errorJson);
      }
    }
  };

  const getRooms = async () => {
    try {
      const responseData = await RoomService.getAllRoom({
        status: [1, 2], // only get active, deactivated room: ticket 61
      }).json();
      setRooms(responseData.data);
    } catch (error) {
      console.log(error);
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

  const handleChangeLocation = location => {
    setLocation(location);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const postData = {
        startdate: moment(dateRange.startDate).format('YYYY-MM-DD HH:mm'),
        image: file ? file : '',
        location: location.value ? location.value : banner.location,
        url: event.target.url.value,
        room_id: roomId,
      };

      const data = await adminBannerService.update(params.id, postData).json();

      setModalShow(true);
      setModalMessage(data);
    } catch (error) {
      console.error(error);
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        console.error(errorJson);
      }
    }
  };

  return (
    <>
      <div className="wrapper my-profile-wrapper">
        <Row className="my-5">
          <Col md={10} lg={12}>
            <Card>
              <Card.Header>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff" className="me-1">
                  <path
                    d="M448 64c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32z"/>
                </svg>
                <Link to="/admin/pages/banners">Banners</Link> <FontAwesomeIcon icon={faArrowRight}/> Edit banner
              </Card.Header>
              <Card.Body>
                <Link to="/admin/pages/banners">Back</Link>
                <Form onSubmit={onSubmitHandler}>
                  <Row>
                    <Col md={6} className="without-date-calander">
                      <Form.Group className="mb-3 form-group">
                        <Form.Label>Date*</Form.Label>
                        <DatePicker
                          selected={dateRange.startDate}
                          onChange={(date) => setDateRange({ ...dateRange, startDate: date, endDate: date })}
                          name="startdate"
                          filterDate={(date) => date.getDay() === 1}
                          injectTimes={[
                            setHours(setMinutes(new Date(), 1), 0),
                            setHours(setMinutes(new Date(), 5), 12),
                            setHours(setMinutes(new Date(), 59), 23),
                          ]}
                          dateFormat="dd.MM.yyyy HH:mm"
                          calendarStartDay={1}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group mb-3">
                        <Form.Label>Room *</Form.Label>
                        <Form.Select value={roomId} onChange={e => setRoomId(e.target.value)}>
                          {rooms.map(room => (
                            <option key={room.id} value={room.id}>{room.title}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3 form-group">
                        <Form.Label>Banner Location</Form.Label>
                        <Select
                          options={Location}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          value={location}
                          onChange={handleChangeLocation}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3 form-group">
                        <Form.Label>URL*</Form.Label>
                        <Form.Control type="text" name="url" className="" defaultValue={banner.url}/>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3 form-group" controlId="">
                        <Form.Label>Logo<span className="required">*</span></Form.Label>
                        <div className="image-wrap">
                          <Form.Control
                            type="file"
                            name="logo"
                            onChange={handleChangeImage}/>
                          <Image
                            id="canvas"
                            src={
                              file ? file : process.env.REACT_APP_BANNER_IMAGE_URL + banner.image
                            }
                            fluid
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={12} className="text-center mt-5">
                      <Button type="submit" className=" btn btn-primary btn-submit">Edit Banner</Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {isLoading && <LogoAnimationLoader/>}

      <Modal show={modalShow}>
        <Modal.Header>
          <Modal.Title>{modalMessage.status ? 'Saved' : 'Not saved'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage.message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModalShow(false);
              if (modalMessage.status) {
                navigate('/admin/pages/banners');
              }
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AdminEditBanner;