import React, { useEffect, useState } from 'react';

import UserInfo from '../components/UserInfo';
import LeaderboardTable from '../components/ui/LeaderboardTable';

import { firestore } from '../firebase';
import { getDocs, query, collection, orderBy, limit } from 'firebase/firestore';

import useAuth from "../hooks/useAuth";
import useUserScore from '../hooks/useUserScore';

function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [userRank, setUserRank] = useState(null);
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
                console.log("User Rank Index:", userRankIndex); // Debugging
                if (userRankIndex !== null) {
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
    const userRow = users.find(u => u.email === user?.email);

    console.log("Logged-in User Data:", userRow); // Debugging

    return (
        <div className="flex flex-col min-h-screen bg-black p-4">
            <UserInfo isPage={isPage} />
            <div className="w-full max-w-4xl text-white mx-auto p-2 md:p-10 h-screen">
                <div className="flex flex-col items-center gap-4 justify-center mb-6">
                    <h1 className="text-5xl text-center font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient-animate">Leaderboard</h1>
                    <p>See where you stand among the best.</p>
                </div>
                <LeaderboardTable users={users} />
                {user && (
                    <div className="mt-6 text-lg text-white">
                        <p className='text-center font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>Your Rank: <span className='text-white'>#{userRank}</span></p>
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
                                        <td className="p-4 align-left font-medium">{userRank}</td>
                                        <td className="p-4 align-left">{user.displayName}</td>
                                        <td className="p-4 align-right text-right">{score}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
