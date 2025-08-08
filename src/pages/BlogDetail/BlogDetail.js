import { Box, Container, Typography, Avatar, Card, CardContent, CardMedia, Divider, Stack, CircularProgress, Paper, List, ListItem, ListItemAvatar, ListItemText, TextField, Button, IconButton, useTheme, Checkbox, Skeleton } from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RightBar from "../../components/Rightbar";
import { useParams } from "react-router-dom";
import { useGetBlog } from "../../api/blog/getblog/use-get-blog";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from '../../utilities/common';
import { toast } from 'react-toastify';
import AuthService from "../../utilities/auth-service";
import { authToken } from "../../utilities/constant";
import { addComment, deleteComment, toggleLike } from '../../api/blog/blog.api';
import { Send, MoreVert, Favorite, FavoriteBorder, Share } from '@mui/icons-material';
import { useImage } from "../../utilities/useImage";

const BlogImageSection = ({ imageUrl }) => {
    const { loading, error, imageUrl: resolvedUrl } = useImage(imageUrl);

    if (loading) {
        return (
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <Skeleton 
                    variant="rectangular" 
                    sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }} 
                />
            </Box>
        );
    }

    if (error) {
        return null;
    }

    return (
        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
            <CardMedia
                component="img"
                image={resolvedUrl}
                alt="Blog image"
                sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </Box>
    );
};

const BlogDetail = () => {
    const { blogId } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { data: blog, isLoading, error } = useGetBlog({ blogId });
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        const token = checkAuthentication();
        console.log('Token:', token);
        
        setIsAuthenticated(!!token);
        if (!token) {
            toast.warn('Please login to see the blog details');
            navigate(`/login`);
        }
    }, [navigate]);    


    useEffect(() => {
        if (blog) {
            setComments(blog.comments || []);
            setIsLiked(blog.likes?.includes(AuthService.getCurrentUserId()));
            setLikesCount(blog.likes?.length || 0);
        }
    }, [blog]);

    const getBlogImage = useCallback((blogPicture) => {
        if (!blogPicture) {
            console.log('No blog picture provided');
            return '';
        }
        const imageUrl = `http://localhost:4005/blog-picture/${blogPicture}`;
        console.log('Generated image URL:', imageUrl);
        return imageUrl;
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const token = new AuthService(authToken).getCookie();        
        if (!token) {
            toast.warn('Please login first to comment');
            return;
        }

        try {
            const comment = await addComment(blogId, newComment);
            setComments([...comments, comment]);
            setNewComment('');
            // toast.success('Comment added successfully');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await deleteComment(blogId, commentId);
            setComments(comments.filter(comment => comment._id !== commentId));
            toast.success('Comment deleted successfully');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const handleLike = async () => {
        const token = AuthService.getCookie(authToken);
        if (!token) {
            toast.warn('Please login first to like posts');
            return;
        }

        try {
            const response = await toggleLike(blogId);
            setIsLiked(response.isLiked);
            setLikesCount(response.likes);
            toast.success(response.isLiked ? 'Post liked!' : 'Post unliked');
        } catch (error) {
            toast.error('Failed to update like');
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">Failed to load blog. Please try again.</Typography>
            </Box>
        );
    }

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} />
            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Sidebar />
                <Box
                    flex={4}
                    p={2}
                    sx={{
                        overflowY: 'auto',
                        height: 'calc(100vh - 64px)',
                        backgroundColor: theme.palette.background.default
                    }}
                >
                    <Container maxWidth="lg">
                        <Card sx={{ 
                            mb: 4,
                            boxShadow: 3,
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}>
                            {blog?.imageUrls?.length > 0 && (
                                <BlogImageSection imageUrl={blog.imageUrls[0]} />
                            )}
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        {blog?.avatarName || 'U'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {blog?.email}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {blog?.createdAt && formatDate(blog.createdAt)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h4" component="h1" gutterBottom>
                                    {blog?.title && <div dangerouslySetInnerHTML={{ __html: blog.title }} />}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body1" color="text.secondary" component="div">
                                    {blog?.content && <div dangerouslySetInnerHTML={{ __html: blog.content }} />}
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                                    <Stack direction="row" alignItems="center">
                                        <Checkbox
                                            icon={<FavoriteBorder />}
                                            checkedIcon={<Favorite sx={{ color: "#4c00e6" }} />}
                                            checked={isLiked}
                                            onChange={handleLike}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {likesCount}
                                        </Typography>
                                    </Stack>
                                    <IconButton>
                                        <Share />
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                        <Paper elevation={0} sx={{ p: 4, mb: 4 }}>
                            <Box sx={{ mt: 6 }}>
                                <Typography variant="h6" gutterBottom>
                                    Comments ({comments.length})
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        endIcon={<Send />}
                                        disabled={!newComment.trim()}
                                    >
                                        Post Comment
                                    </Button>
                                </Box>

                                <List>
                                    {comments.map((comment) => (
                                        <ListItem
                                            key={comment._id}
                                            alignItems="flex-start"
                                            secondaryAction={
                                                comment.userId?._id === AuthService.getCurrentUserId() && (
                                                    <IconButton edge="end" onClick={() => handleCommentDelete(comment._id)}>
                                                        <MoreVert />
                                                    </IconButton>
                                                )
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {comment.userId?.first_name?.[0] || 'U'}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${comment.userId?.first_name || 'Anonymous'} ${comment.userId?.last_name || ''}`}
                                                secondary={
                                                    <>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </Typography>
                                                        <Typography
                                                            component="p"
                                                            variant="body2"
                                                            sx={{ mt: 1 }}
                                                        >
                                                            {comment.content}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
                <RightBar />
            </Stack>
        </>
    );
};

export default BlogDetail;