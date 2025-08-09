import { request } from "../request";
import { checkAuthentication } from '../../utilities/common';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4005';
const BASE_URL = `${API_BASE_URL}/v1/blog`;

export async function toggleLike(blogId) {
    const customHeaders = {
        'Content-Type': 'application/json',
        'accesstoken': `Bearer ${checkAuthentication()}`,
    };
    const response = await request({ 
        url: `${BASE_URL}/${blogId}/like`, 
        headers: customHeaders, 
        init: { method: 'post' } 
    });
    return response.data;
}

export async function addComment(blogId, content) {
    const customHeaders = {
        'Content-Type': 'application/json',
        'accesstoken': `Bearer ${checkAuthentication()}`,
    };
    const response = await request({ 
        url: `${BASE_URL}/${blogId}/comment`, 
        headers: customHeaders, 
        init: { 
            method: 'post',
            body: { content }
        } 
    });
    return response.data;
}

export async function deleteComment(blogId, commentId) {
    const customHeaders = {
        'Content-Type': 'application/json',
        'accesstoken': `Bearer ${checkAuthentication()}`,
    };
    const response = await request({ 
        url: `${BASE_URL}/${blogId}/comment/${commentId}`, 
        headers: customHeaders, 
        init: { method: 'delete' } 
    });
    return response.data;
}

export async function getBlogById(blogId) {
    const customHeaders = {
        'Content-Type': 'application/json',
        'accesstoken': `Bearer ${checkAuthentication()}`,
    };
    const response = await request({ 
        url: `${BASE_URL}/get-blog/${blogId}`, 
        headers: customHeaders, 
        init: { method: 'get' } 
    });
    console.log('response  main', response);
    return response.data;
}