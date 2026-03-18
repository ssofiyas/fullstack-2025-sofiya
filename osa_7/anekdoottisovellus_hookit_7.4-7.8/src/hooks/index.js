import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  // Tehtävä 7.6: Eriytetään reset muista ominaisuuksista ja palautetaan se erikseen
  return {
    type,
    value,
    onChange,
    reset
  }
}