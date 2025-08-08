import styled from "@emotion/styled";
import { TextareaAutosize } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

const Textarea = () => {

    const StyledTextarea = styled(TextareaAutosize)(({ theme }) => `
width: 380px;
font-family: IBM Plex Sans, sans-serif;
font-size: 0.875rem;
font-weight: 400;
line-height: 1.5;
padding: 12px;
border-radius: 12px 12px 0 12px;
color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
margin-top: 15px;
margin-bottom: 15px;

&:hover {
  border-color: ${blue[800]};
}

// firefox
&:focus-visible {
  outline: 0;
}
@media (max-width: 600px) { // Adjust the breakpoint as needed
    width: 90%; // Make the textarea full width on smaller screens
  }
`,)
    return (
        <StyledTextarea
            aria-label="minimum height"
            minRows={6}
            placeholder="Write the discription here..."
        />
    )

}

export default Textarea;