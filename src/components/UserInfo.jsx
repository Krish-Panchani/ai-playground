import React, { useState } from 'react';
import Login from './Login';
import { Link } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import Drawer from './ui/Drawer';
import { MdLeaderboard } from "react-icons/md";
import { MdDraw } from "react-icons/md";


const UserInfo = ({ user, ageGroup, setAgeGroup, skillLevel, setSkillLevel, signOut, ageGroups, skillLevels, setQuestion, setResponseText }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='flex items-center justify-between px-2 sm:px-8 my-6 gap-4'>
            {user ? (
                <h2 className='text-white text-md sm:text-xl mr-4'>
                    Hello Artist, <span className='font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'>{user.displayName}</span>
                </h2>
            ) : (
                <>
                    <h2 className='text-white text-md sm:text-xl'>
                        Hello Artist, <span className='font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent'>Guest</span>
                    </h2>

                </>
            )}
  
                <button onClick={() => setIsOpen(true)}>
                    <HiMenuAlt3 className='text-white text-2xl sm:text-4xl' />
                </button>


            <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className='flex flex-col items-start justify-between px-2 gap-4'>
                    <div>
                        {/* <label className='text-white px-2 font-semibold'>I'am</label> */}
                        <select
                            value={ageGroup}
                            onChange={(e) => setAgeGroup(e.target.value)}
                            className='text-black text-sm sm:text-xl font-semibold px-4 py-2 rounded-full bg-white border-2 border-orange-500' required>
                            <option value='' className='text-black font-semibold text-sm sm:text-xl' disabled>- Select Age Group -</option>
                            {ageGroups.map(group => (
                                <option key={group} value={group} className='text-black font-semibold'>{group}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        {/* <label className='text-white px-2 font-semibold'>My Skill Level</label> */}
                        <select
                            value={skillLevel}
                            onChange={(e) => setSkillLevel(e.target.value)}
                            className='text-black text-sm sm:text-xl font-semibold px-4 py-2 rounded-full bg-white border-2 border-orange-500' required>
                            <option value='' className='text-black font-semibold text-sm sm:text-xl' disabled>- Select Skill Level -</option>
                            {skillLevels.map(level => (
                                <option key={level} value={level} className='text-black font-semibold'>{level}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='flex flex-col gap-6 p-4'>
                    <Link>
                        <div className='flex gap-2 items-center'>
                            <MdLeaderboard className='text-xl' />
                            <span className='text-xl font-semibold'>Leaderboard</span>
                        </div>
                    </Link>
                    <Link>
                        <div className='flex gap-2 items-center'>
                            <MdDraw className='text-2xl' />
                            <span className='sm:text-xl font-semibold'>Your Arts</span>
                        </div>
                    </Link>
                </div>
                <div className='flex justify-between gap-8'>
                    {user ?
                        <button
                            onClick={signOut}
                            className='flex items-center gap-2 px-4 py-2 bg-red-500 rounded-full text-white font-semibold'>
                            <MdLogout className='text-xl' />
                            <span>Sign Out</span>

                        </button>
                        :
                        <Login setQuestion={setQuestion} setResponseText={setResponseText} setAgeGroup={setAgeGroup} ageGroup={ageGroup} setSkillLevel={setSkillLevel} skillLevel={skillLevel} />
                    }

                </div>

            </Drawer>

        </div>
    );
};

export default UserInfo;
