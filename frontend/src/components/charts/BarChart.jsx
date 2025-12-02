import { Bar } from "react-chartjs-2";
import { defaultChartOptions } from "../../config/chartconfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const BarChart = ({ data }) => {
  return (
    <div
      className="w-full"
      style={{
        height: "35vh", // Takes 35% of the viewport height
        minHeight: "200px", // Minimum height to ensure readability
        maxHeight: "400px", // Maximum height to prevent overflow
      }}
    >
      <Bar data={data} options={defaultChartOptions} />
    </div>
  );
};

export default BarChart;