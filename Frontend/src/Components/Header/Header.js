import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../../Assets/LOGO.png';

import './Header.scss';

const Header = () =>{
    let navigate  = useNavigate();
    return(
        <div className="Header">
            <nav>
                <div className="HeaderRoot">
                    <Link to={"/"}>
                        <img
                            src={Logo}
                            alt='Cosmpawliton Logo'
                            className='brand-logo'
                            onClick={() => navigate('/')}
                            width={300}
                        />
                    </Link>
                    <div className="HeaderSections">
                        <h2 className="HeaderItem">Locate an animal</h2>
                        <h2 className="HeaderItem">Adoption</h2>
                        <h2 className="HeaderItem">Find NGOs</h2>
                        <h2 className="HeaderItem">Contact us</h2>
                    </div>
                </div>
                <div className="Padder"></div>
            </nav>
        </div>
    )
}

export default Header;