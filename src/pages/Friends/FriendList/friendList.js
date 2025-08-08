import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import React from "react";

function FriendList({ props }) {
    const friendList = [
        {
            firstName: 'amit',
            status: 'active',
            Nationality: 'indian',
            isFollowing: true,
            avatar: 'A',
            image: '',
        },
        {
            firstName: 'abxc',
            status: 'active',
            Nationality: 'indian',
            isFollowing: true,
            avatar: '',
            image: '',
        },
        {
            firstName: 'ajdjd',
            status: 'active',
            Nationality: 'indian',
            isFollowing: true,
            avatar: 'A',
            image: '',
        },

        {
            firstName: 'bjjdd',
            status: 'active',
            Nationality: 'indian',
            isFollowing: true,
            avatar: 'B',
            image: '',
        },
    ];
    return (
        <>
            <Navbar />
            <Stack direction="row" spacing={2} justifyContent="space-between" >
                <Sidebar />
                <Box
                    p={2}
                    flex={4}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',  // Center vertically
                        justifyContent: 'center', // Center vertically
                    }}
                >
                    {
                        friendList && friendList.length && friendList.map((friend) => {
                            return (<div>
                                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar alt={friend.avatar} src="/static/images/avatar/1.jpg" />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={friend.firstName}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        Ali Connors
                                                    </Typography>
                                                    {" — I'll be in your neighborhood doing errands this…"}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </List>
                            </div>)
                        })
                    }

                </Box>
            </Stack>

        </>
    )
}

export default FriendList;