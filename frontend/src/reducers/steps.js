import { createSlice } from "@reduxjs/toolkit"

import api from "../services/api"
import { unstable_composeClasses } from "@mui/material"

const initialVars = {
    target: null,
    features: [],
    selectedFeature: null
}

const stepSlice = createSlice({
    name: 'step',
    initialState: initialVars,
    reducers: {
        setData(state, action){
            const dataSet = action.payload
            return {...state, data: dataSet}
        },
        setXLabel(state, action){
            const xLabel = action.payload
            return {...state, selectedFeature: xLabel}
        },
        setTarget(state, action){
            const newTarget = action.payload
            const changedTarget = {...state, target: newTarget}
            return changedTarget
        },
        setFeatures(state, action){
            const newFeatures = action.payload
            const changedVars = {...state, features: newFeatures}
            return changedVars
        },
        selectFeatures(state, action){
            console.log(state.features)
            const feature = action.payload.feature
            const include = action.payload.include
            if (include){
                return {...state, features: [...state.features].filter(x => x != feature)}
            }
            else {
                return {...state, features: [...state.features].concat(feature)}
            }
        }
    }
})

export const updateVariables = (vars) => {
    return async () => {
        const response = await api.createVariables(vars)
    }
}

export const { setData, setTarget, setFeatures, selectFeatures, setXLabel} = stepSlice.actions
export default stepSlice.reducer