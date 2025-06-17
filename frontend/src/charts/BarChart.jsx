// components/BarChart.js
import { Bar } from "react-chartjs-2"

export const BarChart = ({ chartData }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Shapley values"
            },
            legend: {
              display: false
            }
          },
          indexAxis: 'y'
        }}
      />
    </div>
  );
}

export default BarChart

