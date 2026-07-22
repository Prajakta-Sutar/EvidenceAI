import './App.css';
import Homepage from './homepage';
import Channels from './channels';
import Navlink from './navlink';
import Profile from './profile';
import Messages from './messages';
import { Navigate } from 'react-router-dom'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {

    window.BASE_URL = 'http://localhost:4000';


    // ariables to store access information about the current user
    const [access, setAccess] = useState(true);
    const [user, setUser] = useState('');

    // Give access to user to use website 
    const authenticate = (hasAccess, currUser)=>{
        setAccess(hasAccess);
        setUser(currUser);
    }

    // Remove access from user
    const removeAuthentication = () =>{
        setAccess(false);
        setUser('');
        sessionStorage.removeItem('session_user');
        sessionStorage.setItem('isAdmin', "false");
    }

    // Save or remove user's information in sessionStorage
    useEffect(()=>{
        if(user){
            sessionStorage.setItem('session_user', user);
        }
        else{
            sessionStorage.removeItem('session_user');
            sessionStorage.setItem('isAdmin', "false");
        }
    });

    return (
        <>
            <Router>
                <Navlink removeAccess={removeAuthentication}></Navlink> 
                <Routes>
                    <Route path="/" element={<Homepage  giveAccess={authenticate}/>}/>
                    <Route path="/channels" element={ access ? <Channels/> : <Navigate to="/"/>}/>
                    <Route path="/profile" element={access ? <Profile/> :<Navigate to="/"/> }/>
                    <Route path="/messages" element={access ? <Messages/> : <Navigate to="/" />} />
                </Routes>
            </Router>
        </>
  );
}

export default App;
