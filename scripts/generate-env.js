const fs = require('fs');
const path = require('path');
const os = require('os');

const networkInterfaces = os.networkInterfaces();
let ipAddress = 'localhost';

const ips = [];
for (const interfaceName in networkInterfaces) {
  const interfaces = networkInterfaces[interfaceName];
  for (const iface of interfaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      ips.push(iface.address);
    }
  }
}

// Find an IP that is likely a physical LAN IP (usually starts with 192.168. or 10.)
const lanIp = ips.find(ip => ip.startsWith('192.168.') || ip.startsWith('10.'));
if (lanIp) {
  ipAddress = lanIp;
} else if (ips.length > 0) {
  // Fallback to first non-internal IPv4 that doesn't start with 172. (which is typically WSL/Docker network)
  const nonVirtualIp = ips.find(ip => !ip.startsWith('172.'));
  ipAddress = nonVirtualIp || ips[0];
}

// Write root .env
const rootEnvPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(rootEnvPath, `API_IP=${ipAddress}\n`, 'utf8');

// Write mobile-client .env
const mobileEnvPath = path.join(__dirname, '..', 'mobile-client', '.env');
fs.writeFileSync(mobileEnvPath, `EXPO_PUBLIC_API_URL=http://${ipAddress}:8080\n`, 'utf8');

console.log(`[Auto-Config] Detected Host LAN IP: ${ipAddress}`);
console.log(`[Auto-Config] Generated root .env (API_IP=${ipAddress})`);
console.log(`[Auto-Config] Generated mobile-client/.env (EXPO_PUBLIC_API_URL=http://${ipAddress}:8080)`);
