import { request } from "../../request";

export async function verifyToken(token) {
    if (!token) {
        throw new Error('Token is empty.')
    }

    console.log('Verifying token:', token);

    const query = {
        token
    };
    const customHeaders = {
        'Content-Type': 'application/json',
    };

    try {
        const result = await request({
            url: 'http://localhost:4005/v1/auth/validate-token',
            headers: customHeaders,
            init: { query, method: 'get' }
        });
        console.log('Token verification result:', result);
        return result;
    } catch (error) {
        console.error('Token verification error:', error);
        throw error;
    }
}