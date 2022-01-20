import React from 'react';
import {Route, ReactLocation} from 'react-location';
import Home from './features/Home';
import Login from './features/Login';

export const routes: Route[] = [
    {
        path: '/',
        element: <Home/>
    },
    {
        path: 'login',
        element: <Login/>,
    },
];


export const location = new ReactLocation();