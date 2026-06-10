import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Landing from './Landing/landingpage';
import About from './About/about';
import CV from './CV/cv';
import Projects from './Projects/projects';
import TrainGame from './Projects/TrainGame/trainGame';
import PaceCalculator from './Projects/PaceCalculator/paceCalculator';
import FiveHundred from './Projects/500/500.jsx';
import Photos from './Photos/photos';
import NoisyDetector from './Projects/NoisyDetector/noisyDetector';
import Arbitrage from './Projects/Arbitrage/arbitrage';
import TrioHome from './Projects/Trio/trioHome';
import TrioGame from './Projects/Trio/trioGame';
import Music from './Music/music';
import BusinessBrains from './BusinessBrains/businessBrains';
import NBALadder from './Projects/NBA-Ladder/NBA-Ladder';
import TopArtistsMap from './Projects/TopArtistsMap/topArtistsMap';
import PLPredictions from './Projects/PLPredictions/plPredictions';
import FPLDraftChecker from './Projects/FPLDraft/fplDraftChecker';


const Main = () => (
    <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/About" element={<About/>}/>
        <Route path="/CV" element={<CV/>}/>
        <Route path="/Projects" element={<Projects/>}/>
        <Route path="/Projects/Arbitrage" element={<Arbitrage/>}/>
        <Route path="/Projects/Trio" element={<TrioHome/>}/>
        <Route path="/Projects/TrioGame" element={<TrioGame/>}/>
        <Route path="/Projects/TrainGame" element={<TrainGame/>}/>
        <Route path="/Projects/PaceCalculator" element={<PaceCalculator/>}/>
        <Route path="/Projects/FiveHundred" element={<FiveHundred/>}/>
        <Route path="/Projects/Noise" element={<NoisyDetector/>}/>
        <Route path="/Projects/NBA-Ladder" element={<NBALadder/>}/>
        <Route path="/Projects/TopArtistsMap" element={<TopArtistsMap/>}/>
        <Route path="/Projects/PLPredictions" element={<PLPredictions/>}/>
        <Route path="/Projects/FPLDraft" element={<FPLDraftChecker/>}/>
        <Route path="/Photos" element={<Photos/>}/>
        <Route path="/Music" element={<Music/>}/>
        <Route path="/BusinessBrains" element={<BusinessBrains/>}/>
    </Routes>
)

export default Main;
