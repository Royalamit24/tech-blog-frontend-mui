import { Modal, Box, TextField, Typography, Button, styled } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AuthService from '../../utilities/auth-service';

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const ModalContent = styled(Box)({
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400
});

const AuthModal = ({ open, onClose, onSuccess }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthService.login(loginData);
            onSuccess?.();
            toast.success('Login successful!');
        } catch (error) {
            toast.error('Login failed. Please try again.');
        }
    };

    return (
        <StyledModal open={open} onClose={onClose}>
            <ModalContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Login
                </Typography>
                <Box component="form" onSubmit={handleLoginSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </ModalContent>
        </StyledModal>
    );
};

export default AuthModal;
