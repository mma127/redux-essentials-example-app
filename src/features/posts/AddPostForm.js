import React, { useState } from 'react'
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { postAdded } from "./postsSlice";

export const AddPostForm = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)

  const onPostSaved = () => {
    if (title && content) {
      dispatch(postAdded({ id: nanoid(), title, content }))
    }
    setTitle('')
    setContent('')
  }

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Post Content:</label>
        <input
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onPostSaved}>Save Post</button>
      </form>
    </section>
  )
}
