async function getOeeData() {
    try {
        const response = await fetch('http://64.227.139.217:5000/api/oee');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Fetched OEE Data:", data);

        updateOeeChart(data);
    } catch (error) {
        console.error('Error fetching OEE data:', error);
    }
}

let oeeChart;

function createOeePieChart(aval, perf, qual) {
    const chartCanvas = document.getElementById('oeeChart');
    if (!chartCanvas) return; // Avoid errors if canvas is missing

    const ctx = chartCanvas.getContext('2d');

    if (oeeChart) {
        oeeChart.destroy();
    }

    oeeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: [aval.toFixed(1), perf.toFixed(1), qual.toFixed(1)],
                backgroundColor: ['#FFC107', '#007BFF', 'green'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false } // Disables hover tooltips
            }
        }
    });
}

function updateOeeChart(data) {
    if (!data || typeof data !== 'object') return;

    const aval = data[0]?.d["aval"]?.[0] ?? 1;
    const perf = data[0]?.d["perf"]?.[0] ?? 1;
    const qual = data[0]?.d["qual"]?.[0] ?? 1;

    // Update the values on the page
    document.getElementById('aval').innerText = aval.toFixed(1);
    document.getElementById('perf').innerText = perf.toFixed(1);
    document.getElementById('qual').innerText = qual.toFixed(1);

    createOeePieChart(aval, perf, qual);
}

// Fetch OEE data periodically (every 10 seconds)
setInterval(getOeeData, 10000);
getOeeData();
