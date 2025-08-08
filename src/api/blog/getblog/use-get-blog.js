import { useQuery } from 'react-query';
import { getBlog } from './get-blog';

export function useGetBlog({ blogId }) {
    return useQuery({
        queryKey: ['blog', blogId],
        queryFn: async () => {
            const response = await getBlog({blogId});
            return response.data
        },
        enabled: !!blogId,
    });
}