// Dashboard script for weekly heatmap visualization
document.addEventListener('DOMContentLoaded', () => {
    loadWeeklyData();
});

function loadWeeklyData() {
    const last7Days = getLast7Days();

    chrome.storage.local.get(null, (allData) => {
        // Aggregate data by day and domain
        const dayTotals = {};
        const domainTotals = {};
        let weekTotal = 0;

        last7Days.forEach(date => {
            dayTotals[date] = 0;
        });

        // Process all domains
        for (const [domain, dates] of Object.entries(allData)) {
            let domainWeekTotal = 0;

            for (const date of last7Days) {
                const timeForDay = dates[date] || 0;
                dayTotals[date] += timeForDay;
                domainWeekTotal += timeForDay;
                weekTotal += timeForDay;
            }

            if (domainWeekTotal > 0) {
                domainTotals[domain] = domainWeekTotal;
            }
        }

        // Render heatmap
        renderHeatmap(last7Days, dayTotals);

        // Render statistics
        renderStats(weekTotal, dayTotals, last7Days);

        // Render domains list
        renderDomains(domainTotals);
    });
}

function renderHeatmap(days, dayTotals) {
    const heatmapContainer = document.getElementById('heatmap');

    // Find max value for intensity scaling
    const maxTime = Math.max(...Object.values(dayTotals), 1);

    const heatmapHTML = days.map(date => {
        const time = dayTotals[date];
        const intensity = time / maxTime;
        const intensityClass = getIntensityClass(intensity);

        const dateObj = new Date(date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return `
      <div class="heatmap-day ${intensityClass}">
        <div class="day-name">${dayName}</div>
        <div class="day-date">${monthDay}</div>
        <div class="day-time">${formatTime(time)}</div>
      </div>
    `;
    }).join('');

    heatmapContainer.innerHTML = heatmapHTML;
}

function getIntensityClass(intensity) {
    if (intensity === 0) return 'intensity-0';
    if (intensity < 0.2) return 'intensity-1';
    if (intensity < 0.4) return 'intensity-2';
    if (intensity < 0.6) return 'intensity-3';
    if (intensity < 0.8) return 'intensity-4';
    return 'intensity-5';
}

function renderStats(weekTotal, dayTotals, days) {
    // Total this week
    document.getElementById('weekTotal').textContent = formatTime(weekTotal);

    // Daily average
    const dailyAvg = Math.floor(weekTotal / 7);
    document.getElementById('dailyAvg').textContent = formatTime(dailyAvg);

    // Most active day
    let maxDay = days[0];
    let maxTime = dayTotals[days[0]];

    days.forEach(day => {
        if (dayTotals[day] > maxTime) {
            maxTime = dayTotals[day];
            maxDay = day;
        }
    });

    const maxDayObj = new Date(maxDay);
    const maxDayName = maxDayObj.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById('mostActiveDay').textContent = maxDayName;
}

function renderDomains(domainTotals) {
    const domainsContainer = document.getElementById('domainsList');

    // Sort domains by time
    const sortedDomains = Object.entries(domainTotals)
        .sort((a, b) => b[1] - a[1]);

    if (sortedDomains.length === 0) {
        domainsContainer.innerHTML = '<div class="empty-state">No browsing data yet</div>';
        return;
    }

    const maxTime = sortedDomains[0][1];

    const domainsHTML = sortedDomains.map(([domain, time]) => {
        const percentage = (time / maxTime) * 100;

        return `
      <div class="domain-item">
        <div class="domain-header">
          <div class="domain-name">${domain}</div>
          <div class="domain-time">${formatTime(time)}</div>
        </div>
        <div class="domain-bar-container">
          <div class="domain-bar" style="width: ${percentage}%;"></div>
        </div>
      </div>
    `;
    }).join('');

    domainsContainer.innerHTML = domainsHTML;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m`;
    } else {
        return `${seconds}s`;
    }
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        days.push(dateString);
    }
    return days;
}
