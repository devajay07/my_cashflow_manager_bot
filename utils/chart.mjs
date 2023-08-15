import { Chart, CategoryScale, LinearScale, Title, Tooltip } from "chart.js";
import { BarController, BarElement, Legend } from "chart.js";
import canvas from "canvas";

Chart.register(
  BarController,
  BarElement,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip
);

const { createCanvas } = canvas;
const width = 800;
const height = 500;
const canvasNode = createCanvas(width, height);
const ctx = canvasNode.getContext("2d");

export const generateWeekChart = (expense) => {
  const labels = Object.keys(expense.weekData);
  const data = {
    labels,
    datasets: [
      {
        label: "Expense Amount (₹)",
        data: labels.map((label) => expense.weekData[label]),
        backgroundColor: createGradient(ctx), // Use gradient function
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ₹${value}`;
            },
          },
        },
      },
    },
  };

  Chart.register(CategoryScale, LinearScale);

  const existingChart = Chart.getChart(canvasNode);

  if (existingChart) {
    // If a previous Chart instance exists, destroy it
    existingChart.destroy();
  }

  new Chart(ctx, config);
  const image = canvasNode.toBuffer();

  return image;
};

export const generateMonthChart = (expense) => {
  const labels = Object.keys(expense.monthData);
  const data = {
    labels,
    datasets: [
      {
        label: "Expense Amount (₹)",
        data: labels.map((label) => expense.monthData[label]),
        backgroundColor: createGradient(ctx), // Use gradient function
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ₹${value}`;
            },
          },
        },
      },
    },
  };

  Chart.register(CategoryScale, LinearScale);

  const existingChart = Chart.getChart(canvasNode);

  if (existingChart) {
    // If a previous Chart instance exists, destroy it
    existingChart.destroy();
  }

  new Chart(ctx, config);
  const image = canvasNode.toBuffer();

  return image;
};

export const generateYearChart = (expense) => {
  const labels = Object.keys(expense.yearData);
  const data = {
    labels,
    datasets: [
      {
        label: "Expense Amount (₹)",
        data: labels.map((label) => expense.yearData[label]),
        backgroundColor: createGradient(ctx), // Use gradient function
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ₹${value}`;
            },
          },
        },
      },
    },
  };

  Chart.register(CategoryScale, LinearScale);

  const existingChart = Chart.getChart(canvasNode);

  if (existingChart) {
    // If a previous Chart instance exists, destroy it
    existingChart.destroy();
  }

  new Chart(ctx, config);
  const image = canvasNode.toBuffer();

  return image;
};

export const generateCategoryChart = (categoryData) => {
  const labels = Object.keys(categoryData);
  const data = {
    labels,
    datasets: [
      {
        label: "Expense Amount (₹)",
        data: labels.map((label) => categoryData[label]),
        backgroundColor: createGradient(ctx), // Use gradient function
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ₹${value}`;
            },
          },
        },
      },
    },
  };

  Chart.register(CategoryScale, LinearScale);

  const existingChart = Chart.getChart(canvasNode);

  if (existingChart) {
    // If a previous Chart instance exists, destroy it
    existingChart.destroy();
  }

  new Chart(ctx, config);
  const image = canvasNode.toBuffer();

  return image;
};

// Helper function to create gradient fill
const createGradient = (ctx) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(75, 192, 192, 0.8)");
  gradient.addColorStop(1, "rgba(75, 192, 192, 0.2)");
  return gradient;
};
