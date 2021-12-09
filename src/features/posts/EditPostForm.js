import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'

import { postUpdated } from "./postsSlice";

export const EditPostForm = ({ match }) => {
  // Get post id from url match
  const { postId } = match.params

  // Select post from state with post id
  const post = useSelector(state => state.posts.find(post => post.id === postId))

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const dispatch = useDispatch()
  const history = useHistory()

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  // Expose onSave button to update the post to state
  const onPostSaved = () => {
    if (title && content) {
      dispatch(postUpdated({ id: post.id, title, content }))
      history.push(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChanged}/>
        <label htmlFor="postContent">Post Content:</label>
        <input type="text" id="postContent" name="postContent" value={content} onChange={onContentChanged} />
        <button type="button" onClick={onPostSaved}>Save Edit</button>
      </form>
    </section>
  )
}