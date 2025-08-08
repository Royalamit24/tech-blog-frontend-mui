import { Box, Button, Card, CardActions, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RightBar from "../../components/Rightbar";
import profile_page from '../../assets/img/profile_undraw.png';
import React, { useEffect, useState } from "react";
import { useResetPassword } from '../../api/auth/reset-password/use-reset-password';
import { useLocation } from 'react-router-dom';
import { useVerifyToken } from '../../api/auth/verify-token/use-verify-token';
import CryptoJS from 'crypto-js';
import { secretKey, authToken } from '../../utilities/constant';
import { useNavigate } from "react-router-dom";
import AuthService from "../../utilities/auth-service";
import { useConnectHome } from '../Hook';
import LoginModal from "./Login";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';

const ResetPassword = React.memo(() => {

    const {
        handleLogin,
        isOpenToLogin,
        setIsOpenToLogin
    } = useConnectHome();

    const navigate = useNavigate();
    const resetPasswordMutation = useResetPassword();
    const [verifictionData, setVerificationData] = useState({});
    const [visiblePassword, setVisiblePassword] = useState({
        p_visible: false,
        confirm_p_visible: false,
    });

    const [userPassword, setUserPassword] = useState({
        password: '',
        confirmPassword: ''
    });

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [errorClass, setErrorClass] = useState({
        'password_error': false,
        'confirmPassword_error': false,
    });

    //get the token from query params and verify the is token is valid or not 
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    //if token exists in query param first verify the token is expaired or not if not then fetch the user details with the help of token
    const useVerifyTokenResult = useVerifyToken({ token });

    useEffect(() => {
        if (token && useVerifyTokenResult.data && !useVerifyTokenResult.isLoading && !useVerifyTokenResult.isError) {
            // Set verification data when token verification succeeds
            setVerificationData(useVerifyTokenResult.data);
        } else if (useVerifyTokenResult.isError && token) {
            console.error('Token verification failed:', useVerifyTokenResult.error);
            // Show error message for invalid token
            toast.error('Invalid or expired reset token. Please request a new password reset.');
        }
    }, [token, useVerifyTokenResult.data, useVerifyTokenResult.isLoading, useVerifyTokenResult.isError]);

    const encryptString = (text) => {
        const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
        return encrypted;
    }

    const setAuthTokenToCookie = async (resp) => {
        new AuthService(authToken).setCookie(resp.data.token);
    }

    const handleSubmit = async () => {
        // Validation checks
        if (!userPassword.password) {
            toast.error('Please enter a password');
            return;
        }

        if (!userPassword.confirmPassword) {
            toast.error('Please confirm your password');
            return;
        }

        if (userPassword.password !== userPassword.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Password strength validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(userPassword.password)) {
            toast.error('Password must be at least 8 characters long and contain at least one letter, one number, and one special character');
            return;
        }

        // Try to get email from verification data or API data
        const email = verifictionData.email || useVerifyTokenResult.data?.email || useVerifyTokenResult.data?.data?.email;

        if (!email) {
            // If no email found, we can still try with just the token
            // The backend might be able to extract the email from the token
            console.log('No email found in verification data, attempting reset with token only');
            if (!token) {
                toast.error('No reset token found. Please request a new password reset link.');
                return;
            }
        }

        const encryptedPassword = encryptString(userPassword.password);
        resetPasswordMutation.mutate(
            {
                email: email,
                password: encryptedPassword,
                token: token, // Include token in case backend needs it
            },
            {
                onSuccess: async (resp) => {
                    try {
                        await setAuthTokenToCookie(resp);
                        localStorage.setItem('userId', encryptString(resp.data._id));
                        toast.success('Password reset successfully! Redirecting to your profile...');

                        // Reset form
                        setFormData({
                            password: '',
                            confirmPassword: ''
                        });
                        setUserPassword({
                            password: '',
                            confirmPassword: ''
                        });
                        setVerificationData({});

                        // Navigate after a short delay
                        setTimeout(() => {
                            navigate(`/profile?_id=${resp.data._id}`);
                        }, 1500);
                    } catch (error) {
                        console.error('Error setting auth token:', error);
                        toast.error('Password reset successful, but there was an issue logging you in. Please try logging in manually.');
                    }
                },
                onError: (error) => {
                    console.error("Reset password error:", error);
                    toast.error(error.message || 'Failed to reset password. Please try again.');
                },
            }
        );
    }

    const handleFormData = (e) => {
        const { name, value } = e.target;

        // Update both formData (for display) and userPassword (for submission)
        setFormData({
            ...formData,
            [name]: value
        });

        setUserPassword({
            ...userPassword,
            [name]: value,
        });

        // Password validation
        // eslint-disable-next-line no-useless-escape
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        if (name === 'password') {
            if (!passwordRegex.test(value)) {
                setErrorClass({
                    ...errorClass,
                    'password_error': true,
                });
            } else {
                setErrorClass({
                    ...errorClass,
                    'password_error': false,
                });
            }
        } else if (name === 'confirmPassword') {
            if (!passwordRegex.test(value) || value !== userPassword.password) {
                setErrorClass({
                    ...errorClass,
                    'confirmPassword_error': true,
                });
            } else {
                setErrorClass({
                    ...errorClass,
                    'confirmPassword_error': false,
                });
            }
        }
    }

    const handleVisiblePassword = ({ name }) => {
        setVisiblePassword({ ...visiblePassword, [name]: !visiblePassword[name] })
    }

    return (
        <>
            <Navbar handleLogin={handleLogin} />
            <Stack direction="row" spacing={2} justifyContent="space-between" >
                <Sidebar />
                <Box
                    p={2}
                    flex={4}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',  // Center vertically
                        alignItems: 'center',     // Center horizontally
                        justifyContent: 'center', // Center vertically
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h6">
                        Reset Password
                    </Typography>

                    {/* Show loading state while verifying token */}
                    {useVerifyTokenResult.isLoading && (
                        <Card sx={{ maxWidth: 1000, width: { xs: 300, sm: 500, xl: 1000 }, margin: 5, textAlign: 'center', p: 4 }}>
                            <Typography variant="body1">Verifying reset token...</Typography>
                        </Card>
                    )}

                    {/* Show error state if token verification failed */}
                    {useVerifyTokenResult.isError && (
                        <Card sx={{ maxWidth: 1000, width: { xs: 300, sm: 500, xl: 1000 }, margin: 5, textAlign: 'center', p: 4 }}>
                            <Typography variant="body1" color="error">
                                Invalid or expired reset token. Please request a new password reset link.
                            </Typography>
                        </Card>
                    )}

                    {/* Show warning if no token */}
                    {!token && (
                        <Card sx={{ maxWidth: 1000, width: { xs: 300, sm: 500, xl: 1000 }, margin: 5, textAlign: 'center', p: 4 }}>
                            <Typography variant="body1" color="warning.main">
                                No reset token found in URL. Please use the link from your email.
                            </Typography>
                        </Card>
                    )}

                    {/* Show form if token exists and not loading - temporarily allowing errors for testing */}
                    {token && !useVerifyTokenResult.isLoading && (
                        <Card sx={{ maxWidth: 1000, width: { xs: 300, sm: 500, xl: 1000 }, margin: 5 }}>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                }}>
                                <div className="profile_image">
                                    <CardMedia
                                        component="img"
                                        height="420px"
                                        src={profile_page}
                                        alt="Paella dish"
                                    />
                                </div>
                                <div className="reset_password_form">
                                    {useVerifyTokenResult.isError && (
                                        <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                                            <Typography variant="body2" color="warning.main">
                                                ⚠️ Token verification failed, but you can still try to reset your password.
                                                If it doesn't work, please request a new reset link.
                                            </Typography>
                                        </div>
                                    )}
                                    <form >
                                    <div className="reset_password_container">
                                        <label> Password </label><br />
                                        <div>
                                            <input value={formData.password} type={visiblePassword.p_visible ? "text" : "password"} name="password" onChange={(e) => handleFormData(e)} className={errorClass.password_error ? "input_form_error" : "input_form"} placeholder="******" />
                                            <Button onClick={() => { handleVisiblePassword({ name: "p_visible" }) }} className="reset-eye-visible">
                                                {visiblePassword.p_visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </Button>
                                        </div>
                                        <label>Confirm Password</label><br />
                                        <div>
                                            <input value={formData.confirmPassword} type={visiblePassword.confirm_p_visible ? "text" : "password"} name="confirmPassword" onChange={(e) => handleFormData(e)} className={errorClass.confirmPassword_error ? "input_form_error" : "input_form"} placeholder="******" />
                                            <Button onClick={() => { handleVisiblePassword({ name: "confirm_p_visible" }) }} className="reset-eye-visible">
                                                {visiblePassword.confirm_p_visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </Button>
                                        </div>
                                        {errorClass.password_error && (
                                            <p style={{ color: 'red', fontSize: '12px', margin: '5px 0' }}>
                                                Password must be at least 8 characters with letter, number, and special character
                                            </p>
                                        )}
                                        {errorClass.confirmPassword_error && (
                                            <p style={{ color: 'red', fontSize: '12px', margin: '5px 0' }}>
                                                Passwords do not match or don't meet requirements
                                            </p>
                                        )}
                                        <Button
                                            onClick={handleSubmit}
                                            variant="contained"
                                            color="primary"
                                            disabled={resetPasswordMutation.isLoading || errorClass.password_error || errorClass.confirmPassword_error}
                                            sx={{
                                                borderRadius: '10px',
                                                width: "240px",
                                                marginTop: "24px",
                                                textTransform: "none"
                                            }}
                                        >
                                            {resetPasswordMutation.isLoading ? 'Resetting...' : 'Reset Password'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </CardContent>
                        <CardActions disableSpacing>
                        </CardActions>
                    </Card>
                    )}
                </Box>
                <RightBar />
            </Stack>
            <LoginModal isOpenToLogin={isOpenToLogin} setIsOpenToLogin={setIsOpenToLogin} handleLogin={handleLogin} />
        </>
    )

}
)

export default ResetPassword;