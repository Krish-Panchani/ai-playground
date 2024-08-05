import React from 'react';
import Login from './Login';
import { MdLogout } from "react-icons/md";

const UserInfo = ({ user, ageGroup, setAgeGroup, skillLevel, setSkillLevel, signOut, ageGroups, skillLevels, setQuestion, setResponseText }) => {
    return (
        <div className='text-white flex flex-col sm:flex-row items-center justify-between px-8 my-6 gap-4'>
            {user ? (
                <div className='flex items-center'>
                    <h2 className='text-lg sm:text-xl mr-4'>
                        Hello Artist, <span className='font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent'>{user.displayName}</span>
                    </h2>

                    <div className='flex flex-col sm:flex-row items-center justify-between px-8 gap-4'>
                        <div>
                            {/* <label className='text-white px-2 font-semibold'>I'am</label> */}
                            <select
                                value={ageGroup}
                                onChange={(e) => setAgeGroup(e.target.value)}
                                className='text-black font-semibold px-4 py-2 rounded-full bg-white' required>
                                <option value='' className='text-black font-semibold'>- Select Age Group -</option>
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
                                className='text-black font-semibold px-4 py-2 rounded-full bg-white' required>
                                <option value='' className='text-black font-semibold'>- Select Skill Level -</option>
                                {skillLevels.map(level => (
                                    <option key={level} value={level} className='text-black font-semibold'>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className='flex items-center gap-2 px-4 py-2 bg-red-500 rounded-full text-white font-semibold'>
                            <MdLogout className='text-xl' />
                            <span>Sign Out</span>
                        
                    </button>
                </div>
            ) : (
                <>
                    <h2 className='text-md sm:text-xl'>
                        Hello Artist, <span className='font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent'>Guest</span>
                    </h2>
                    <div className='flex flex-col sm:flex-row items-center justify-between px-8 gap-4'>
                        <div>
                            {/* <label className='text-white px-2 font-semibold'>I'am</label> */}
                            <select
                                value={ageGroup}
                                onChange={(e) => setAgeGroup(e.target.value)}
                                className='text-orange-700 font-semibold px-4 py-2 rounded-full bg-white border-2 border-orange-500' required>
                                <option value='' className='text-black font-semibold' disabled>- Select Age Group -</option>
                                {ageGroups.map(group => (
                                    <option key={group} value={group} className='text-orange-500 font-semibold'>{group}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            {/* <label className='text-white px-2 font-semibold'>My Skill Level</label> */}
                            <select
                                value={skillLevel}
                                onChange={(e) => setSkillLevel(e.target.value)}
                                className='text-orange-700 font-semibold px-4 py-2 rounded-full bg-white border-2 border-orange-500' required>
                                <option value='' className='text-black font-semibold' disabled>- Select Skill Level -</option>
                                {skillLevels.map(level => (
                                    <option key={level} value={level} className='text-orange-500 font-semibold'>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Login setQuestion={setQuestion} setResponseText={setResponseText} />
                </>
            )}
        </div>
    );
};

export default UserInfo;
