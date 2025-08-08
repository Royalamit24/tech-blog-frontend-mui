import { toast } from 'react-toastify';

export const request = async ({ url, headers = {}, init = {} }) => {
    // Declare finalUrl outside try block so it's accessible in catch
    let finalUrl = url;

    try {
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        // Add cache-busting for image requests and handle image URLs specially
        if (url.includes('/blog-picture/')) {
            finalUrl = `${url}?t=${new Date().getTime()}`;
            delete defaultHeaders['Content-Type'];
        }

        const { body, method, query } = init;
        const finalBody = body && typeof body === 'object' && !(body instanceof FormData) 
            ? JSON.stringify(body) 
            : body;

        const queryString = query ? new URLSearchParams(query).toString() : '';
        if (queryString) {
           finalUrl = `${finalUrl}?${queryString}`;   
        }

        const response = await fetch(finalUrl, {
            method,
            body: finalBody,
            headers: {
                ...defaultHeaders,
                ...headers,
            },
            mode: 'cors',
            credentials: 'same-origin'
        });

        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
            const errorData = contentType?.includes('application/json') 
                ? await response.json()
                : await response.text();
                
            console.error('Request failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData,
                url: finalUrl
            });
            
            throw new Error(
                errorData?.error?.message || 
                errorData?.error || 
                errorData || 
                'Request failed'
            );
        }

        if (contentType?.includes('application/json')) {
            return response.json();
        }
        
        return response;
    } catch (error) {
        console.error('Request error:', error);

        // Don't show toast for token validation errors - let the component handle them
        if (!finalUrl.includes('/validate-token')) {
            toast.error(error.message || 'An error occurred');
        }

        throw error;
    }
};