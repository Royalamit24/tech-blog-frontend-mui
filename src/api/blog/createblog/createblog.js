import { request } from "../../request";
import {checkAuthentication} from '../../../utilities/common';

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
    const response = await request({ url: 'http://localhost:4005/v1/blog/create-blog', headers: customHeaders, init: { body, method: 'post' } })
    return response;
}