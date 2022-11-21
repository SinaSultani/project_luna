import React, { useContext, useState } from 'react'

export const UserContext = React.createContext();

export const UserProvider = ({children}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [ loggedIn, setLoggedIn ] = useState(false)
    const [ initializing, setInitializing ] = useState(true)
    const [ user, setUser ] = useState({});
    const [ balance, setBalance ] = useState(0)

    const thisUser = {
        email, 
        setEmail,
        password,
        setPassword,   
        user, 
        setUser,
        loggedIn,
        setLoggedIn
    }


    // return (
    //     <UserContext.Provider value={{email, setEmail, password, setPassword}}>
    //         {children}
    //     </UserContext.Provider>
    // )
    return (
        <UserContext.Provider value={thisUser}>
            {children}
        </UserContext.Provider>
    )
};