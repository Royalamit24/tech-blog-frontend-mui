import { request } from "../../request";
import { checkAuthentication } from '../../../utilities/common';
import { getApiBaseUrl } from "../../../utilities/api-config";

export async function getBlogs({ searchTerm = '', skip = 0, limit = 100, sortBy = 'desc' }) {

    const customHeaders = {
        'Content-Type': 'application/json',
        'accesstoken': `Bearer ${checkAuthentication()}`,
    };
    const response = await request({
        url: `${getApiBaseUrl()}/v1/blog/get-blogs?skip=${skip}&limit=${limit}&searchTerm=${searchTerm}&sortBy=${sortBy}`,
        headers: customHeaders,
        init: { method: 'get' }
    });
    return response ? response : [];
}