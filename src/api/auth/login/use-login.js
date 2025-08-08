import { useMutation } from 'react-query';
import { login } from './login';
import { toast } from 'react-toastify';

export function useLogin() {
    return useMutation(login, {
        onSuccess: (data) => {
            if (data) {
                toast.success("logged in.", {
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