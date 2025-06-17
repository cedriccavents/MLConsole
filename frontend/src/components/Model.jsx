import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { Chart , registerables} from "chart.js"
import { Spinner} from "react-bootstrap"
import { Slider } from "@mui/material"
import { AgGridReact } from "ag-grid-react"
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

import LinearRegression from "./models/LinearRegression"
import LogisticRegression from "./models/LogisticRegression"
import TreeRegression from "./models/TreeRegression"
import Notification from "./Notification"
import api from "../services/api"
import { setModelType, setModelName, setAdvancedParam } from "../reducers/model"
import store from '../../src/store'

Chart.register(...registerables)
ModuleRegistry.registerModules([AllCommunityModule])

const Setting = ({name, component, type="regular"}) => {

    const styled = type === "regular" ? "" : "p-advanced"

    return (
        <div className={styled}>
            <p>{name}</p>
            {component}
        </div>
    )
}

const AdvancedSetting = ({name}) => {

    const dispatch = useDispatch()
    const [paramVal, setParamVal] = useState('')

    const handleParam = (event) => {
        dispatch(setAdvancedParam({param: name, value: event.target.value}))
        setParamVal(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
    }

    const inputBox = (
        <form onSubmit={handleSubmit}>
            <input type="text" name="param" value={paramVal} onChange={handleParam}/>
        </form>
    )

    return (
        <div>
            <Setting name={name} type="a" component={inputBox}/>
        </div>
    )
}

const Parameters = ({ handleTraining, loading }) => {

    const [checked, setChecked] = useState(true)
    const [model, setModel] = useState(null)
    const [modelClass, setModelClass] = useState('Regression')
    const [subModel, setSubModel] = useState([])
    const [modelParameters, setModelParameters] = useState(null)
    const [advancedSettings, setAdvancedSettings] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        api.getModel('Regression').then(response => {
            setSubModel(Object.keys(response.data))
        })
    }, [])

    const handleModelClass = async (e) => {
        e.preventDefault()
        setModelClass(e.target.value)
        dispatch(setModelType(e.target.value))

        // get models
        const response = await api.getModel(e.target.value)
        setSubModel(Object.keys(response.data))
    }

    const handleModel = async (e) => {
        e.preventDefault()
        setModel(e.target.value)
        dispatch(setModelName(e.target.value))

        // get advanced parameters
        const response = await api.getModel(modelClass, e.target.value)
        setModelParameters(Object.keys(response.data))
        console.log(Object.keys(response.data))
    }

    const ModelType = (
        <select onChange={e => handleModel(e)}>
            {
                subModel.map((x, i) => <option key={i}>{x}</option>)
            }
        </select>
    )

    const ModelClass = (
        <select onChange={(e) => handleModelClass(e)}>
            <option>Regression</option>
            <option>Classification</option>
        </select>
    )

    const AdvancedParameters = () => {

        if (!modelParameters || modelParameters.length === 0){
            return null
        }

        return (
            <div>
                <button className="button-toggle" onClick={showAdvanced}>Toggle Advanced Settings</button>
                {advancedSettings &&  
                    <div>
                        {
                            modelParameters.map((x, i) => <AdvancedSetting key={i} name={x} />)
                        }
                    </div>
                }
            </div>
        )
    }

    const showAdvanced = () => {
        setAdvancedSettings(!advancedSettings)
    }

    return (
        <div>
            <div className="model-settings">
                <Setting name="Class" component={ModelClass}/>
                <Setting name="Model" component={ModelType}/>
                <AdvancedParameters/>
                <Setting name="Train/Test" component={
                        <Slider 
                            defaultValue={70}
                            step={10}
                            min={10}
                            max={100}
                            valueLabelDisplay="on"
                            marks={[{ value: 10, label: '10' }, { value: 70, label: '70' }, { value: 100, label: '100' }]}
                            />
                } />
                <span>
                    <input 
                        type="checkbox" defaultChecked={checked}/>
                        Fix seed
                </span>
                <div>
                <button 
                    className="button-train" 
                    onClick={handleTraining} >
                        {loading ? <Spinner /> : "Train"}
                </button>
                </div>
            </div>
        </div>


    )
}

const Model = () => {

    const [results, setResults] = useState(null)
    const [modelId, setModelId] = useState(0)
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({message: null})
    const [rawData, setRawData] = useState({})

    const vars = useSelector(state => {return state.steps})
    const dataset = useSelector(state => {return state.steps.data})

    const notifyWith = (message, isError=false) => {
        setNotification({message, isError})
        setTimeout(() => {
            setNotification({message: null})
        }, 5000)
    }

    const handleTraining = async () => {
        setLoading(true)
        const params = store.getState().model
        const dataSet = store.getState().steps.data
        notifyWith(`Traing ${params.model} model`)
        const response = await api.createVariables({dataSet, ...vars, ...params})
        setResults(response.data)
        setModelId(modelId + 1)
        setLoading(false)
    }

    useEffect(() => {
        api.getData(dataset).then(dataset => {
            setRawData(dataset.data)
        })
    }, [])

    useEffect(() => {
        if (results){
            const settings = store.getState().model
            if (settings.modeltype === 'Regression'){
                if (settings.model === 'DecisionTree'){
                    setModels(<TreeRegression settings={store.getState().model} results={results} id={modelId} />)
                }
                else {
                    setModels(<LinearRegression settings={store.getState().model} results={results} id={modelId} />)
                }
            }
            else if (settings.modeltype === 'Classification') {
                setModels(<LogisticRegression settings={store.getState().model} results={results} id={modelId} />)
            }
        }
    }, [results])   


    const firstRow = rawData[0]

    if (!firstRow){
        return null
    }

    const tableHeader = []
    const headers = Object.keys(firstRow)
    for (let i = 0; i < headers.length; ++i){
        tableHeader.push({field: headers[i]})
    }

    return (
        <div>
            <div className="two-column-layout">
                <div className="two-column-layout-param">
                    <div>
                        <Parameters handleTraining={handleTraining} loading={loading}/>
                        <br />
                        {/* <Button onClick={handleTraining} disabled={loading}>
                            Train
                        </Button> */}
                    </div>
                </div>
                <div>
                <Notification notification={notification}/>
                <div className="predictions">
                    <p>Target: {vars.target}</p>
                    <span><button className="button-predictions">Predict</button></span>
                    </div>
                {models}
                </div>
            </div>
            {/* {output} */}
        </div>

    )
}

export default Model