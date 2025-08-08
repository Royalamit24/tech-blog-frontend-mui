import { useState, useEffect } from 'react';

export const useImage = (fileName) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (!fileName) {
            setLoading(false);
            return;
        }

        const url = process.env.REACT_APP_API_URL 
            ? `${process.env.REACT_APP_API_URL}/blog-picture/${fileName}`
            : `http://localhost:4005/blog-picture/${fileName}`;
            
        setImageUrl(url);

        const img = new Image();
        img.onload = () => {
            setLoading(false);
            setError(null);
        };
        
        img.onerror = () => {
            setLoading(false);
            setError('Failed to load image');
        };

        img.src = url;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [fileName]);

    return { loading, error, imageUrl };
};