import React from 'react';
import './SideDrawer.css';

const SideDrawer = props => {
    let drawerClass = 'side-drawer';
    if(props.show) {
        drawerClass = 'side-drawer open';
    }
    
    return (
    <nav className={drawerClass} >
        <ul>
            <li>
                <a href="/" className="picture-wrapper">
                    <img src='../BrendonWard.png' alt="Brendon Ward" className="side-drawer-picture"/>
                    <div className="side-drawer-picture-caption">Brendon Ward</div>
                </a>
            </li>
            <li><a href="/About" className="drawer-item">About Me</a></li>
            <li><a href="/CV" className="drawer-item">CV</a></li>
            <li><a href="/Projects" className="drawer-item">Personal Projects</a></li>
            <li><a href="/Photos" className="drawer-item">Photos and Videos</a></li>
            <li><a href="/Music" className="drawer-item">Music</a></li>
            <li><a href="/BusinessBrains" className="drawer-item">Business Brains</a></li>
        </ul>
    </nav>)
};

export default SideDrawer;