import { request } from "../../request";
import { checkAuthentication } from '../../../utilities/common';

export async function getBlog({ blogId }) {
    const customHeaders = {
        'Content-Type': 'application/json',
        'accesstoken': `Bearer ${checkAuthentication()}`,
    };
    const response = await request({ 
        url: `http://localhost:4005/v1/blog/get-blog/${blogId}`, 
        headers: customHeaders, 
        init: { method: 'get' } 
    });
    return response;
}