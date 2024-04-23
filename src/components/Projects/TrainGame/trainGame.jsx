import React, {Component} from 'react';
import './trainGame.css';
import getSolutions from './trainGameCalculations';
import {Modal, Button} from 'react-bootstrap';

function HelpModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            Help
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This program is based on a game played on Sydney Trains. Each carriage has a unique four-digit
            identifying number associated with it. The aim of the game is to use each of the digits with operations
            in order to generate the number ten.
          </p>
          <p>
            For Example: The number 2384 can be split into (2x3)+(8-4) = 10 
          </p>
          <p>
            This program will accept a 4-digit number and then generate all the possible solutions based
            off this number. It will use addition, subtraction, multiplication, division and powers to find all solutions.
            It is worth noting that not every four digit number has a solution associated with it.
          </p>
          <p>
            Powers work like this: The number 2271 can be split into 2^2+7-1 = 10
          </p>
        </Modal.Body>
      </Modal>
    );
  }

function MadeModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            How this was made
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This project has gone through many iterations over the last year or so. Initially, I was
            playing this game with some friends and we realised there were multiple ways to solve certain
            numbers. This made me do some googling to see if there was some sort of calculator out there
            that would do this for me. Having no luck, I took matters into my own hands and hopped into
            Python and started messing around with ways to calculate solutions. I eventually got something
            that did what I wanted to work in the command-line, however, I didn't think this was very
            user-friendly so decided to port this code into Javascript and make it into an app. 
          </p>
          <p>
            This was my first ever attempt at creating an app using Android Studio and after watching some
            videos and working out how everything worked, I was able to get the Javascript code running on my
            phone. This is what it looks like:
          </p>
          <img src="../../app1.jpg" className="app-image" alt="Train Game App 1"></img>
          <img src="../../app2.jpg" className="app-image" alt="Train Game App 2"></img>
          <p>
            I'm yet to publish this app, but I may do so in the future. Now that I've started my own website,
            I wanted to also display my work here as well. So I made a few more modifications and adapted the
            code into a HTML/Javascript format so that it will run online as well.
          </p>
          <p>
              If you'd like to check out the original javascript repository, you can find it here:  
              <a href="https://github.com/b-ward/Train-game/blob/master/traingame.py" target="_blank" rel="noreferrer"> https://github.com/b-ward/Train-game/blob/master/traingame.py </a>
              (Sorry the code isn't that pretty)
          </p>
        </Modal.Body>
      </Modal>
    );
}

class TrainGame extends Component {
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

    validateAndSubmit(number) {
        if (number.length === 4 && /^\d+$/.test(number)) {
            this.setState({error: ""})
            var solutions = getSolutions(number);
            var solutionRows = [];
            if (solutions.length > 0){
                solutionRows.push(<h3 key="title">Solutions</h3>)
                for (var i = 0; i < solutions.length; i++){
                    solutionRows.push(<div key={i}>{solutions[i]}</div>)
                }
            }
            else {
                solutionRows.push(<h3 key="title">No Solutions Found</h3>)
            }
            this.setState({solutions: solutionRows})
        }
        else {
            this.setState({solutions: ""})
            this.setState({error: "Please enter a 4-digit number"})
        }
    }

    render() {
        return(
            <div className="trainGame-wrapper">
                <div className="row" style={{width: '100%', margin: 'auto'}}>
                    <div style={{position: "absolute", left: "40%"}}>
                        <Button className="made-button" variant="primary" onClick={() => this.setState({madeModalShow: true})}>
                            Creation
                        </Button>
                    </div>
                    <div style={{width: '100%'}}>
                        <div className="trainGame-title"><h1>Train Game</h1></div>
                    </div>
                    <div style={{position: "absolute", right: "40%"}}>
                        <Button className="help-button" variant="primary" onClick={() => this.setState({helpModalShow: true})}>
                            Help
                        </Button>
                    </div>
                </div>

                <input name="number" type="text" value={this.state.number} style={{height: '33px'}}onChange={this.onInputChange}></input>
                <Button style={{marginTop: '-3px'}} onClick={() => {this.validateAndSubmit(this.state.number)}}>Submit</Button>
                <div className="error">{this.state.error}</div>
                <div className="solutions">{this.state.solutions}</div>

                <HelpModal
                    show={this.state.helpModalShow}
                    onHide={() => this.setState({helpModalShow: false})}
                />
                <MadeModal
                    show={this.state.madeModalShow}
                    onHide={() => this.setState({madeModalShow: false})}
                />
            </div>
        )
    }
}

export default TrainGame;