import { useMutation } from 'react-query';
import { singUp } from './signUp';

export function useSignUpMutation() {
    return useMutation(singUp, {
        // Removed automatic toast - will be handled by component with modal
        onSuccess: (data) => {
            return data;
        },
    },
    )
}