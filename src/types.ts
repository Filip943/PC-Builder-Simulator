export type Socket = 'AM4' | 'AM5' | 'sTRX4' | 'LGA1151' | 'LGA1200' | 'LGA1700';
export type FormFactor = 'E-ATX' | 'ATX' | 'Micro-ATX' | 'Mini-ITX';
export type PSUFormFactor = 'ATX' | 'SFX' | 'SFX-L';

export interface BaseComponent {
  id: string;
  name: string;
  category: PartCategory;
  wattage: number;
  price: number;
  performance?: number;
  image?: string;
  description: string;
}

export interface Motherboard extends BaseComponent {
  category: 'Motherboard';
  socket: Socket;
  formFactor: FormFactor;
}

export interface CPU extends BaseComponent {
  category: 'CPU';
  socket: Socket;
}

export interface GPU extends BaseComponent {
  category: 'GPU';
  lengthMm: number;
}

export interface Storage extends BaseComponent {
  category: 'Storage';
  type: 'NVMe' | 'SATA' | 'HDD';
}

export interface PowerSupply extends BaseComponent {
  category: 'Power Supply';
  maxWattage: number;
  psuFormFactor: PSUFormFactor;
}

export interface Case extends BaseComponent {
  category: 'Case';
  supportedFormFactors: FormFactor[];
  maxGPULengthMm: number;
  supportedPSU: PSUFormFactor[];
}

export interface Cooling extends BaseComponent {
  category: 'Cooling';
  supportedSockets: Socket[];
}

export type PCComponent = Motherboard | CPU | GPU | Storage | PowerSupply | Case | Cooling;

export type PartCategory = 
  | 'Motherboard' 
  | 'CPU' 
  | 'GPU' 
  | 'Storage' 
  | 'Power Supply' 
  | 'Case' 
  | 'Cooling';
