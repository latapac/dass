// Function to fetch live data
async function getLiveData() {
    try {
        const response = await fetch('http://64.227.139.217:3000/getMachineData/12345'); // Correct API URL
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); 
        console.log();
        // Parse JSON response
        console.log("Fetched Data:", data); // Log the data to check the structure
  
        updatePage(data.data[1]); // Pass only the 'd' object
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  }
  
  // Initialize Chart.js Pie Chart
  let oeeChart;
  
  function createPieChart(aval, perf, qual) {
      const ctx = document.getElementById('oeeChart').getContext('2d');
  
      if (oeeChart) {
          oeeChart.destroy(); // Destroy previous chart before creating a new one
      }
  
      oeeChart = new Chart(ctx, {
          type: 'pie',
          data: {
              datasets: [{
                  data: [aval, perf, qual],
                  backgroundColor: ['#FFC107', '#007BFF', 'green'],
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false, // Allows proper resizing
              layout: {
                  padding: {
                      right: 20 // Adds space for tooltip clarity
                  }
              },
              plugins: {
                  legend: {
                      display: false // Completely removes labels from the chart
                  },
                  tooltip: {
                      callbacks: {
                          label: function(tooltipItem) {
                              return tooltipItem.raw.toFixed(2); // Show only the value, formatted to 2 decimal places
                          }
                      }
                  }
              }
          }
      });
  }
  
  // Function to update page content with live data
  function updatePage(data) {
    console.log(data);
    
    if (!data || typeof data !== 'object') {
        console.error("Invalid data format:", data);
        return;
    }
  
    const oee = data?.d["oee%"]?.[0] ?? 1;
    const runtime = data?.d["runtime"]?.[0] ?? 1;
    const stoptime = data?.d["stoptime"]?.[0] ?? 1;
    const errortime = data?.d["errortime"]?.[0] ?? 1;
    const totalprd = data?.d["totalprd"]?.[0] ?? 1;
    const goodprod = data?.d["goodprod"]?.[0] ?? 1;
    const rejprod = data?.d["rejprod"]?.[0] ?? 1;
    const aval = data?.d["aval"]?.[0] ?? 1;
    const qual = data?.d["qual"]?.[0] ?? 1;
    const perf = data?.d["perf"]?.[0] ?? 1;
  
    console.log("Updated Data:", { oee, runtime, stoptime, errortime, totalprd, goodprod, rejprod });
  
    document.getElementById('total_production').innerText = `${totalprd}`;
    document.getElementById('good_production').innerText = `${goodprod}`;
    document.getElementById('bad_production').innerText = `${rejprod}`;
    document.getElementById('runtime').innerText = `${runtime}`;
    document.getElementById('stoptime').innerText = `${stoptime}`;
    document.getElementById('errortime').innerText = `${errortime}`;
  
    const elements = document.getElementsByClassName('oee');
    for (let i = 0; i < elements.length; i++) {
        elements[i].innerText = `${oee.toFixed(1)}`;
    }
  
    document.getElementById('aval').innerText = `${aval.toFixed(1)}%`;
    document.getElementById('perf').innerText = `${perf.toFixed(1)}%`;
    document.getElementById('qual').innerText = `${qual.toFixed(1)}%`;
  
    createPieChart(aval, perf, qual);
  }
  
  // Fetch data periodically (every 10 seconds)
  setInterval(getLiveData, 10000);
  
  // Initial data fetch
  getLiveData();
  