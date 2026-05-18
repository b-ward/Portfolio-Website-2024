import React from 'react';

const BusinessBrains = () => (
  <div>
    <h3 className="text-accent text-center text-2xl font-semibold mb-4">Business Brains</h3>
    <div className="w-4/5 mx-auto mt-8 mb-8">
      <iframe
        className="mb-8 bg-[#121212]"
        title="Pod 2"
        src="https://open.spotify.com/embed/episode/3uqsIqXuVVHPeMTlB5FQ1i?theme=0"
        width="100%"
        height="232"
        frameBorder="0"
        allowTransparency={true}
        allow="encrypted-media"
      ></iframe>
      <iframe
        className="mb-8 bg-[#121212]"
        title="Pod 1"
        src="https://open.spotify.com/embed/episode/0eoHeo60heCHlVDOHZOug7?theme=0"
        width="100%"
        height="232"
        frameBorder="0"
        allowTransparency={true}
        allow="encrypted-media"
      ></iframe>
    </div>
  </div>
);

export default BusinessBrains;
