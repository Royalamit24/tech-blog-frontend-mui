import React from 'react';
import { Box, Button, Typography, Modal, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SuccessModal = ({ open, onClose, title, message }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper
                sx={{
                    width: { xs: 320, sm: 450 },
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center',
                    outline: 'none',
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <CheckCircleIcon 
                        sx={{ 
                            fontSize: 60, 
                            color: 'success.main',
                            mb: 2 
                        }} 
                    />
                    <Typography 
                        id="success-modal-title" 
                        variant="h5" 
                        component="h2"
                        sx={{ 
                            fontWeight: 600,
                            mb: 2,
                            color: 'text.primary'
                        }}
                    >
                        {title || 'Success!'}
                    </Typography>
                    <Typography 
                        id="success-modal-description" 
                        variant="body1"
                        sx={{ 
                            color: 'text.secondary',
                            lineHeight: 1.6,
                            mb: 3
                        }}
                    >
                        {message}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '16px',
                        fontWeight: 500,
                    }}
                >
                    Got it!
                </Button>
            </Paper>
        </Modal>
    );
};

export default SuccessModal;
