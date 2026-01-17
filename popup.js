// Popup script to display today's browsing data
document.addEventListener('DOMContentLoaded', () => {
    loadTodayData();

    document.getElementById('dashboardBtn').addEventListener('click', () => {
        chrome.tabs.create({ url: 'dashboard.html' });
    });
});

function loadTodayData() {
    const today = getTodayString();

    chrome.storage.local.get(null, (allData) => {
        let totalSeconds = 0;
        const sitesData = [];

        // Process all domains
        for (const [domain, dates] of Object.entries(allData)) {
            const todayTime = dates[today] || 0;
            if (todayTime > 0) {
                totalSeconds += todayTime;
                sitesData.push({ domain, time: todayTime });
            }
        }

        // Update total time
        document.getElementById('totalTime').textContent = formatTime(totalSeconds);

        // Sort sites by time and show top 5
        sitesData.sort((a, b) => b.time - a.time);
        const topSites = sitesData.slice(0, 5);

        // Update site count
        const siteCount = document.getElementById('siteCount');
        if (siteCount) {
            siteCount.textContent = topSites.length;
        }

        // Render sites list
        const sitesList = document.getElementById('sitesList');
        if (topSites.length === 0) {
            sitesList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <div class="empty-text">Start browsing to see stats</div>
        </div>
      `;
        } else {
            sitesList.innerHTML = topSites.map(site => `
        <div class="site-item">
          <div class="site-domain">${site.domain}</div>
          <div class="site-time">${formatTime(site.time)}</div>
        </div>
      `).join('');
        }
    });
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

function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
