import React from "react";
import {Router, Outlet} from "react-location";

import Header from "./Header";
import Footer from "./Footer";

import {routes, location} from "../router";

export default function MainLayout() {
    return (
        <Router routes={routes} location={location}>
            <div>
                <Header/>
                <div>
                    <Outlet/>
                </div>
                <Footer/>
            </div>
        </Router>
    );
}