import { useSelector } from 'react-redux'

const Statistics = () => {
  const { good, ok, bad } = useSelector(state => state)

  return (
    <div>
      <p>good {good}</p>
      <p>ok {ok}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default Statistics
