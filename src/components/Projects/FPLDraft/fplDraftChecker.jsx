import React from 'react';

const FPL_URL = 'https://script.google.com/macros/s/AKfycbyn0B2IQZYYdWKZGHzDXhDdzkH_beWK1e8LebSTjTZzv_iBBQWFaN97Xi8c6e7zia3DtA/exec?league=1422966';

const FPLDraftChecker = () => (
  <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
    <iframe
      src={FPL_URL}
      title="FPL Draft Checker"
      className="flex-1 w-full border-0"
      allow="forms"
    />
    <p className="text-center text-sm py-2 text-gray-400">
      Not loading?{' '}
      <a href={FPL_URL} target="_blank" rel="noopener noreferrer" className="text-accent underline">
        Open directly
      </a>
    </p>
  </div>
);

export default FPLDraftChecker;
