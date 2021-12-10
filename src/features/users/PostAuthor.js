import React from 'react'
import { useSelector } from "react-redux";
import { getUserById } from "./usersSlice";

export const PostAuthor = ({ userId }) => {
  const author = useSelector(state => getUserById(state, userId))

  return (
    <span>
      by {author ? author.name : "Unknown author"}
    </span>
  )
}