// API Configuration
//
// IMPORTANT: When accessing from other devices, update API_URL to your server's IP address
//
// Examples:
// - Same device (localhost): 'http://localhost:3000'
// - Other devices on network: 'http://192.168.1.100:3000' (replace with your computer's IP)
// - Production server: 'https://your-domain.com'
//
// To find your computer's IP address:
// - Windows: Open Command Prompt and run: ipconfig
// - Mac/Linux: Open Terminal and run: ifconfig or ip addr
// - Look for IPv4 address (usually starts with 192.168.x.x or 10.x.x.x)

const CONFIG = {
  // Set this to your server's IP address for cross-device access
  // Leave as 'auto' to automatically detect (works for same-device only)
  API_URL: 'auto', // Change to 'http://YOUR_IP_ADDRESS:3000' for cross-device access
};

// Auto-detect API URL if set to 'auto'
if (CONFIG.API_URL === 'auto') {
  CONFIG.API_URL = window.location.origin;
}

console.log('API URL:', CONFIG.API_URL);
