import "./Admin.css";
import React from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Menu } from "antd";
import { DashboardOutlined, UserOutlined, PlusCircleOutlined } from "@ant-design/icons";

import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
import AdminUsers from "../components/AdminUsers/AdminUsers";
import AddItem from "./AddItem";

function Admin() {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', flexDirection: "row" }}>
            <Menu mode="vertical"
                onClick={({ key }) => {
                    navigate(key);
                }}
                items={[
                    { label: "Dashboard", key: "/admin/dashboard", icon: <DashboardOutlined /> },
                    { label: "Utilizatori", key: "/admin/users", icon: <UserOutlined /> },
                    { label: "Adauga carte", key: "/admin/addBook", icon: <PlusCircleOutlined />}
                ]}>
            </Menu>
            <Content />
        </div>
    );

    function Content() {
        return (
            <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
                <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/addBook" element={<AddItem/>}/>
                </Routes>
            </div>
        );
    }
}

export default Admin;