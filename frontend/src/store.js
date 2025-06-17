import { configureStore } from '@reduxjs/toolkit'

import stepReducer from './reducers/steps'
import modelReducer from './reducers/model'

const store = configureStore({
    reducer: {
        steps: stepReducer,
        model: modelReducer,
    }
})

export default store
