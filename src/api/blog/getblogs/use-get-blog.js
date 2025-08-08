import { useQuery } from 'react-query';
import { getBlogs } from './get-blogs';

export function useGetBlogs({ searchTerm }) {
    return useQuery({
        queryKey: ['blogs', searchTerm], // Consistent query key for cache invalidation
        queryFn: async () => {
            return await getBlogs({ searchTerm })
        },
    });
}