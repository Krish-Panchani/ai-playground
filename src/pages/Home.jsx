import React from 'react'
import { Link } from 'react-router-dom';
function Home() {
    return (
        <div>
        <h1>Home</h1>
        <p>Welcome to the home page!</p>
        <Link to={"/CreativeQuest"}>CreativeQuest</Link>
        </div>
    )
    }

    export default Home;