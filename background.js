// Background service worker for tracking active browsing time
let activeTabId = null;
let activeUrl = null;
let startTime = null;
let isUserActive = true;
let updateInterval = null;

// Initialize tracking when extension loads
chrome.runtime.onStartup.addListener(() => {
  initializeTracking();
});

chrome.runtime.onInstalled.addListener(() => {
  initializeTracking();
});

function initializeTracking() {
  // Get current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      startTracking(tabs[0].id, tabs[0].url);
    }
  });

  // Set idle detection to 60 seconds
  chrome.idle.setDetectionInterval(60);
}

// Track when tabs are activated
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      startTracking(tab.id, tab.url);
    }
  });
});

// Track when tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    startTracking(tabId, changeInfo.url);
  }
});

// Track when window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window has focus
    stopTracking();
  } else {
    // Window has focus, get active tab
    chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
      if (tabs[0]) {
        startTracking(tabs[0].id, tabs[0].url);
      }
    });
  }
});

// Track idle state
chrome.idle.onStateChanged.addListener((newState) => {
  isUserActive = newState === 'active';
  
  if (!isUserActive) {
    stopTracking();
  } else {
    // User became active again, resume tracking
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        startTracking(tabs[0].id, tabs[0].url);
      }
    });
  }
});

function startTracking(tabId, url) {
  // Save time for previous tab/url
  stopTracking();

  // Don't track chrome:// or edge:// URLs
  if (!url || url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:')) {
    return;
  }

  activeTabId = tabId;
  activeUrl = url;
  startTime = Date.now();

  // Update every second
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  
  updateInterval = setInterval(() => {
    if (isUserActive && startTime) {
      saveTimeEntry();
    }
  }, 1000);
}

function stopTracking() {
  if (startTime && activeUrl) {
    saveTimeEntry();
  }

  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  activeTabId = null;
  activeUrl = null;
  startTime = null;
}

function saveTimeEntry() {
  if (!activeUrl || !startTime) return;

  const domain = extractDomain(activeUrl);
  const today = getTodayString();
  const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds

  if (timeSpent < 1) return; // Don't save if less than 1 second

  // Reset start time for next interval
  startTime = Date.now();

  // Get existing data
  chrome.storage.local.get([domain], (result) => {
    const domainData = result[domain] || {};
    const currentTime = domainData[today] || 0;
    
    domainData[today] = currentTime + timeSpent;

    // Save back to storage
    chrome.storage.local.set({ [domain]: domainData });
  });
}

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return 'unknown';
  }
}

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Clean up old data (keep only last 30 days)
function cleanOldData() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

  chrome.storage.local.get(null, (allData) => {
    const updates = {};
    
    for (const [domain, dates] of Object.entries(allData)) {
      const filteredDates = {};
      let hasData = false;
      
      for (const [date, time] of Object.entries(dates)) {
        if (date >= cutoffDate) {
          filteredDates[date] = time;
          hasData = true;
        }
      }
      
      if (hasData) {
        updates[domain] = filteredDates;
      }
    }
    
    // Clear all and set cleaned data
    chrome.storage.local.clear(() => {
      chrome.storage.local.set(updates);
    });
  });
}

// Run cleanup once a day
setInterval(cleanOldData, 24 * 60 * 60 * 1000);
