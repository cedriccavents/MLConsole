import { useState } from "react"
import { Accordion, Table, Card} from "react-bootstrap"
import { LineChart } from "../../charts/LineChart"
import { useSelector } from "react-redux"

import api from "../../services/api"
import store from "../../store"
import { unstable_composeClasses } from "@mui/material"

const LogisticRegression = ({settings, results, id}) => {

    const vars = useSelector(state => {return state.steps})
    const [dummyMetrics, setDummyMetrics] = useState({})

    const chartData = {
        labels: results.thresholds,
        datasets: [
            {
                label: "Recall",
                data: results.recall_test_curve
            },
            {
                label: "Precision",
                data: results.precision_test_curve
            },
        ]
    }

    const DummyModels = () => {
        const handleClick = async (e) => {
            e.preventDefault()
            const dataSet = store.getState().steps.data
            const params = {modeltype: 'Classification', model: 'Dummy', strategy: e.target.value}
            const response = await api.createVariables({dataSet, ...vars, ...params})
            setDummyMetrics({recall: response.data.recall_test, precision: response.data.precision_test})
        }

        return (
            <select className="dummy-selector" onChange={e => handleClick(e)}>
                <option>Uniform</option>
                <option>Prior</option>
                <option>Stratified</option>
                <option>Most frequent</option>
            </select>
        )
    }

    return (
        <div>
            <div className="two-column-layout-results">
                <div>
                    <Card>
                        <Card.Header>Metrics</Card.Header>
                        <Card.Body>
                        <p>Train</p>
                        <table>
                                <thead>
                                    <tr>
                                    <th className="metrics-header">Precision</th>
                                    <th className="metrics-value">{results.precision_train}</th>
                                </tr>
                                <tr>
                                    <th className="metrics-header">Recall</th>
                                    <th className="metrics-value">{results.recall_train}</th>
                                </tr>
                            </thead>
                        </table>
                        <p>Test</p>
                        <table>
                                <thead>
                                <tr>
                                    <th className="metrics-header">Precision</th>
                                    <th className="metrics-value">{results.precision_test}</th>
                                    </tr>
                                <tr>
                                    <th className="metrics-header">Recall</th>
                                    <th className="metrics-value">{results.recall_test}</th>
                                </tr>
                                </thead>
                        </table>
                        </Card.Body>
                    </Card>
                    <br />
                    <div>
                    <Card>
                        <Card.Header>Benchmark (<span style={{"fontSize": "15px"}}>Dummy</span>)</Card.Header>
                        <p style={{"paddingLeft": "15px"}}>Strategy: <span>{DummyModels()}</span></p>
                            <Card.Body>
                            <table>
                                    <thead>
                                        <tr>
                                        <th className="metrics-header">Precision</th>
                                        <th className="metrics-value">{dummyMetrics.precision}</th>
                                    </tr>
                                    <tr>
                                        <th className="metrics-header">Recall</th>
                                        <th className="metrics-value">{dummyMetrics.recall}</th>
                                    </tr>
                                </thead>
                            </table>
                        </Card.Body>
                    </Card>
                    </div>
                </div>
                <div>
                    <Card>
                        <Card.Header>Learning Curves</Card.Header>
                        <Card.Body>
                            <LineChart chartData={chartData} />
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default LogisticRegression