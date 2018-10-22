import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from '../components/HomePage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HomePage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
