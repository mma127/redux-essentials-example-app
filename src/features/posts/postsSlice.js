import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: "1", title: "First post!", content: 'Hello!'},
  { id: "2", title: 'Second Post', content: "More text" }
]

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded(state, action) {
      state.push(action.payload)
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const post = state.find(post => id === post.id)
      if (post) {
        post.title = title
        post.content = content
      }
    }
  }
})

export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer