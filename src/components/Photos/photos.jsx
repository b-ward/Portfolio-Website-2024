import React from 'react';

const Photos = () => (
  <div>
    <h3 className="text-accent text-center text-2xl font-semibold mb-4">Videography</h3>
    <p className="text-center text-white">Make sure to change the quality to 1080p/4k</p>
    <iframe
      className="aspect-video w-3/5 mx-auto block mb-8"
      title="Northern Territory 2021"
      src="https://www.youtube.com/embed/z_7wfXeZL-g?si=2c-qHQHLI3aRFfkB"
      allow="fullscreen;"
    ></iframe>
    <iframe
      className="aspect-video w-3/5 mx-auto block mb-8"
      title="Northern Territory 2021"
      src="https://www.youtube.com/embed/0yzM_pxB0qY"
      allow="fullscreen;"
    ></iframe>
    <iframe
      className="aspect-video w-3/5 mx-auto block mb-8"
      title="Europe 19/20"
      src="https://www.youtube.com/embed/QTkTdYfBvCk"
      allow="fullscreen;"
    ></iframe>
    <iframe
      className="aspect-video w-3/5 mx-auto block mb-8"
      title="Europe 18/19"
      src="https://www.youtube.com/embed/Y9x_vyCl0lg"
      allow="fullscreen;"
    ></iframe>
    <iframe
      className="aspect-video w-3/5 mx-auto block mb-8"
      title="South-East Asia 17/18"
      src="https://www.youtube.com/embed/p_jTXvdzkHM"
      allow="fullscreen;"
    ></iframe>
  </div>
);

export default Photos;
