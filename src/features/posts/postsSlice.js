import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

// Create the Posts normalized entity data object, with sortComparer to keep ids sorted based on date
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

// Combine the empty normalized state object with our state
const initialState = postsAdapter.getInitialState({
  status: 'idle', // idle, pending, success, failure
  error: null
})


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
      const post = state.entities[id] // Can look in the normalized entities object directly
      if (post) {
        post.title = title
        post.content = content
      }
    },
    reactionIncrement(state, action) {
      const { id, reactionName } = action.payload
      const post = state.entities[id] // Can look in the normalized entities object directly
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
        // Use the `upsertMany` reducer as a mutating update utility
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failure"
        state.error = action.error.message
      })
      // Directly add the new post object to the posts array
      // Use the `addOne` reducer for this, can be used just as a reducer
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  }
})

export const { postUpdated, reactionIncrement } = postsSlice.actions

export default postsSlice.reducer

// Export the customized selectors for this adapter using `getSelectors`, using ES6 destructuring to rename them to match the old names
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds

  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

// export const selectAllPosts = state => state.posts.posts

// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)

export const selectAllPostsByUserId = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)