import { Box, Modal, useTheme, useMediaQuery } from "@mui/material";

const ModalBox = ({ open, onClose, styles, children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onClose={onClose}
            open={open}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                outline: 'none',
                p: { xs: 1.5, sm: 3 },
                borderRadius: '12px',
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: '80vh', // Reduced from 90vh
                overflowY: 'auto',
                width: {
                    xs: '85%',  // Reduced from 90%
                    sm: '70%',  // Reduced from 80%
                    md: '60%',  // Reduced from 70%
                    lg: '50%'   // Reduced from 60%
                },
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                },
                ...styles,
            }}
            >
                {children}
            </Box>
        </Modal>
    );
};

export default ModalBox;