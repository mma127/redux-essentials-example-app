import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { sub } from 'date-fns'

const initialState = {
  posts: [
    {
      id: "1",
      title: "First post!",
      content: 'Hello!',
      date: sub(new Date(), { minutes: 10 }).toISOString(),
      reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 }
    },
    {
      id: "2",
      title: 'Second Post',
      content: "More text",
      date: sub(new Date(), { minutes: 5 }).toISOString(),
      reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 }
    }
  ],
  status: 'idle', // idle, pending, success, failure
  error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async initialPost => {
  // The payload creator receives the partial `{title, content, user}` object
  // Send the initial data to the fake API
  const response = await client.post('/fakeApi/posts', initialPost)
  // The response contains the complete post object including unique ID
  return response.data
})

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // This is replaced by addNewPost
    // postAdded: {
    //   reducer(state, action) {
    //     state.posts.push(action.payload)F
    //   },
    //   prepare(title, content, userId) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         title,
    //         content,
    //         user: userId,
    //         date: new Date().toISOString(),
    //         reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 }
    //       }
    //     }
    //   }
    // },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const post = state.posts.find(post => id === post.id)
      if (post) {
        post.title = title
        post.content = content
      }
    },
    reactionIncrement(state, action) {
      const { id, reactionName } = action.payload
      const post = state.posts.find(post => id === post.id)
      if (post) {
        post.reactions[reactionName] += 1
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "pending"
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "success"
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failure"
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // Directly add the new post object to the posts array
        state.posts.push(action.payload)
      })
  }
})

export const { postUpdated, reactionIncrement } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)
export const selectAllPostsByUserId = (state, userId) => {
  const posts = selectAllPosts(state)
  return posts.filter(post => post.user === userId)
}