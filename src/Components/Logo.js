import React from 'react';

const Logo = ({width,height}) => {
  const logo = '/logo.png';

  return (
    <img src={logo} alt="Logo" style={{ width: width || '100%', height: height|| '100%' }} />
  );
};

export default Logo;
