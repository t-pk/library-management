import React from 'react';
import { Button } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const nav = useNavigate();

  const button1 = (page) => () => {
    nav(page);
  };
  return (localStorage.getItem('TOKEN_KEY') ?
    <div>
      <Button onClick={button1('/page2')}>page 2</Button>
      <Button onClick={button1('/page3')}>page 3</Button>
      <Button onClick={button1('/')}>page 1</Button>
      <Button onClick={button1('/login')}>Login</Button>
    </div> : <Navigate to="/login" replace />)
}


export default HomePage;
