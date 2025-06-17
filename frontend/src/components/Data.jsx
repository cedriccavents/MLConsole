import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from 'react-bootstrap'

import { Step } from './StepHeader'
import { setData } from "../reducers/steps"

const descriptions = {
    "housing": "Predict housing prices using ares, number of rooms, location etc. ",
    "iris": "Classic textbook ML problem, build a model to distinguish between 3 types of flowers.",
    "covid": "Predicting Covid hospitalities given age, pre-existing medical conditions etc. ",
    "weather": "Predict Weather conditions given temperature, humidity, wind speed etc.  "
}

const DataSetLink = (props) => {
    
    const dispatch = useDispatch()
    const dataSetName = props.name
    const label = props.label

    const handleDataSet = () => {
        console.log('Sending data ...')
        dispatch(setData(label))
    }

    return (
        <div>
            <button className="dataset-link" onClick={handleDataSet}>
                {dataSetName}
                <p>{descriptions[label]}</p>
            </button>
        </div>
    )
}

const Data = () => {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate("/variables")
    }

    return (
        <div>
            <div className="content-wrapper">
                <h2>Select a dataset to use </h2>
                <div className="step-content">
                    <h3>Example datasets</h3>
                    <div className="example-datasets">
                        <DataSetLink name="House Prices" label="housing"/>
                        <DataSetLink name="Iris Dataset" label="iris"/>
                        <DataSetLink name="Covid Reinfections" label="covid"/>
                        <DataSetLink name="Weather" label="weather"/>
                    </div>
                    <h3>Load your own dataset</h3>
                    <div className="own-dataset">
                        <div className="upload">
                            Drag & Drop your data or <a>Click here</a>
                        </div>
                    </div>
                    <div>
                    <label>
                        <input type="checkbox" />
                            <span> Use first row as header</span>
                        </label>
                    </div>
                </div>
                <div className="button-dataset">
                    <Button variant="secondary" onClick={handleClick}>Next</Button>
                </div>

            </div>

        </div>
    )
}

export default Data