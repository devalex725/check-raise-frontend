// import React from 'react';
// // import '../../AdminSide.scss'
// import { Image, NavDropdown } from 'react-bootstrap';

// import {
//   Link,
//   Link,
//   useNavigate,
//   useLocation
// } from 'react-router-dom';

// import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// const MyProfileLeftNavAdmin = () => {

//     //assigning location variable
//     const location = useLocation();
//     //destructuring pathname from location
//     const { pathname } = location;
//     //Javascript split method to get the name of the path in array
//     const splitLocation = pathname.split("/admin/");

//     return (
//         <>
//              <div className='list-group'>
//                 <div className='menu-admin-container'>
//                     <ul className='menu'>
//                         <li>
//                             <Link className={splitLocation[1] === "tournament" ? "nav-link active" : ""} to="/admin/tournament">
//                                 All Tournaments
//                             </Link>
//                         </li>
//                         <li>
//                             <Link className="nav-link" to="/admin/room">
//                                 All Rooms
//                             </Link>
//                         </li>
//                         <li>
//                             <Link className="nav-link" to="/admin/player">
//                                 All Players
//                             </Link>
//                         </li>
//                         <li>
//                             <Link className="nav-link" to="/admin/player-statistics">
//                                 Players Statistics
//                             </Link>
//                         </li>
//                         <li>
//                             <Link className="nav-link" to="/admin/rooms-statistics">
//                                 Room Statistics
//                             </Link>
//                         </li>
//                         <li>
//                             <Link className="nav-link" to="/admin/emaillogs">
//                                 E-mail log

//                             </Link>
//                         </li>
//                         <li>
//                             <NavDropdown title="Users" id="basic-nav-dropdown">
//                                 <Link to="/admin/user/Admin">Admin</Link>
//                                 <Link to="/admin/user/Room Manager">Manager</Link>
//                                 <Link to="/admin/user/Director">Director</Link>
//                                 <Link to="/admin/user/Player">Players</Link>
//                             </NavDropdown>
//                         </li>
//                         <li>
//                             <Link to="/admin/pages">
//                                 Pages
//                             </Link>
//                         </li>
//                         <li>

//                             <NavDropdown title="Settings" id="basic-nav-dropdown">
//                                 <Link to="/admin/bannersetting">Banner Setting</Link>
//                                 <Link to="/admin/advertisesetting">Advertisement Setting</Link>
//                                 <Link to="/admin/settings">Settings</Link>
//                                 <Link to="/admin/setting">Banner Message</Link>
//                             </NavDropdown>
//                         </li>

//                     </ul>
//                 </div>
//             </div>

//         </>
//     );
// };

// export default MyProfileLeftNavAdmin;
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MyProfileLeftNavPlayers from "./MyProfileLeftNavPlayers";
import { Image, NavDropdown } from "react-bootstrap";

const MyprofileLeftAdmin = (props) => {
  const { t } = useTranslation();
  //assigning location variable
  const location = useLocation();
  //destructuring pathname from location
  const { pathname } = location;
  //Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/admin/");
  const navigate = useNavigate();
  const [isActive, setActive] = useState(false);

  return (
    <>
      <div className="list-group">
        <div className="menu-admin-container">
          <ul className="menu">
            <li
              className={
                splitLocation[1] === "tournament" ? "nav-link active" : ""
              }
            >
              <Link
                to="/admin/tournament"
                onClick={() => props.parentCallback(isActive)}
              >
                All Tournaments
              </Link>
            </li>
            <li
              className={splitLocation[1] === "room" ? "nav-link active" : ""}
            >
              <Link
                to="/admin/room"
                onClick={() => props.parentCallback(isActive)}
              >
                All Rooms
              </Link>
            </li>
            <li
              className={splitLocation[1] === "player" ? "nav-link active" : ""}
            >
              <Link
                to="/admin/player"
                onClick={() => props.parentCallback(isActive)}
              >
                All Players
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "player-statistics"
                  ? "nav-link active"
                  : ""
              }
            >
              <Link
                to="/admin/player-statistics"
                onClick={() => props.parentCallback(isActive)}
              >
                Players Statistics
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "room-statistics" ? "nav-link active" : ""
              }
            >
              <Link
                to="/admin/rooms-statistics"
                onClick={() => props.parentCallback(isActive)}
              >
                Room Statistics
              </Link>
            </li>
            <li>
              <Link
                to="/admin/emaillogs"
                onClick={() => props.parentCallback(isActive)}
              >
                E-mail log
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "admin/user/Admin"
                  ? "nav-link active nav-link-custom"
                  : "nav-link-custom"
              }
            >
              <Link to="#">Users</Link>
              <ul
                title="Users"
                id="basic-nav-dropdown-1"
                className="dropdown-menu"
              >
                <li>
                  <Link
                    to="/admin/user/Admin"
                    onClick={() => props.parentCallback(isActive)}
                  >
                    Admin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/user/Room Manager"
                    onClick={() => props.parentCallback(isActive)}
                  >
                    Manager
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/user/Director"
                    onClick={() => props.parentCallback(isActive)}
                  >
                    Director
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/user/Player"
                    onClick={() => props.parentCallback(isActive)}
                  >
                    Players
                  </Link>
                </li>
              </ul>
            </li>
            <li
              className={
                splitLocation[1] === "admin/pages" ? "nav-link active" : ""
              }
            >
              <Link
                to="/admin/pages"
                onClick={() => props.parentCallback(isActive)}
              >
                Pages
              </Link>
            </li>
            <li
              className={
                splitLocation[1] === "admin/user/Admin"
                  ? "nav-link active nav-link-custom"
                  : "nav-link-custom"
              }
            >
              <Link to="#">Setting</Link>
              <ul
                title="Settings"
                id="basic-nav-dropdown-1"
                className="dropdown-menu"
              >
                {/* <li><Link to="/admin/bannersetting" onClick={() => props.parentCallback(isActive)}>Banner Setting</Link></li> */}
                <li>
                  <Link
                    to="/admin/advertisesetting"
                    onClick={() => props.parentCallback(isActive)}
                  >
                    Advertisement Setting
                  </Link>
                </li>
                {/* <li><Link to="/admin/settings" onClick={() => props.parentCallback(isActive)}>Settings</Link></li> */}
                <li>
                  <Link
                    to="/admin/setting"
                    onClick={() => props.parentCallback(isActive)}
                  >
                    Message Banner
                  </Link>
                </li>
              </ul>
            </li>
            {/* <li className={splitLocation[1] === "my-profile" ? "active" : ""}>
                            <Link to="/edit-profile">{t('page.myprofile.myprofilenav.MyProfile')}</Link>
                        </li>
                        <li className={splitLocation[1] === "all-rooms" ? "active" : ""}>
                            <Link to="/all-rooms">{t('page.myprofile.myprofilenav.AllRooms')}</Link>
                        </li>
                        <li className={splitLocation[1] === "all-players" ? "active" : ""}>
                            <Link to="/all-players" >{t('page.myprofile.myprofilenav.AllPlayers')}</Link>
                        </li>
                        <li className={splitLocation[1] === "players-statistics" ? "active" : ""}>
                            <Link to="/players-statistics" >{t('page.myprofile.myprofilenav.PlayersStatistics')}</Link>
                        </li>
                        <li className={splitLocation[1] === "rooms-statistics" ? "active" : ""}>
                            <Link to="/rooms-statistics" >{t('page.myprofile.myprofilenav.RoomsStatistics')}</Link>
                        </li>
                        <li className={splitLocation[1] === "notifications" ? "active" : ""}>
                            <Link to="/notifications" >{t('page.myprofile.myprofilenav.notifi')}</Link>
                        </li>
                        <li className={splitLocation[1] === "newsletters" ? "active" : ""}>
                            <Link to="/newsletters" >{t('page.myprofile.myprofilenav.NewslettersTitle')}</Link>
                        </li> */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MyprofileLeftAdmin;
