import React, { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { markAllNotificationsRead, selectAllNotifications } from "./notificationsSlice";
import { getAllUsers } from "../users/usersSlice";
import { formatDistanceToNow, parseISO } from "date-fns";
import classNames from "classnames";

export const NotificationsList = () => {
  // Get all notifications from state, render
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(getAllUsers)

  // Want to dispatch a mark read action on render
  useLayoutEffect(() => {
    dispatch(markAllNotificationsRead())
  })

  const renderedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || {
      name: 'Unknown user'
    }
    const notificationClassName = classNames('notification', {
      new: notification.isNew
    })

    return (
      <div key={notification.id} className={notificationClassName}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}