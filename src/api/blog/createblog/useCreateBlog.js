import { useMutation, useQueryClient } from 'react-query';
import { createBlog } from './createblog';
import { toast } from 'react-toastify';

export function useCreateBlogMutation() {
    const queryClient = useQueryClient();
    
    return useMutation(createBlog, {
        onSuccess: (data) => {
            if (data) {
                toast.success("your new post added successfully.", {
                    className: "succss-toast",
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                // Invalidate and refetch blogs query
                queryClient.invalidateQueries('blogs');
            }
            return data;
        },
    });
}