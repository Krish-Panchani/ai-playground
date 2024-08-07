import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import UserInfo from '../components/UserInfo';
import useAuth from "../hooks/useAuth";
import Footer from '../components/Footer';
import useUserScore from '../hooks/useUserScore';
import useAge from '../hooks/useAge';
import useSkill from '../hooks/useSkill';
import { getDocs, query, collection, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../firebase';
import LeaderboardTable from '../components/ui/LeaderboardTable';
import { MdOutlineLeaderboard } from "react-icons/md";

function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const { ageGroup, setAgeGroup, ageGroups } = useAge();
    const { skillLevel, setSkillLevel, skillLevels } = useSkill();
    const score = useUserScore();
    const user = useAuth();
    const isPage = "Leaderboard";

    useEffect(() => {
        const fetchUsers = async () => {
            const q = query(collection(firestore, 'users'), orderBy('score', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => doc.data());

            console.log("Fetched Users List:", usersList); // Debugging

            // Check for the logged-in user's rank
            if (user) {
                const userRankIndex = usersList.findIndex(u => u.email === user.email);
                if (userRankIndex !== 1) {
                    setUserRank(userRankIndex + 1);
                } else {
                    setUserRank(null);
                }
            }

            setUsers(usersList);
        };

        fetchUsers();
    }, [user]);

    // Find the user's complete data for display
    const userRow = users.find(u => u.uid === user?.uid);

    console.log("Logged-in User Data:", userRow); // Debugging

    return (
        <div className="flex flex-col min-h-screen bg-black p-4">
            <Header score={score} className="mb-4" />
            <UserInfo
                user={user}
                ageGroup={ageGroup}
                setAgeGroup={setAgeGroup}
                skillLevel={skillLevel}
                setSkillLevel={setSkillLevel}
                ageGroups={ageGroups}
                skillLevels={skillLevels}
                isPage={isPage}
            />
            <div className="w-full max-w-4xl text-white mx-auto p-2 md:p-10 h-screen">
                <div className="flex items-center gap-2 justify-center mb-6">
                    <MdOutlineLeaderboard className='text-3xl' />
                    <h1 className="text-2xl text-center font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient-animate">Leaderboard</h1>
                </div>
                <LeaderboardTable users={users} />
                {user &&  (
                    <div className="mt-6 text-center text-lg text-white">
                        <p>Your Rank: {userRank}</p>
                        <div className="mt-4">
                            <table className="w-full caption-bottom text-sm">
                                <thead>
                                    <tr className="border-b font-bold text-md sm:text-xl transition-colors hover:bg-muted/50">
                                        <th className="h-12 px-4 text-left align-middle text-muted-foreground">Rank</th>
                                        <th className="h-12 px-4 text-left align-middle text-muted-foreground">Username</th>
                                        <th className="h-12 px-4 text-right align-middle text-muted-foreground">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-orange-500 transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{userRank}</td>
                                        <td className="p-4 align-middle">{user.displayName}</td>
                                        {/* <td className="p-4 align-middle text-right">{userRow.score}</td> */}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Leaderboard;
