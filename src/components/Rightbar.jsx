import { Star } from "@mui/icons-material";
import { 
    Avatar, 
    AvatarGroup, 
    Box, 
    Divider, 
    Link, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    Typography, 
    Paper,
    styled,
    useTheme
} from "@mui/material";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(3),
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
}));

const TopicLink = styled(Link)(({ theme }) => ({
    color: theme.palette.text.primary,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const RightBar = () => {
    const theme = useTheme();

    const trendingTopics = [
        {
            title: "Understanding JavaScript Loops: for-of vs for-in",
            link: "https://example.com/js-loops"
        },
        {
            title: "Kubernetes Fundamentals: A Beginner's Guide",
            link: "https://example.com/kubernetes"
        },
        {
            title: "Docker Compose: Complete Tutorial",
            link: "https://example.com/docker-compose"
        },
        {
            title: "Modern React Development Best Practices",
            link: "https://example.com/react-best-practices"
        }
    ];

    const conversations = [
        {
            id: 1,
            author: "Sarah Johnson",
            avatar: "/avatars/sarah.jpg",
            title: "React Hooks Discussion",
            preview: "What's your experience with custom hooks implementation?"
        },
        {
            id: 2,
            author: "Mike Chen",
            avatar: "/avatars/mike.jpg",
            title: "TypeScript Migration",
            preview: "Tips for migrating a large codebase to TypeScript..."
        },
        {
            id: 3,
            author: "Emma Wilson",
            avatar: "/avatars/emma.jpg",
            title: "State Management",
            preview: "Redux vs Context API - when to use what?"
        }
    ];

    return (
        <Box 
            flex={2} 
            p={2} 
            sx={{ 
                display: { xs: 'none', sm: 'block' },
                maxHeight: 'calc(100vh - 64px)',
                overflowY: 'auto',
                position: 'sticky',
                top: 64, // AppBar height
                backgroundColor: theme.palette.background.default,
            }}
        >
            <StyledPaper>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Trending Topics
                </Typography>
                <List disablePadding>
                    {trendingTopics.map((topic, index) => (
                        <ListItem key={index} disablePadding>
                            <TopicLink href={topic.link} target="_blank">
                                <Star sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                                <Typography variant="body2" noWrap>
                                    {topic.title}
                                </Typography>
                            </TopicLink>
                        </ListItem>
                    ))}
                </List>
            </StyledPaper>

            <StyledPaper>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Active Authors
                </Typography>
                <AvatarGroup max={6} sx={{ justifyContent: 'center', mb: 2 }}>
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter, index) => (
                        <Avatar 
                            key={index}
                            sx={{ 
                                bgcolor: `hsl(${index * 40}, 70%, 50%)`,
                                width: 40,
                                height: 40
                            }}
                        >
                            {letter}
                        </Avatar>
                    ))}
                </AvatarGroup>
            </StyledPaper>

            <StyledPaper>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Latest Conversations
                </Typography>
                <List disablePadding>
                    {conversations.map((conversation) => (
                        <div key={conversation.id}>
                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                <ListItemAvatar>
                                    <Avatar alt={conversation.author}>
                                        {conversation.author[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={conversation.title}
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                                sx={{ display: 'block' }}
                                            >
                                                {conversation.author}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {conversation.preview}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider component="li" sx={{ my: 1 }} />
                        </div>
                    ))}
                </List>
            </StyledPaper>
        </Box>
    );
};

export default RightBar;