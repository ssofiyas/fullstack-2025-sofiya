import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload
    case "CLEAR":
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

// Apufunktiot helpottaa käyttöä komponenteissa
export const useNotificationValue = () => useContext(NotificationContext)[0]
export const useNotificationDispatch = () => useContext(NotificationContext)[1]

export default NotificationContext