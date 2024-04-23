import React, {Component} from 'react';
import './trioHome.css';
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
            This program finds betting odds where you can make a profit through arbitrage and lay betting.
            The odds api (<a href="https://the-odds-api.com/">https://the-odds-api.com/</a>) is leveraged in order to retrieve the betting odds from all the different sites.
            Arbitrage betting is the method of locking in a profit no matter the result of an event. 
            This requires placing bets on all outcomes of an event across multiple betting sites where the sum of all probabilities is less than 100%.
          </p>
          <p>
            For Example: If Chelsea was playing Liverpool in the English Premier League, there are 3 outcomes of the game. A Chelsea win, a Liverpool win or a draw.
            If we look at the odds for different betting sites we may find that a Chelsea win is paying $4 on TAB, a Liverpool win is paying $1.9 on Ladbrokes and a draw is paying $5 on SportsBet.
            So the probability of each outcome is: Chelsea win = 100/4 = 25%, Liverpool win = 100/1.9 = 52.63% and Draw = 100/5 = 20%.
            Adding all the percentages together, we get 97.63%. As this number is less than 100%, if we bet on all the outcomes with varying amounts, we guarantee a profit no matter what the result is.
            In this case if we bet $25.60 on a Chelsea win, $20.48 on a draw and $53.90 on a Liverpool win we guarantee winning $2.43, no matter the outcome.
          </p>
          <p>  
            For more examples see: <a href="https://www.betfair.com.au/hub/arbitrage-betting/">https://www.betfair.com.au/hub/arbitrage-betting/</a><br></br>
            Use this site as an arbitrage calculator (You can do biased bets in order to maximise profits if you believe one event is more likely to happen): <a href="https://www.aussportsbetting.com/tools/online-calculators/arbitrage-calculator/">https://www.aussportsbetting.com/tools/online-calculators/arbitrage-calculator/</a>
          </p>
          <p>
            Additionally, this program returns profitable lay bets.
            Lay betting is based around betting on an event NOT happening. If you can find lay betting odds that are lower than the actual odds on a betting site, you can often profit. Lay betting can only be performed on Betfair (<a href="https://www.betfair.com.au/">https://www.betfair.com.au/</a>)
          </p>
          <p>
            For example: If the Penrith Panthers are playing the Manly Sea Eagles and Penrith are paying $2 to win on Sportsbet whereas the lay bet (Penrith NOT winning) is $1.70, if we bet $100 on the panthers winning and lay $121.21, we will guarantee winning $15.15, no matter the result.
            The one thing you need to be careful with is that Betfair takes a cut of your winnings when you place bets. This will vary on the sport but can be between 2 and 10%, so you need to factor this into the betting calculations.
          </p>
          <p>
              This site will do all the lay betting calculations for you: <a href="https://www.oddsmonkey.com/Tools/Calculator.aspx">https://www.oddsmonkey.com/Tools/Calculator.aspx</a>  
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
            During the COVID-19 lockdown, I didn't have much to do in the evenings after work so I was wondering if 
            there was any way of making some money from my laptop at home. I stumbled across this YouTube video that explained the arbitrage process: 
            <a href="https://www.youtube.com/watch?v=TGinzvSDayU&ab_channel=NewMoney">https://www.youtube.com/watch?v=TGinzvSDayU&ab_channel=NewMoney</a>
            I found that you can actually make a little bit of money off this method, however, it could be quite time consuming as you have to score multiple betting sites in order to find odds that produce a profitable outcome.
            Having a developer background, I thought that there should be an easier way to find profitable arbitrage bets so I got to work on writing some python code that would
            leverage an API called The Odds API (<a href="https://the-odds-api.com/">https://the-odds-api.com/</a>) which returns betting odds from around 10 betting sites for over 50 different sports.
          </p>
          <p>
            Arbitrage betting isn't breaking any laws, however, it is frowned upon by betting sites and they can ban you from their sites if they suspect you
            are guaranteed profits. So be cautious on how much money you place on bets (the closer to a dollar value, the better eg. $7).
          </p>
          <p>
            Once I set up this website, I wanted to add my arbitrage betting program so that it was publicly accessible and meant that I didn't have to run a Python script from my laptop.
            So I got to work at converting the code from Python to Javascript, which was a lot more tedious than I initially though it would be. Eventually, I got everything working and, due to API Keys only allowing 50 requests per month, I've also implemented an API Key rotation feature
            so that users can make more requests. 
          </p>
        </Modal.Body>
      </Modal>
    );
}

class TrioHome extends Component {
    constructor(props){
        super(props);
        this.state = {
            arbitrageBets: '',
            madeModalShow: false,
            helpModalShow: false,
            loadingResults: false
        };
    }

    onMouseOverCard(cardName) {
      var card = document.getElementById(cardName);
      card.style.width = 400;
      card.style.height = 300;
      card.style.left = 155;
      card.style.top = 180;
      card.src = '../Trio/Images/card fan.png';
    }

    onMouseOutCard(cardName) {
      var card = document.getElementById(cardName);
      card.style.width = 126;
      card.style.height = 182;
      card.style.left = 300;
      card.style.top = 200;
      card.src = '../Trio/Images/card_back.png';
    }

    render() {
        return(
            <div className="trio-wrapper">
                <div className="row" style={{width: '100%', margin: 'auto'}}>
                    <div style={{position: "absolute", left: 20}}>
                        <Button className="made-button" variant="primary" onClick={() => this.setState({madeModalShow: true})}>
                            Creation
                        </Button>
                    </div>
                    <div style={{width: '100%'}}>
                        <div className="trio-title"><h1>Trio</h1></div>
                    </div>
                    <div style={{position: "absolute", right: 20}}>
                        <Button className="help-button" variant="primary" onClick={() => this.setState({helpModalShow: true})}>
                            Help
                        </Button>
                    </div>
                </div>

                <img id = 'play' src = '../Trio/Images/background.png' alt="background"/>
                <div class="playContainer" onClick={() => window.location.href='TrioGame'} onMouseOver={()=>this.onMouseOverCard('playGame')} onMouseOut={()=>this.onMouseOutCard('playGame')}>
                  <img id = 'playGame' src = '../Trio/Images/card_back.png' alt="card"/>
                  <p id = 'p1'>PLAY</p>
                </div>
                <div class="instructionContainer" onClick={() => window.location.href='TrioInstructions'} onMouseOver={()=>this.onMouseOverCard('instructions')} onMouseOut={()=>this.onMouseOutCard('instructions')}>
                  <p id = 'p2' >HOW TO PLAY</p>
                  <img id = 'instructions' src = '../Trio/Images/card_back.png' alt="card"/>
                </div>
                
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

export default TrioHome;