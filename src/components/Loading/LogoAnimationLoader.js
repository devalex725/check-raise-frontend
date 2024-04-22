import './LogoAnimationLoader.scss';

import React from 'react';

import loader from '../../assets/images/loader.png';


const LogoAnimationLoader = () => {
    return (
        <>
            <div className='spinner'>
                <img src={loader} alt='' />
            </div>
        </>
    );
};
export default LogoAnimationLoader;