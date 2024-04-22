import React, { useState} from 'react';
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from './../../assets/images/logo.svg';

const Footer = () => {
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(0);
    const { t, i18n } = useTranslation();
    const clickLanguageHandler = (divNum) => (e) => {
        setShow(false);
        const languageValue = e.target.getAttribute('data-value');
        i18n.changeLanguage(languageValue);
        setSelected(divNum);
    };

    return (
        <div className="footer">
            <div className='footer-wrapper d-flex justify-content-between align-items-center m-auto'>
                <NavLink to="/" className='logo'>
                    <img src={logo} width="100" height="50" alt=''/>
                </NavLink >
                <div className='ml-0 ml-lg-auto'>
                    <ul className='list-unstyled lang-list'>
                        <li>
                            <span className={`lang text-uppercase ${selected === 1 ? 'lang--active' : ''}`} data-value="fr" onClick={clickLanguageHandler(1)}>FR</span>
                        </li>
                        <li>
                            <span className={`lang text-uppercase ${selected === 2 ? 'lang--active' : ''}`} data-value="de" onClick={clickLanguageHandler(2)}>DE</span>
                        </li>
                        <li>
                            <span className={`lang text-uppercase ${selected === 3 ? 'lang--active' : ''}`} data-value="en" onClick={clickLanguageHandler(3)}>EN</span>
                        </li>
                    </ul>
                    <ul className='d-flex list-unstyled mb-0 flex-column flex-md-row footer-pages-links'>
                        <li>
                            <NavLink className="nav-link" to="/">{t('menu.Tournaments')}</NavLink>
                        </li>
                        <li>
                            <NavLink className="nav-link" to="/info">{t('menu.Info')}</NavLink>
                        </li>
                        <li>
                            {/* <NavLink className="nav-link" to="/contact">{t('menu.Contact')}</NavLink> */}
                            <NavLink className="nav-link" to="mailto:info@check-raise.ch">{t('menu.Contact')}</NavLink>
                        </li>
                    </ul>
                </div>
                <div className='text-end btn-fb-wrap'>
                    <NavLink className="btn-fb" to="/tournaments"><svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00195312 10.0021C0.00251636 12.3834 0.852424 14.6864 2.39892 16.4972C3.94541 18.308 6.08707 19.5079 8.43895 19.8811V12.8921H5.90195V10.0021H8.44195V7.80208C8.38587 7.28717 8.44385 6.76623 8.61177 6.27625C8.7797 5.78627 9.05345 5.33927 9.41359 4.96701C9.77373 4.59475 10.2114 4.30635 10.6956 4.1223C11.1797 3.93825 11.6985 3.86307 12.215 3.90208C12.965 3.91408 13.715 3.98108 14.455 4.10208V6.56108H13.191C12.9761 6.53294 12.7577 6.55344 12.5519 6.62106C12.346 6.68868 12.158 6.80169 12.0017 6.95175C11.8454 7.1018 11.7249 7.28506 11.6489 7.48798C11.573 7.69089 11.5436 7.90828 11.563 8.12408V10.0021H14.334L13.891 12.8931H11.563V19.8811C13.4506 19.5828 15.2132 18.7498 16.6421 17.4809C18.071 16.2119 19.1064 14.56 19.6257 12.7209C20.145 10.8818 20.1264 8.93233 19.5721 7.10342C19.0179 5.27451 17.9512 3.64271 16.4983 2.40122C15.0455 1.15974 13.2673 0.36055 11.3743 0.0982848C9.48135 -0.16398 7.55287 0.121659 5.81721 0.921384C4.08154 1.72111 2.61137 3.00143 1.58076 4.61076C0.550147 6.22009 0.0022565 8.09103 0.00195312 10.0021Z" fill="#F7F5F5"></path>
                    </svg></NavLink>

                </div>
            </div>
        </div>
    );
};

export default Footer;