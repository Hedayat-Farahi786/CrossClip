"use client";
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Avatar, Dropdown, Navbar as Nav } from "flowbite-react";
import { DarkMode } from "./DarkMode";
import './Navbar.css';
import avatar from '../assets/avatar.png';
import { LanguageSelection } from "./LanguageSelection";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png"

export function Navbar() {

  const { t } = useTranslation();

  const location = useLocation();
  const navItems = [
    { path: '/', label: 'home' },
    { path: '/about', label: 'about' },
    { path: '/services', label: 'services' },
    { path: '/pricing', label: 'pricing' },
    { path: '/contact', label: 'contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="navbar bg-white dark:bg-black md:py-4 py-2">
      <Nav fluid rounded className="mx-auto w-[90%] dark:bg-black">
        <Nav.Brand as={Link} to="/">
          <img className="w-24 md:w-36" src={logo} alt="logo" />
        </Nav.Brand>
        <div className="flex md:order-2">
          
          <div className="flex items-center flex-row-reverse">
            <LanguageSelection />
          {/* <DarkMode /> */}
          </div>
          {/* <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={avatar}
                className="avatar"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">Hedayat Farahi</span>
              <span className="block truncate text-sm font-medium">
                Hedayat@evoluna.co
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown> */}
          <Nav.Toggle />
        </div>
        <Nav.Collapse>
          {navItems.map(({ path, label }) => (
            <Nav.Link
              key={path}
              as={Link}
              to={path}
              className={`transition-all duration-200 ease-in-out ${
                isActive(path)
                  ? 'font-semibold active border-b-2 border-gray-300'
                  : 'font-normal text-black hover:text-black'
              } nav-link-custom`}
              active={isActive(path)}
            >
              {t(label)}
            </Nav.Link>
          ))}
        </Nav.Collapse>
      </Nav>
    </div>
  );
}