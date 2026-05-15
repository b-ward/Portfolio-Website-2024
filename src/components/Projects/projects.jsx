import React from 'react';
import ProjectCard from './ProjectCard';

const PROJECTS = [
  { src: '/train_numbers.jpg', title: 'Train Game',            description: 'A program that takes four digits and uses different operations to make ten.',                        route: '/Projects/TrainGame' },
  { src: '/arbitrage.jpg',     title: 'Arbitrage Betting',     description: 'A program that aggregates betting odds from different sites to find profitable arbitrage bets.',     route: '/Projects/Arbitrage' },
  { src: '/card-games.jpg',    title: 'Trio',                  description: 'A virtual version of the card game Trio',                                                            route: '/Projects/TrioGame' },
  { src: '/runner.jpg',        title: 'Pace Calculator',       description: 'Calculate your running pace as you go',                                                              route: '/Projects/PaceCalculator' },
  { src: '/500.jpg',           title: '500 Scorer',            description: 'A scoring assistant for the 500 card game',                                                          route: '/Projects/FiveHundred' },
  { src: '/nba.png',           title: 'NBA Ladder',            description: 'Live NBA standings using the Sportradar API',                                                        route: '/Projects/NBA-Ladder' },
  { src: '/pin.png',           title: 'Top Artists World Map', description: 'Spotify top artists visualized by origin country on an interactive world map.',                     route: '/Projects/TopArtistsMap' },
  // { src: '/spotify-alexa.png', title: 'Alexa Spotify',      description: 'Use Alexa to play the most recently added songs to a playlist on Spotify.',                         route: '/Projects/AlexaSpotify' },
  // { src: '/angry.png',         title: 'Noisy Detector',     description: 'Uses the microphone to detect when you are being too loud.',                                         route: '/Projects/Noise' },
  // { src: '/facebook.png',      title: 'Facebook Analytics', description: 'Data analytics on Facebook messages.',                                                               route: '/Projects/Analytics' },
];

const Projects = () => (
  <div className="py-8 px-4 sm:px-8 lg:px-20">
    <h1 className="text-accent text-center mb-6">Personal Projects</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {PROJECTS.map((card) => (
        <ProjectCard key={card.route} {...card} />
      ))}
    </div>
  </div>
);

export default Projects;
