import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { client } from '../../api/client'

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})


const initialState = notificationsAdapter.getInitialState({
  status: "idle",
  error: null
})

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async(_, { getState }) => { // destructure getState out of the thunkAPI object which is the 2nd param to this func
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications //gets first notification from the list
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`)
    return response.data
  })

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAllNotificationsRead(state, action) {
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.pending, (state, action) => {
        state.status = "pending"
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "success"
        notificationsAdapter.upsertMany(state, action.payload)
        Object.values(state.entities).forEach(notification => {
          // Any read notifications are no longer new
          notification.isNew = !notification.read
        })
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failure"
        state.error = action.error.message
      })
  }
})

export const { markAllNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
  selectAll: selectAllNotifications
} = notificationsAdapter.getSelectors(state => state.notifications)
// export const selectAllNotifications = state => state.notifications.notifications

