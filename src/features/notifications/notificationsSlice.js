import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from '../../api/client'

const initialState = {
  notifications: [],
  status: "idle",
  error: null
}

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
      const allNotifications = state.notifications
      allNotifications.forEach(notification => {
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
        state.notifications.push(...action.payload)
        state.notifications.forEach(notification => {
          // Any read notifications are no longer new
          notification.isNew = !notification.read
        })
        state.notifications.sort((a,b) => b.date.localeCompare(a.date))
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failure"
        state.error = action.error.message
      })
  }
})

export const { markAllNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectAllNotifications = state => state.notifications.notifications

