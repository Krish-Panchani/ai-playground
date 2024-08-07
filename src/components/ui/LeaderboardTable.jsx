import React from 'react';

const LeaderboardTable = ({ users }) => {
  const getBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'Gold';
      case 2:
        return 'Silver';
      case 3:
        return 'Bronze';
      default:
        return 'Honorable Mention';
    }
  };

  return (
    <div className="rounded-lg border border-orange-500 bg-card text-card-foreground shadow-sm text-white" data-v0-t="card">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead >
            <tr className="border-b-2 font-bold text-md sm:text-xl transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle text-muted-foreground bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Rank
              </th>
              <th className="h-12 px-4 text-left align-middle text-muted-foreground bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Username
              </th>
              <th className="h-12 px-4 align-middle text-muted-foreground  text-right bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Points
              </th>
              {/* <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground ">
                <span className="sr-only">Avatar</span>
              </th> */}
            </tr>
          </thead>
          <tbody className="[&amp;_tr:last-child]:border-0">
            {users.map((user, index) => (
              <tr key={index} className="border-b border-orange-500 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle  font-medium">{index + 1}</td>
                <td className="p-4 align-middle ">
                  <div className="flex items-center gap-2">
                    {/* <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      <img className="aspect-square h-full w-full" alt={user.displayName} src="/placeholder-user.jpg" />
                    </span> */}
                    <div>{user.displayName}</div>
                  </div>
                </td>
                <td className="p-4 align-middle  text-right">{user.score}</td>
                <td className="p-4 align-middle ">
                  <div className="flex justify-end">
                    <div
                      className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                      data-v0-t="badge"
                    >
                      {getBadge(index + 1)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;