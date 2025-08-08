import { Box, Grid, Container, Typography, CircularProgress, Paper, useTheme } from "@mui/material";
import Blogcard from "./Blogcard";
import { useGetBlogs } from '../api/blog/getblogs/use-get-blog';

const Feed = ({ searchTerm }) => {
    const theme = useTheme();
    const { data, isLoading, error } = useGetBlogs({ searchTerm });
    const blogList = data?.data?.data || [];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography color="error">Failed to load blogs. Please try again.</Typography>
            </Box>
        );
    }

    return (
        <Box 
            flex={4} 
            p={2} 
            sx={{ 
                backgroundColor: theme.palette.background.default,
                minHeight: 'calc(100vh - 64px)',
                overflowY: 'auto'
            }}
        >
            <Container maxWidth="xl">
                {blogList?.length === 0 ? (
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            backgroundColor: 'transparent'
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            No blogs found
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {blogList?.map((blog) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={blog._id}>
                                <Blogcard blog={blog} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Feed;