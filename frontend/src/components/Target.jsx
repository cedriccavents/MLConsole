import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Table, Button, Tab, Tabs} from "react-bootstrap"
import { useDispatch } from "react-redux"
import { AgGridReact } from "ag-grid-react"
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

import api from '../services/api'
import FeaturesTable, { Step, TargetTable } from "./StepHeader"
import { setData, setFeatures } from "../reducers/steps"
import { LineChart } from "../charts/LineChart"

ModuleRegistry.registerModules([AllCommunityModule])

const Target = () => {

    const [rawData, setRawData] = useState({})
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const target = useSelector(state => {
        return state.steps.target
    })
    const include = useSelector(state => {
        return state.steps.include
    })
    const name = useSelector(state => {
        return state.steps.data
    })

    useEffect(() => {
        api.getData(name).then(dataset => {
            setRawData(dataset.data)
        })
    }, [])

    const firstRow = rawData[0]

    if (!firstRow){
        return null
    }

    const columns = Object.keys(firstRow)
    const values = Object.values(firstRow)

    const tableHeader = []
    for (let i = 0; i < columns.length; ++i){
        tableHeader.push({field: columns[i]})
    }

    const handleClick = () => {
        navigate("/model")
    }
 
    const chartData = {
        labels: rawData.map(x => x.Age),
        datasets: [
            {
                label: "Train",
                data: rawData.map(x => x.Hospitalized)
            },
        ]
    }

    console.log('CHECK', rawData, tableHeader)

    return (
        <div>
            <div className="steps">
                <Step label="1" text="Load Dataset" isDisabled={false}/>
                <Step label="2" text="Select variables" isDisabled={false}/>
            </div>
            <div className="content-wrapper">
                <Tabs>
                    <Tab eventKey="features" title="features">
                        <div className="step-content">
                            <h2>Select target</h2>
                            <TargetTable cols={columns}/>
                            <h2>Select features to predict:  
                            <span className="target"> {target}</span>
                            </h2>
                            <div>
                                <FeaturesTable cols={columns} vals={values}/>
                            </div>
                        </div>
                        <div className="button-dataset">
                            <Button variant="secondary" onClick={handleClick}>Finish</Button>
                        </div>
                    </Tab>
                    <Tab eventKey="Data" title="Data">
                        <div style={{"height": "600px", "padding": "20px"}}>
                            <AgGridReact rowData={rawData} columnDefs={tableHeader}/>
                        </div>
                    </Tab>
                    <Tab eventKey="Analysis" title="Analysis">
                        <div className="content-wrapper step-content">
                            <h3>Single Factor Analysis</h3>
                            <LineChart chartData={chartData} chartTitle="area"/>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default Target