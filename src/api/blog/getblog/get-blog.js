import { request } from "../../request";
import { checkAuthentication } from '../../../utilities/common';
import { getApiBaseUrl } from "../../../utilities/api-config";

export async function getBlog({ blogId }) {
    const customHeaders = {
        'Content-Type': 'application/json',
        'accesstoken': `Bearer ${checkAuthentication()}`,
    };
    const response = await request({
        url: `${getApiBaseUrl()}/v1/blog/get-blog/${blogId}`,
        headers: customHeaders,
        init: { method: 'get' }
    });
    return response;
}