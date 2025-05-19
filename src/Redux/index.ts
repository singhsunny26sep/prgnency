import { combineReducers, createStore, applyMiddleware } from 'redux'
import common from './Common'
import thunk from 'redux-thunk'

const reducers = combineReducers({ common, })
const store = createStore(reducers, applyMiddleware(thunk))

export default store;

export type RootState = ReturnType<typeof reducers>;