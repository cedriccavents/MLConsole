import { createSlice } from "@reduxjs/toolkit"

const initialParam = {
    modeltype: 'Regression', 
    model: 'Linear'
}

const modelSlice = createSlice({
    name: 'model',
    initialState: initialParam,
    reducers: {
        setModelType(state, action){
            return {...state, modeltype: action.payload}
        },
        setModelName(state, action){
            return {...state, model: action.payload}
        },
        setAdvancedParam(state, action){
            const param = action.payload.param
            const value = action.payload.value
            const newState = {...state}
            newState[param] = value
            return newState
        }
    }

})



export const { setModelType, setModelName, setAdvancedParam } = modelSlice.actions
export default modelSlice.reducer