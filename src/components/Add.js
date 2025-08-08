import { 
    Fab, 
    Tooltip, 
    Box, 
    Typography, 
    Divider, 
    TextField, 
    MenuItem, 
    InputLabel, 
    Input, 
    Button,
    Paper,
    styled,
    useTheme
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";
import Select from "@mui/material/Select";
import JoditEditor from "jodit-react";
import Confetti from 'react-confetti'
import ModalBox from "./ModalBox";
import { useCreateBlogMutation } from '../../src/api/blog/createblog/useCreateBlog';
import AuthService from "../utilities/auth-service";
import { authToken } from "../utilities/constant";
import { toast } from 'react-toastify';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`
}));

const Add = ({ isEditBlog = false, editedData = false, setEditBlog, setEditedData }) => {
    const theme = useTheme();
    const { mutate: createPostMutation } = useCreateBlogMutation();
    const [openModel, setOpenModel] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const [formData, setFormData] = useState({
        title: isEditBlog ? editedData && editedData.title && editedData.title : '',
        category: isEditBlog ? editedData && editedData.category && editedData.category : '',
        content: isEditBlog ? editedData && editedData.content && editedData.content : '',
    });

    const [mediaFile, setMediaFile] = useState(null);
    const handleChange = ({ value, name }) => {
        setFormData({ ...formData, [`${name}`]: value })
    }

    const handleFileChange = (e) => {
        setMediaFile(e.target.files[0]);
    }

    const handleModelClose = () => {
        setOpenModel(false);
        setShowConfetti(false);
        setFormData({
            title: '',
            category: '',
            content: '',
        });
        isEditBlog && setEditBlog(false);
        editedData && setEditedData({});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = new AuthService(authToken).getCookie();
        if (!token) {
            toast.warn('Sorry! Please login first.', {
                className: "warn-toast", // Apply the custom CSS class for errors
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            setOpenModel(false)
            isEditBlog && setEditBlog(false)
            editedData && setEditedData({});
            return
        }
        createPostMutation({ file: mediaFile, title: formData.title, content: formData.content, category: formData.category })
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
            setOpenModel(false)
            isEditBlog && setEditBlog(false)
            isEditBlog && setFormData({
                title: '',
                category: '',
                content: '',
            });
            setMediaFile(null);
        }, 4000)
    }

    return (
        <div>
            <Tooltip
                title="Add"
                onClick={(e) => { setOpenModel(true) }}
                sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 1
                }}
            >
                <Fab 
                    sx={{
                        width: { xs: 45, sm: 55 },
                        height: { xs: 45, sm: 55 },
                        boxShadow: 3,
                        bgcolor: '#4c00e6',
                        '&:hover': {
                            bgcolor: '#3900b3'
                        }
                    }}
                >
                    <AddIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: 'white' }} />
                </Fab>
            </Tooltip>
            <ModalBox
                open={openModel || isEditBlog}
                onClose={handleModelClose}
            >
                <StyledPaper elevation={0}>
                    <Typography 
                        variant="h5" 
                        color="primary" 
                        textAlign="center" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 600,
                            mb: 3
                        }}
                    >
                        {isEditBlog ? 'Update Post' : 'Create New Post'}
                    </Typography>
                    <Divider sx={{ mb: 4 }} />
                    {showConfetti && <Confetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        numberOfPieces={200}
                        recycle={false}
                    />}
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            '& .jodit-container': {
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'}`,
                                '& .jodit-toolbar__box': {
                                    background: theme.palette.mode === 'dark' ? '#333' : '#f8f8f8',
                                },
                                '& .jodit-workplace': {
                                    background: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
                                },
                                '& .jodit-status-bar': {
                                    background: theme.palette.mode === 'dark' ? '#333' : '#f8f8f8',
                                }
                            }
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            name="title"
                            value={formData.title}
                            onChange={(e) => { handleChange({ value: e.target.value, name: e.target.name }) }}
                            fullWidth
                            label="Post Title"
                            variant="outlined"
                            placeholder="Enter an engaging title"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#4c00e6',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4c00e6',
                                    },
                                },
                            }}
                        />
                        
                        <Box sx={{ mt: 2 }}>
                            <InputLabel sx={{ mb: 1, color: theme.palette.text.primary }}>Content</InputLabel>
                            <JoditEditor
                                value={formData.content}
                                config={{
                                    readonly: false,
                                    height: 300,
                                    enableDragAndDropFileToEditor: false,
                                    showCharsCounter: false,
                                    showWordsCounter: false,
                                    showXPathInStatusbar: false,
                                    toolbarButtonSize: 'medium',
                                    toolbarAdaptive: false,
                                    buttons: ['bold', 'italic', 'underline', 'strikethrough', '|', 
                                            'ul', 'ol', '|', 'center', 'left', 'right', 'justify', '|',
                                            'link', '|', 'hr', 'eraser'],
                                    theme: theme.palette.mode,
                                    textIcons: false,
                                    uploader: {
                                        insertImageAsBase64URI: true
                                    },
                                    spellcheck: false,
                                    autofocus: false,
                                    minHeight: 300,
                                    maxHeight: 500,
                                    defaultMode: 1,
                                    removeButtons: ['fullsize', 'image', 'file', 'video'],
                                    statusbar: false,
                                    tabIndex: 1
                                }}
                                onBlur={(newContent) => handleChange({ value: newContent, name: 'content' })}
                                onChange={(newContent) => {}}
                            />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <InputLabel sx={{ mb: 1, color: theme.palette.text.primary }}>Category</InputLabel>
                            <Select
                                value={formData.category}
                                name="category"
                                onChange={(e) => { handleChange({ value: e.target.value, name: e.target.name }) }}
                                fullWidth
                                displayEmpty
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#4c00e6',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#4c00e6',
                                    },
                                }}
                            >
                                <MenuItem value="" disabled>Select a category</MenuItem>
                                <MenuItem value="stack">Stack</MenuItem>
                                <MenuItem value="queue">Queue</MenuItem>
                                <MenuItem value="array">Array</MenuItem>
                            </Select>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <InputLabel sx={{ mb: 1, color: theme.palette.text.primary }}>Featured Image</InputLabel>
                            <Input
                                type="file"
                                fullWidth
                                inputProps={{ 
                                    accept: '.png,.jpg,.jpeg',
                                    style: { 
                                        cursor: 'pointer',
                                        padding: '10px 0',
                                        color: theme.palette.text.primary
                                    }
                                }}
                                onChange={(e) => { handleFileChange(e) }}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                mt: 3,
                                py: 1.5,
                                fontWeight: 600,
                                fontSize: '1rem',
                                textTransform: 'none',
                                borderRadius: '8px',
                                bgcolor: '#4c00e6',
                                '&:hover': {
                                    bgcolor: '#3900b3'
                                }
                            }}
                            onClick={handleSubmit}
                        >
                            {isEditBlog ? 'Update Post' : 'Publish Post'}
                        </Button>
                    </Box>
                </StyledPaper>
            </ModalBox>
        </div>
    );
};

export default Add;