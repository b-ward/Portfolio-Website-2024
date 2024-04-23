import React, {Component} from 'react';
import './trioGame.css';
import {Modal, Button, Carousel} from 'react-bootstrap';

function HelpModal(props) {
  var instructionImages = []
  for (var i = 1; i < 14; i++) {
    instructionImages.push(<Carousel.Item key={i}><img key={i} className="d-block w-100" src={`../Trio/Instruction_images/Trio - User Manual - ${i}.png`} alt="Instruction" /></Carousel.Item>);
  }

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
          This program is based off the popular card game Trio. A video explanation of the game can be found below:
        </p>
        <div className="video-container">
          <iframe className="instruction-video" title="Trio rules" width="300" height="200" src="https://www.youtube.com/embed/OvWgewf9uEA" frameborder="0" allow="fullscreen;"></iframe>
        </div>
        <p>
          Instruction images can also be found below:
        </p>
        <div className="images-container">
          <Carousel> 
              {instructionImages}
          </Carousel>
        </div>
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

//NEED TO:
//Consider if 8 cards of the same number and 4 jokers are played in one trio
//Fix weird glitch where 6 and 10 were being put in the same trio with a joker by the computer
//MAKE CODE CLEANER YOU MUPPET, THIS SUCKS
//Use setState

class TrioGame extends Component {
  constructor(props){
    super(props);
    this.state = {
      madeModalShow: false,
      helpModalShow: false,

      //These five lists are the ID's of divs so that images can be changed efficiently
      card_list: ['player_card_1','player_card_2','player_card_3','player_card_4','player_card_5',
      'player_card_6','player_card_7','player_card_8','player_card_9','player_card_10','player_card_11','player_card_12','player_card_13'],

      trio_list_1: ['player_trio_1_card_1','player_trio_1_card_2','player_trio_1_card_3','player_trio_1_card_4','player_trio_1_card_5','player_trio_1_card_6','player_trio_1_card_7','player_trio_1_card_8'],
      trio_list_2: ['player_trio_2_card_1','player_trio_2_card_2','player_trio_2_card_3','player_trio_2_card_4','player_trio_2_card_5','player_trio_2_card_6','player_trio_2_card_7','player_trio_2_card_8'],

      CPU_trio_list_1: ['CPU_trio_1_card_1','CPU_trio_1_card_2','CPU_trio_1_card_3','CPU_trio_1_card_4','CPU_trio_1_card_5','CPU_trio_1_card_6','CPU_trio_1_card_7','CPU_trio_1_card_8'],
      CPU_trio_list_2: ['CPU_trio_2_card_1','CPU_trio_2_card_2','CPU_trio_2_card_3','CPU_trio_2_card_4','CPU_trio_2_card_5','CPU_trio_2_card_6','CPU_trio_2_card_7','CPU_trio_2_card_8'],

      //Variable names for each card in the deck eg. A1 is the 2 of diamonds
      deck: ['A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K1','L1','M1',
              'A2','B2','C2','D2','E2','F2','G2','H2','I2','J2','K2','L2','M2',
              'A3','B3','C3','D3','E3','F3','G3','H3','I3','J3','K3','L3','M3',
              'A4','B4','C4','D4','E4','F4','G4','H4','I4','J4','K4','L4','M4','S1','S2',
              'A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K1','L1','M1',
              'A2','B2','C2','D2','E2','F2','G2','H2','I2','J2','K2','L2','M2',
              'A3','B3','C3','D3','E3','F3','G3','H3','I3','J3','K3','L3','M3',
              'A4','B4','C4','D4','E4','F4','G4','H4','I4','J4','K4','L4','M4','S3','S4'],

      //List used for assigning cards to their correct images
      original_deck: ['A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K1','L1','M1',
              'A2','B2','C2','D2','E2','F2','G2','H2','I2','J2','K2','L2','M2',
              'A3','B3','C3','D3','E3','F3','G3','H3','I3','J3','K3','L3','M3',
              'A4','B4','C4','D4','E4','F4','G4','H4','I4','J4','K4','L4','M4','S1','S2',
              'A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K1','L1','M1',
              'A2','B2','C2','D2','E2','F2','G2','H2','I2','J2','K2','L2','M2',
              'A3','B3','C3','D3','E3','F3','G3','H3','I3','J3','K3','L3','M3',
              'A4','B4','C4','D4','E4','F4','G4','H4','I4','J4','K4','L4','M4','S3','S4'],

      //List of the file names for all the images in the deck
      //http://opengameart.org/content/playing-cards-vector-png
      card_image: ['2_of_clubs.png','3_of_clubs.png','4_of_clubs.png','5_of_clubs.png','6_of_clubs.png','7_of_clubs.png','8_of_clubs.png',
      '9_of_clubs.png','10_of_clubs.png','jack_of_clubs2.png','queen_of_clubs2.png','king_of_clubs2.png','ace_of_clubs.png',

      '2_of_diamonds.png','3_of_diamonds.png','4_of_diamonds.png','5_of_diamonds.png','6_of_diamonds.png','7_of_diamonds.png','8_of_diamonds.png',
      '9_of_diamonds.png','10_of_diamonds.png','jack_of_diamonds2.png','queen_of_diamonds2.png','king_of_diamonds2.png','ace_of_diamonds.png',

      '2_of_hearts.png','3_of_hearts.png','4_of_hearts.png','5_of_hearts.png','6_of_hearts.png','7_of_hearts.png','8_of_hearts.png',
      '9_of_hearts.png','10_of_hearts.png','jack_of_hearts2.png','queen_of_hearts2.png','king_of_hearts2.png','ace_of_hearts.png',

      '2_of_spades.png','3_of_spades.png','4_of_spades.png','5_of_spades.png','6_of_spades.png','7_of_spades.png','8_of_spades.png',
      '9_of_spades.png','10_of_spades.png','jack_of_spades2.png','queen_of_spades2.png','king_of_spades2.png','ace_of_spades2.png',

      'black_joker.png','red_joker.png',



      '2_of_clubs.png','3_of_clubs.png','4_of_clubs.png','5_of_clubs.png','6_of_clubs.png','7_of_clubs.png','8_of_clubs.png',
      '9_of_clubs.png','10_of_clubs.png','jack_of_clubs2.png','queen_of_clubs2.png','king_of_clubs2.png','ace_of_clubs.png',

      '2_of_diamonds.png','3_of_diamonds.png','4_of_diamonds.png','5_of_diamonds.png','6_of_diamonds.png','7_of_diamonds.png','8_of_diamonds.png',
      '9_of_diamonds.png','10_of_diamonds.png','jack_of_diamonds2.png','queen_of_diamonds2.png','king_of_diamonds2.png','ace_of_diamonds.png',

      '2_of_hearts.png','3_of_hearts.png','4_of_hearts.png','5_of_hearts.png','6_of_hearts.png','7_of_hearts.png','8_of_hearts.png',
      '9_of_hearts.png','10_of_hearts.png','jack_of_hearts2.png','queen_of_hearts2.png','king_of_hearts2.png','ace_of_hearts.png',

      '2_of_spades.png','3_of_spades.png','4_of_spades.png','5_of_spades.png','6_of_spades.png','7_of_spades.png','8_of_spades.png',
      '9_of_spades.png','10_of_spades.png','jack_of_spades2.png','queen_of_spades2.png','king_of_spades2.png','ace_of_spades2.png',

      'black_joker.png','red_joker.png'],

      hand: [],
      CPU_hand: [],

      trio_played_1: [],
      trio_played_2: [],

      CPU_trio_1: [],
      CPU_trio_2: [],
      CPU_complete_trio_1: [],
      CPU_complete_trio_2: [],

      double_cards: [],
      joker_list: [],

      reset: 0,
      discard: false,
      picked_up: false,
      playing_trios: false,
      correct: 0,
      player_turn: true,
      player_trios_complete: false,
      CPU_trios_complete: false,
      trio_adder: 0,

      picked_up_deck: false,
      picked_up_pile: false,

      rearrange: false,
      card_swap_count: 0,
      trio_to_add_to: 0,
      all_joker: false,
      add_to_trios: false,

      amount_discarded: 6,
      added_card_pos: 0,
      num_cards_left: 5,

      game_over: false,

      instruction_button: true,

      discarded_card: ''
    }
  }

  //Shuffles all the cards in the deck to ensure a different game very time
  //https://www.kirupa.com/html5/shuffling_array_js.htm
  shuffle(deck) {
    var shuffledDeck = deck;
    for (var i = deck.length-1; i >=0; i--) {
        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = deck[randomIndex];

        shuffledDeck[randomIndex] = deck[i];
        deck[i] = itemAtIndex;
    }
    return shuffledDeck;
}

  //Changes the image and rules (what instructions are displayed) when the button is clicked
  instruction_change() {
    if (this.state.instruction_button === true){
      this.setState({instruction_button: false});
      document.getElementById('instruction_switch').src = '../Trio/Images/OFF.png';
    }
    else if (this.state.instruction_button === false){
      this.setState({instruction_button: true});
      document.getElementById('instruction_switch').src = '../Trio/Images/ON.png';
    }
  }

  //Refreshes the images displayed so that they are up-to-date and in accordance to the lists that change due to player decisions
  hand_refresh() {
    var go_through_hand = 0;
    //Loops through to refresh each card in the player's hand
    while (go_through_hand < this.state.hand.length) {
      var card_changes = 0
      var card_pos = 0;
      var go_through_deck = 0;
      var card_to_find = this.state.hand[go_through_hand]
      //Checks through the array of images to find the one that matches the variable name
      while (card_changes === 0) {
        if (card_to_find===this.state.original_deck[go_through_deck]) {
          card_pos = go_through_deck
          card_changes = 1
        }
        go_through_deck= go_through_deck + 1
      }
      document.getElementById(this.state.card_list[go_through_hand]).src = '../Trio/Images/' + this.state.card_image[card_pos];
      go_through_hand = go_through_hand + 1
    }
  }

  //Same as above except for the card that is shown face-up
  pile_refresh() {
    var go_through_deck = 0;
    var card_changes = 0;
    var pile_card_pos = 0
    this.setState({pile_card_to_get: this.state.deck[0]});
    while (card_changes === 0) {
      if (this.state.pile_card_to_get===this.state.original_deck[go_through_deck]) {
          pile_card_pos = go_through_deck
          card_changes = 1}
      go_through_deck= go_through_deck + 1
      console.log(this.state.card_image[pile_card_pos])
      document.getElementById('pile').src = '../Trio/Images/' + this.state.card_image[pile_card_pos];
  }}

//   //Performed as the page loads
  componentDidMount() {
    if (this.state.reset === 0){
      //Shuffle module is called
      this.setState({deck: this.shuffle(this.state.deck)});

      //Deals the player 12 cards from the top of the deck
      while (this.state.hand.length < 12) {
        this.state.hand.push(this.state.deck[0])
        this.state.deck.splice(0,1)
      }

      //Deals the CPU 12 cards from the top of the deck
      while (this.state.CPU_hand.length < 12) {
        this.state.CPU_hand.push(this.state.deck[0])
        this.state.deck.splice(0,1)
      }

      //Sorts the cards into ascending order to make the CPU's decisions easier, this is done throughout the code
      this.state.CPU_hand.sort();

      this.hand_refresh();
      this.pile_refresh();
      this.setState({reset: 1});
      //Displays instructions only if the player allows
      if (this.state.instruction_button === true){window.alert("Select a card from either the face-up pile, or the face down deck")}
    }
  }

  //When the player clicks the face-down card the pick up the card and add it to their hand
    pick_up_deck() {
      if (this.state.picked_up === false) {
        this.state.hand.push(this.state.deck[1])
        this.state.deck.splice(1,1)
        this.hand_refresh();
        this.setState({picked_up: true});
        this.setState({picked_up_deck: true});
        this.move_cards_pos()
        //Displays instructions only if the player allows
        if (this.state.instruction_button === true){window.alert("Now you can either play two trios (if you have the correct cards) by pressing the 'PLAY TRIOS' button, or you can discard a card by clicking the 'DISCARD' button.")}
    }}

    pick_up_pile() {
      console.log(this.state.hand)
      console.log(this.state.deck)
      if (this.state.picked_up === false){
        document.getElementById('pile').src = '../Trio/Images/blank.png';
        this.state.hand.push(this.state.deck[0])
        this.state.deck.splice(0,1)
        this.hand_refresh();
        this.setState({picked_up: true});
        this.setState({picked_up_deck: true});
        this.move_cards_pos()
        //Displays instructions only if the player allows
        if (this.state.instruction_button === true){window.alert("Now you can either play two trios (if you have the correct cards) by pressing the 'PLAY TRIOS' button, or you can discard a card by clicking the 'DISCARD' button.")}
    }}

    move_cards_pos() {
      document.getElementById('player_card_1').style.left = 170;
      document.getElementById('player_card_2').style.left = 240;
      document.getElementById('player_card_3').style.left = 310;
      document.getElementById('player_card_4').style.left = 380;
      document.getElementById('player_card_5').style.left = 450;
      document.getElementById('player_card_6').style.left = 520;
      document.getElementById('player_card_7').style.left = 590;
      document.getElementById('player_card_8').style.left = 660
      document.getElementById('player_card_9').style.left = 730;
      document.getElementById('player_card_10').style.left = 800;
      document.getElementById('player_card_11').style.left = 870;
      document.getElementById('player_card_12').style.left = 940;
      document.getElementById('player_card_13').style.left = 1010;
    }

    move_cards_pos_back() {
      document.getElementById('player_card_1').style.left = 200;
      document.getElementById('player_card_2').style.left = 270;
      document.getElementById('player_card_3').style.left = 340;
      document.getElementById('player_card_4').style.left = 410;
      document.getElementById('player_card_5').style.left = 480;
      document.getElementById('player_card_6').style.left = 550;
      document.getElementById('player_card_7').style.left = 620;
      document.getElementById('player_card_8').style.left = 690;
      document.getElementById('player_card_9').style.left = 760;
      document.getElementById('player_card_10').style.left = 830;
      document.getElementById('player_card_11').style.left = 900;
      document.getElementById('player_card_12').style.left = 970;
      document.getElementById('player_card_13').style.left = 1040;
    }

    discard_initialise() {
      if (this.state.game_over === false) {
      if (this.state.picked_up === true) {
        if (this.state.instruction_button === true){window.alert('Click a card to discard')}
        this.setState({discard: true});
      }
    }}

    play_initialise() {
      if (this.state.game_over === false) {
      if (this.state.picked_up === true) {
        if (this.state.player_trios_complete === false){
        //Displays instructions only if the player allows
        if (this.state.instruction_button === true){window.alert('Click three cards to play for your first trio')}
        this.setState({playing_trios: true})};
        if (this.state.player_trios_complete === true){
          //Displays instructions only if the player allows
          if (this.state.instruction_button === true){window.alert('Click the orange button next to the trio you want to add to')}
          this.setState({add_to_trios: true});
        }
      }
    }}

    rearrange_initialise(){
      if (this.state.game_over === false) {
        this.setState({rearrange: true});
        //Displays instructions only if the player allows
        if (this.state.instruction_button === true){window.alert('Click two cards that you would like to swap positions')}
    }}


    add_trio_1() {
      if (this.state.add_to_trios === true){
      //Displays instructions only if the player allows
      if (this.state.instruction_button === true){window.alert('Click the card you would like to add to this trio')}
      this.setState({trio_to_add_to: 1});}
    }
    add_trio_2() {
      if (this.state.add_to_trios === true){
      //Displays instructions only if the player allows
      if (this.state.instruction_button === true){window.alert('Click the card you would like to add to this trio')}
      this.setState({trio_to_add_to: 2});}
    }
    add_trio_3() {
      if (this.state.add_to_trios === true){
      //Displays instructions only if the player allows
      if (this.state.instruction_button === true){window.alert('Click the card you would like to add to this trio')}
      this.setState({trio_to_add_to: 3});}
    }
    add_trio_4() {
      if (this.state.add_to_trios === true){
      //Displays instructions only if the player allows
      if (this.state.instruction_button === true){window.alert('Click the card you would like to add to this trio')}
      this.setState({trio_to_add_to: 4});}
    }

  //Refreshes the images displayed in a selected trio when cards are added
    trio_refresh(trio_played_num, trio_list) {
      var go_through_trio = 0;
      while (go_through_trio < trio_played_num.length) {
        var card_changes = 0
        var card_pos = 0;
        var go_through_deck = 0;
        var card_to_find = trio_played_num[go_through_trio]
        while (card_changes === 0) {
          if (card_to_find===this.state.original_deck[go_through_deck]) {
              card_pos = go_through_deck
              card_changes = 1}
          go_through_deck= go_through_deck + 1
          }
        document.getElementById(trio_list[go_through_trio]).src = '../Trio/Images/' + this.state.card_image[card_pos];
        go_through_trio = go_through_trio + 1
      }
  }

  //Allows the player to remove a card from their hand at the end of their turn
  player_discard(){
    this.setState({add_to_trios: false});
    this.setState({discarded_card: this.state.hand[this.state.card_num_clicked]});
    this.state.hand.splice(this.state.card_num_clicked,1);
    this.hand_refresh();
    if (this.state.picked_up_deck === true){this.state.deck.splice(0,1); this.setState({picked_up_deck: false});}
    if (this.state.picked_up_pile === true){this.setState({picked_up_pile: false});}
    this.state.deck.unshift(this.state.discarded_card);
    this.pile_refresh(); 
    this.setState({discard: false});
    console.log(this.state.hand);
    console.log(this.state.deck);
    this.CPU_turn();
    this.setState({picked_up: false});
  }

  //Adds a selected card to a selected trio
  add_cards(trio, trio_list) {
    if (trio.length > 2){
      var card_to_check = trio[0]
      //In order to check if the move is valid, the card played must be compared to an actual numbered card, rather than a 'wild' joker card
      if (card_to_check[0] === 'S'){card_to_check = trio[1]}
      if (card_to_check[0] === 'S'){card_to_check = trio[2]; this.setState({all_jokers: true})}
      //If all the cards in the trio are, for some reason, all jokers, then any card can be added to it
      if (this.state.hand[this.state.card_num_clicked][0] === card_to_check[0] || this.state.all_joker === true || this.state.hand[this.state.card_num_clicked][0] === 'S'){
        //Card is added to the trio and removed from the player's hand
        trio.push(this.state.hand[this.state.card_num_clicked])
        this.state.hand.splice(this.state.card_num_clicked,1)
        this.trio_refresh(trio, trio_list)
        this.hand_refresh()
        document.getElementById(this.state.card_list[this.state.amount_discarded]).src = '../Trio/Images/blank.png';
        this.setState({amount_discarded: this.state.amount_discarded - 1});
        //Displays instructions only if the player allows
        if (this.state.instruction_button === true){window.alert('You can now either play another card by clicking the green "PLAY" button again, or discard by clicking the red "DISCARD" button' )}}
      //If the move is not valid a message appears
      else {window.alert('This is not a valid card to add.')}
    }
    //If the move is not valid a message appears
    else {window.alert("You can't add to this trio.")}
      this.setState({all_joker: false})
      this.setState({add_to_trios: false})
      this.setState({trio_to_add_to: 0})
  }

  //Occurs when a card is clicked
  card_clicked() {
    //////////////////////////////////////////////////////////////////// BEFORE TRIOS PLAYED //////////////////////////////////////////////////////////////////////////////
    if (this.state.player_trios_complete === false){
      //If the discard variable has been intialised, the card the player clicks is discarded
      if (this.state.discard === true && this.state.correct === 0) {document.getElementById(this.state.card_list[12]).src = '../Trio/Images/blank.png'; this.player_discard(); this.move_cards_pos_back()}
      //If the player has chosen to play two trios then the following occurs
      if (this.state.playing_trios === true){
        //If the first trio has not been completed
        if (this.state.correct === 0) {
          //If the trio is incomplete (has less than three cards)
          if (this.state.trio_played_1.length < 3){
            //Adds the card clicked to the first trio
            this.state.trio_played_1.push(this.state.hand[this.state.card_num_clicked]);
            //Removes the card clicked from the player's hand
            this.state.hand.splice(this.state.card_num_clicked,1);
            this.hand_refresh();
            this.trio_refresh(this.state.trio_played_1, this.state.trio_list_1)
            //Removs the image of the last card in the player's hand to show they have added a card to a trio
            if (this.state.trio_played_1.length === 1){document.getElementById('player_card_13').src = '../Trio/Images/blank.png'}
            if (this.state.trio_played_1.length === 2){document.getElementById('player_card_12').src = '../Trio/Images/blank.png'}
            if (this.state.trio_played_1.length === 3){document.getElementById('player_card_11').src = '../Trio/Images/blank.png'}}
          //If the player has played three cards to their first trio
          if (this.state.trio_played_1.length === 3) {
            //The following statements check to see if the trio played is valid, the reason there is so many is that if a joker (or multiple jokers) is played, then there a a variety of
            //combinations that could occur that still successfully complete a trio
            if (this.state.trio_played_1[0][0] === 'S'){if (this.state.trio_played_1[1][0] === this.state.trio_played_1[2][0]){this.setState({correct: 1})}}
            else if (this.state.trio_played_1[1][0] === 'S'){if (this.state.trio_played_1[0][0] === this.state.trio_played_1[2][0]){this.setState({correct: 1})}}
            else if (this.state.trio_played_1[2][0] === 'S'){if (this.state.trio_played_1[0][0] === this.state.trio_played_1[1][0]){this.setState({correct: 1})}}

            else if (this.state.trio_played_1[0][0] === 'S' && this.state.trio_played_1[1][0] === 'S') {this.setState({correct: 1})}
            else if (this.state.trio_played_1[1][0] === 'S' && this.state.trio_played_1[2][0] === 'S') {this.setState({correct: 1})}
            else if (this.state.trio_played_1[0][0] === 'S' && this.state.trio_played_1[2][0] === 'S'){this.setState({correct: 1})}
            else if (this.state.trio_played_1[0][0] === 'S' && this.state.trio_played_1[1][0] === 'S' && this.state.trio_played_1[2][0] === 'S'){this.setState({correct: 1})}

            else if (this.state.trio_played_1[0][0] === this.state.trio_played_1[1][0] && this.state.trio_played_1[1][0] === this.state.trio_played_1[2][0] && this.state.trio_played_1[0][0] === this.state.trio_played_1[2][0]){this.setState({correct: 1})}

            //A message is displayed if the trio is invalid and the cards played and put back into the player's hand
            else {window.alert('Sorry that is not a valid trio'); this.state.hand.push(this.state.trio_played_1[0]);this.state.hand.push(this.state.trio_played_1[1]);this.state.hand.push(this.state.trio_played_1[2]); this.setState({trio_played_1: []}); document.getElementById('player_trio_1_card_1').src = '../Trio/Images/blank.png'; document.getElementById('player_trio_1_card_2').src = '../Trio/Images/blank.png'; document.getElementById('player_trio_1_card_3').src = '../Trio/Images/blank.png'; this.hand_refresh(); this.setState({playing_trios: false});}}}

        //If the first trio has been completed but the second has not - Same thing as above occurs except the second trio is checked
        else if (this.state.correct === 1){
          if (this.state.trio_played_2.length < 3){
            this.state.trio_played_2.push(this.state.hand[this.state.card_num_clicked]);
            this.state.hand.splice(this.state.card_num_clicked,1);
            this.hand_refresh();
            this.trio_refresh(this.state.trio_played_2, this.state.trio_list_2);
            if (this.state.trio_played_2.length === 1){document.getElementById('player_card_10').src = '../Trio/Images/blank.png'}
            if (this.state.trio_played_2.length === 2){document.getElementById('player_card_9').src = '../Trio/Images/blank.png'}
            if (this.state.trio_played_2.length === 3){document.getElementById('player_card_8').src = '../Trio/Images/blank.png'}
          }
          if (this.state.trio_played_2.length === 3) {
                  if (this.state.trio_played_2[0][0] === 'S'){if (this.state.trio_played_2[1][0] === this.state.trio_played_2[2][0]){this.setState({player_trios_complete: true}); this.setState({correct: 2}); this.discard_initialise(); }}
                  else if (this.state.trio_played_2[1][0] === 'S'){if (this.state.trio_played_2[0][0] === this.state.trio_played_2[2][0]){this.setState({player_trios_complete: true});  this.setState({correct: 2}); this.discard_initialise();}}
                  else if (this.state.trio_played_2[2][0] === 'S'){if (this.state.trio_played_2[0][0] === this.state.trio_played_2[1][0]){this.setState({player_trios_complete: true});  this.setState({correct: 2}); this.discard_initialise();}}

                  else if (this.state.trio_played_2[0][0] === 'S' && this.state.trio_played_2[1][0] === 'S') {this.setState({player_trios_complete: true});  this.setState({correct: 2}); this.discard_initialise();}
                  else if (this.state.trio_played_2[1][0] === 'S' && this.state.trio_played_2[2][0] === 'S') {this.setState({player_trios_complete: true});  this.setState({correct: 2}); this.discard_initialise();}
                  else if (this.state.trio_played_2[0][0] === 'S' && this.state.trio_played_2[2][0] === 'S') {this.setState({player_trios_complete: true});  this.setState({correct: 2}); this.discard_initialise();}
                  else if (this.state.trio_played_2[0][0] === 'S' && this.state.trio_played_2[1][0] === 'S' && this.state.trio_played_2[2][0] === 'S') {this.setState({player_trios_complete: true});  this.setState({correct: 2}); this.discard_initialise();}

                  else if (this.state.trio_played_2[0][0] === this.state.trio_played_2[1][0] && this.state.trio_played_2[1][0] === this.state.trio_played_2[2][0] && this.state.trio_played_2[0][0] === this.state.trio_played_2[2][0]){this.setState({player_trios_complete: true}); this.setState({correct: 2}); this.discard_initialise();}

            //All cards from the first and second trios are added back to the player's hand
            else {
              window.alert('Sorry that is not a valid trio'); 
              this.state.hand.push(this.state.trio_played_2[0]);
              this.state.hand.push(this.state.trio_played_2[1]);
              this.state.hand.push(this.state.trio_played_2[2]); 
              this.setState({trio_played_2: []}); 
              document.getElementById('player_trio_2_card_1').src = '../Trio/Images/blank.png'; 
              document.getElementById('player_trio_2_card_2').src = '../Trio/Images/blank.png'; 
              document.getElementById('player_trio_2_card_3').src = '../Trio/Images/blank.png'; 
              this.setState({playing_trios: false});
              this.state.hand.push(this.state.trio_played_1[0]);
              this.state.hand.push(this.state.trio_played_1[1]);
              this.state.hand.push(this.state.trio_played_1[2]); 
              this.setState({trio_played_1: []}); 
              document.getElementById('player_trio_1_card_1').src = '../Trio/Images/blank.png'; 
              document.getElementById('player_trio_1_card_2').src = '../Trio/Images/blank.png'; 
              document.getElementById('player_trio_1_card_3').src = '../Trio/Images/blank.png'; 
              this.hand_refresh(); 
              this.setState({correct: 0})
            }
          }
        }
      }
    }

  ///////////////////////////////////////////////////////////////////// AFTER TRIOS PLAYED ///////////////////////////////////////////////////////////////////////

  //Occurs of the player has already played their two trios
  else if (this.state.player_trios_complete === true){
    //Checks which trio the player wants to add a card to
    if (this.state.trio_to_add_to === 1){this.add_cards(this.state.trio_played_1, this.state.trio_list_1)}
    if (this.state.trio_to_add_to === 2){this.add_cards(this.state.trio_played_2, this.state.trio_list_2)}
    if (this.state.trio_to_add_to === 3){this.add_cards(this.state.CPU_complete_trio_1, this.state.CPU_trio_list_1)}
    if (this.state.trio_to_add_to === 4){this.add_cards(this.state.CPU_complete_trio_2, this.state.CPU_trio_list_2)}
    //If the discard button has been clicked, then the card that has been clicked is discarded
    if (this.state.discard === true) {document.getElementById(this.state.card_list[this.state.amount_discarded]).src = '../Trio/Images/blank.png'; this.player_discard(); this.move_cards_pos_back();}
    //If the player has no cards left then they win
    if (this.state.hand.length === 0) {window.alert('YOU WIN'); this.setState({game_over: true}); window.location.href='/Projects'}
  }

  ///////////////////////////////////////////////////////////////////  REARRANGE CARDS IN PLAYER'S HAND ////////////////////////////////////////////////////////
  if (this.state.rearrange === true){
    if (this.state.card_swap_count === 0){this.setState({first_card_to_swap: this.state.card_num_clicked}); this.setState({card_swap_count: this.state.card_swap_count + 1});}
    else if (this.state.card_swap_count === 1){
      this.setState({second_card_to_swap: this.state.card_num_clicked})
      //uses a placeholder so that the card is not completely erased from the system
      var placeholder = this.state.hand[this.state.first_card_to_swap]
      
      // 1. Make a shallow copy of the items
      var handCopy = [...this.state.hand];
      // 2. Make a shallow copy of the item you want to mutate
      let handCopyItem = {...handCopy[this.state.first_card_to_swap]};
      // 3. Replace the property you're intested in
      handCopyItem = this.state.hand[this.state.second_card_to_swap];
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      handCopy[this.state.first_card_to_swap] = handCopyItem;
      // 2. Make a shallow copy of the item you want to mutate
      let handCopyItem2 = {...handCopy[this.state.second_card_to_swap]};
      // 3. Replace the property you're intested in
      handCopyItem2 = placeholder;
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      handCopy[this.state.second_card_to_swap] = handCopyItem2;

      // 5. Set the state to our new copy
      this.setState({hand: handCopy});

      // this.state.hand[this.state.first_card_to_swap] = this.state.hand[this.state.second_card_to_swap]
      // this.state.hand[this.state.second_card_to_swap] = placeholder
      this.setState({card_swap_count: 0})
      this.setState({rearrange: false})
      this.hand_refresh()
    }}
  }

  //Functions that indicate which card has been clicked
    discard1() {if (this.state.game_over === false) {this.setState({card_num_clicked: 0}); this.card_clicked();}}
    discard2() {if (this.state.game_over === false) {this.setState({card_num_clicked: 1}); this.card_clicked();}}
    discard3() {if (this.state.game_over === false) {this.setState({card_num_clicked: 2}); this.card_clicked();}}
    discard4() {if (this.state.game_over === false) {this.setState({card_num_clicked: 3}); this.card_clicked();}}
    discard5() {if (this.state.game_over === false) {this.setState({card_num_clicked: 4}); this.card_clicked();}}
    discard6() {if (this.state.game_over === false) {this.setState({card_num_clicked: 5}); this.card_clicked();}}
    discard7() {if (this.state.game_over === false) {this.setState({card_num_clicked: 6}); this.card_clicked();}}
    discard8() {if (this.state.game_over === false) {this.setState({card_num_clicked: 7}); this.card_clicked();}}
    discard9() {if (this.state.game_over === false) {this.setState({card_num_clicked: 9}); this.card_clicked();}}
    discard10() {if (this.state.game_over === false) {this.setState({card_num_clicked: 10});this.card_clicked();}}
    discard11() {if (this.state.game_over === false) {this.setState({card_num_clicked: 11}); this.card_clicked();}}
    discard12() {if (this.state.game_over === false) {this.setState({card_num_clicked: 12}); this.card_clicked();}}
    discard13() {if (this.state.game_over === false) {this.setState({card_num_clicked: 13}); this.card_clicked();}}


//     ////////////////////////////////////////////////CPU TURN/////////////////////////////////////////////////

    //This completes the entire CPU's turn and is called after the player has taken their turn
      CPU_turn(){
        if (this.state.game_over === false) {
        console.log('CPU START')
        console.log(this.state.CPU_hand)
        var pile_decision = true;
        var card_check_counter = 0;
        var CPU_possible_trio = [];
        var card_found = false;
        //The CPU picks whether to pick up from the pile or deck depending on what cards are in their hands
        while (pile_decision === true){
        if (this.state.CPU_hand[card_check_counter][0] === this.state.deck[0][0]){
            CPU_possible_trio.push(this.state.CPU_hand[card_check_counter])}
        if (card_check_counter === this.state.CPU_hand.length-1){
            if (this.state.deck[0][0] === 'S'){
              console.log('a')
              this.state.CPU_hand.push(this.state.deck[0])
              this.state.deck.splice(0,1)
                card_found = true
                pile_decision = false}

            if (card_found === false){
              if (this.state.player_trios_complete === true){
                  if (this.state.trio_played_1.length > 0){
                          if (this.state.deck[0][0] === this.state.trio_played_1[0][0]){
                            console.log('b')
                            this.state.CPU_hand.push(this.state.deck[0])
                            this.state.deck.splice(0,1)
                              card_found = true
                              pile_decision = false}}

                  if (this.state.trio_played_2.length > 0){
                          if (this.state.deck[0][0] === this.state.trio_played_2[0][0]){
                            console.log('c')
                            this.state.CPU_hand.push(this.state.deck[0])
                            this.state.deck.splice(0,1)
                              card_found = true
                              pile_decision = false}}}}

            if (card_found === false){
              if (this.state.CPU_trios_complete === true){
                  if (this.state.CPU_trio_1.length > 0){
                      if (this.state.deck[0][0] === this.state.CPU_trio_1[0][0]){
                        console.log('d')
                        this.state.CPU_hand.push(this.state.deck[0])
                        this.state.deck.splice(0,1)
                          card_found = true
                          pile_decision = false}}

                  if (this.state.CPU_trio_2.length > 0){
                      if (this.state.deck[0][0] === this.state.CPU_trio_2[0][0]){
                        console.log('e')
                        this.state.CPU_hand.push(this.state.deck[0])
                        this.state.deck.splice(0,1)
                          card_found = true
                          pile_decision = false}}}}

            if (card_found === false){
              if (this.state.player_trios_complete === false){
                  if (CPU_possible_trio.length > 1){
                    console.log('f')
                    this.state.CPU_hand.push(this.state.deck[0])
                    this.state.deck.splice(0,1)
                      card_found = true
                      pile_decision = false}

                  if (this.state.CPU_trios_complete === false){
                      if (CPU_possible_trio.length > 1){
                        console.log('h')
                        this.state.CPU_hand.push(this.state.deck[0])
                        this.state.deck.splice(0,1)
                          card_found = true
                          pile_decision = false}}

                  else {
                    console.log('i')
                    this.state.CPU_hand.push(this.state.deck[1])
                    this.state.deck.splice(1,1)
                      card_found = true
                      pile_decision = false}}}

            if (card_found === false){
              console.log('j')
              this.state.CPU_hand.push(this.state.deck[1])
              this.state.deck.splice(1,1)
                pile_decision = false}
            }
            card_check_counter += 1}

        console.log(this.state.CPU_hand)
        this.state.CPU_hand.sort();

        if (this.state.CPU_trios_complete === false){

        var count_through_for_jokers =0
        var joker_list = []
        //Finds any jokers in the CPU's hand
        while (count_through_for_jokers < this.state.CPU_hand.length){
            if (this.state.CPU_hand[count_through_for_jokers][0] === 'S'){joker_list.push(this.state.CPU_hand[count_through_for_jokers])}
            count_through_for_jokers += 1}

        //Finds cards where there are two of the same number. Ignores any assortments of cards where there are three of the same ie. if there was three nines they would not be included but two sixes alone would
        console.log('joker_list:')
        console.log(joker_list)
        var double_cards = []
        if (this.state.CPU_hand[this.state.CPU_hand.length-3][0] !== this.state.CPU_hand[this.state.CPU_hand.length-2][0] && this.state.CPU_hand[this.state.CPU_hand.length-2][0] === this.state.CPU_hand[this.state.CPU_hand.length-1][0]){
            if (this.state.CPU_hand[this.state.CPU_hand.length-2][0] !== 'S' && this.state.CPU_hand[this.state.CPU_hand.length-1][0] !== 'S'){
              double_cards.push(this.state.CPU_hand[this.state.CPU_hand.length-2])
              double_cards.push(this.state.CPU_hand[this.state.CPU_hand.length-1])}}
        if (this.state.CPU_hand[0][0] === this.state.CPU_hand[1][0] && this.state.CPU_hand[1][0] !== this.state.CPU_hand[2][0]){
              if (this.state.CPU_hand[0] !== 'S' && this.state.CPU_hand[1] !== 'S'){
                  double_cards.push(this.state.CPU_hand[0])
                  double_cards.push(this.state.CPU_hand[1])}}

        var count_through_for_doubles = 0
        while (count_through_for_doubles < this.state.CPU_hand.length-3){
            if (this.state.CPU_hand[count_through_for_doubles][0] === this.state.CPU_hand[count_through_for_doubles+1][0] && this.state.CPU_hand[count_through_for_doubles+1][0] === this.state.CPU_hand[count_through_for_doubles+2][0]){/*do nothing*/}
            else if (this.state.CPU_hand[count_through_for_doubles][0] !== this.state.CPU_hand[count_through_for_doubles+1][0] && this.state.CPU_hand[count_through_for_doubles+1][0] === this.state.CPU_hand[count_through_for_doubles+2][0] && this.state.CPU_hand[count_through_for_doubles+2][0] !== this.state.CPU_hand[count_through_for_doubles+3][0]){
                if (this.state.CPU_hand[count_through_for_doubles+1][0] !== 'S'){
                  this.state.double_cards.push(this.state.CPU_hand[count_through_for_doubles+1])}
                if (this.state.CPU_hand[count_through_for_doubles+2][0] !== 'S'){
                    double_cards.push(this.state.CPU_hand[count_through_for_doubles+2])}}
            count_through_for_doubles += 1}

      console.log('doubles:')
      console.log(double_cards)

    //Finds any trios in the CPU's hand without the use of a joker

        this.CPU_find_trio(this.state.CPU_trio_1)
        this.CPU_find_trio(this.state.CPU_trio_2)

        console.log('CPU trios:')
        console.log(this.state.CPU_trio_1)
        console.log(this.state.CPU_trio_2)

        this.CPU_change_for_joker(this.state.CPU_trio_1, joker_list, double_cards)
        this.CPU_change_for_joker(this.state.CPU_trio_2, joker_list, double_cards)

        console.log('CPU joker trios:')
        console.log(this.state.CPU_trio_1)
        console.log(this.state.CPU_trio_2)

    //If the CPU has two complete trios the trios are displayed on screen and the CPU has won
      if (this.state.CPU_trio_1.length === 3 && this.state.CPU_trio_2.length === 3){
        this.setState({CPU_complete_trio_1: this.state.CPU_trio_1});
        this.setState({CPU_complete_trio_2: this.state.CPU_trio_2});
        console.log('Made it 0')
          this.trio_refresh(this.state.CPU_complete_trio_1,this.state.CPU_trio_list_1);
          this.trio_refresh(this.state.CPU_complete_trio_2,this.state.CPU_trio_list_2);

          this.setState({CPU_trios_complete: true});
          console.log('Made it 0.5')
      }
      console.log('Made it 1')

    // finds any indivdual cards that are the most useless to the CPU for it to discard
        var individual_card_counter = 0
        var individual_cards = []
        var increase_individual = 0
        if (this.state.CPU_hand[0][0] !== this.state.CPU_hand[1][0]){
            if (this.state.CPU_hand[0][0] !== 'S'){
                if (this.state.CPU_complete_trio_1.length > 0 && this.state.CPU_complete_trio_2.length > 0){
                    if (this.state.CPU_hand[0][0] === this.state.CPU_trio_1[0][0]) {increase_individual = 1}
                    if (this.state.CPU_hand[0][0] === this.state.CPU_trio_2[0][0]) {increase_individual = 1}}
                if (this.state.trio_played_1.length > 0 && this.state.trio_played_2.length > 0){
                    if (this.state.CPU_hand[0][0] === this.state.trio_played_1[0][0]) {increase_individual = 1}
                    if (this.state.CPU_hand[0][0] === this.state.trio_played_2[0][0]) {increase_individual = 1}}
                if (increase_individual === 1){individual_card_counter = individual_card_counter+ 1}

                if (increase_individual === 0){
                    individual_cards.push(this.state.CPU_hand[0])
                    individual_card_counter = individual_card_counter + 1}}}

        individual_card_counter = 0
        while (individual_card_counter < this.state.CPU_hand.length-2){
          console.log(individual_card_counter)
            increase_individual = 0
            if (this.state.CPU_hand[individual_card_counter][0] !== this.state.CPU_hand[individual_card_counter+1][0] && this.state.CPU_hand[individual_card_counter+1][0] !== this.state.CPU_hand[individual_card_counter+2][0]){
                if (this.state.CPU_hand[individual_card_counter+1][0] !== 'S'){
                    if (this.state.CPU_complete_trio_1.length > 0 && this.state.CPU_complete_trio_2.length > 0){
                        if (this.state.CPU_hand[individual_card_counter+1][0] === this.state.CPU_trio_1[0][0]) {increase_individual = 1}
                        if (this.state.CPU_hand[individual_card_counter+1][0] === this.state.CPU_trio_2[0][0]) {increase_individual = 1}}
                    if (this.state.trio_played_1.length > 0 && this.state.trio_played_2.length > 0){
                        if (this.state.CPU_hand[individual_card_counter+1][0] === this.state.trio_played_1[0][0]) {increase_individual = 1}
                        if (this.state.CPU_hand[individual_card_counter+1][0] === this.state.trio_played_2[0][0]) {increase_individual = 1}}
                    if (increase_individual === 1){individual_card_counter = individual_card_counter+1}

                    if (increase_individual === 0){
                        individual_cards.push(this.state.CPU_hand[individual_card_counter+1])
                        individual_card_counter =individual_card_counter+1}}}

            else {individual_card_counter= individual_card_counter+1}}

        individual_card_counter = 0
        var CPU_hand_length= this.state.CPU_hand.length
        increase_individual = 0
        if (this.state.CPU_hand[CPU_hand_length-2][0] !== this.state.CPU_hand[CPU_hand_length-1][0]){
            if (this.state.CPU_hand[CPU_hand_length-1][0] !== 'S'){
                if (this.state.CPU_complete_trio_1.length > 0 && this.state.CPU_complete_trio_2.length > 0){
                    if (this.state.CPU_hand[CPU_hand_length-1][0] === this.state.CPU_trio_1[0][0]) {increase_individual = 1}
                    if (this.state.CPU_hand[CPU_hand_length-1][0] === this.state.CPU_trio_2[0][0]) {increase_individual = 1}}
                if (this.state.trio_played_1.length > 0 && this.state.trio_played_2.length > 0){
                    if (this.state.CPU_hand[CPU_hand_length-1][0] === this.state.trio_played_1[0][0]) {increase_individual = 1}
                    if (this.state.CPU_hand[CPU_hand_length-1][0] === this.state.trio_played_2[0][0]) {increase_individual = 1}}
                if (increase_individual === 1){individual_card_counter = individual_card_counter+1}

                if (increase_individual === 0){
                    individual_cards.push(this.state.CPU_hand[CPU_hand_length-1])
                    individual_card_counter = individual_card_counter+1}}}
    console.log('Made it 2')
    //If there are no individual cards...
    if (individual_cards.length === 0){individual_cards = double_cards}
    //If there are still no individual cards...
    if (individual_cards.length === 0){individual_cards = this.state.CPU_hand}
    //CPU discards most useless card and adds it to the discard pile
    this.state.deck.splice(0,1)
    this.state.deck.unshift(individual_cards[individual_cards.length-1])
    var discarded_CPU_card_pos = this.state.CPU_hand.indexOf(individual_cards[individual_cards.length-1])
    this.state.CPU_hand.splice(discarded_CPU_card_pos,1)
    console.log(this.state.CPU_hand)
    console.log(this.state.deck)
    this.pile_refresh();}
  ////////////////////////////////////////////////////// CPU ADD CARDS /////////////////////////////////////////////////////////////////
        else if (this.state.CPU_trios_complete === true){
          console.log('complete')
          console.log(this.state.CPU_complete_trio_1)
          console.log(this.state.CPU_complete_trio_2)
            var trio_adder = 0
            while (trio_adder < this.state.CPU_hand.length){
                var adding = true
                var which_trio = this.state.CPU_hand[trio_adder][0]
                if (which_trio === 'S'){
                    if (this.state.trio_played_1.length > 0 && this.state.trio_played_1.length < 7){
                      this.state.trio_played_1.push(this.state.CPU_hand[trio_adder])
                      this.state.CPU_hand.splice(trio_adder,1)
                        trio_adder = trio_adder-1
                        this.setState({num_cards_left: this.state.num_cards_left - 1});
                        this.trio_refresh(this.state.trio_played_1, this.state.trio_list_1)
                        }
                    else if (this.state.trio_played_2.length > 0 && this.state.trio_played_2.length < 7){
                      this.state.trio_played_2.push(this.state.CPU_hand[trio_adder])
                      this.state.CPU_hand.splice(trio_adder,1)
                        trio_adder = trio_adder-1
                        this.setState({num_cards_left: this.state.num_cards_left - 1});
                        this.trio_refresh(this.state.trio_played_2, this.state.trio_list_2)
                      }
                    else if (this.state.CPU_complete_trio_1.length > 0 && this.state.CPU_complete_trio_1.length < 7){
                      this.state.CPU_complete_trio_1.push(this.state.CPU_hand[trio_adder])
                      this.state.CPU_hand.splice(trio_adder,1)
                        trio_adder = trio_adder-1
                        this.setState({num_cards_left: this.state.num_cards_left - 1});
                        this.trio_refresh(this.state.CPU_complete_trio_1,this.state.CPU_trio_list_1)
                      }
                    else if (this.state.CPU_complete_trio_2.length > 0 && this.state.CPU_complete_trio_2.length < 7){
                      this.state.CPU_complete_trio_2.push(this.state.CPU_hand[trio_adder])
                      this.state.CPU_hand.splice(trio_adder,1)
                        trio_adder = trio_adder-1
                        this.setState({num_cards_left: this.state.num_cards_left - 1});
                        this.trio_refresh(this.state.CPU_complete_trio_2,this.state.CPU_trio_list_2)
                      }
                      adding = false}

                if (this.state.trio_played_1.length > 0){
                  if (adding === true){
                    if (this.state.trio_played_1[0][0] === which_trio || this.state.trio_played_1[1][0] === which_trio || this.state.trio_played_1[2][0] === which_trio){
                      this.state.trio_played_1.push(this.state.CPU_hand[trio_adder])
                      this.state.CPU_hand.splice(trio_adder,1)
                        trio_adder = trio_adder-1
                        adding = false
                        this.setState({num_cards_left: this.state.num_cards_left - 1});
                        this.trio_refresh(this.state.trio_played_1, this.state.trio_list_1)
                      }}}
                if (this.state.trio_played_2.length > 0){
                    if (adding === true){
                        if (this.state.trio_played_2[0][0] === which_trio || this.state.trio_played_2[1][0] === which_trio || this.state.trio_played_2[2][0] === which_trio){
                          this.state.trio_played_2.push(this.state.CPU_hand[trio_adder])
                          this.state.CPU_hand.splice(trio_adder,1)
                          trio_adder = trio_adder-1
                          adding = false
                          this.setState({num_cards_left: this.state.num_cards_left - 1});
                          this.trio_refresh(this.state.trio_played_2, this.state.trio_list_2)
                          }}}
                if (this.state.CPU_complete_trio_1.length > 0){
                    if (adding === true){
                        if (this.state.CPU_complete_trio_1[0][0] === which_trio || this.state.CPU_complete_trio_1[1][0] === which_trio || this.state.CPU_complete_trio_1[2][0] === which_trio){
                          this.state.CPU_complete_trio_1.push(this.state.CPU_hand[trio_adder])
                          this.state.CPU_hand.splice(trio_adder,1)
                          trio_adder = trio_adder-1
                          adding = false
                          this.setState({num_cards_left: this.state.num_cards_left - 1});
                          this.trio_refresh(this.state.CPU_complete_trio_1,this.state.CPU_trio_list_1)
                          }}}
                if (this.state.CPU_complete_trio_2.length > 0){
                    if (adding === true){
                        if (this.state.CPU_complete_trio_2[0][0] === which_trio || this.state.CPU_complete_trio_2[1][0] === which_trio || this.state.CPU_complete_trio_2[2][0] === which_trio){
                          this.state.CPU_complete_trio_2.push(this.state.CPU_hand[trio_adder])
                          this.state.CPU_hand.splice(trio_adder,1)
                          trio_adder = trio_adder-1
                          adding = false
                          this.setState({num_cards_left: this.state.num_cards_left - 1});
                          this.trio_refresh(this.state.CPU_complete_trio_2,this.state.CPU_trio_list_2)
                        }}}
                trio_adder+=1}

            console.log(this.state.CPU_complete_trio_1)
            console.log(this.state.CPU_complete_trio_2)
            console.log(this.state.CPU_hand)
            this.state.CPU_hand.sort();

            if (this.state.CPU_hand.length === 1) {
              this.state.CPU_hand.splice(0,1)
                window.alert('CPU WINS!')
                this.setState({game_over: true});
                window.location.href='/Projects'
                }

            if (this.state.CPU_hand.length > 1){
              this.state.deck.splice(0,1)
              this.state.deck.unshift(this.state.CPU_hand[this.state.CPU_hand.length-1])
              this.state.CPU_hand.splice(this.state.CPU_hand.length-1,1)}

            this.pile_refresh()
            console.log(this.state.CPU_hand)
        }
      }}

  CPU_find_trio(CPU_trio){
    var count_through_hand= 0
    var checking_for_trios = true
    if (CPU_trio.length === 0){
      while (checking_for_trios === true){
        console.log('CPU Hand:')
        console.log(this.state.CPU_hand)
        console.log(count_through_hand)
        console.log('Numbers:');
        console.log(count_through_hand);
        console.log(this.state.CPU_hand.length-4);
        if (this.state.CPU_hand[count_through_hand][0] === this.state.CPU_hand[count_through_hand+1][0] && this.state.CPU_hand[count_through_hand+1][0] === this.state.CPU_hand[count_through_hand+2][0] && this.state.CPU_hand[count_through_hand][0] === this.state.CPU_hand[count_through_hand+2][0] && this.state.CPU_hand[count_through_hand][0] !== 'S'){
          console.log('yoooooooooooyoyo')
          console.log(this.state.CPU_hand)
          CPU_trio.push(this.state.CPU_hand[count_through_hand])
          CPU_trio.push(this.state.CPU_hand[count_through_hand+1])
          CPU_trio.push(this.state.CPU_hand[count_through_hand+2])
          this.state.CPU_hand.splice(count_through_hand,1)
          this.state.CPU_hand.splice(count_through_hand,1)
          this.state.CPU_hand.splice(count_through_hand,1)
          console.log(this.state.CPU_hand)
          checking_for_trios= false
        }
        else if (count_through_hand === this.state.CPU_hand.length-3) {checking_for_trios= false}
        count_through_hand+= 1
      }
    }
  }

  CPU_change_for_joker(CPU_trio, joker_list,double_cards){
          var final_double = double_cards.length-1
        //Creates a trio using a joker
          if (joker_list.length > 0){
              if (CPU_trio.length === 0){
                      if (double_cards.length > 0){
                        CPU_trio.push(double_cards[final_double])
                        CPU_trio.push(double_cards[final_double-1])
                        CPU_trio.push(joker_list[0])

                        var discard_pos_1 = this.state.CPU_hand.indexOf(double_cards[final_double])
                        this.state.CPU_hand.splice(discard_pos_1,1)
                        var discard_pos_2 = this.state.CPU_hand.indexOf(double_cards[final_double-1])
                        this.state.CPU_hand.splice(discard_pos_2,1)
                        var discard_pos_3 = this.state.CPU_hand.indexOf(joker_list[0])
                        this.state.CPU_hand.splice(discard_pos_3,1)

                        joker_list.splice(0,1);
                        double_cards.splice(final_double,1)
                        double_cards.splice(final_double-1,1)

                      }}}

                      this.state.CPU_hand.sort();
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
                <div id = 'play'>
                  <p id = 'p1' className="trio-button" onClick = {() => this.play_initialise()}>PLAY TRIOS</p>
                  <p id = 'p2' className="trio-button" onClick = {() => this.discard_initialise()}>DISCARD</p>
                  <p id = 'p3' className="trio-button" onClick = {() => this.rearrange_initialise()}>REARRANGE CARDS</p>
                  <p id = 'p4'>Instruction pop-ups</p>

                  <img id = 'player_card_1' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard1()}/>
                  <img id = 'player_card_2' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard2()}/>
                  <img id = 'player_card_3' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard3()}/>
                  <img id = 'player_card_4' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard4()}/>
                  <img id = 'player_card_5' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard5()}/>
                  <img id = 'player_card_6' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard6()}/>
                  <img id = 'player_card_7' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard7()}/>
                  <img id = 'player_card_8' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard8()}/>
                  <img id = 'player_card_9' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard9()}/>
                  <img id = 'player_card_10' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard10()}/>
                  <img id = 'player_card_11' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard11()}/>
                  <img id = 'player_card_12' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard12()}/>
                  <img id = 'player_card_13' className="trio-button" src='../Trio/Images/blank.png' alt='Card' onClick = {() => this.discard13()}/>

                  <img id = 'player_trio_1_card_1' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_1_card_2' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_1_card_3' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_1_card_4' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_1_card_5' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_1_card_6' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_1_card_7' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_1_card_8' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>

                  <img id = 'player_trio_2_card_1' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_2_card_2' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_2_card_3' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_2_card_4' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_2_card_5' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_2_card_6' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_2_card_7' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'player_trio_2_card_8' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>

                  <img id = 'CPU_trio_1_card_1' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_1_card_2' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_1_card_3' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_1_card_4' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_1_card_5' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_1_card_6' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_1_card_7' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_1_card_8' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>

                  <img id = 'CPU_trio_2_card_1' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_2_card_2' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_2_card_3' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_2_card_4' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_2_card_5' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_2_card_6' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_2_card_7' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>
                  <img id = 'CPU_trio_2_card_8' className="trio-button" alt='Card' src ='../Trio/Images/blank.png'/>

                  <div id = 'add_to_player_trio_1' className="trio-button" onClick = {() => this.add_trio_1()}/>
                  <div id = 'add_to_player_trio_2' className="trio-button" onClick = {() => this.add_trio_2()}/>
                  <div id = 'add_to_CPU_trio_1' className="trio-button" onClick = {() => this.add_trio_3()}/>
                  <div id = 'add_to_CPU_trio_2' className="trio-button" onClick = {() => this.add_trio_4()}/>

                  <div id = 'play_button' className="trio-button" onClick = {() => this.play_initialise()}/>
                  <div id = 'discard_button' className="trio-button" onClick = {() => this.discard_initialise()}/>
                  <div id = 'rearrange_button' className="trio-button" onClick = {() => this.rearrange_initialise()}/>
                  <img id = 'home_button' className="trio-button" alt='Button' src= '../Trio/Images/home.png' onClick = {() => window.location.href='/Projects'}/>
                  <img id = 'instruction_switch' className="trio-button" alt='Button' src='../Trio/Images/ON.png' onClick = {() => this.instruction_change()}/>

                  <img id = 'pile' className="trio-button" alt='Card' src = '../Trio/Images/blank.png' onClick = {() => this.pick_up_pile()}/>
                  <img id = 'deck' className="trio-button" alt='Card' src = '../Trio/Images/card_back.png' onClick = {() => this.pick_up_deck()}/>
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

export default TrioGame;