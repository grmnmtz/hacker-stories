import './App.css'

import { useSemiPersistentState } from './hooks/semiPersistentState'

import { InputWithLabel } from './components/InputWithLabel'
import { useEffect, useState, useReducer } from 'react/cjs/react.development'

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data: { stories: initialStories } }), 1500)
  )

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload
    case 'REMOVE_STORY':
      return state.filter((story) => action.payload.objectID !== story.objectID)
    default:
      throw new Error()
  }
  // if (action.type === 'SET_STORIES') {
  //   return action.payload
  // } else if (action.type === 'REMOVE_STORY') {
  //   return state.filter((story) => action.payload.objectID !== story.objectID)
  // } else {
  //   throw new Error()
  // }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
  // const [stories, setStories] = useState([])
  const [stories, dispatchStories] = useReducer(storiesReducer, [])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories,
        })
        // setStories(result.data.stories)
        setIsLoading(false)
      })
      .catch(() => setIsError(true))
  }, [])

  const handleRemoveStory = (item) => {
    // const newStories = stories.filter(
    //   (story) => item.objectID !== story.objectID
    // )
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })
    // setStories(newStories)
  }

  const handleSearch = (event) => setSearchTerm(event.target.value)

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1>My hacker stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />
      {isError && <p>Something went wrong while trying to get the data.</p>}

      {isLoading ? (
        <h3>Loading stories...</h3>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  )
}

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ))

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => onRemoveItem(item)

  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  )
}

export default App
