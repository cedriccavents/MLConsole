import { Accordion, Table, Card } from "react-bootstrap"
import { LineChart } from "../../charts/LineChart"
import BarChart from "../../charts/BarChart"
import { AgCharts } from "ag-charts-react"

const LinearRegression = ({settings, results, id}) => {

    const coeff = results.coeff
    const variables = results.variables

    const chartData = {
        labels: Array.from(Array(results.train_error.length).keys()),
        datasets: [
            {
                label: "Train",
                data: results.train_error
            },
            {
                label: "Test",
                data: results.test_error
            }
        ]
    }

    const residualChartData = {
        labels: Array.from(Array(results.train_error.length).keys()),
        datasets: [
            {
                label: "Train",
                data: results.residuals
            },
        ]
    }

    const dataTest = []
    const series = []
    const keys = Object.keys(results.shapley)
    const vals = Object.values(results.shapley)
    for (let i = 0; i < keys.length; i++){
        if (keys[i] != "ev"){
            let newEl = {feature: keys[i]}
            newEl[keys[i]] = vals[i]
            dataTest.push(newEl)
            series.push({type: "bar", direction: "horizontal", xKey: "feature", yKey: keys[i]})
        }
    }

    const shapChartData = {
        data: dataTest,
        title: {
            text: "Shapley Values"
        },
        series: series,
        background: {
            fill: "#1e1e1e"
        }
    }

    return (
        <div>
            <div className="two-column-layout-results">
                <div>
                    <Card>
                        <Card.Header>Performance</Card.Header>
                        <Card.Body>
                        <p>Train</p>
                        <table>
                            <thead>
                                    <tr>
                                    <th className="metrics-header">R-squared</th>
                                    <th className="metrics-value">{results.rsq_train}</th>
                                </tr>
                            </thead>
                        </table>
                        <p>Test</p>
                        <table>
                                <thead>
                                <tr>
                                    <th className="metrics-header">R-squared</th>
                                    <th className="metrics-value">{results.rsq_test}</th>
                                </tr>
                                </thead>
                        </table>
                        </Card.Body>
                    </Card>
                    <br />
                    <Card>
                        <Card.Header>Shapley Values</Card.Header>
                        <Card.Body>
                            <AgCharts options={shapChartData} />
                            <h5 className="ev">EV = {results.shapley.ev.toLocaleString()}</h5>
                        </Card.Body>
                    </Card>
                </div>
                <div>
                    <Card>
                        <Card.Header>Learning Curves</Card.Header>
                        <Card.Body>
                            <LineChart chartData={chartData} />
                        </Card.Body>
                    </Card>
                    <br />
                    <div>
                    <Card>
                        <Card.Header>Residuals</Card.Header>
                        <Card.Body>
                            <LineChart chartData={residualChartData} />
                        </Card.Body>
                    </Card>
                </div>
                </div>
            </div>
        </div>
    )
}

export default LinearRegression