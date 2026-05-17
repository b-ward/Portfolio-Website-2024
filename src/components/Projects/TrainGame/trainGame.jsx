import { useState } from 'react';
import getSolutions from './trainGameCalculations';
import Modal from '../../Shared/Modal';

const TrainGame = () => {
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [solutions, setSolutions] = useState([]);
  const [helpModalShow, setHelpModalShow] = useState(false);
  const [madeModalShow, setMadeModalShow] = useState(false);

  function onInputChange(event) {
    setNumber(event.target.value);
  }

  function validateAndSubmit(num) {
    if (num.length === 4 && /^\d+$/.test(num)) {
      setError('');
      const sols = getSolutions(num);
      const solutionRows = [];
      if (sols.length > 0) {
        solutionRows.push(<h3 key="title">Solutions</h3>);
        for (let i = 0; i < sols.length; i++) {
          solutionRows.push(<div key={i}>{sols[i]}</div>);
        }
      } else {
        solutionRows.push(<h3 key="title">No Solutions Found</h3>);
      }
      setSolutions(solutionRows);
    } else {
      setSolutions([]);
      setError('Please enter a 4-digit number');
    }
  }

  return (
    <div className="text-center text-accent min-h-screen">
      <div className="px-4 py-3">
        <div className="pb-2"><h1>Train Game</h1></div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setMadeModalShow(true)}
            className="bg-accent text-black font-semibold px-4 py-2 rounded"
          >
            Creation
          </button>
          <button
            onClick={() => setHelpModalShow(true)}
            className="bg-accent text-black font-semibold px-4 py-2 rounded"
          >
            Help
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <input
          name="number"
          type="text"
          value={number}
          onChange={onInputChange}
          className="border border-accent/50 bg-transparent text-white rounded px-3 py-2 text-center"
        />
        <button
          onClick={() => validateAndSubmit(number)}
          className="bg-accent text-black font-semibold px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>

      <div className="pt-2 text-red-500">{error}</div>
      <div className="pt-2 pb-40">{solutions}</div>

      {helpModalShow && (
        <Modal title="Help" onClose={() => setHelpModalShow(false)}>
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
        </Modal>
      )}

      {madeModalShow && (
        <Modal title="How this was made" onClose={() => setMadeModalShow(false)}>
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
          <img src="../../app1.jpg" className="w-1/2" alt="Train Game App 1" />
          <img src="../../app2.jpg" className="w-1/2" alt="Train Game App 2" />
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
        </Modal>
      )}
    </div>
  );
};

export default TrainGame;
