import React from 'react';

export default function Footer() {
  const gitSha = process.env.REACT_APP_GIT_SHA;
  const webLink = `https://github.com/bken-io/web/commit/${gitSha}`;
  const message = `Version: ${gitSha}`;
  return (
    <div className='bg-gray-900 h-12 w-full flex flex-row justify-center items-center'>
      <h6 className='text-xs uppercase font-semibold text-gray-500'>
        <a href={webLink}>
          {message}
        </a>
      </h6>
    </div>
  );
}