import React from 'react';
import './Toolbar.css';
import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';

const Toolbar = props => (
    <header className="toolbar">
        <nav className="toolbar_navigation">
            <div>
                <DrawerToggleButton click={props.drawerClickHandler}/>
            </div>
            {/* <div className="toolbar_logo"><a href="/">Brendon Ward</a></div>
            <div className="toolbar_navigation-items">
                <ul>
                    <li><a href="/About">About Me</a></li>
                    <li><a href="/Resume">Resume</a></li>
                    <li><a href="/Projects">Personal Projects</a></li>
                    <li><a href="/Photos">Photography</a></li>
                </ul>
            </div> */}
        </nav>
    </header>
);

export default Toolbar;