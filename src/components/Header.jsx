import React from 'react';
import '../styles/Header.css';

const Header = ({ onAddUser }) => {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <span className="header__icon">⬡</span>
          <div>
            <h1 className="header__title">UserDesk</h1>
            <p className="header__subtitle">Admin Management Console</p>
          </div>
        </div>
        <button className="btn btn--primary" onClick={onAddUser}>
          <span className="btn__icon">+</span>
          Add User
        </button>
      </div>
    </header>
  );
};

export default Header;
