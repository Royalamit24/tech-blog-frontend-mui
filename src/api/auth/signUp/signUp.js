import { request } from "../../request";

export async function singUp(email) {
    const body = {
        email
    };
    const customHeaders = {
        'Content-Type': 'application/json',
      };
    const response = await request({ url: 'http://localhost:4005/v1/auth/signup', headers: customHeaders, init: { body, method: 'post' } })
    return response;
}