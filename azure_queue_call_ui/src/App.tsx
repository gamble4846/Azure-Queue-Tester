import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ClientData from './pages/Client Data/ClientData';
import Message from './pages/Message/Message';
import Queue from './pages/Queue/Queue';
import SendMessage from './pages/SendMessage/SendMessage';
import CommonLayout from './CommonLayout/CommonLayout';

function App() {
  const router = createBrowserRouter([
    {
      element: <CommonLayout />,
      children: [
        {
          path: '/',
          element: <ClientData />,
          index: true
        },
        {
          path: '/message',
          element: <Message />,
        },
        {
          path: '/queue',
          element: <Queue />,
        },
        {
          path: '/sendMessage',
          element: <SendMessage />,
        }
      ]
    }
  ]);
  return (
    <RouterProvider router={router} />
  );
}

export default App;
