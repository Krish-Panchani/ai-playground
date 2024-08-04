import React from 'react';
import Login from './Login';

const UserInfo = ({ user, ageGroup, setAgeGroup, skillLevel, setSkillLevel, signOut, ageGroups, skillLevels, setQuestion, setResponseText }) => {
    return (
        <div className='text-white flex items-center justify-between px-8 my-6'>
            {user ? (
                <div className='flex items-center'>
                    <h2 className='text-lg sm:text-xl mr-4'>
                        Hello Artist, <span className='font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent'>{user.displayName}</span>
                    </h2>
                    <select
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        className='bg-gray-700 text-white rounded px-2 py-1 mr-4' required>
                        <option value=''>Select Age Group</option>
                        {ageGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                    <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
                        className='bg-gray-700 text-white rounded px-2 py-1 mr-4' required>
                        <option value=''>Select Skill Level</option>
                        {skillLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                    <button
                        onClick={signOut}
                        className='px-4 py-2 bg-red-600 rounded text-white'>
                        Sign Out
                    </button>
                </div>
            ) : (
                <>
                    <h2 className='text-md sm:text-xl'>
                        Hello Artist, <span className='font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent'>Guest</span>
                    </h2>
                    <div>
                        <label className='text-white px-2'>I'am</label>
                        <select
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        className='bg-white text-black rounded px-2 py-1 mr-4' required>
                        <option value=''>Select Age Group</option>
                        {ageGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                        <label className='text-white px-2'>My Skill Level</label>
                        <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
                        className='bg-white text-black rounded px-2 py-1 mr-4' required>
                        <option value=''>Select Skill Level</option>
                        {skillLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                    </div>
                    <Login setQuestion={setQuestion} setResponseText={setResponseText} />
                </>
            )}
        </div>
    );
};

export default UserInfo;
