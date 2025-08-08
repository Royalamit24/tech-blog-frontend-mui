import styled from "@emotion/styled";
import { Pets, Login, Menu as MenuIcon, Search as SearchIcon, Close, AutoAwesome } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, InputBase, Box, Avatar, Menu, MenuItem, Button, IconButton, useTheme, useMediaQuery, keyframes } from "@mui/material";
import { useEffect, useState } from "react";
import { checkAuthentication } from '../utilities/common';
import { useNavigate } from 'react-router-dom';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#4c00e6',
}));

const Search = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'white',
    padding: '5px 10px',
    borderRadius: theme.shape.borderRadius,
    width: '30%',
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#ddd'}`,
    '&:hover': {
        border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.primary.main : '#aaa'}`,
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: '0 10px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#666',
}));

const Icons = styled(Box)(({ theme }) => ({
    display: 'none',
    gap: '20px',
    alignItems: 'center',
    [theme.breakpoints.up("sm")]: {
        display: 'flex'
    }
}));

const UserBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    [theme.breakpoints.up("sm")]: {
        display: 'none'
    }
}));

const LogoContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
});

const RotatingIcon = styled(AutoAwesome)({
    animation: `${rotate} 2s linear infinite`,
    color: 'white',
});

const Navbar = ({ handleLogin, setSearchTerm, searchKey, searchTerm }) => {
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    useEffect(() => {
        const token = checkAuthentication();
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setOpen(false);
    };

    return (
        <AppBar position="sticky">
            <StyledToolbar>
                {isMobile && (
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleMobileMenuToggle}
                    >
                        {mobileMenuOpen ? <Close /> : <MenuIcon />}
                    </IconButton>
                )}
                
                <LogoContainer>
                    <RotatingIcon />
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            display: { xs: isMobile ? 'none' : 'block', sm: 'block' },
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                        onClick={() => navigate('/')}
                    >
                        Tech-blog
                    </Typography>
                </LogoContainer>
                
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <InputBase 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search blogs..."
                        fullWidth
                    />
                </Search>

                <Icons>
                    {isLoggedIn ? (
                        <Avatar
                            onClick={() => setOpen(true)}
                            sx={{ 
                                width: 35, 
                                height: 35,
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.8 }
                            }}
                        />
                    ) : (
                        <Button 
                            onClick={handleLogin}
                            variant="outlined"
                            color="inherit"
                            size="medium"
                            sx={{ 
                                borderRadius: '20px',
                                textTransform: 'none',
                                padding: '6px 20px'
                            }}
                        >
                            Login <Login sx={{ ml: 1, fontSize: 20 }} />
                        </Button>
                    )}
                </Icons>

                {isLoggedIn && (
                    <UserBox>
                        <Avatar
                            onClick={() => setOpen(true)}
                            sx={{ width: 35, height: 35, cursor: 'pointer' }}
                        />
                    </UserBox>
                )}
            </StyledToolbar>

            <Menu
                anchorEl={document.body}
                id="account-menu"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        mt: 7,
                        width: 200,
                        boxShadow: 3,
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={() => navigate('/user-home')}>My blogs</MenuItem>
                <MenuItem onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/');
                    window.location.reload();
                }}>Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar;