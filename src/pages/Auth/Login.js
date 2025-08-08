import { Box, Button, Link, TextField, Typography } from "@mui/material";
import ModalBox from "../../components/ModalBox";
import SuccessModal from "../../components/SuccessModal";
import { GoogleSvgIcon, FacebookSvgIcon, EmailSvgIcon } from '../../assets/icons/icon';
import { ArrowBackIos } from "@mui/icons-material";
import { useConnect } from "./Hook";
const AuthModal = ({ isOpenToLogin, setIsOpenToLogin, onLoginClick }) => {

    const { changeToSignInSignUp,
        setChangeToSignInSignUp,
        changeToLogin,
        changeTosignUp,
        showSuccessModal,
        inputForm,
        handleLoginEnable,
        handleSignupEnable,
        handleReverseToPage,
        handleModalClose,
        handleSuccessModalClose,
        handleLoginWithGoogle,
        handleInputForm,
        handleFormSubmit,
    } = useConnect({ setIsOpenToLogin });

    return (
        <>
        <ModalBox
            open={isOpenToLogin}
            styles={{
                width: { xs: 300, sm: 500 },
                height: { xs: 500, sm: 520 },
            }}
            onClose={handleModalClose}
        >
            {
                (changeToLogin || changeTosignUp) ? <Typography
                    sx={{
                        marginTop: 10,
                        fontFamily: 'sans-serif',
                        fontSize: 24
                    }}
                    id="modal-modal-title" variant="h6" color="white" textAlign="center" component="h2">
                    {changeToLogin ? 'Sign in with email' : 'Sign up with email'}
                </Typography> :
                    <Typography 
                        sx={{
                            marginTop: 10,
                            fontFamily: 'sans-serif',
                            fontSize: 24
                        }}
                        id="modal-modal-title" variant="h6" color="black" textAlign="center" component="h2">
                        {changeToSignInSignUp ? 'Welcome to Team' : 'Join the Team'}
                    </Typography>
            }
            {
                // login and sign up with google button
                (!changeToLogin && !changeTosignUp) ? <Box display='flex' justifyContent='center' sx={{ marginTop: '30px' }}>
                    {changeToSignInSignUp ?
                        <Button variant="text" sx={{ display: 'flex', justifyContent: 'space-around', color: 'black', borderRadius: 30, fontSize: 14, border: '1px solid black', width: 240, textTransform: 'none' }}>
                            <GoogleSvgIcon styles={{ paddingLeft: '10px' }} />
                            <Link href={handleLoginWithGoogle()} sx={{ textDecoration: 'none', fontSize: '15px', color: 'white' }}> Sign in with Google</Link>
                        </Button> :
                        <Button variant="text" sx={{ display: 'flex', justifyContent: 'space-around', color: 'black', borderRadius: 30, fontSize: 14, border: '1px solid black', width: 240, textTransform: 'none' }}>
                            <GoogleSvgIcon styles={{ paddingLeft: '10px' }} />
                            <Link href={handleLoginWithGoogle()} sx={{ textDecoration: 'none', fontSize: '15px', color: 'white' }}> Sign up with Google</Link>
                        </Button>
                    }
                </Box> :
                    <Box display='flex' flexDirection='column' alignItems='center' sx={{ margin: '18px', textAlign: 'center' }}>
                        {
                            changeToLogin ? <p> Enter the email address & password associated<br />
                                with your account.
                            </p> :
                                <p> Enter your email address to create an <br />
                                    account.
                                </p>
                        }

                    </Box>
            }
            {
                // login and singup with facebook button
                (!changeToLogin && !changeTosignUp) ? <Box display='flex' justifyContent='center' sx={{ marginTop: '14px' }}>
                    {
                        changeToSignInSignUp ? <Button variant="text" sx={{ display: 'flex', justifyContent: 'space-around', color: 'white', borderRadius: 30, fontSize: 14, border: '1px solid black', width: 240, textTransform: 'none' }}>
                            <FacebookSvgIcon styles={{ paddingLeft: '10px' }} />
                            Sign In with Facebook
                        </Button> :
                            <Button variant="text" sx={{ display: 'flex', justifyContent: 'space-around', color: 'white', borderRadius: 30, fontSize: 14, border: '1px solid black', width: 240, textTransform: 'none' }}>
                                <FacebookSvgIcon styles={{ paddingLeft: '10px' }} />
                                Sign up with Facebook
                            </Button>
                    }
                </Box> :
                    <Box display='flex' flexDirection='column' alignItems='center' sx={{ marginTop: '20px', textAlign: 'center' }}>
                        <TextField
                            placeholder="Enter Your Email"
                            name="email"
                            value={inputForm.email}
                            onChange={(e) => { handleInputForm({ value: e.target.value, name: e.target.name }) }}
                            variant="standard"
                        />
                    </Box>
            }
            {
                // login and signup with email
                (!changeToLogin && !changeTosignUp) ? <Box display='flex' justifyContent='center' sx={{ marginTop: '14px' }}>
                    {changeToSignInSignUp ? <Button onClick={handleLoginEnable} variant="text" sx={{ display: 'flex', justifyContent: 'space-around', color: 'white', borderRadius: 30, fontSize: 14, border: '1px solid black', width: 240, textTransform: 'none' }}>
                        <EmailSvgIcon />
                        Sign in with email
                    </Button> :
                        <Button onClick={handleSignupEnable} variant="text" sx={{ display: 'flex', justifyContent: 'space-around', color: 'white', borderRadius: 30, fontSize: 14, border: '1px solid black', width: 240, textTransform: 'none' }}>
                            <EmailSvgIcon />
                            Sign up with email
                        </Button>
                    }
                </Box> : changeToLogin ?
                    <Box display='flex' flexDirection='column' alignItems='center' sx={{ marginTop: '20px', textAlign: 'center' }}>
                        <TextField
                            placeholder="Enter Your Password"
                            name="password"
                            type="password"
                            value={inputForm.password}
                            onChange={(e) => { handleInputForm({ value: e.target.value, name: e.target.name }) }}
                            variant="standard"
                        />
                    </Box> : ''
            }
            {
                (!changeToLogin && !changeTosignUp) ? <Box display='flex' justifyContent='center' marginTop={3}>
                    <h4 className="already-account">{changeToSignInSignUp ? 'Create New ?' : 'Already have an account ?'}</h4>
                    <Button 
                        className="createOneButton"  
                        onClick={() => { setChangeToSignInSignUp(!changeToSignInSignUp) }} 
                        underline="none"
                    >
                        {changeToSignInSignUp ? 'Create One' : 'Sign in'}
                    </Button>
                </Box> :
                    <Box display='flex' justifyContent='center' sx={{ marginTop: '45px' }}>
                        <Button className="signupLoginBtn" onClick={handleFormSubmit} variant="text" sx={{ display: 'flex', backgroundColor: 'black', justifyContent: 'space-around', color: 'white', borderRadius: 30, fontSize: 14, border: '1px solid black', width: 240, textTransform: 'none' }}>
                            {changeToLogin ? 'Login' : 'Sign up'}
                        </Button>
                    </Box>

            }
            {
                (!changeToLogin && !changeTosignUp) ? <Box display='flex' flexDirection='column' alignItems='center' sx={{ margin: '18px', textAlign: 'center' }}>
                    {changeToSignInSignUp ?
                        <p className="sign-up-message">
                            Forgot your password, need to help?
                            <Button underline="none" sx={{ fontSize: '15px', fontWeight: '600', bgcolor: 'white', color: 'gray', textTransform: 'none' }}>Get help</Button>
                        </p> :
                        <p className="sign-up-message">
                            Click “Sign Up” to agree to Tech-blog Terms of Service and acknowledge that
                            Tech-blog Privacy Policy applies to you.
                        </p>
                    }
                </Box> : <Box display='flex' justifyContent='center' sx={{ marginTop: '45px' }}>
                    <Button underline="none" onClick={handleReverseToPage} sx={{ fontSize: '14px', fontWeight: '600', bgcolor: 'white', color: 'green', textTransform: 'none' }}><ArrowBackIos sx={{ fontSize: 14 }} /> {changeToLogin ? 'All sign in options' : 'All sign up options'}</Button>
                </Box>
            }

        </ModalBox>

        <SuccessModal
            open={showSuccessModal}
            onClose={handleSuccessModalClose}
            title="Registration Successful!"
            message="You have registered successfully! We have sent a magic link to your email to reset password. Please click and reset your password."
        />
    </>
    )
}

export default AuthModal;