export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    title: { display: true, text: "Average score of last 7 interviews" },
  },
  scales: {
    y: { beginAtZero: true },
  },
};