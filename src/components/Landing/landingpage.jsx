//Design Credit: https://www.youtube.com/watch?v=7WwtzsSHdpI

import React, {Component} from 'react';
import './landingpage.css';
import {init} from 'ityped';

class Landing extends Component {
    componentDidMount(){
        const typing = document.querySelector('#typing')
        init(typing, { showCursor: false, backDelay: 1500, strings: ['Developer', 'Project Manager', 'Security Consultant', 'Technology Enthusiast' ] })
    }

    render() {
        return(
            <div className="intro" id="intro">
                <div className="left">
                    <div className="imgContainer">
                        <img src="../BrendonWard.png" alt="Brendon Ward"></img>
                    </div>
                </div>
                <div className="right">
                    <div className="wrapper">
                        <h2>G'day! My name's</h2>
                        <h1>Brendon Ward</h1>
                        <h3>I'm a <span><div id="typing"></div></span></h3>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Landing;