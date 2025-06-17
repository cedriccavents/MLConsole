import { useSelector } from "react-redux"
import { Accordion, Table, Card } from "react-bootstrap"
import { Chart , registerables} from "chart.js"
import { LineChart } from "../../charts/LineChart"

const TreeRegression = ({settings, results, id}) => {

    const LearningCurveChartData = {
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

    return (
        <div>
            <p style={{"fontSize": "20px", "fontWeight": "bold"}}>DecisionTree</p>
            <div className="two-column-layout-results">
                <div>
                    <Card>
                        <Card.Header>Metrics</Card.Header>
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
                        <Card.Header>Tuned hyperparameters</Card.Header>
                        <Card.Body>{JSON.stringify(results.hyper_param)}</Card.Body>
                    </Card>
                </div>
                <div>
                    <Card>
                        <Card.Header>Learning Curves</Card.Header>
                        <Card.Body>
                            <LineChart chartData={LearningCurveChartData} />
                        </Card.Body>
                    </Card>
                </div>
                <div></div>
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
    )
}

export default TreeRegression