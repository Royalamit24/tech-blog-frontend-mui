import { request } from "../../request";
import { buildApiUrl, API_ENDPOINTS } from "../../../utilities/api-config";

export async function login({email, password}) {
    const body = {
        email,
        password
    };
    const customHeaders = {
        'Content-Type': 'application/json',
      };
    const response = await request({
        url: buildApiUrl(API_ENDPOINTS.AUTH.LOGIN),
        headers: customHeaders,
        init: { body, method: 'post' }
    });
    return response;
}