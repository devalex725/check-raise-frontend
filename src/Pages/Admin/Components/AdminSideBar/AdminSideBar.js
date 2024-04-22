import React, { useState, useEffect, useRef } from 'react';
import '../../AdminSide.scss'
import { Image, NavDropdown } from 'react-bootstrap';

import {
  Link,
  NavLink,
  useNavigate,
  useLocation
} from 'react-router-dom';

import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminUser from '../../../../api/services/AdminService/AdminUser';
const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/admin/");

  const handleLogout = async () => {

    try {

      const data = await AdminUser.logout().json();
      localStorage.removeItem("usertoken");
      localStorage.removeItem("user");
      localStorage.removeItem("usertype");
      localStorage.removeItem("adminloginasuser")
      localStorage.removeItem("adminuser");
      localStorage.removeItem("admintoken");
      // navigate('/admin/login');
      navigate('/');
      //  if(data.status === true)
      //  {

      //     localStorage.removeItem("admintoken");
      //     localStorage.removeItem("adminuser");
      //     navigate('/admin/login')

      //  }

    } catch (error) {
      console.log(error)
    }
  }
  // Toggle hamburger desktop and mobile
  const menuRef = useRef(null);
  const buttonRef = useRef(null);


  const [isActive, setActive] = useState(false);
  const toggleClass = () => {
    setActive(!isActive);
  };

  const handleOutsideClick = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      event.target !== buttonRef.current
    ) {
      setActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  return (
    <>
      <Link to="admin/home" className='logo'>
        <Image
          src={require('../../../../assets/images/logo_large.png')}
          fluid
        />
      </Link>
      <div className='header-left d-flex nav container justify-content-between align-items-center'>
        <div className="burger-menu d-flex order-1 order-md-0">
          <span className={isActive ? 'jquery-toggle-mobile-nav hamburger-active' : 'jquery-toggle-mobile-nav'} onClick={toggleClass} ref={buttonRef}>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12C0.716667 12 0.479333 11.904 0.288 11.712C0.0960001 11.5207 0 11.2833 0 11C0 10.7167 0.0960001 10.4793 0.288 10.288C0.479333 10.096 0.716667 10 1 10H17C17.2833 10 17.5207 10.096 17.712 10.288C17.904 10.4793 18 10.7167 18 11C18 11.2833 17.904 11.5207 17.712 11.712C17.5207 11.904 17.2833 12 17 12H1ZM1 7C0.716667 7 0.479333 6.904 0.288 6.712C0.0960001 6.52067 0 6.28333 0 6C0 5.71667 0.0960001 5.479 0.288 5.287C0.479333 5.09567 0.716667 5 1 5H17C17.2833 5 17.5207 5.09567 17.712 5.287C17.904 5.479 18 5.71667 18 6C18 6.28333 17.904 6.52067 17.712 6.712C17.5207 6.904 17.2833 7 17 7H1ZM1 2C0.716667 2 0.479333 1.90433 0.288 1.713C0.0960001 1.521 0 1.28333 0 1C0 0.716667 0.0960001 0.479 0.288 0.287C0.479333 0.0956668 0.716667 0 1 0H17C17.2833 0 17.5207 0.0956668 17.712 0.287C17.904 0.479 18 0.716667 18 1C18 1.28333 17.904 1.521 17.712 1.713C17.5207 1.90433 17.2833 2 17 2H1Z" fill="#F7F5F5"></path></svg>
          </span>
          <div className='mobile-navigation' style={{ left: 0, right: 'auto' }} ref={menuRef}>
            <nav id="sidebar" className="d-flex justify-content-between flex-column">
              <div>

                <ul className="list-unstyled components menu">

                  <li>
                    <NavLink className={splitLocation[1] === "tournament" ? "nav-link active" : ""} to="/admin/tournament" onClick={() => setActive(false)}>
                      All Tournaments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/admin/room" onClick={() => setActive(false)}>
                      All Rooms
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/admin/player" onClick={() => setActive(false)}>
                      All Players
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/admin/player-statistics" onClick={() => setActive(false)}>
                      Players Statistics
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/admin/rooms-statistics" onClick={() => setActive(false)}>
                      Room Statistics
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/admin/emaillogs" onClick={() => setActive(false)}>
                      E-mail log
                    </NavLink>
                  </li>
                  <li className={splitLocation[1] === "admin/user/Admin" ? "nav-link active nav-link-custom" : "nav-link-custom"}>
                    <Link to="#">Users</Link>
                    <ul title="Users" id="basic-nav-dropdown-1" className="dropdown-menu d-block" >
                      <li><Link to="/admin/user/Admin" onClick={() => setActive(false)}>Admin</Link></li>
                      <li><Link to="/admin/user/Room Manager" onClick={() => setActive(false)}>Manager</Link></li>
                      <li><Link to="/admin/user/Director" onClick={() => setActive(false)}>Director</Link></li>
                      <li><Link to="/admin/user/Player" onClick={() => setActive(false)}>Players</Link></li>
                    </ul>

                  </li>
                  <li>
                    <NavLink to="/admin/pages">
                      Pages
                    </NavLink>
                  </li>
                  <li className={splitLocation[1] === "admin/user/Admin" ? "nav-link active nav-link-custom" : "nav-link-custom"}>
                    <Link to="#">Settings</Link>
                    <ul title="Users" id="basic-nav-dropdown-1" className="dropdown-menu d-block" >
                      {/* <li><Link to="/admin/bannersetting" onClick={() => setActive(false)}>Banner Setting</Link></li> */}
                      <li><Link to="/admin/advertisesetting" onClick={() => setActive(false)}>Advertising Settings</Link></li>
                      {/* <li><Link to="/admin/settings" onClick={() => setActive(false)}>Settings</Link></li> */}
                      <li><Link to="/admin/setting" onClick={() => setActive(false)}>Message Banner</Link></li>
                    </ul>

                  </li>

                </ul>
              </div>

              <ul
                className="list-unstyled components logout-ul mb-0 pb-0"
                onClick={() => handleLogout()}

              >
                <li >
                  <Link className="nav-link d-flex align-items-center">
                    <FontAwesomeIcon icon={faPowerOff} className="me-2" /> Logout
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>


    </>
  )
}

export default AdminSideBar
