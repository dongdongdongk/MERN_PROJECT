import React from "react";
import UserList from "../components/UserList";

const Users = () => {
    const USERS = [
        {
            id: 'ul',
            name: 'Max Scum',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJQI2LqLPX9YHtBRMcpt5oruL1jaaRD57OFA&usqp=CAU',
            places : 3
        }
    ];

    return (
        <UserList items={USERS} />
    )
}

export default Users