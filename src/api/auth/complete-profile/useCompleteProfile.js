import { useMutation } from 'react-query';
import { completeProfile } from './completeProfile';
import { toast } from 'react-toastify';

export function useCompleteProfileMutation() {
    return useMutation(completeProfile, {
        onSuccess: (data) => {
            if (data) {
                toast.success("Done", {
                    className: "succss-toast",
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            }
            return data;
        },
    },
    )
}