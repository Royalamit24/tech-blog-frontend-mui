import { Box, Button, Card, CardActions, CardContent, CardMedia, Stack, Typography, useTheme } from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RightBar from "../../components/Rightbar";
import profile_page from '../../assets/img/profile_undraw.png';
import Datetime from "../../components/Datetime";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from '../../utilities/common';
import { useConnectProfile } from './Hook';

const Profile = React.memo(() => {
    const theme = useTheme();
    const {
        profileData,
        handleSubmit,
        handleFormData,
    } = useConnectProfile();

    const navigate = useNavigate();

    useEffect(() => {
        const token = checkAuthentication();
        if (!token) {
            navigate(`/`)
        }
    });

    return (
        <>
            <Navbar />
            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Sidebar />
                <Box
                    p={2}
                    flex={4}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        textAlign: 'center',
                        mt: 2, // Reduced top margin
                    }}
                >
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            mb: 3
                        }}
                    >
                        Complete Your Profile
                    </Typography>
                    <Card 
                        sx={{ 
                            maxWidth: 1000, 
                            width: { xs: '95%', sm: 600, md: 800, lg: 1000 },
                            borderRadius: 2,
                            boxShadow: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 0 }}>
                            <div className="profile_image" style={{ flex: 1 }}>
                                <CardMedia
                                    component="img"
                                    height="100%"
                                    src={profile_page}
                                    alt="Profile setup"
                                    sx={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="profile_form" style={{ 
                                flex: 1, 
                                padding: '2rem',
                                backgroundColor: theme.palette.background.paper 
                            }}>
                                <form>
                                    <input 
                                        value={profileData.firstName}
                                        name="firstName"
                                        onChange={(e) => handleFormData({ e, name: 'firstName' })}
                                        className="input_form"
                                        type="text"
                                        placeholder="First Name"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            marginBottom: '16px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '1rem',
                                            fontFamily: "'Roboto', sans-serif",
                                            transition: 'border-color 0.2s',
                                            outline: 'none',
                                        }}
                                    />
                                    <input 
                                        value={profileData.lastName}
                                        name="lastName"
                                        onChange={(e) => handleFormData({ e, name: 'lastName' })}
                                        className="input_form"
                                        type="text"
                                        placeholder="Last Name"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            marginBottom: '16px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '1rem',
                                            fontFamily: "'Roboto', sans-serif",
                                            transition: 'border-color 0.2s',
                                            outline: 'none',
                                        }}
                                    />
                                    <div className="profile_date" style={{ marginBottom: '16px' }}>
                                        <Datetime 
                                            onChange={(e) => handleFormData({ e, name: 'date' })}
                                            styles={{ 
                                                width: '100%',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </div>
                                    <textarea 
                                        value={profileData.bio}
                                        onChange={(e) => handleFormData({ e, name: 'bio' })}
                                        className="profile_bio_textarea"
                                        placeholder="Tell us about yourself..."
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            marginBottom: '20px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '1rem',
                                            fontFamily: "'Roboto', sans-serif",
                                            minHeight: '120px',
                                            resize: 'vertical',
                                            transition: 'border-color 0.2s',
                                            outline: 'none',
                                        }}
                                    />
                                    <Button 
                                        onClick={handleSubmit}
                                        variant="contained"
                                        sx={{
                                            borderRadius: '8px',
                                            width: "100%",
                                            padding: "12px",
                                            textTransform: "none",
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            boxShadow: 2,
                                            '&:hover': {
                                                boxShadow: 4,
                                            }
                                        }}
                                    >
                                        Complete Profile
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </Box>
                <RightBar />
            </Stack>
        </>
    );
});

export default Profile;