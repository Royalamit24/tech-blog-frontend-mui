import { AppBar, Toolbar, Button } from '@mui/material';
import { useState } from 'react';
import AuthModal from '../pages/Auth/Login';

const Navbar = () => {
  const [isOpenToLogin, setIsOpenToLogin] = useState(false);

  const handleLoginClick = () => {
    setIsOpenToLogin(true);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button 
            color="inherit" 
            onClick={handleLoginClick}
            sx={{ marginLeft: 'auto' }}
          >
            LOGIN
          </Button>
        </Toolbar>
      </AppBar>

      <AuthModal 
        isOpenToLogin={isOpenToLogin}
        setIsOpenToLogin={setIsOpenToLogin}
      />
    </>
  );
};

export default Navbar;