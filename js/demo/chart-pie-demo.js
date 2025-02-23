// Function to fetch live data
async function getLiveData() {
  try {
      const response = await fetch('http://64.227.139.217:5000/api/data');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      console.log("API Response:", data); // Debugging

      // Validate data structure before updating the chart
      if (!data || typeof data !== 'object' || !data.d) {
          console.error("Unexpected data format:", data);
          return;
      }

      updateChart(data.d);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Function to update the chart with live data
function updateChart(data) {
  if (!data || typeof data !== 'object') {
      console.error("Invalid data format:", data);
      return;
  }

  const runtime = data['runtime']?.[0] || 0;
  const stoptime = data['stoptime']?.[0] || 0;
  const errortime = data['errortime']?.[0] || 0;

  // Update the dataset for the Pie Chart
  myPieChart.data.datasets[0].data = [runtime, stoptime, errortime];
  myPieChart.update();
}

// Ensure Chart.js initializes only if the element exists
document.addEventListener("DOMContentLoaded", function () {
  var ctx = document.getElementById("myPieChart");

  if (!ctx) {
      console.error("Canvas element #myPieChart not found!");
      return;
  }

  var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: ["Runtime", "Stoptime", "Errortime"],
          datasets: [{
              data: [55, 30, 15], // Default values (will be replaced with live data)
              backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
              hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
              hoverBorderColor: "rgba(234, 236, 244, 1)",
          }],
      },
      options: {
          maintainAspectRatio: false,
          tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              caretPadding: 10,
          },
          legend: {
              display: false
          },
          cutoutPercentage: 80,
      },
  });

  // Fetch data periodically (every 10 seconds)
  setInterval(getLiveData, 10000);

  // Initial data fetch
  getLiveData();
});
