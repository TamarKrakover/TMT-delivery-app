const fs = require('fs');
const path = require('path');
const os = require('os');

const networkInterfaces = os.networkInterfaces();
let ipAddress = 'localhost';

const ips = [];
for (const interfaceName in networkInterfaces) {
  // Ignore virtual adapters commonly created by WSL, Docker, Hyper-V
  if (interfaceName.toLowerCase().includes('wsl') || 
      interfaceName.toLowerCase().includes('vethernet') || 
      interfaceName.toLowerCase().includes('virtual')) {
    continue;
  }
  
  const interfaces = networkInterfaces[interfaceName];
  for (const iface of interfaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      // Prioritize Wi-Fi or Ethernet
      if (interfaceName.toLowerCase().includes('wi-fi') || interfaceName.toLowerCase().includes('wireless')) {
        ips.unshift(iface.address); // put at the front
      } else {
        ips.push(iface.address);
      }
    }
  }
}

// Find an IP that is likely a physical LAN IP (usually starts with 192.168. or 10. or 172.)
const lanIp = ips.find(ip => ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.'));
if (lanIp) {
  ipAddress = lanIp;
} else if (ips.length > 0) {
  ipAddress = ips[0];
}

const envPath = path.join(__dirname, '..', '.env');
const envContent = `EXPO_PUBLIC_API_URL=http://${ipAddress}:8080\n`;

fs.writeFileSync(envPath, envContent, 'utf8');
console.log(`Auto-detected local host IP: ${ipAddress}`);
console.log(`Created/updated mobile-client/.env with EXPO_PUBLIC_API_URL=http://${ipAddress}:8080`);
