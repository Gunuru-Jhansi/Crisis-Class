import React, { useContext } from 'react';
import { DisasterContext } from '../DisasterContext';

const Redirect = () => {
  const { navigate } = useContext(DisasterContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1E2A78] to-[#3B3B98]">
      <div className="bg-[#252C3B] text-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Disaster Response Management</h1>
        <p className="text-sm text-gray-300 mb-6">
          Your message is sent to government authorities. We will reach out to you shortly.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Redirect;
