import React, {Component} from 'react';
import './photos.css';

class Photos extends Component {
    render() {
        return(
            <div>
                <h3 className="photos-title">Videography</h3>
                <p className="photos-subtitle">Make sure to change the quality to 1080p/4k</p>
                <iframe className="video" title="Northern Territory 2021" src="https://www.youtube.com/embed/z_7wfXeZL-g?si=2c-qHQHLI3aRFfkB" allow="fullscreen;"></iframe>
                <iframe className="video" title="Northern Territory 2021" src="https://www.youtube.com/embed/0yzM_pxB0qY" allow="fullscreen;"></iframe>
                <iframe className="video" title="Europe 19/20" src="https://www.youtube.com/embed/QTkTdYfBvCk" allow="fullscreen;"></iframe>
                <iframe className="video" title="Europe 18/19" src="https://www.youtube.com/embed/Y9x_vyCl0lg" allow="fullscreen;"></iframe>
                <iframe className="video" title="South-East Asia 17/18" src="https://www.youtube.com/embed/p_jTXvdzkHM" allow="fullscreen;"></iframe>
            </div>
        )
    }
}

export default Photos;