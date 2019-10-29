import React from 'react';
import ReactDOM from 'react-dom';

const Index = () => {
  return (
    <div>
      <div>
        <h1>Welcome</h1>
      </div>
    </div>
  );
};

const App = document.getElementById('app');

ReactDOM.render(<Index />, App);
