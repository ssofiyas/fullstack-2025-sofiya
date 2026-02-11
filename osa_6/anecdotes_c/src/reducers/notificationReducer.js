import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const setNotificationAsync = (message, seconds) => {
  return dispatch => {
    dispatch(setNotification(message))

    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
