import { Line, Scatter } from "react-chartjs-2"

export const LineChart = ({ chartData, chartTitle }) => {
  return (
    <div className="chart-container">
      {/* <h2 style={{ textAlign: "center" }}>Line Chart</h2> */}
      <Scatter
      style={{width: "100%", height: "100%"}}
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Precision-Recall Curve"
            },
            legend: {
              display: true
            },
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'precision'
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'recall'
                }
              }
            }
          }
        }}
      />
    </div>
  );
}
