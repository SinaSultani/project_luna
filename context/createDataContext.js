import React, { useReducer, createContext } from "react";
import { create } from "react-test-renderer";


export default (reducer, actions, initialState) => {
    const Context = createContext();

    const Provider = ({ children }) => {
        const [state, dispatch] = useReducer(reducer, initialState);

        //actions === {signInUser: (dispatch) => { return () => {} } }
        const boundActions = {};

        return (
            <Context.Provider value={{ state }}>
                {children}
            </Context.Provider>
        )
    }

    return { Context, Provider };
};