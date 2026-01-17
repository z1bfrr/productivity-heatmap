# Productivity Heatmap - Browser Extension

A free, open-source, privacy-friendly Chrome extension that tracks your active browsing time and displays a weekly productivity heatmap.

![Extension Icon](icons/icon128.png)

## ✨ Features

- ⏱️ **Active Tab Tracking** - Only tracks the tab you're actively using
- 📊 **Weekly Heatmap** - Visual representation of your browsing activity
- 🌐 **Per-Domain Stats** - See time spent on each website
- 📈 **Daily Summaries** - Quick overview in the popup
- 🔒 **100% Private** - All data stored locally in your browser
- 🌙 **Dark Mode** - Beautiful dark theme for comfortable viewing
- 🆓 **Free & Open Source** - MIT License

## 🚀 Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/productivity-heatmap.git
   cd productivity-heatmap
   ```

2. **Load in Chrome/Edge**
   - Open Chrome or Edge browser
   - Navigate to `chrome://extensions` (or `edge://extensions`)
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `productivity-heatmap` folder

3. **Start tracking!**
   - The extension will appear in your toolbar
   - Start browsing and your time will be tracked automatically

## 📖 How to Use

### Popup View
- Click the extension icon to see today's stats
- View total active time for today
- See your top 5 most visited sites
- Click "View Dashboard" for detailed analytics

### Dashboard View
- Full weekly heatmap showing last 7 days
- Activity intensity visualization (darker = less time, lighter = more time)
- Complete list of all tracked websites
- Weekly statistics (total time, daily average, most active day)

## 🛠️ How It Works

- **Timer starts** when you activate a tab
- **Timer stops** when you switch tabs, change URL, or go idle (60 seconds)
- **Data is saved** every second to Chrome's local storage
- **Old data cleaned** automatically (keeps last 30 days)
- **Privacy first** - No external servers, no tracking, 100% local

## 📂 Project Structure

```
productivity-heatmap/
├── manifest.json          # Extension configuration (Manifest V3)
├── background.js          # Service worker for time tracking
├── popup.html             # Popup interface
├── popup.js               # Popup logic
├── dashboard.html         # Dashboard interface
├── dashboard.js           # Dashboard logic & heatmap rendering
├── styles.css             # Dark mode styling
├── README.md              # This file
├── LICENSE                # MIT License
└── icons/                 # Extension icons (16, 32, 48, 128px)
```

## 🔒 Privacy

- ✅ **No login required** - Works immediately
- ✅ **No backend servers** - All processing is local
- ✅ **No external requests** - Data never leaves your browser
- ✅ **No analytics** - Zero tracking or telemetry
- ✅ **Chrome:// URLs ignored** - Browser pages aren't tracked
- ✅ **Open source** - Audit the code yourself

## 🎨 Technology

- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No frameworks, lightweight & fast
- **Chrome Storage API** - Secure local storage
- **Chrome Idle API** - Smart idle detection
- **Dark Mode CSS** - Modern, beautiful dark theme

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🐛 Known Issues

None currently! If you find a bug, please open an issue.

## 💡 Future Enhancements

- [ ] Export data to CSV/JSON
- [ ] Set daily time goals
- [ ] Custom website categories/tags
- [ ] Monthly calendar view
- [ ] Browser sync support

---

**Made with 💜 for productivity enthusiasts**
