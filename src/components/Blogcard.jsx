import { 
    ExpandMore as ExpandMoreIcon, 
    Favorite, 
    FavoriteBorder, 
    MoreVert, 
    Share,
    ChatBubbleOutline,
    Send
} from "@mui/icons-material";
import { 
    Avatar, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader, 
    CardMedia, 
    Checkbox, 
    IconButton, 
    Typography,
    Menu,
    MenuItem,
    styled,
    useTheme,
    TextField,
    Box,
    Collapse,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
    Skeleton,
} from "@mui/material";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Add from './Add';
import { toggleLike, addComment, deleteComment } from '../api/blog/blog.api';
import { toast } from 'react-toastify';
import AuthService from "../utilities/auth-service";
import { authToken } from "../utilities/constant";
import { useImage } from "../utilities/useImage";

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    },
}));

const StyledCardContent = styled(CardContent)({
    flexGrow: 1,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
});

const BlogImage = ({ imageUrl }) => {
    const { loading, error, imageUrl: resolvedUrl } = useImage(imageUrl);

    if (loading) {
        return <Skeleton variant="rectangular" height={200} />;
    }

    if (error || !resolvedUrl) {
        return null;
    }

    return (
        <CardMedia
            component="img"
            height="200"
            image={resolvedUrl}
            alt="Blog image"
            sx={{ objectFit: 'cover' }}
        />
    );
};

const Blogcard = ({ blog }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditBlog, setEditBlog] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(blog.likes?.includes(AuthService.getCurrentUserId()));
    const [likesCount, setLikesCount] = useState(blog.likes?.length || 0);
    const [comments, setComments] = useState(blog.comments || []);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setEditBlog(true);
        handleMenuClose();
        setEditedData({
            title: blog.title || '',
            category: blog.category || '',
            content: blog.content || '',
            blogId: blog['_id'] || '',
        });
    };

    const handleDelete = () => {
        // Handle delete action
        handleMenuClose();
    };

    const makeContent = (content) => {
        return (
            <div>
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                    }}
                    dangerouslySetInnerHTML={{ __html: content }} 
                />
            </div>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCardClick = (event) => {
        // Prevent navigation if clicking on interactive elements
        if (event.target.closest('.action-area') || 
            event.target.closest('button') || 
            event.target.closest('a') ||
            event.target.closest('.MuiCollapse-root')) {
            return;
        }
        navigate(`/blog/${blog._id}`);
    };

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const token = new AuthService(authToken).getCookie();
        if (!token) {
            toast.warn('Please login first to like posts');
            return;
        }
        
        try {
            const response = await toggleLike(blog._id);
            setIsLiked(response.isLiked);
            setLikesCount(response.likes);
        } catch (error) {
            toast.error('Failed to update like');
        }
    };

    const handleCommentToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowComments(!showComments);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!newComment.trim()) return;

        const token = new AuthService(authToken).getCookie();
        if (!token) {
            toast.warn('Please login first to comment');
            return;
        }

        try {
            const comment = await addComment(blog._id, newComment);
            setComments([...comments, comment]);
            setNewComment('');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await deleteComment(blog._id, commentId);
            setComments(comments.filter(comment => comment._id !== commentId));
            toast.success('Comment deleted successfully');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    // const handleCommentClick = () => {  
        // navigate(`/blog/${blog._id}`);
    // };

    return (
        <>
            {isEditBlog && (
                <Add
                    isEditBlog={isEditBlog}
                    editedData={editedData}
                    setEditBlog={setEditBlog}
                    setEditedData={setEditedData}
                />
            )}
            
            <StyledCard onClick={handleCardClick}>
                <CardHeader
                    className="action-area"
                    avatar={
                        <Avatar sx={{ bgcolor: '#4c00e6' }}>
                            {blog.avatarName?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                    }
                    action={
                        <IconButton 
                            aria-label="settings" 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick(e);
                            }}
                        >
                            <MoreVert />
                        </IconButton>
                    }
                    title={
                        <Typography variant="h6" component="div" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                            {blog.title && <div dangerouslySetInnerHTML={{ __html: blog.title }} />}
                        </Typography>
                    }
                    subheader={formatDate(blog.createdAt)}
                    titleTypographyProps={{
                        color: theme.palette.text.primary,
                        fontWeight: 600
                    }}
                    subheaderTypographyProps={{
                        color: theme.palette.text.secondary
                    }}
                />

                {blog.imageUrls?.length > 0 && blog.imageUrls.map((imageUrl, index) => (
                    <BlogImage key={index} imageUrl={imageUrl} />
                ))}

                <StyledCardContent>
                    {makeContent(blog.content)}
                </StyledCardContent>

                <CardActions className="action-area" disableSpacing>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite sx={{ color: "#4c00e6" }} />}
                            checked={isLiked}
                            onChange={handleLike}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {likesCount}
                        </Typography>
                    </Box>
                    
                    <IconButton onClick={handleCommentToggle}>
                        <ChatBubbleOutline />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {comments.length}
                        </Typography>
                    </IconButton>

                    <IconButton aria-label="share">
                        <Share />
                    </IconButton>
                </CardActions>

                <Collapse in={showComments} timeout="auto" unmountOnExit>
                    <CardContent>
                        <List>
                            {comments.map((comment) => (
                                <ListItem 
                                    key={comment._id}
                                    secondaryAction={
                                        comment.userId?._id === AuthService.getCurrentUserId() && (
                                            <IconButton edge="end" onClick={() => handleCommentDelete(comment._id)}>
                                                <MoreVert />
                                            </IconButton>
                                        )
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>{comment.userId?.first_name?.[0] || 'U'}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${comment.userId?.first_name || 'Anonymous'} ${comment.userId?.last_name || ''}`}
                                        secondary={comment.content}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        
                        <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                variant="outlined"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                endIcon={<Send />}
                                disabled={!newComment.trim()}
                            >
                                Post
                            </Button>
                        </Box>
                    </CardContent>
                </Collapse>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                        }
                    }}
                >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
            </StyledCard>
        </>
    );
};

export default Blogcard;