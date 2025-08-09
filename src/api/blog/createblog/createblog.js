import { request } from "../../request";
import {checkAuthentication} from '../../../utilities/common';
import { buildApiUrl, API_ENDPOINTS } from "../../../utilities/api-config";

export async function createBlog({title, content, category, file}) {
    const body = {
        title,
        content,
        category,
        file,
    };

    const customHeaders = {
        'Content-Type': 'multipart/form-data',
        'accesstoken':`Bearer ${checkAuthentication()}`,
      };
    const response = await request({
        url: buildApiUrl(API_ENDPOINTS.BLOG.CREATE_BLOG),
        headers: customHeaders,
        init: { body, method: 'post' }
    });
    return response;
}