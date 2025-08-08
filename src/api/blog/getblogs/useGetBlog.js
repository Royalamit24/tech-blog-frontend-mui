import { useQuery } from 'react-query';
import { getBlogs } from './get-blogs';

export function useGetBlogsMutation() {
    return useQuery('blogs', getBlogs, {
        refetchOnWindowFocus: false,
        retry: 1,
        onError: (error) => {
            console.error('Error fetching blogs:', error);
        }
    });
}