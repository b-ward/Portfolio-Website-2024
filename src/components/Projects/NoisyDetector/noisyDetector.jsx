import React, {Component} from 'react';
import './noisyDetector.css';
// import {Modal, Button} from 'react-bootstrap';
// import RNSoundLevel from 'react-native-sound-level';

// function HelpModal(props) {
//     return (
//       <Modal
//         {...props}
//         size="lg"
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//       >
//         <Modal.Header closeButton>
//             <Modal.Title id="contained-modal-title-vcenter">
//             Help
//             </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>

//           </p>
//         </Modal.Body>
//       </Modal>
//     );
//   }

// function MadeModal(props) {
//     return (
//       <Modal
//         {...props}
//         size="lg"
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//       >
//         <Modal.Header closeButton>
//             <Modal.Title id="contained-modal-title-vcenter">
//             How this was made
//             </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>

//           </p>
//         </Modal.Body>
//       </Modal>
//     );
// }

class NoisyDetector extends Component {
    constructor(props){
        super(props);
        this.state = {
            number: '',
            error: '',
            solutions: '',
            madeModalShow: false,
            helpModalShow: false
        };
        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    componentDidMount() {
      // RNSoundLevel.start()
      // RNSoundLevel.onNewFrame = (data) => {
      //   // see "Returned data" section below
      //   console.log('Sound level info', data)
      // }
    }
    
    // don't forget to stop it
    componentWillUnmount() {
      // RNSoundLevel.stop()
    }

    render() {
        return(
          <div></div>
            // <div className="noisy-wrapper">
            //     <div class="row" style={{width: '100%', margin: 'auto'}}>
            //         <div style={{position: "absolute", left: 20}}>
            //             <Button className="made-button" variant="primary" onClick={() => this.setState({madeModalShow: true})}>
            //                 Creation
            //             </Button>
            //         </div>
            //         <div style={{width: '100%'}}>
            //             <div className="noisy-title"><h1>Noisy Detector</h1></div>
            //         </div>
            //         <div style={{position: "absolute", right: 20}}>
            //             <Button className="help-button" variant="primary" onClick={() => this.setState({helpModalShow: true})}>
            //                 Help
            //             </Button>
            //         </div>
            //     </div>

            //     <img src="http://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Face_Emoji_grande.png?v=1571606036" alt="noise-status" id="noisy-image"></img>

            //     <HelpModal
            //         show={this.state.helpModalShow}
            //         onHide={() => this.setState({helpModalShow: false})}
            //     />
            //     <MadeModal
            //         show={this.state.madeModalShow}
            //         onHide={() => this.setState({madeModalShow: false})}
            //     />
            // </div>
        )
    }
}

export default NoisyDetector;