import React, {Component} from 'react';
import './businessBrains.css';

class BusinessBrains extends Component {
    render() {
        return(
            <div>
                <h3 className="business-brains-title">Business Brains</h3>
                <div className="business-brains-wrapper">
                    <iframe className= "business-brains-audio" title="Pod 2" src="https://open.spotify.com/embed/episode/3uqsIqXuVVHPeMTlB5FQ1i?theme=0" width="100%" height="232" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                    <iframe className= "business-brains-audio" title="Pod 1" src="https://open.spotify.com/embed/episode/0eoHeo60heCHlVDOHZOug7?theme=0" width="100%" height="232" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                </div>
            </div>
        )
    }
}

export default BusinessBrains;