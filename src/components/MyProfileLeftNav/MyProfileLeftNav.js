import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import MyProfileLeftNavPlayers from './MyProfileLeftNavPlayers';


const MyProfileLeftNavDirector = (props) => {
    const { t } = useTranslation();
    //assigning location variable
    const location = useLocation();
    //destructuring pathname from location
    const { pathname } = location;
    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/director/");
    const navigate = useNavigate();
    const [isPlayerLogin, setIsPlayerLogin] = useState(true);
    const [isActive, setActive] = useState(false);
    useEffect(() => {

        if (localStorage.getItem('usertoken')) {


            localStorage.getItem('usertype') === 'Player' ?
                setIsPlayerLogin(true)
                :
                setIsPlayerLogin(false)
        } else {

            navigate('/')
        }

    }, [navigate]);
    return (
        <>
            {
                isPlayerLogin === true ?
                    <div className='list-group' >
                        <div className='menu-admin-container'>

                            <ul className='menu'>
                                <li className={splitLocation[1] === "my-profile" ? "active" : ""}>
                                    <Link to="/player/my-profile" onClick={() => props.parentCallback(isActive)}>{t('menu.My Profile')}</Link>
                                </li>
                            </ul>
                        </div></div>
                    // <MyProfileLeftNavPlayers />
                    :
                    <div className='list-group'>
                        <div className='menu-admin-container'>
                            <ul className='menu'>
                                <li className={splitLocation[1] === "all-tournaments" ? "active" : ""} >
                                    <Link to="/director/all-tournaments" onClick={() => props.parentCallback(isActive)}>{t('menu.All tournaments')}</Link>
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
            }


        </>
    );
};

export default MyProfileLeftNavDirector;