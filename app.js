'use strict';
import { IPIFY_API_KEY, IPGEOLOCATION_API_KEY } from './config.js';

// DOM Elements
const ipAddressField = document.querySelector('.ipAddressField');
const timezoneInput = document.querySelector('.timezoneInput');
const locationInput = document.querySelector('.locationInput');
const ispInput = document.querySelector('.ispInput');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const whatsappButton = document.querySelector('.whatsapp-share-btn');
const gmailButton = document.querySelector('.gmail-share-btn');

// Initialize map
let map = L.map('map').setView([51.505, -0.09], 13);
let currentMarker = null;

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Map functions
const updateMap = (lat, lng) => {
  // Remove existing marker if any
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // Add new marker using default Leaflet marker
  currentMarker = L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 13);
};

// API functions
const fetchIPData = async (searchTerm) => {
  try {
    const url = searchTerm
      ? `https://geo.ipify.org/api/v2/country,city?apiKey=${IPIFY_API_KEY}&domain=${searchTerm}`
      : `https://geo.ipify.org/api/v2/country,city?apiKey=${IPIFY_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch IP data');
    
    const data = await response.json();
    updateUI(data);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to fetch IP data. Please try again.');
  }
};

const updateUI = (data) => {
  const { ip, location, isp } = data;
  const { country, region, city, timezone, lat, lng } = location;

  // Update info cards
  ipAddressField.textContent = ip;
  locationInput.textContent = `${city}, ${region}, ${country}`;
  timezoneInput.textContent = `UTC ${timezone}`;
  ispInput.textContent = isp;

  // Update map
  updateMap(lat, lng);
};

// Share functions
const shareViaWhatsApp = () => {
  const ipAddress = ipAddressField.textContent;
  const location = locationInput.textContent;
  const timezone = timezoneInput.textContent;
  const isp = ispInput.textContent;

  const message = `
IP Address Tracker Information
---------------------------
IP Address: ${ipAddress}
Location: ${location}
Timezone: ${timezone}
ISP: ${isp}
  `.trim();

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

const shareViaGmail = () => {
  const ipAddress = ipAddressField.textContent;
  const location = locationInput.textContent;
  const timezone = timezoneInput.textContent;
  const isp = ispInput.textContent;

  const subject = 'IP Address Information';
  const body = `
IP Address: ${ipAddress}
Location: ${location}
Timezone: ${timezone}
ISP: ${isp}
  `.trim();

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};

// Event Listeners
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchIPData(searchTerm);
  }
});

whatsappButton.addEventListener('click', shareViaWhatsApp);
gmailButton.addEventListener('click', shareViaGmail);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  fetchIPData();
});
