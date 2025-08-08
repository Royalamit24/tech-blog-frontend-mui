import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch, Paper, styled, Divider, useTheme } from "@mui/material";
import { AccountBox, Feed, Groups, Home, ModeNight, Pages, People, Settings } from "@mui/icons-material";
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Add from './Add';
import { ColorModeContext } from '../App';

const StyledSidebar = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: 0,
    height: '100vh',
    position: 'sticky',
    top: 0,
    left: 0,
    boxShadow: 'none',
    borderRight: `1px solid ${theme.palette.divider}`
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    ...(active && {
        backgroundColor: theme.palette.primary.light + '20',
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
        },
        '& .MuiListItemText-primary': {
            color: theme.palette.primary.main,
            fontWeight: 600,
        },
    }),
}));

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const menuItems = [
        { text: 'Homepage', icon: <Home />, path: '/' },
        { text: 'Pages', icon: <Pages />, path: '/pages' },
        { text: 'Groups', icon: <Groups />, path: '/groups' },
        { text: 'Friends', icon: <People />, path: '/friends' },
        { text: 'Marketplace', icon: <Feed />, path: '/marketplace' },
        { text: 'Settings', icon: <Settings />, path: '/settings' },
        { text: 'Profile', icon: <AccountBox />, path: '/profile' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Box flex={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <StyledSidebar>
                <List disablePadding>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <StyledListItemButton
                                active={location.pathname === item.path ? 1 : 0}
                                onClick={() => handleNavigation(item.path)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText 
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '0.9rem',
                                    }}
                                />
                            </StyledListItemButton>
                        </ListItem>
                    ))}
                    <ListItem disablePadding>
                        <StyledListItemButton>
                            <ListItemIcon>
                                <ModeNight />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Dark Mode"
                                primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                }}
                            />
                            <Switch
                                checked={theme.palette.mode === 'dark'}
                                onChange={colorMode.toggleColorMode}
                                color="primary"
                            />
                        </StyledListItemButton>
                    </ListItem>
                    <Divider sx={{ my: 2 }} />
                    <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Add />
                    </ListItem>
                </List>
            </StyledSidebar>
        </Box>
    );
};

export default Sidebar;