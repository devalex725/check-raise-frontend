import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import logo from "./../../assets/images/logo.svg";
import zerogif from "./../../assets/images/0.gif";
import User from "./../../api/services/User";
import advertisingBanner from "./../../assets/images/advertisebanner.png";
import BannerService from "../../api/services/BannerService";
import MyProfileLeftNav from "../MyProfileLeftNav/MyProfileLeftNavManager";
import MyProfileLeftNavDirector from "../MyProfileLeftNav/MyProfileLeftNav";
import MyProfileLeftNavPlayers from "../MyProfileLeftNav/MyProfileLeftNavPlayers";
import MyProfileLeftNavAdmin from "../MyProfileLeftNav/MyProfieLeftAdmin";

const Header = () => {
  var adminlogin = JSON.parse(localStorage.getItem("user"));
  // Mobile left menu hide show canvas
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [topbanners, setTopBanner] = useState([]);
  const [topbannersSettings, setTopBannerSetting] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  //Creating a method to change the language onChange from select box
  const changeLanguageHandler = (e) => {
    const languageValue = e.target.value;
    i18n.changeLanguage(languageValue);
  };
  const [isManagerLogin, setIsManagerLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  //Creating a method to change the language onClick from Mobile menu
  const [selected, setSelected] = useState(0);
  const clickLanguageHandler = (divNum) => (e) => {
    setShow(false);
    const languageValue = e.target.getAttribute("data-value");
    i18n.changeLanguage(languageValue);
    setSelected(divNum);
  };

  const handleCloseRedirect = () => {
    setShow(false);
  };
  useEffect(() => {
    getTodayBanner();
    if (localStorage.getItem("usertoken")) {
      // navigate('/')
      setIsLogin(true);

      localStorage.getItem("usertype") === "Room Manager"
        ? setIsManagerLogin(true)
        : setIsManagerLogin(false);
    } else {
      if (localStorage.getItem("admintoken")) {
        setIsLogin(false);
        setIsAdmin(true);
        var adminlogin = JSON.parse(localStorage.getItem("adminuser"));
        if (adminlogin.username === "admin") {
          navigate("/admin/home");
        }
        // adminlogin.username === 'admin' ?
        //     setIsAdminLogin(true)
        //     :
        //     setIsAdminLogin(false)
      } else {
      }

      // navigate('/')
    }
  }, []);
  const getTodayBanner = async () => {
    try {
      const response = await BannerService.todayBanner(1).json();
      const bannerData = response.data;
      const settingData = response.settings;

      if (settingData[0].adv_top_banner) {
        bannerData.push({
          image: settingData[0].default_banner_top,
          rolling_time_top: settingData[0].rolling_time_top,
          url: settingData[0].default_banner_top_link,
        });
      }

      setTopBanner(bannerData);
      setTopBannerSetting(settingData);

      let rollingTime = 1000;
      if (settingData) {
        rollingTime = settingData[0].rolling_time_top * 1000;
      }

      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % response.data.length,
        );
      }, rollingTime);

      return () => clearInterval(interval);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = async () => {
    try {
      const data = await User.logout().json();
      console.log(data, "logout");
      localStorage.removeItem("usertoken");
      localStorage.removeItem("user");
      localStorage.removeItem("usertype");
      localStorage.removeItem("adminloginasuser");
      localStorage.removeItem("adminuser");
      localStorage.removeItem("admintoken");
      navigate("/");
      setIsLogin(false);

      /*if(data.status === true){
               navigate('/')
               setIsLogin(false)
            }*/
    } catch (error) {
      setIsLogin(false);
    }
  };

  // Toggle hamburger desktop and mobile
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const [isActive, setActive] = useState(false);
  const toggleClass = () => {
    setActive(!isActive);
  };

  const handleOutsideClick = (event) => {
    if (event === false) {
      setActive(false);
    } else {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        event.target !== buttonRef.current
      ) {
        setActive(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      {localStorage.getItem("adminloginasuser") === "adminloginasuser" ? (
        <div className="header-small">
          <div className="header-small-content">
            <p>Login as {adminlogin.email}</p>
          </div>
        </div>
      ) : (
        <></>
      )}

      <header className="header">
        <div className="header-wrapper">
          <div className="header-content">
            <NavLink to="/" className="logo">
              <img src={logo} width="100" height="50" alt=""/>
            </NavLink>

            <div className="header-left d-flex nav container justify-content-between align-items-center">
              <div className="burger-menu d-flex order-1 order-md-0">
                <span
                  className={
                    isActive
                      ? "jquery-toggle-mobile-nav hamburger-active"
                      : "jquery-toggle-mobile-nav"
                  }
                  onClick={toggleClass}
                  ref={buttonRef}
                >
                  <svg
                    width="18"
                    height="12"
                    viewBox="0 0 18 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 12C0.716667 12 0.479333 11.904 0.288 11.712C0.0960001 11.5207 0 11.2833 0 11C0 10.7167 0.0960001 10.4793 0.288 10.288C0.479333 10.096 0.716667 10 1 10H17C17.2833 10 17.5207 10.096 17.712 10.288C17.904 10.4793 18 10.7167 18 11C18 11.2833 17.904 11.5207 17.712 11.712C17.5207 11.904 17.2833 12 17 12H1ZM1 7C0.716667 7 0.479333 6.904 0.288 6.712C0.0960001 6.52067 0 6.28333 0 6C0 5.71667 0.0960001 5.479 0.288 5.287C0.479333 5.09567 0.716667 5 1 5H17C17.2833 5 17.5207 5.09567 17.712 5.287C17.904 5.479 18 5.71667 18 6C18 6.28333 17.904 6.52067 17.712 6.712C17.5207 6.904 17.2833 7 17 7H1ZM1 2C0.716667 2 0.479333 1.90433 0.288 1.713C0.0960001 1.521 0 1.28333 0 1C0 0.716667 0.0960001 0.479 0.288 0.287C0.479333 0.0956668 0.716667 0 1 0H17C17.2833 0 17.5207 0.0956668 17.712 0.287C17.904 0.479 18 0.716667 18 1C18 1.28333 17.904 1.521 17.712 1.713C17.5207 1.90433 17.2833 2 17 2H1Z"
                      fill="#F7F5F5"
                    ></path>
                  </svg>
                </span>

                <div className="mobile-navigation" ref={menuRef}>
                  <div className="d-flex flex-column justify-content-between">
                    <div className="mobile-nav-inner-wrapper">
                      <div className="mobile-nav-account d-flex flex-column align-items-center">
                        {isLogin ? (
                          <>
                            {isManagerLogin === false ? (
                              // <Link onClick={handleCloseRedirect} to="/player/my-profile" className='text-uppercase nav-header-register'>{t('My Profile')}</Link>
                              <>
                                <MyProfileLeftNavDirector
                                  data={isActive}
                                  parentCallback={handleOutsideClick}
                                />
                                <NavLink
                                  className="text-uppercase nav-header-register"
                                  onClick={() => handleLogout()}
                                >
                                  {t("menu.Logout")}
                                </NavLink>
                              </>
                            ) : (
                              <>
                                <MyProfileLeftNav
                                  data={isActive}
                                  parentCallback={handleOutsideClick}
                                />
                                {/* <Link onClick={handleCloseRedirect} to="/manager/my-tournaments" className='text-uppercase nav-header-register'>{t('My Profile')}</Link> */}

                                <NavLink
                                  className="text-uppercase nav-header-register"
                                  onClick={() => handleLogout()}
                                >
                                  {t("menu.Logout")}
                                </NavLink>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {isAdmin ? (
                              <>
                                {isAdminLogin === true ? (
                                  <>
                                    <MyProfileLeftNavAdmin
                                      data={isActive}
                                      parentCallback={handleOutsideClick}
                                    />
                                    {/* <NavLink className="text-uppercase nav-header-register" onClick={() => handleLogout()}>{t('Logout')}</NavLink> */}
                                  </>
                                ) : (
                                  <>
                                    {/* <Link onClick={handleCloseRedirect} to="/registration" className='text-uppercase nav-header-register'>{t('registration')}</Link>
                                                                                    <span className='login-info-wrapper'>Already have an account?</span>
                                                                                    <Link onClick={handleCloseRedirect} to="/logIn" className='nav-header-login'>{t('Login')}</Link> */}
                                  </>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                            {!isAdmin ? (
                              <>
                                <Link
                                  onClick={() => setActive(false)}
                                  to="/registration"
                                  className="text-uppercase nav-header-register"
                                >
                                  {t("menu.Registration")}
                                </Link>
                                <span className="login-info-wrapper">
                                  {t("menu.Already have an account?")}
                                </span>
                                <Link
                                  onClick={() => setActive(false)}
                                  to="/logIn"
                                  className="nav-header-login"
                                >
                                  {t("menu.Login")}
                                </Link>
                                {/* <Link

                                                                        to="/admin/login" className='nav-header-login'>{t('Admin Login')}</Link> */}
                              </>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </div>
                      <div className="mobile-nav-items ">
                        <NavLink
                          onClick={() => setActive(false)}
                          className="nav-link text-uppercase"
                          to="/"
                        >
                          {t("menu.Tournaments")}
                        </NavLink>
                        <NavLink
                          onClick={() => setActive(false)}
                          className="nav-link text-uppercase"
                          to="/info"
                        >
                          {t("menu.Info")}
                        </NavLink>
                        <NavLink
                          onClick={() => setActive(false)}
                          className="nav-link text-uppercase"
                          to="/advertising"
                        >
                          {t("menu.Advertising")}
                        </NavLink>
                        <NavLink
                          onClick={() => setActive(false)}
                          className="nav-link text-uppercase"
                          to="/contact"
                          // to="mailto:info@check-raise.ch"
                        >
                          {t("menu.Contact")}
                        </NavLink>
                      </div>
                    </div>
                    <div className="lang-wrapper-mobile">
                      <ul className="list-unstyled lang-list">
                        <li onClick={() => setActive(false)}>
                          <span
                            className={`lang text-uppercase ${
                              selected === 1 ? "lang--active" : ""
                            }`}
                            data-value="fr"
                            onClick={clickLanguageHandler(1)}
                          >
                            FR
                          </span>
                        </li>
                        <li onClick={() => setActive(false)}>
                          <span
                            className={`lang text-uppercase ${
                              selected === 2 ? "lang--active" : ""
                            }`}
                            data-value="de"
                            onClick={clickLanguageHandler(2)}
                          >
                            DE
                          </span>
                        </li>
                        <li onClick={() => setActive(false)}>
                          <span
                            className={`lang text-uppercase ${
                              selected === 3 ? "lang--active" : ""
                            }`}
                            data-value="en"
                            onClick={clickLanguageHandler(3)}
                          >
                            EN
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="advertising-banner px-3 order-0 order-md-1">
                {topbannersSettings.length > 0 &&
                topbannersSettings[0].adv_top_banner == 1 ? (
                  topbanners.length > 0 ? (
                    <a
                      href={`https://${topbanners[currentImageIndex].url}`}
                      target="_blank"
                    >
                      <img
                        className="image divImg"
                        src={zerogif}
                        alt="Changing Image"
                        width="500"
                        height="50"
                        style={{
                          backgroundImage:
                            "url(" +
                            process.env.REACT_APP_BANNER_IMAGE_URL +
                            "" +
                            topbanners[currentImageIndex].image +
                            ")",
                        }}
                      />
                    </a>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </div>

              {/* <NavLink className="nav-link" to="/">{t('Tournaments')}</NavLink>  */}
              {/* 
                            <NavLink className="nav-link"
                                // to="/info" 
                                onClick={() => {
                                    window.open("/info", "_blank", "noreferrer")
                                }}>{t('Info')}</NavLink> */}

              {/* <NavLink className="nav-link" to="/contact">{t('Contact')}</NavLink> */}
            </div>
            {/* <Nav className='header-right ms-auto d-none d-md-flex nav'>
                            {
                                isLogin ?
                                    <>
                                        {
                                            isManagerLogin === false ?
                                                <NavLink className="nav-link my-profile"

                                                    to="/director/all-tournaments"
                                                >{t('My Profile')}</NavLink>
                                                :
                                                <NavLink className="nav-link my-profile"
                                                    to="/manager/my-tournaments"
                                                >{t('My Profile')}</NavLink>
                                        }

                                        <NavLink className="nav-link" onClick={() => handleLogout()}>{t('Logout')}</NavLink>


                                    </>
                                    :
                                    <>
                                        <NavLink className="nav-link" to="/registration">{t('Registration')}</NavLink>
                                        <span>/</span>
                                        <NavLink className="nav-link" to="/logIn">{t('login')}</NavLink>
                                    </>

                            }


                            <select className="custom-select" onChange={changeLanguageHandler}>
                                <option value="en" >EN</option>
                                <option value="fr" >FR</option>
                                <option value="de" >DE</option>
                            </select>
                            
                        </Nav> */}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
