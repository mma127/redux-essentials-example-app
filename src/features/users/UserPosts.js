import React from 'react'
import { useSelector } from "react-redux";
import { selectAllPostsByUserId } from "../posts/postsSlice";
import { PostExcerpt } from "../posts/PostExcerpt";
import { getUserById } from "./usersSlice";
import { Redirect } from "react-router-dom"

export const UserPosts = ({ match }) => {
  // For the given user, find all posts by the user
  const { userId } = match.params

  const user = useSelector(state => getUserById(state, userId))
  const userPosts = useSelector(state => selectAllPostsByUserId(state, userId))

  if (!user) {
    return <Redirect to="/users" />
  }

  const title = `${user.name}'s Posts`

  const renderedPosts = userPosts.map(post => <PostExcerpt key={post.id} post={post} />)
  return (
    <section className="posts-list">
      <h2>{title}</h2>
      {renderedPosts}
    </section>
  )
}