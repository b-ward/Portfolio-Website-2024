import React from 'react';

const PL_URL = 'https://script.google.com/macros/s/AKfycbzYdGKGOEr31ypMosEi_TDtNunVVb8Lj2kdN52lY1Blh83i7tM4mATuzS7mKxgUa9U1gQ/exec';

const PLPredictions = () => (
  <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
    <iframe
      src={PL_URL}
      title="Premier League Predictions Submissions (26/27)"
      className="flex-1 w-full border-0"
      allow="forms"
    />
    <p className="text-center text-sm py-2 text-gray-400">
      Not loading?{' '}
      <a href={PL_URL} target="_blank" rel="noopener noreferrer" className="text-accent underline">
        Open directly
      </a>
    </p>
  </div>
);

export default PLPredictions;
