// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Menu } from '@mantine/core';
import { FaBars } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import {
  MdOutlineBusinessCenter,
  MdOutlineDashboard,
} from 'react-icons/md';
import { FaUserCircle, FaSave, FaBriefcase } from 'react-icons/fa';
import { MdDoneAll } from 'react-icons/md';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { logOrNot } from '../actions/UserActions';
import { logoutClearState } from '../slices/UserSlice';
import useIsMobile from '../hooks/useIsMobile';

export const Navbar = () => {
  const { isLogin, me } = useSelector((state) => state.user);
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const LogOut = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('role');
    dispatch(logOrNot());
    navigate('/');
    toast.success('Logout Successful!');
    dispatch(logoutClearState());
  };

  // 💡 Different menu items for recruiter and normal user
  const isRecruiter = me?.role === 'recruiter';
  const isAdmin = me?.role === 'admin';
  const isStudent = me?.role === 'student';

  const NavLinks = () => (
    <>
      <Link to="/" className="cool-link">
        Home
      </Link>

      {/* Students see gigs */}
      {isStudent && (
        <Link to="/jobs" className="cool-link">
          Gigs
        </Link>
      )}

      {/* Recruiters see Post Job + Applicants */}
      {isRecruiter && (
        <>
          <Link to="/admin/postJob" className="cool-link">
            Post Gigs
          </Link>
          <Link to="/admin/allApplications" className="cool-link">
            Applicants
          </Link>
        </>
      )}

      <Link to="/contact" className="cool-link">
        Contact
      </Link>
      <Link to="/about" className="cool-link">
        About
      </Link>
      
      {/* Portfolio link for students */}
      {isStudent && (
        <Link to="/portfolio" className="cool-link">
          My Portfolio
        </Link>
      )}
    </>
  );

  const UserMenu = () => (
    <Menu shadow="md" width={220}>
      <Menu.Target>
        <Avatar
          className="cursor-pointer fixed right-32"
          radius="xl"
          src={me?.avatar?.url}
          alt="it's me"
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Link to="/profile">
          <Menu.Item icon={<FaUserCircle size={14} />}>My Profile</Menu.Item>
        </Link>

        {/* Admin Dashboard */}
        {isAdmin && (
          <Link to="/admin/dashboard">
            <Menu.Item icon={<MdOutlineDashboard size={14} />}>
              Admin Dashboard
            </Menu.Item>
          </Link>
        )}

        {/* Recruiter-specific items */}
        {isRecruiter ? (
          <>
            <Link to="/admin/myJobs">
              <Menu.Item icon={<MdDoneAll size={14} />}>
                My Posted Jobs
              </Menu.Item>
            </Link>
          </>
        ) : (
          <>
            {/* Normal User (Student) */}
            <Link to="/applied">
              <Menu.Item icon={<MdDoneAll size={14} />}>
                Applied Jobs
              </Menu.Item>
            </Link>
            <Link to="/saved">
              <Menu.Item icon={<FaSave size={14} />}>Saved Jobs</Menu.Item>
            </Link>
            {/* Portfolio for students */}
            <Link to="/portfolio">
              <Menu.Item icon={<FaBriefcase size={14} />}>My Portfolio</Menu.Item>
            </Link>
          </>
        )}

        <Menu.Divider />
        <Menu.Item
          onClick={LogOut}
          color="red"
          icon={<RiLogoutBoxFill size={14} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <>
      <div className="text-white z-20 fixed min-w-full bg-gray-950">
        {/* Desktop Navbar */}
        {!isMobile && (
          <ul className="sm:flex justify-center items-center gap-24 pt-4 pb-3 font-semibold text-xl">
            <Link
              to="/"
              className="flex fixed left-24 justify-center items-center titleT"
            >
              <MdOutlineBusinessCenter size={19} /> CAMPUS HIRE
            </Link>

            <NavLinks />

            {isLogin ? (
              <UserMenu />
            ) : (
              <span className="fixed right-24 flex gap-3">
                <Link
                  className="cursor-pointer text-sm px-3 py-1 rounded-xl blueCol"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="cursor-pointer text-sm px-3 py-1 rounded-xl blueCol"
                  to="/register"
                >
                  Register
                </Link>
              </span>
            )}
          </ul>
        )}

        {/* Mobile Navbar */}
        <div className="py-3 px-3 md:hidden justify-between items-center flex">
          <Link
            to="/"
            className="text-lg titleT flex justify-center items-center gap-1"
          >
            <MdOutlineBusinessCenter size={19} /> CAMPUS HIRE
          </Link>

          <div className="flex justify-center items-center">
            <div className="pr-12">
              {isLogin ? (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Avatar
                      size={28}
                      className="cursor-pointer"
                      radius="xl"
                      src={me?.avatar?.url}
                      alt="it's me"
                    />
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Link to="/profile">
                      <Menu.Item icon={<FaUserCircle size={14} />}>
                        My Profile
                      </Menu.Item>
                    </Link>

                    {isAdmin && (
                      <Link to="/admin/dashboard">
                        <Menu.Item icon={<MdOutlineDashboard size={14} />}>
                          Admin Dashboard
                        </Menu.Item>
                      </Link>
                    )}

                    {isRecruiter ? (
                      <>
                        <Link to="/admin/postJob">
                          <Menu.Item icon={<MdOutlineBusinessCenter size={14} />}>
                            Post a Job
                          </Menu.Item>
                        </Link>
                        <Link to="/admin/myJobs">
                          <Menu.Item icon={<MdDoneAll size={14} />}>
                            My Posted Jobs
                          </Menu.Item>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/applied">
                          <Menu.Item icon={<MdDoneAll size={14} />}>
                            Applied Jobs
                          </Menu.Item>
                        </Link>
                        <Link to="/saved">
                          <Menu.Item icon={<FaSave size={14} />}>
                            Saved Jobs
                          </Menu.Item>
                        </Link>
                        {/* Portfolio for students in mobile menu */}
                        <Link to="/portfolio">
                          <Menu.Item icon={<FaBriefcase size={14} />}>
                            My Portfolio
                          </Menu.Item>
                        </Link>
                      </>
                    )}

                    <Menu.Divider />
                    <Menu.Item
                      onClick={LogOut}
                      color="red"
                      icon={<RiLogoutBoxFill size={14} />}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <span className="flex gap-3 fixed top-3 right-16">
                  <Link
                    className="cursor-pointer text-sm px-3 py-1 rounded-xl blueCol"
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="cursor-pointer text-sm px-3 py-1 rounded-xl blueCol"
                    to="/register"
                  >
                    Register
                  </Link>
                </span>
              )}
            </div>

            <div className="pr-1">
              {toggle ? (
                <RxCross1
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setToggle(!toggle)}
                />
              ) : (
                <FaBars
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setToggle(!toggle)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border-b md:mx-20 mx-3"></div>

        {/* Mobile Menu Drawer */}
        <div
          className={`${
            toggle ? 'flex' : 'hidden'
          } absolute w-screen h-screen z-20 md:hidden`}
        >
          <ul className="bg-gray-950 bg-opacity-95 flex flex-col gap-20 text-2xl justify-start w-screen pt-20 items-center">
            <NavLinks />
          </ul>
        </div>
      </div>
    </>
  );
};