import { request } from "../../request";

export async function resetPassword({ password, email, token }) {
    const body = {
        email,
        password,
        token
    };
    const customHeaders = {
        'Content-Type': 'application/json',
    };
    const response = await request({ url: 'http://localhost:4005/v1/auth/reset-password', headers: customHeaders, init: { body, method: 'post' } })
    return response;
}