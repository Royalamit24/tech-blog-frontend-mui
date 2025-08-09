import { request } from "../../request";
import { buildApiUrl, API_ENDPOINTS } from "../../../utilities/api-config";

export async function singUp(email) {
    const body = {
        email
    };
    const customHeaders = {
        'Content-Type': 'application/json',
      };
    const response = await request({
        url: buildApiUrl(API_ENDPOINTS.AUTH.SIGNUP),
        headers: customHeaders,
        init: { body, method: 'post' }
    });
    return response;
}