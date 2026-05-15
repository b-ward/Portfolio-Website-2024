import React from 'react';

const SharedCard = ({ cardTitle, cardBody, imageSrc }) => (
  <div className="bg-white text-black rounded-lg mb-8">
    <div className="flex flex-row">
      {imageSrc && (
        <img
          src={imageSrc}
          alt=""
          className="max-h-[100px] w-auto pr-4 self-start mt-6 ml-6"
        />
      )}
      <div className="p-6">
        {cardTitle && <h5 className="font-semibold mb-2">{cardTitle}</h5>}
        <div>{cardBody}</div>
      </div>
    </div>
  </div>
);

export default SharedCard;
