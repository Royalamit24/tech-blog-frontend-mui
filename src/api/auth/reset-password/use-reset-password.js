import { useMutation } from 'react-query';
import { resetPassword } from './reset-password';
import { toast } from 'react-toastify';

export function useResetPassword() {
   return useMutation(resetPassword, {
        onSuccess: (data) => {
            // Success handling is now done in the component for better control
            return data;
        },
        onError: (error) => {
            console.error('Reset password error:', error);
            // Error handling is also done in the component
        },
    },
    )
}