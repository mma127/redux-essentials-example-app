import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState({
  status: "idle",
  error: null
})

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "pending"
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "success"
        // return action.payload
        usersAdapter.setAll(state, action.payload)
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failure"
        state.error = action.error.message
      })
  }
})

// export const { } = usersSlice.actions

export default usersSlice.reducer

export const {
  selectById: getUserById,
  selectAll : getAllUsers
} = usersAdapter.getSelectors(state => state.users)

// export const getAllUsers = state => state.users.users
// export const getUserById = (state, userId) => state.users.users.find(user => user.id === userId)