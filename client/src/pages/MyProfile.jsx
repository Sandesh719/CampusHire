import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

export const MyProfile = () => {
  const { loading, me } = useSelector((state) => state.user);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const convertDateFormat = (inputDate) => {
    if (!inputDate) return "--";
    try {
      const [year, month, day] = inputDate.split("-");
      return `${day}-${month}-${year}`;
    } catch {
      return inputDate;
    }
  };

  if (loading) return <Loader />;
  if (!me) return null;

  const isStudent = me.role === "student";
  const isRecruiter = me.role === "recruiter";

  return (
    <>
      <MetaData title="My Profile" />

      <div className="bg-gray-950 min-h-screen pt-16 md:px-20 px-4 text-white">
        <div className="text-3xl font-medium underline underline-offset-8 mb-8">
          My Profile
        </div>

        <div className="flex flex-col md:flex-row md:gap-12 justify-around items-start">
          {/* Avatar and edit button */}
          <div className="md:w-1/2 w-full flex flex-col items-center gap-6">
            <div className="w-56 h-56 md:w-72 md:h-72">
              <img
                src={me.avatar?.url || "/default-avatar.png"}
                alt="avatar"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <Link
              to="/editProfile"
              className="blueCol px-10 py-2 text-center font-semibold rounded"
            >
              Edit Profile
            </Link>
          </div>

          {/* Information blocks */}
          <div className="md:w-1/2 w-full pb-20 md:pt-6 pt-10 space-y-6">
            <div>
              <p className="md:text-2xl text-xl">Full Name</p>
              <p className="md:text-xl pt-1 text-lg">{me.name}</p>
            </div>

            <div>
              <p className="md:text-2xl text-xl">Email</p>
              <p className="md:text-xl pt-1 text-lg">{me.email}</p>
            </div>

            {me.contactNumber && (
              <div>
                <p className="md:text-2xl text-xl">Contact Number</p>
                <p className="md:text-xl pt-1 text-lg">{me.contactNumber}</p>
              </div>
            )}

            <div>
              <p className="md:text-2xl text-xl">Joined On</p>
              <p className="md:text-xl pt-1 text-lg">
                {convertDateFormat(me.createdAt?.substr(0, 10))}
              </p>
            </div>

            {/* ---------- Student Profile ---------- */}
            {isStudent && (
              <>
                <div>
                  <p className="md:text-2xl text-xl">College</p>
                  <p className="md:text-xl pt-1 text-lg">{me.college}</p>
                </div>

                {me.year && (
                  <div>
                    <p className="md:text-2xl text-xl">Year</p>
                    <p className="md:text-xl pt-1 text-lg">{me.year}</p>
                  </div>
                )}

                <div>
                  <p className="md:text-2xl text-xl">Skills</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {me.skills?.length > 0 ? (
                      me.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-yellow-500 text-black text-sm px-2 py-1 font-bold rounded"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No skills added</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:gap-8 pt-4 gap-3">
                  <ul className="space-y-3">
                    <li>
                      <button
                        onClick={open}
                        className="blueCol w-full md:w-48 font-medium px-6 py-1"
                      >
                        My Resume
                      </button>
                    </li>
                    <li>
                      <Link to="/applied">
                        <button className="blueCol w-full md:w-48 font-medium px-6 py-1">
                          My Applications
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/saved">
                        <button className="blueCol w-full md:w-48 font-medium px-6 py-1">
                          Saved Jobs
                        </button>
                      </Link>
                    </li>
                  </ul>

                  <ul className="space-y-3">
                    <li>
                      <Link to="/changePassword">
                        <button className="blueCol w-full md:w-48 font-medium px-6 py-1">
                          Change Password
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/deleteAccount">
                        <button className="blueCol w-full md:w-48 font-medium px-6 py-1">
                          Delete Account
                        </button>
                      </Link>
                    </li>
                  </ul>
                </div>

                <Modal opened={opened} onClose={close} title="Resume">
                  {me.resume?.url ? (
                    <iframe
                      src={me.resume.url}
                      title="Resume"
                      className="w-full min-h-[70vh]"
                    />
                  ) : (
                    <p>No resume uploaded.</p>
                  )}
                </Modal>
              </>
            )}

            {/* ---------- Recruiter Profile ---------- */}
            {isRecruiter && (
              <>
                <div>
                  <p className="md:text-2xl text-xl">Company Name</p>
                  <p className="md:text-xl pt-1 text-lg">{me.companyName}</p>
                </div>

                {me.companyDescription && (
                  <div>
                    <p className="md:text-2xl text-xl">Company Description</p>
                    <p className="md:text-xl pt-1 text-lg">
                      {me.companyDescription}
                    </p>
                  </div>
                )}

                <div>
                  <p className="md:text-2xl text-xl">Verified Recruiter</p>
                  <p
                    className={`md:text-xl pt-1 text-lg ${
                      me.verifiedRecruiter ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {me.verifiedRecruiter ? "Yes ✅" : "No ❌"}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 pt-6">
                  <Link
                    to="/admin/myJobs"
                    className="blueCol px-8 py-2 font-semibold rounded text-center"
                  >
                    My Posted Jobs
                  </Link>
                  <Link
                    to="/admin/postJob"
                    className="blueCol px-8 py-2 font-semibold rounded text-center"
                  >
                    Post a New Gig
                  </Link>
                  <Link
                    to="/changePassword"
                    className="blueCol px-8 py-2 font-semibold rounded text-center"
                  >
                    Change Password
                  </Link>
                  <Link
                    to="/deleteAccount"
                    className="blueCol px-8 py-2 font-semibold rounded text-center"
                  >
                    Delete Account
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};