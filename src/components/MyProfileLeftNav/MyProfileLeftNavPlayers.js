import React from 'react';
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';


const MyProfileLeftNavPlayers = () => {
    const { t } = useTranslation();
    //assigning location variable
    const location = useLocation();
    //destructuring pathname from location
    const { pathname } = location;
    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/player/");

    return (
        <>
            <div className='list-group'>
                <div className='menu-admin-container'>
                    
                    <ul className='menu'>
                        {/* <li className={splitLocation[1] === "my-tournaments" ? "active" : ""}>
                            <Link to="/player/my-tournaments" >{t('page.myprofile.myprofilenav.Mytournaments')}</Link>
                        </li> */}
                        <li className={splitLocation[1] === "my-profile" ? "active" : ""}>
                            <Link to="/player/my-profile">{t('menu.My Profile')}</Link>
                        </li>
                       
                        {/* <li className={splitLocation[1] === "notifications" ? "active" : ""}>
                            <Link to="/player/notifications">{t('page.myprofile.myprofilenav.notifi')}</Link>
                        </li> */}

                    </ul>
                </div>
            </div>

        </>
    );
};

export default MyProfileLeftNavPlayers;