import { request } from "../../request";
import { buildApiUrl, API_ENDPOINTS } from "../../../utilities/api-config";

export async function resetPassword({ password, email, token }) {
    const body = {
        email,
        password,
        token
    };
    const customHeaders = {
        'Content-Type': 'application/json',
    };
    const response = await request({
        url: buildApiUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD),
        headers: customHeaders,
        init: { body, method: 'post' }
    });
    return response;
}