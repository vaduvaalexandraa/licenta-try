import React, { useState } from 'react';
import { UserContext } from './UserContext';

export function UserProvider({ children }) {
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
}