'use strict';
import { IPIFY_API_KEY, IPGEOLOCATION_API_KEY } from './config.js';

const ipAddressField = document.querySelector('.ipAddressField');
const timezoneInput = document.querySelector('.timezoneInput');
const countryLocationInput = document.querySelector('.locationInput');
const ispInput = document.querySelector('.ispInput');
const submitBtn = document.querySelector('.submit-btn');
const inputField = document.querySelector('.input-field');
const whatsappButton = document.querySelector('.whatsapp-share-btn');
const gmailButton = document.querySelector('.gmail-share-btn');
let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
document.querySelector('.logout-btn').addEventListener('click', function() {
  localStorage.removeItem('loggedIn');
  window.location.href = 'login.html';
});
const mapLocation = (lat, lng) => {
  var markerIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [46, 56], 
    iconAnchor: [23, 55],
  });
  map.setView([lat, lng], 17);
  L.marker([lat, lng], { icon: markerIcon }).addTo(map);
};
const fetchPublicIPGeolocationData = (ip) => {
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${IPIFY_API_KEY}&ipAddress=${ip}`;
  fetch(url)
    .then((response) => response.json())
    .then((response) => {
      const { ip, location, isp } = response;
      const { timezone, country, city, postalCode, lat, lng } = location;

      ipAddressField.textContent = ip;
      timezoneInput.textContent = `UTC ${timezone}`;
      countryLocationInput.textContent = `${country}, ${city} ${postalCode}`;
      ispInput.textContent = isp;
      mapLocation(lat, lng);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
const fetchPrivateIPGeolocationData = (ip) => {
  const privateIPData = {
    '192.168.0.0/16': { lat: 37.7749, lng: -122.4194, country: 'Local', city: 'Local Network', isp: 'Private Network' },
    '10.0.0.0/8': { lat: 40.7128, lng: -74.0060, country: 'Local', city: 'Local Network', isp: 'Private Network' },
    '172.16.0.0/12': { lat: 34.0522, lng: -118.2437, country: 'Local', city: 'Local Network', isp: 'Private Network' },
  };
  let locationData = null;
  for (const [range, data] of Object.entries(privateIPData)) {
    const [rangeStart, subnetMask] = range.split('/');
    if (isInSubnet(ip, rangeStart, parseInt(subnetMask))) {
      locationData = data;
      break;
    }
  }
  if (locationData) {
    ipAddressField.textContent = ip;
    timezoneInput.textContent = `UTC`;
    countryLocationInput.textContent = `${locationData.country}, ${locationData.city}`;
    ispInput.textContent = locationData.isp;
    mapLocation(locationData.lat, locationData.lng);
  } else {
    alert('You have entered an invalid private IP address!');
  }
};
const isInSubnet = (ip, subnet, subnetMask) => {
  const ipInt = ipToInt(ip);
  const subnetInt = ipToInt(subnet);
  const mask = -1 << (32 - subnetMask);
  return (ipInt & mask) === (subnetInt & mask);
};
const ipToInt = (ip) => {
  return ip.split('.').reduce((ipInt, octet) => {
    return (ipInt << 8) + parseInt(octet, 10);
  }, 0) >>> 0;
};
const getPublicIP = () => {
  fetch('https://api.ipify.org?format=json')
    .then((response) => response.json())
    .then((data) => {
      fetchPublicIPGeolocationData(data.ip);
    })
    .catch((error) => {
      console.error('Error fetching public IP:', error);
    });
};
const isValidIP = (ip) => {
  const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
};
const resolveDomainToIP = (domain) => {
  const url = `https://dns.google/resolve?name=${domain}&type=A`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.Answer && data.Answer.length > 0) {
        return data.Answer[0].data;
      } else {
        throw new Error('Invalid domain name');
      }
    });
};
const handleUserInput = (input) => {
  if (isValidIP(input)) {
    const isPrivateIP = input.startsWith('192.168.') || input.startsWith('10.') || input.startsWith('172.16.') || input.startsWith('172.17.') || input.startsWith('172.18.') || input.startsWith('172.19.') || input.startsWith('172.20.') || input.startsWith('172.21.') || input.startsWith('172.22.') || input.startsWith('172.23.') || input.startsWith('172.24.') || input.startsWith('172.25.') || input.startsWith('172.26.') || input.startsWith('172.27.') || input.startsWith('172.28.') || input.startsWith('172.29.') || input.startsWith('172.30.') || input.startsWith('172.31.');

    if (isPrivateIP) {
      fetchPrivateIPGeolocationData(input);
    } else {
      fetchPublicIPGeolocationData(input);
    }
  } else {
    resolveDomainToIP(input)
      .then((ip) => fetchPublicIPGeolocationData(ip))
      .catch((error) => alert('You have entered an invalid IP address or domain name!'));
  }
};
submitBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const input = inputField.value.trim();
  handleUserInput(input);
});

getPublicIP();
const shareViaWhatsApp = () => {
  const ipAddress = ipAddressField.textContent;
  const locationInfo = countryLocationInput.textContent;
  const timezoneInfo = timezoneInput.textContent;
  const ispInfo = ispInput.textContent;

  const whatsappMessage = `IP Address Tracker Information\n\nIP Address: ${ipAddress}\nLocation: ${locationInfo}\nTimezone: ${timezoneInfo}\nISP: ${ispInfo}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, '_blank');
};

const shareViaGmail = () => {
  const ipAddress = ipAddressField.textContent;
  const locationInfo = countryLocationInput.textContent;
  const timezoneInfo = timezoneInput.textContent;
  const ispInfo = ispInput.textContent;

  const subject = 'IP Address Tracker Information';
  const body = `IP Address: ${ipAddress}\nLocation: ${locationInfo}\nTimezone: ${timezoneInfo}\nISP: ${ispInfo}`;
  const gmailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = gmailUrl;
};
whatsappButton.addEventListener('click', shareViaWhatsApp);
gmailButton.addEventListener('click', shareViaGmail);
