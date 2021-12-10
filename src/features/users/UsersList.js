import React from 'react'
import { useSelector } from "react-redux";
import { getAllUsers } from "./usersSlice";
import { Link } from "react-router-dom";
import { Spinner } from "../../components/Spinner";

const UserBlock = ({ user }) => (
  <li key={user.id}>
    <Link to={`/users/${user.id}`}>{user.name}</Link>
  </li>
)

export const UsersList = () => {
  // Get all Users from store, display as list

  const usersLoadingStatus = useSelector(state => state.users.status)
  const users = useSelector(getAllUsers)

  let content = ''
  if (usersLoadingStatus === "pending") {
    content = <Spinner text="Loading..." />
  } else {
    const renderedUsers = users.map(user => <UserBlock key={user.id} user={user} />)
    content = <ul>{renderedUsers}</ul>
  }

  return (
    <section>
      <h2>Users</h2>
      {content}
    </section>
  )
}