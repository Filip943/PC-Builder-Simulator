import { PCComponent, PartCategory } from './types';

export const CATEGORIES: PartCategory[] = [
  'Motherboard',
  'CPU',
  'GPU',
  'Storage',
  'Power Supply',
  'Case',
  'Cooling'
];

export const CATALOG: PCComponent[] = [
  // ==================== MOTHERBOARDS ====================
  // E-ATX
  { id: 'mb-eatx-1', category: 'Motherboard', name: 'ROG Zenith II Extreme Alpha', description: 'Ultimate HEDT E-ATX board for Threadripper.', socket: 'sTRX4', formFactor: 'E-ATX', wattage: 70, price: 850 },
  { id: 'mb-eatx-2', category: 'Motherboard', name: 'MEG Z790 GODLIKE', description: 'Enthusiast E-ATX board for Intel 13th/14th Gen.', socket: 'LGA1700', formFactor: 'E-ATX', wattage: 65, price: 1199 },
  { id: 'mb-eatx-3', category: 'Motherboard', name: 'X670E AORUS XTREME', description: 'Flagship AM5 E-ATX board.', socket: 'AM5', formFactor: 'E-ATX', wattage: 60, price: 699 },
  { id: 'mb-eatx-4', category: 'Motherboard', name: 'ROG MAXIMUS Z690 EXTREME', description: 'Top-tier E-ATX LGA1700 DDR5 motherboard.', socket: 'LGA1700', formFactor: 'E-ATX', wattage: 60, price: 799 },
  { id: 'mb-eatx-5', category: 'Motherboard', name: 'TRX40 AORUS PRO WIFI', description: 'Feature-rich Threadripper E-ATX board.', socket: 'sTRX4', formFactor: 'E-ATX', wattage: 65, price: 399 },
  
  // ATX
  { id: 'mb-atx-1', category: 'Motherboard', name: 'MSI MAG B550 TOMAHAWK', description: 'Solid AM4 ATX motherboard for Ryzen.', socket: 'AM4', formFactor: 'ATX', wattage: 35, price: 169 },
  { id: 'mb-atx-2', category: 'Motherboard', name: 'GIGABYTE X670E AORUS MASTER', description: 'High-end AM5 ATX motherboard.', socket: 'AM5', formFactor: 'ATX', wattage: 45, price: 489 },
  { id: 'mb-atx-3', category: 'Motherboard', name: 'ASUS ROG Maximus Z790 Hero', description: 'Premium LGA1700 ATX motherboard.', socket: 'LGA1700', formFactor: 'ATX', wattage: 50, price: 629 },
  { id: 'mb-atx-4', category: 'Motherboard', name: 'ASUS ROG STRIX B450-F GAMING II', description: 'Legendary AM4 standard ATX motherboard.', socket: 'AM4', formFactor: 'ATX', wattage: 30, price: 139 },
  { id: 'mb-atx-5', category: 'Motherboard', name: 'MSI MAG Z690 TOMAHAWK WIFI', description: 'Sturdy LGA1700 ATX motherboard.', socket: 'LGA1700', formFactor: 'ATX', wattage: 40, price: 259 },

  // Micro-ATX
  { id: 'mb-matx-1', category: 'Motherboard', name: 'ASUS Prime A320M-K', description: 'Budget AM4 Micro-ATX motherboard.', socket: 'AM4', formFactor: 'Micro-ATX', wattage: 20, price: 60 },
  { id: 'mb-matx-2', category: 'Motherboard', name: 'MSI MAG B660M MORTAR WIFI', description: 'Excellent LGA1700 Micro-ATX board.', socket: 'LGA1700', formFactor: 'Micro-ATX', wattage: 35, price: 159 },
  { id: 'mb-matx-3', category: 'Motherboard', name: 'MSI B550M PRO-VDH WIFI', description: 'Great value AM4 Micro-ATX motherboard.', socket: 'AM4', formFactor: 'Micro-ATX', wattage: 25, price: 119 },
  { id: 'mb-matx-4', category: 'Motherboard', name: 'MSI H310M PRO-VD', description: 'Legacy LGA1151 Micro-ATX board.', socket: 'LGA1151', formFactor: 'Micro-ATX', wattage: 20, price: 55 },
  { id: 'mb-matx-5', category: 'Motherboard', name: 'GIGABYTE B460M DS3H', description: 'Reliable LGA1200 Micro-ATX option.', socket: 'LGA1200', formFactor: 'Micro-ATX', wattage: 25, price: 79 },

  // Mini-ITX
  { id: 'mb-itx-1', category: 'Motherboard', name: 'GIGABYTE B660I AORUS PRO', description: 'Compact LGA1700 Mini-ITX motherboard.', socket: 'LGA1700', formFactor: 'Mini-ITX', wattage: 30, price: 189 },
  { id: 'mb-itx-2', category: 'Motherboard', name: 'GIGABYTE B550I AORUS PRO AX', description: 'Powerful AM4 Mini-ITX motherboard.', socket: 'AM4', formFactor: 'Mini-ITX', wattage: 28, price: 199 },
  { id: 'mb-itx-3', category: 'Motherboard', name: 'ASUS ROG Strix Z490-I Gaming', description: 'Premium LGA1200 Mini-ITX board.', socket: 'LGA1200', formFactor: 'Mini-ITX', wattage: 35, price: 249 },
  { id: 'mb-itx-4', category: 'Motherboard', name: 'ASUS ROG Strix X670E-I Gaming', description: 'Next-gen AM5 Mini-ITX motherboard.', socket: 'AM5', formFactor: 'Mini-ITX', wattage: 45, price: 439 },
  { id: 'mb-itx-5', category: 'Motherboard', name: 'MSI H110I PRO', description: 'Small form factor LGA1151 motherboard.', socket: 'LGA1151', formFactor: 'Mini-ITX', wattage: 20, price: 75 },

  // ==================== CPUS ====================
  // Intel
  { id: 'cpu-int-1', category: 'CPU', name: 'Intel Celeron G4930', description: 'Basic dual-core processor.', socket: 'LGA1151', wattage: 54, price: 40, performance: 10 },
  { id: 'cpu-int-2', category: 'CPU', name: 'Intel Pentium Gold G6400', description: 'Entry-level dual-core with hyper-threading.', socket: 'LGA1200', wattage: 58, price: 65, performance: 18 },
  { id: 'cpu-int-3', category: 'CPU', name: 'Intel Core i3-12100F', description: 'Excellent budget gaming quad-core.', socket: 'LGA1700', wattage: 89, price: 105, performance: 35 },
  { id: 'cpu-int-4', category: 'CPU', name: 'Intel Core i5-13400F', description: 'Solid 10-core mid-range CPU.', socket: 'LGA1700', wattage: 148, price: 209, performance: 65 },
  { id: 'cpu-int-5', category: 'CPU', name: 'Intel Core i7-13700K', description: 'High performance 16-core CPU.', socket: 'LGA1700', wattage: 253, price: 409, performance: 90 },
  { id: 'cpu-int-6', category: 'CPU', name: 'Intel Core i9-14900K', description: 'Absolute powerhouse 24-core CPU.', socket: 'LGA1700', wattage: 320, price: 589, performance: 100 },
  
  // AMD Mainstream
  { id: 'cpu-amd-1', category: 'CPU', name: 'AMD Ryzen 3 3300X', description: 'Budget quad-core standard.', socket: 'AM4', wattage: 65, price: 120, performance: 30 },
  { id: 'cpu-amd-2', category: 'CPU', name: 'AMD Ryzen 5 5600X', description: 'Great 6-core gaming CPU.', socket: 'AM4', wattage: 76, price: 159, performance: 55 },
  { id: 'cpu-amd-3', category: 'CPU', name: 'AMD Ryzen 7 7800X3D', description: 'The undisputed gaming king.', socket: 'AM5', wattage: 120, price: 399, performance: 92 },
  { id: 'cpu-amd-4', category: 'CPU', name: 'AMD Ryzen 9 7950X', description: '16-core flagship for productivity.', socket: 'AM5', wattage: 230, price: 599, performance: 98 },
  
  // AMD Threadripper
  { id: 'cpu-tr-1', category: 'CPU', name: 'AMD Ryzen Threadripper 3960X', description: '24-core HEDT processor.', socket: 'sTRX4', wattage: 280, price: 1399, performance: 85 },
  { id: 'cpu-tr-2', category: 'CPU', name: 'AMD Ryzen Threadripper 3970X', description: '32-core HEDT processor.', socket: 'sTRX4', wattage: 280, price: 1999, performance: 95 },
  { id: 'cpu-tr-3', category: 'CPU', name: 'AMD Ryzen Threadripper 3990X', description: '64-core HEDT monster.', socket: 'sTRX4', wattage: 280, price: 3990, performance: 115 },
  { id: 'cpu-tr-4', category: 'CPU', name: 'AMD Threadripper PRO 5955WX', description: '16-core workstation processor.', socket: 'sTRX4', wattage: 280, price: 1250, performance: 80 },
  { id: 'cpu-tr-5', category: 'CPU', name: 'AMD Threadripper PRO 5975WX', description: '32-core workstation processor.', socket: 'sTRX4', wattage: 280, price: 3299, performance: 105 },
  { id: 'cpu-tr-6', category: 'CPU', name: 'AMD Threadripper PRO 5995WX', description: '64-core extreme workstation CPU.', socket: 'sTRX4', wattage: 280, price: 6499, performance: 130 },

  // ==================== GPUS ====================
  { id: 'gpu-1', category: 'GPU', name: 'NVIDIA GTX 860', description: 'Classic budget card (simulated desktop variant).', lengthMm: 170, wattage: 75, price: 80, performance: 15 },
  { id: 'gpu-2', category: 'GPU', name: 'NVIDIA GTX 1060 6GB', description: 'The legendary steam survey champion.', lengthMm: 250, wattage: 120, price: 150, performance: 30 },
  { id: 'gpu-3', category: 'GPU', name: 'NVIDIA RTX 2070', description: 'Excellent entry to ray tracing.', lengthMm: 265, wattage: 175, price: 350, performance: 50 },
  { id: 'gpu-4', category: 'GPU', name: 'NVIDIA RTX 3080', description: 'The 4K sweet spot from Ampere.', lengthMm: 285, wattage: 320, price: 699, performance: 80 },
  { id: 'gpu-5', category: 'GPU', name: 'NVIDIA RTX 4090', description: 'The ultimate Ada Lovelace flagship.', lengthMm: 340, wattage: 450, price: 1599, performance: 100 },
  { id: 'gpu-6', category: 'GPU', name: 'NVIDIA RTX 5090', description: 'Next-gen performance leviathan.', lengthMm: 360, wattage: 500, price: 1999, performance: 130 },
  
  // Extra GPUs for flavor
  { id: 'gpu-7', category: 'GPU', name: 'AMD Radeon RX 7900 XTX', description: 'Top-tier AMD RDNA3 performance.', lengthMm: 287, wattage: 355, price: 999, performance: 90 },
  { id: 'gpu-8', category: 'GPU', name: 'NVIDIA GTX 1650', description: 'Small form factor budget card.', lengthMm: 170, wattage: 75, price: 150, performance: 22 },

  // ==================== CASES ====================
  // E-ATX (5)
  { id: 'ca-eatx-1', category: 'Case', name: 'Lian Li V3000 PLUS', description: 'Gigantic enclosure for extreme builds.', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 480, supportedPSU: ['ATX'], wattage: 0, price: 499 },
  { id: 'ca-eatx-2', category: 'Case', name: 'Corsair Obsidian 1000D', description: 'Super-tower case for dual-system setups.', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 400, supportedPSU: ['ATX', 'SFX-L'], wattage: 0, price: 519 },
  { id: 'ca-eatx-3', category: 'Case', name: 'Phanteks Enthoo Pro 2', description: 'High-performance full tower.', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 503, supportedPSU: ['ATX'], wattage: 0, price: 169 },
  { id: 'ca-eatx-4', category: 'Case', name: 'Fractal Design Meshify 2 XL', description: 'Massive airflow and storage capacity.', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 549, supportedPSU: ['ATX'], wattage: 0, price: 219 },
  { id: 'ca-eatx-5', category: 'Case', name: 'Thermaltake The Tower 900', description: 'Vertical super-tower showcase.', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 400, supportedPSU: ['ATX'], wattage: 0, price: 299 },

  // ATX (5)
  { id: 'ca-atx-1', category: 'Case', name: 'Lian Li O11 Dynamic', description: 'The famous dual-chamber display case.', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 420, supportedPSU: ['ATX'], wattage: 0, price: 159 },
  { id: 'ca-atx-2', category: 'Case', name: 'NZXT H510', description: 'Clean, minimalist mid-tower.', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 381, supportedPSU: ['ATX'], wattage: 0, price: 89 },
  { id: 'ca-atx-3', category: 'Case', name: 'Fractal Design North', description: 'Elegant case with real wood accents.', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 355, supportedPSU: ['ATX'], wattage: 0, price: 139 },
  { id: 'ca-atx-4', category: 'Case', name: 'Corsair 4000D Airflow', description: 'High-airflow, easy-to-build mid-tower.', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 360, supportedPSU: ['ATX'], wattage: 0, price: 104 },
  { id: 'ca-atx-5', category: 'Case', name: 'Phanteks Eclipse P400A', description: 'Mesh front panel for optimal cooling.', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 420, supportedPSU: ['ATX'], wattage: 0, price: 99 },

  // Micro-ATX (5)
  { id: 'ca-matx-1', category: 'Case', name: 'Fractal Design Pop Mini Air', description: 'Compact and colorful airflow case.', supportedFormFactors: ['Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 365, supportedPSU: ['ATX'], wattage: 0, price: 89 },
  { id: 'ca-matx-2', category: 'Case', name: 'Thermaltake Versa H18', description: 'Value-oriented mATX case.', supportedFormFactors: ['Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 350, supportedPSU: ['ATX'], wattage: 0, price: 54 },
  { id: 'ca-matx-3', category: 'Case', name: 'ASUS Prime AP201', description: '33-liter mesh Micro-ATX chassis.', supportedFormFactors: ['Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 338, supportedPSU: ['ATX', 'SFX', 'SFX-L'], wattage: 0, price: 84 },
  { id: 'ca-matx-4', category: 'Case', name: 'Cooler Master MasterBox Q300L', description: 'Highly modular mini-tower.', supportedFormFactors: ['Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 360, supportedPSU: ['ATX'], wattage: 0, price: 49 },
  { id: 'ca-matx-5', category: 'Case', name: 'Budget Office Case', description: 'Generic metal box.', supportedFormFactors: ['Micro-ATX', 'Mini-ITX'], maxGPULengthMm: 200, supportedPSU: ['ATX'], wattage: 0, price: 35 },

  // Mini-ITX (5)
  { id: 'ca-itx-1', category: 'Case', name: 'Cooler Master NR200P', description: 'Popular and versatile ITX case.', supportedFormFactors: ['Mini-ITX'], maxGPULengthMm: 330, supportedPSU: ['SFX', 'SFX-L'], wattage: 0, price: 109 },
  { id: 'ca-itx-2', category: 'Case', name: 'NZXT H1', description: 'Vertical ITX tower.', supportedFormFactors: ['Mini-ITX'], maxGPULengthMm: 305, supportedPSU: ['SFX-L'], wattage: 0, price: 199 },
  { id: 'ca-itx-3', category: 'Case', name: 'Lian Li A4-H20', description: '11-liter sandwich layout case.', supportedFormFactors: ['Mini-ITX'], maxGPULengthMm: 322, supportedPSU: ['SFX', 'SFX-L'], wattage: 0, price: 154 },
  { id: 'ca-itx-4', category: 'Case', name: 'SSUPD Meshlicious', description: 'Vertical mesh ITX case.', supportedFormFactors: ['Mini-ITX'], maxGPULengthMm: 336, supportedPSU: ['ATX', 'SFX', 'SFX-L'], wattage: 0, price: 119 },
  { id: 'ca-itx-5', category: 'Case', name: 'Fractal Design Terra', description: 'Wood-accented SFF luxury case.', supportedFormFactors: ['Mini-ITX'], maxGPULengthMm: 322, supportedPSU: ['SFX', 'SFX-L'], wattage: 0, price: 179 },

  // ==================== STORAGE ====================
  // NVMe
  { id: 'sto-nvme-1', category: 'Storage', name: 'Samsung 990 PRO 2TB', description: 'Blazing fast Gen4 NVMe.', type: 'NVMe', wattage: 10, price: 189 },
  { id: 'sto-nvme-2', category: 'Storage', name: 'Samsung 980 PRO 1TB', description: 'Reliable Gen4 NVMe speed.', type: 'NVMe', wattage: 8, price: 99 },
  { id: 'sto-nvme-3', category: 'Storage', name: 'WD Black SN850X 4TB', description: 'Massive capacity fast NVMe.', type: 'NVMe', wattage: 11, price: 309 },
  { id: 'sto-nvme-4', category: 'Storage', name: 'Crucial P3 Plus 2TB', description: 'Value-oriented Gen4 storage.', type: 'NVMe', wattage: 7, price: 115 },
  { id: 'sto-nvme-5', category: 'Storage', name: 'Kingston NV2 1TB', description: 'Entry-level NVMe drive.', type: 'NVMe', wattage: 5, price: 54 },
  { id: 'sto-nvme-6', category: 'Storage', name: 'Sabrent Rocket 4 Plus 8TB', description: 'Absurd amount of NVMe storage.', type: 'NVMe', wattage: 15, price: 999 },
  // SATA SSD
  { id: 'sto-sata-1', category: 'Storage', name: 'Crucial MX500 1TB', description: 'Reliable SATA SSD storage.', type: 'SATA', wattage: 5, price: 65 },
  { id: 'sto-sata-2', category: 'Storage', name: 'Samsung 870 EVO 2TB', description: 'Premium SATA SSD speed.', type: 'SATA', wattage: 6, price: 149 },
  { id: 'sto-sata-3', category: 'Storage', name: 'Kingston A400 480GB', description: 'Cheap OS boot drive.', type: 'SATA', wattage: 3, price: 30 },
  { id: 'sto-sata-4', category: 'Storage', name: 'SK Hynix Gold S31 1TB', description: 'Dependable SATA SSD.', type: 'SATA', wattage: 5, price: 79 },
  // HDD
  { id: 'sto-hdd-1', category: 'Storage', name: 'Seagate Barracuda 4TB', description: 'Classic 5400RPM bulk storage.', type: 'HDD', wattage: 15, price: 85 },
  { id: 'sto-hdd-2', category: 'Storage', name: 'WD Red Plus 8TB', description: 'NAS-grade CMR hard drive.', type: 'HDD', wattage: 18, price: 169 },
  { id: 'sto-hdd-3', category: 'Storage', name: 'Toshiba X300 10TB', description: 'High performance 7200RPM HDD.', type: 'HDD', wattage: 20, price: 219 },
  { id: 'sto-hdd-4', category: 'Storage', name: 'Seagate IronWolf Pro 22TB', description: 'Insane capacity enterprise HDD.', type: 'HDD', wattage: 25, price: 399 },

  // ==================== POWER SUPPLIES ====================
  { id: 'psu-1', category: 'Power Supply', name: 'Corsair RM1000x', description: '1000W ATX 80+ Gold.', maxWattage: 1000, psuFormFactor: 'ATX', wattage: 0, price: 189 },
  { id: 'psu-2', category: 'Power Supply', name: 'EVGA 600 W1', description: '600W ATX budget power supply.', maxWattage: 600, psuFormFactor: 'ATX', wattage: 0, price: 60 },
  { id: 'psu-3', category: 'Power Supply', name: 'Corsair SF750', description: '750W SFX 80+ Platinum.', maxWattage: 750, psuFormFactor: 'SFX', wattage: 0, price: 185 },
  { id: 'psu-4', category: 'Power Supply', name: 'Generic 350W Unit', description: 'A 350W ATX fire hazard.', maxWattage: 350, psuFormFactor: 'ATX', wattage: 0, price: 25 },
  { id: 'psu-5', category: 'Power Supply', name: 'Seasonic PRIME TX-1600', description: '1600W ATX 80+ Titanium.', maxWattage: 1600, psuFormFactor: 'ATX', wattage: 0, price: 599 },
  { id: 'psu-6', category: 'Power Supply', name: 'be quiet! Dark Power Pro 13', description: '1300W ATX 80+ Titanium.', maxWattage: 1300, psuFormFactor: 'ATX', wattage: 0, price: 459 },
  { id: 'psu-7', category: 'Power Supply', name: 'Cooler Master V850 SFX Gold', description: '850W SFX 80+ Gold.', maxWattage: 850, psuFormFactor: 'SFX', wattage: 0, price: 144 },
  { id: 'psu-8', category: 'Power Supply', name: 'EVGA SuperNOVA 850 G6', description: '850W ATX 80+ Gold.', maxWattage: 850, psuFormFactor: 'ATX', wattage: 0, price: 139 },
  { id: 'psu-9', category: 'Power Supply', name: 'Thermaltake Toughpower GF3', description: '1200W ATX ATX3.0 80+ Gold.', maxWattage: 1200, psuFormFactor: 'ATX', wattage: 0, price: 229 },
  { id: 'psu-10', category: 'Power Supply', name: 'Silverstone SX1000 Platinum', description: '1000W SFX-L 80+ Platinum.', maxWattage: 1000, psuFormFactor: 'SFX-L', wattage: 0, price: 289 },

  // ==================== COOLING ====================
  { id: 'co-1', category: 'Cooling', name: 'Noctua NH-D15', description: 'Massive dual-tower legendary air cooler.', supportedSockets: ['AM4', 'AM5', 'LGA1151', 'LGA1200', 'LGA1700'], wattage: 5, price: 119 },
  { id: 'co-2', category: 'Cooling', name: 'Corsair iCUE H150i ELITE', description: '360mm AIO Liquid Cooler.', supportedSockets: ['AM4', 'AM5', 'LGA1151', 'LGA1200', 'LGA1700'], wattage: 20, price: 199 },
  { id: 'co-3', category: 'Cooling', name: 'AMD Wraith Stealth', description: 'Basic AMD stock air cooler.', supportedSockets: ['AM4', 'AM5'], wattage: 5, price: 15 },
  { id: 'co-4', category: 'Cooling', name: 'Intel Laminar RM1', description: 'Basic Intel stock air cooler.', supportedSockets: ['LGA1700', 'LGA1200', 'LGA1151'], wattage: 5, price: 15 },
  { id: 'co-5', category: 'Cooling', name: 'Noctua NH-U14S TR4-SP3', description: 'Premium air cooler custom fit for Threadripper.', supportedSockets: ['sTRX4'], wattage: 8, price: 99 },
  { id: 'co-6', category: 'Cooling', name: 'Enermax Liqtech TR4 II 360', description: '360mm AIO exclusively for Threadripper.', supportedSockets: ['sTRX4'], wattage: 25, price: 159 },
  { id: 'co-7', category: 'Cooling', name: 'be quiet! Dark Rock Pro 4', description: 'Silent heavy-duty air cooler.', supportedSockets: ['AM4', 'AM5', 'LGA1151', 'LGA1200', 'LGA1700'], wattage: 5, price: 89 },
  { id: 'co-8', category: 'Cooling', name: 'Arctic Liquid Freezer II 420', description: 'Gigantic 420mm AIO radiator.', supportedSockets: ['AM4', 'AM5', 'LGA1700'], wattage: 25, price: 145 },
  { id: 'co-9', category: 'Cooling', name: 'NZXT Kraken Elite 360', description: 'High-end 360mm AIO with LCD display.', supportedSockets: ['AM4', 'AM5', 'LGA1151', 'LGA1200', 'LGA1700'], wattage: 20, price: 279 },
  { id: 'co-10', category: 'Cooling', name: 'Cooler Master Hyper 212 Halo', description: 'The timeless budget air cooler.', supportedSockets: ['AM4', 'AM5', 'LGA1151', 'LGA1200', 'LGA1700'], wattage: 5, price: 45 }
];
