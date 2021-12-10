import React from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, selectAllNotifications } from "../features/notifications/notificationsSlice";

export const Navbar = () => {
  const dispatch = useDispatch()

  const allNotifications = useSelector(selectAllNotifications)
  const numUnreadNotifications = allNotifications.filter(n => !n.read).length

  // Fetch notifications by dispatching the action
  const fetchNewNotifications = () => {
    dispatch(fetchNotifications())
  }

  let unreadNotificationsBadge
  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
