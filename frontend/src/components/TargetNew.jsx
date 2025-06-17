import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Table, Button, Tab, Tabs, Spinner} from "react-bootstrap"
import { useDispatch } from "react-redux"
import { AgGridReact } from "ag-grid-react"
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

import api from '../services/api'
import FeaturesTable, { Step, TargetTable } from "./StepHeader"
import { setData, setFeatures } from "../reducers/steps"
import { LineChart } from "../charts/LineChart"
import store from "../store"

ModuleRegistry.registerModules([AllCommunityModule])

const TargetNew = () => {

    const [rawData, setRawData] = useState({})
    const [yLabel, setYLabel] = useState(null)
    const [xLabel, setXLabel] = useState(null)
    const [corr, setCorr] = useState({})

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

    useEffect(() => {
        api.getCorrelations(name, target).then(data => {
            setCorr(data.data)
        })
    }, [target])

    const firstRow = rawData[0]

    if (!firstRow){
        return null
    }

    const columns = Object.keys(firstRow)
    const values = Object.values(firstRow)

    const newCorr = {}
    const tableHeader = []
    for (let i = 0; i < columns.length; ++i){
        tableHeader.push({field: columns[i]})
        values[i] = corr[columns[i]]
    }

    const handleClick = () => {
        navigate("/model")
    }
 
    const label = store.getState().steps.selectedFeature
    const chartData = {
        labels: rawData.map(x => x[label]),
        datasets: [
            {
                label: "Train",
                data: rawData.map(x => x[target])
            },
        ]
    }

    return (
        <div className="two-column-layout">
            <div style={{"padding": "20px"}}>
                <h3>Select target</h3>
                <TargetTable cols={columns}/>
                <div style={{"marginTop": "30px"}}>
                    <h3>Select features </h3>
                </div>
                    <FeaturesTable cols={columns} vals={values}/>
                <div className="button-dataset">
                    <Button variant="secondary" onClick={handleClick}>Finish</Button>
                </div>
            </div>
                <div >
                <Tabs>
                    <Tab eventKey="data" title="Data">
                        <div style={{"height": "600px", "padding": "20px"}}>
                        <AgGridReact rowData={rawData} columnDefs={tableHeader}/>
                        </div>
                    </Tab>
                    <Tab eventKey="chart" title="Plot">
                        <div>
                            <LineChart chartData={chartData} chartTitle="area"/>
                        </div>
                    </Tab>
                </Tabs>
            </div>


            <div></div>

        </div>
    )
}

export default TargetNew