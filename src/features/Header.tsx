import React from "react";
import {Box} from "@mui/material";
import {Link} from 'react-location';

export default function Header() {
    return (
        <Box sx={{display: 'flex', background: 'cyan', marginLeft: 10}}>
            Header

            <Link to={'/'}>
                <p>Home</p>
            </Link>
            <Link to={'/login'}>
                <p>Login</p>
            </Link>
        </Box>
    );
}