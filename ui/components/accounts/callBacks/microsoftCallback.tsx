'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import { useSaveTokens } from '../utils/useSaveTokens';

const MicrosoftCallback = () => {
  const saveTokens = useSaveTokens();
  useEffect(() => {
    const fetchAccessToken = async (code: string) => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const response = await axios.post(`${baseUrl}/api/users/getMsUsrInfo/`, { code });

        saveTokens(response.data);

      } catch (error) {
        console.error('Failed to sign in with Microsoft', error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      fetchAccessToken(code as string);
    }
  }, [saveTokens]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="relative flex flex-col items-center p-6 bg-gray-900/80 border border-gray-700 shadow-lg rounded-xl backdrop-blur-lg">
        {/* Cyberpunk Loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-purple-500 animate-ping"></div>
        </div>

        <p className="mt-4 text-lg font-mono text-blue-400 tracking-widest">
          Authenticating with Microsoft...
        </p>
        <p className="text-sm text-gray-400 mt-1">Securing your Web3 identity</p>
      </div>
    </div>
  );
};

export default MicrosoftCallback;