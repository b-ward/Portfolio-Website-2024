import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Landing from './Landing/landingpage';
import About from './About/about';
import CV from './CV/cv';
import Projects from './Projects/projects';
import TrainGame from './Projects/TrainGame/trainGame';
import PaceCalculator from './Projects/PaceCalculator/paceCalculator';
import Photos from './Photos/photos';
import NoisyDetector from './Projects/NoisyDetector/noisyDetector';
import Arbitrage from './Projects/Arbitrage/arbitrage';
import TrioHome from './Projects/Trio/trioHome';
import TrioGame from './Projects/Trio/trioGame';
import Music from './Music/music';
import BusinessBrains from './BusinessBrains/businessBrains';

const Main = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" exact element={<Landing/>}/>
            <Route path="/About" exact element={<About/>}/>
            <Route path="/CV" exact element={<CV/>}/>
            <Route path="/Projects" exact element={<Projects/>}/>
            <Route path="/Projects/Arbitrage" exact element={<Arbitrage/>}/>
            <Route path="/Projects/Trio" exact element={<TrioHome/>}/>
            <Route path="/Projects/TrioGame" exact element={<TrioGame/>}/>
            <Route path="/Projects/TrainGame" exact element={<TrainGame/>}/>
            <Route path="/Projects/PaceCalculator" exact element={<PaceCalculator/>}/>
            <Route path="/Projects/Noise" exact element={<NoisyDetector/>}/>
            <Route path="/Photos" exact element={<Photos/>}/>
            <Route path="/Music" exact element={<Music/>}/>
            <Route path="/BusinessBrains" exact element={<BusinessBrains/>}/>
        </Routes>
    </BrowserRouter>
)

export default Main;