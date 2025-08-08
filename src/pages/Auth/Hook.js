import { useState } from "react";
import { useSignUpMutation } from '../../api/auth/signUp/useSignup';
import { useLogin } from '../../api/auth/login/use-login';
import CryptoJS from 'crypto-js';
import { secretKey, authToken } from '../../utilities/constant';
import AuthService from "../../utilities/auth-service";
import { useNavigate } from "react-router-dom";
// import { HandleError } from "../../api/handle-error";

export function useConnect({ setIsOpenToLogin }) {

    const navigate = useNavigate();

    const [changeToSignInSignUp, setChangeToSignInSignUp] = useState(true);
    const [changeToLogin, setChangeToLogin] = useState(false);
    const [changeTosignUp, setChangeToSignUp] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [inputForm, setInputForm] = useState({
        email: '',
        password: '',
    });

    const signUpMutation = useSignUpMutation();
    const logInMutation = useLogin();

    const handleLoginEnable = () => {
        setChangeToLogin(true);
    }

    const handleSignupEnable = () => {
        setChangeToSignUp(true);
    }

    const handleReverseToPage = () => {
        setChangeToLogin(false)
        setChangeToSignUp(false)
        setInputForm({
            email: '',
            password: '',
        })
    }

    const handleModalClose = () => {
        setIsOpenToLogin(false)
        setChangeToLogin(false)
        setChangeToSignUp(false)
        setChangeToSignInSignUp(false)
        setInputForm({
            email: '',
            password: '',
        })
    }

    const handleLoginWithGoogle = () => {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const options = {
            // redirect_uri: 'http://localhost:8081/api/sessions/oauth/google',
            redirect_uri: 'http://localhost:4005/v1/auth/google/signup',
            client_id: '700539504324-dv3j959fsvirnsbkqhc9939ibikd4ppm.apps.googleusercontent.com',
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ].join(" "),
        }
        const qs = new URLSearchParams(options);
        return `${rootUrl}?${qs.toString()}`
    }

    const handleLoginWithFacebook = () => {

    }

    const handleInputForm = ({ name, value }) => {
        setInputForm({ ...inputForm, [`${name}`]: value })
    }

    const encryptString = (text) => {
        const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
        return encrypted;
    }

    const setAuthTokenToCookie = async (resp) => {
        new AuthService(authToken).setCookie(resp.data.token);
    }

    const handleFormSubmit = () => {
        if (inputForm.email && inputForm.password) {
            logInMutation.mutate(
                {
                    email: inputForm.email,
                    password: encryptString(inputForm.password)
                },
                {
                    onSuccess: (resp) => {
                       if (resp) {
                        setAuthTokenToCookie(resp)
                        handleModalClose();
                        navigate('/user-home')
                       }
                    }
                });
        } else {
            signUpMutation.mutate(inputForm.email, {
                onSuccess: (data) => {
                    if (data) {
                        setShowSuccessModal(true);
                        // Reset form
                        setInputForm({
                            email: '',
                            password: '',
                        });
                        // Reset to initial state
                        setChangeToSignUp(false);
                        setChangeToLogin(false);
                        setChangeToSignInSignUp(true);
                    }
                }
            });
        }

    }

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        handleModalClose(); // Close the main login modal as well
    }

    return {
        changeToSignInSignUp,
        setChangeToSignInSignUp,
        changeToLogin,
        setChangeToLogin,
        changeTosignUp,
        setChangeToSignUp,
        showSuccessModal,
        inputForm,
        setInputForm,
        handleLoginEnable,
        handleSignupEnable,
        handleReverseToPage,
        handleModalClose,
        handleSuccessModalClose,
        handleLoginWithGoogle,
        handleLoginWithFacebook,
        handleInputForm,
        handleFormSubmit,
    }
}