import { useLocation } from "react-router-dom";
import { secretKey } from '../../utilities/constant';
import { useCompleteProfileMutation } from '../../api/auth/complete-profile/useCompleteProfile';
import CryptoJS from 'crypto-js';
import { useState } from "react";


export function useConnectProfile() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let userId = queryParams.get('_id');
    const completeProfileApi = useCompleteProfileMutation();

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        bio: '',
    });

    const decryptString = (encryptedText) => {
        const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey);
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    const handleSubmit = () => {
        if (!userId) {
            //get userId from local storage
            userId = decryptString(localStorage.getItem('userId'));
        }
        if (userId && profileData.firstName && profileData.lastName) {
            completeProfileApi.mutate(
                {
                    userId,
                    ...profileData
                },
                {
                    onSuccess: async (resp) => {
                    },
                    onError: (error) => {
                        console.error("Mutation error:", error);
                    },
                }
            );

            setProfileData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                bio: '',
            })
        }

    }

    const handleFormData = ({ e, name }) => {
        if (name === 'date') {
            const date = new Date(e['$d'])
            setProfileData({
                ...profileData,
                'dateOfBirth': date,
            })
        } else {
            setProfileData({
                ...profileData,
                [e.target.name ? e.target.name : name]: e.target.value,
            });
        }

    }

    return {
        profileData,
        setProfileData,
        handleSubmit,
        handleFormData,
    }
}