
import { useQuery } from 'react-query';
import { verifyToken } from './verify-token';

export function useVerifyToken({ token }) {
    return useQuery({
        queryKey: [`verify_token`, token],
        queryFn: async () => {
            return await verifyToken(token)
        },
        cacheTime: 4000,
        staleTime: 300000, // 5 minutes - prevents unnecessary refetches
        refetchOnWindowFocus: false, // Don't refetch when window gains focus
        refetchOnMount: false, // Don't refetch on component mount if data exists
        refetchInterval: false, // Disable automatic refetching
        enabled: !!token, // Only run query if token exists
        retry: false, // Disable retries to prevent multiple error toasts
        onError: (error) => {
            // Handle error silently or with custom logic
            console.error('Token verification failed:', error);
        }
    });
}