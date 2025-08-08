import { request } from "../../request";

export async function login({email, password}) {
    const body = {
        email,
        password
    };
    const customHeaders = {
        'Content-Type': 'application/json',
      };
    const response = await request({ url: 'http://localhost:4005/v1/auth/login', headers: customHeaders, init: { body, method: 'post' } })
    return response;
}