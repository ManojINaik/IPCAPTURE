# IP CAPTURE - IP Address Tracker

A modern web application that allows users to track and get detailed information about any IP address or domain. Built with HTML, CSS, and JavaScript.

## Features

- Track any IP address or domain
- View location on an interactive map
- Get detailed information including:
  - IP Address
  - Location (City, Region, Country)
  - Timezone
  - ISP
- Share results via WhatsApp or Gmail
- Responsive design for all devices
- User authentication system

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Leaflet.js for maps
- IPify API for IP geolocation

## Setup

1. Clone the repository
2. Create a `config.js` file in the root directory with your API keys:
```javascript
export const IPIFY_API_KEY = 'your_ipify_api_key';
export const IPGEOLOCATION_API_KEY = 'your_ipgeolocation_api_key';
```
3. Open `index.html` in your browser

## API Keys Required

- Get your IPify API key from [IPify](https://www.ipify.org/)
- Get your IPGeolocation API key from [IPGeolocation](https://ipgeolocation.io/)

## Live Demo

Visit the live demo: [IP CAPTURE](https://manojinaik.github.io/IP-Capture/)

## License

MIT License 