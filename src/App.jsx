import './App.css';
import React, {Component} from 'react';

import Main from './components/main'
import Toolbar from './components/Toolbar/Toolbar'
import SideDrawer from './components/SideDrawer/SideDrawer';
import Backdrop from './components/Backdrop/Backdrop';

class App extends Component {
  state = {
    sideDrawerOpen: false
  }

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return {sideDrawerOpen: !prevState.sideDrawerOpen}
    });
  }

  backdropClickHandler = () => {
    this.setState({sideDrawerOpen: false})
  }

  //Background balls: https://www.cssscript.com/animated-particles-background-pure-javascript/
  // background = () => {
  //   // Some random colors
  //   const colors = ["#DC143C","#DC143C"];

  //   const numBalls = 50;
  //   const balls = [];

  //   for (let i = 0; i < numBalls; i++) {
  //     let ball = document.createElement("div");
  //     ball.classList.add("ball");
  //     ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  //     //-5 and -23 so that the balls don't exceed the boundary of the screen and enabling the scroller
  //     ball.style.left = `${Math.floor(Math.random() * 100) - 5}vw`;
  //     ball.style.top = `${Math.floor(Math.random() * 100) - 23}vh`;
  //     ball.style.transform = `scale(${Math.random()})`;
  //     ball.style.width = `${Math.random()}em`;
  //     ball.style.height = ball.style.width;
      
  //     balls.push(ball);
  //     document.body.append(ball);
  //   }

  //   // Keyframes
  //   balls.forEach((el, i, ra) => {
  //     let to = {
  //       x: Math.random() * (i % 2 === 0 ? -11 : 11),
  //       y: Math.random() * 12
  //     };

  //     let anim = el.animate(
  //       [
  //         { transform: "translate(0, 0)" },
  //         { transform: `translate(${to.x}rem, ${to.y}rem)` }
  //       ],
  //       {
  //         duration: (Math.random() + 1) * 2000, // random duration
  //         direction: "alternate",
  //         fill: "both",
  //         iterations: Infinity,
  //         easing: "ease-in-out"
  //       }
  //     );
  //   });
  // }

  componentDidMount() {
    // this.background();
  }

  render(){
    let backdrop;

    if(this.state.sideDrawerOpen){
      backdrop=<Backdrop click={this.backdropClickHandler}/>;
    }
    return (
      <div className="app-background">
        <div className='Layout'>
          <Toolbar drawerClickHandler={this.drawerToggleClickHandler}/>
          <SideDrawer show={this.state.sideDrawerOpen}/>
          {backdrop}
          {/* <span class="circle"></span> */}
          <div className="page-content">
            <Main/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
