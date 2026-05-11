import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CircuitBoard, 
  Cpu, 
  MonitorPlay, 
  HardDrive, 
  Zap, 
  Box, 
  Fan,
  CheckCircle2,
  XCircle,
  Power,
  RotateCcw,
  AlertTriangle,
  Lock,
  Activity
} from 'lucide-react';
import { CATALOG, CATEGORIES } from './catalog';
import type { 
  PartCategory, 
  PCComponent, 
  Motherboard, 
  CPU, 
  GPU, 
  Storage, 
  PowerSupply, 
  Case, 
  Cooling 
} from './types';

const INITIAL_UNLOCKS = [
  'mb-matx-1', 'mb-matx-4', 'mb-matx-2',
  'cpu-int-1', 'cpu-int-2', 'cpu-int-3', 'cpu-amd-1',
  'gpu-1', 'gpu-8',
  'sto-sata-3', 'sto-hdd-1',
  'psu-4', 'psu-2',
  'ca-matx-5', 'ca-matx-4', 'ca-matx-2',
  'co-3', 'co-4', 'co-10'
];

const CategoryIcons: Record<PartCategory, React.ElementType> = {
  'Motherboard': CircuitBoard,
  'CPU': Cpu,
  'GPU': MonitorPlay,
  'Storage': HardDrive,
  'Power Supply': Zap,
  'Case': Box,
  'Cooling': Fan
};

type BootStatus = 'idle' | 'booting' | 'benchmarking' | 'success' | 'failure' | 'os';

interface BootLog {
  id: string;
  message: string;
  status: 'pending' | 'ok' | 'error';
}

export default function App() {
  const [gameplayMode, setGameplayMode] = useState<'menu' | 'normal' | 'sandbox'>('menu');
  const [activeCategory, setActiveCategory] = useState<PartCategory>('Motherboard');
  const [selectedParts, setSelectedParts] = useState<Record<string, PCComponent>>({});
  
  const [money, setMoney] = useState(0);
  const [unlockedParts, setUnlockedParts] = useState<Set<string>>(new Set(INITIAL_UNLOCKS));
  
  const [bootStatus, setBootStatus] = useState<BootStatus>('idle');
  const [bootLogs, setBootLogs] = useState<BootLog[]>([]);
  
  // OS Windows
  const [activeWindow, setActiveWindow] = useState<'none' | 'mypc' | 'benchmark' | 'taskmanager'>('none');

  
  // Benchmark state
  const [benchmarkProgress, setBenchmarkProgress] = useState(0);
  const [benchmarkStage, setBenchmarkStage] = useState('');
  const [scores, setScores] = useState({ gaming: 0, productivity: 0, overall: 0 });

  // Task manager dynamic usage
  const [usageStats, setUsageStats] = useState({ cpu: 0, gpu: 0, ram: 0, disk: 0 });

  useEffect(() => {
    if (bootStatus === 'os' && activeWindow === 'taskmanager') {
      const cpuPerf = (selectedParts['CPU'] as CPU)?.performance || 50;
      const gpuPerf = (selectedParts['GPU'] as GPU)?.performance || 50;
      const mbPrice = selectedParts['Motherboard']?.price || 100;
      const storageType = (selectedParts['Storage'] as Storage)?.type || 'HDD';

      const getUsage = (perf: number, max: number) => {
          const ratio = Math.min(perf / max, 1);
          return Math.floor(100 - (ratio * 70) - (Math.random() * 10)); // random jitter
      };

      const updateStats = () => {
          const diskUsage = storageType === 'NVMe' ? Math.floor(2 + Math.random() * 5) : 
                            storageType === 'SATA' ? Math.floor(15 + Math.random() * 10) : 
                            Math.floor(85 + Math.random() * 15);

          setUsageStats({
            cpu: Math.max(1, Math.min(100, getUsage(cpuPerf, 130))),
            gpu: Math.max(1, Math.min(100, getUsage(gpuPerf, 130))),
            ram: Math.max(10, Math.min(100, getUsage(mbPrice, 1000))),
            disk: Math.min(100, Math.max(0, diskUsage))
          });
      };
      
      updateStats();
      const interval = setInterval(updateStats, 1500);
      return () => clearInterval(interval);
    }
  }, [bootStatus, activeWindow, selectedParts]);

  const availableParts = useMemo(() => {
    return CATALOG.filter(part => part.category === activeCategory);
  }, [activeCategory]);

  const togglePart = (part: PCComponent) => {
    setSelectedParts(prev => ({
      ...prev,
      [part.category]: part
    }));
  };

  const totalWattage = useMemo(() => {
    let sum = 0;
    Object.values(selectedParts).forEach(part => {
      // PSU doesn't consume its max wattage, it supplies it.
      if (part.category !== 'Power Supply') {
        sum += part.wattage;
      }
    });
    return sum;
  }, [selectedParts]);

  const powerSupply = selectedParts['Power Supply'] as PowerSupply | undefined;

  const isComplete = CATEGORIES.every(cat => selectedParts[cat] !== undefined);

  // --- BOOT LOGIC ---
  const handleBoot = async () => {
    if (!isComplete) return;
    
    setBootStatus('booting');
    setBootLogs([]);
    
    const logs: BootLog[] = [];
    const addLog = (message: string, status: 'pending' | 'ok' | 'error' = 'pending') => {
      const id = Math.random().toString();
      logs.push({ id, message, status });
      setBootLogs([...logs]);
      return id;
    };
    
    const updateLog = (id: string, status: 'ok' | 'error', appendMsg: string = '') => {
      const log = logs.find(l => l.id === id);
      if (log) {
        log.status = status;
        if (appendMsg) log.message += appendMsg;
        setBootLogs([...logs]);
      }
    };

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    await sleep(600);
    const powerLogId = addLog('Checking Power Supply Capacity...');
    await sleep(1000);

    let hasError = false;

    // 1. Check Power Supply
    if (powerSupply!.maxWattage >= totalWattage) {
      updateLog(powerLogId, 'ok', ` (Draw: ${totalWattage}W / ${powerSupply!.maxWattage}W)`);
    } else {
      updateLog(powerLogId, 'error', ` (Draw: ${totalWattage}W / ${powerSupply!.maxWattage}W) - INSUFFICIENT POWER`);
      hasError = true;
    }

    await sleep(600);
    const compLogId = addLog('Checking Component Compatibility...');
    await sleep(1000);

    const errors: string[] = [];
    const mb = selectedParts['Motherboard'] as Motherboard;
    const cpu = selectedParts['CPU'] as CPU;
    const gpu = selectedParts['GPU'] as GPU;
    const casePart = selectedParts['Case'] as Case;
    const cooler = selectedParts['Cooling'] as Cooling;
    const psu = selectedParts['Power Supply'] as PowerSupply;

    if (mb.socket !== cpu.socket) {
      errors.push(`CPU Socket (${cpu.socket}) does not match Motherboard (${mb.socket}).`);
    }
    if (!cooler.supportedSockets.includes(mb.socket)) {
      errors.push(`Cooler does not support Motherboard socket (${mb.socket}).`);
    }
    if (!casePart.supportedFormFactors.includes(mb.formFactor)) {
      errors.push(`Motherboard form factor (${mb.formFactor}) does not fit in Case.`);
    }
    if (gpu.lengthMm > casePart.maxGPULengthMm) {
      errors.push(`GPU (${gpu.lengthMm}mm) is too long for Case (max ${casePart.maxGPULengthMm}mm).`);
    }
    if (!casePart.supportedPSU.includes(psu.psuFormFactor)) {
      errors.push(`Case does not support ${psu.psuFormFactor} power supplies.`);
    }

    if (errors.length === 0) {
      updateLog(compLogId, 'ok', ' (All components compatible)');
    } else {
      updateLog(compLogId, 'error', ` (${errors.length} conflict(s) found)`);
      for (const err of errors) {
        await sleep(300);
        addLog(`- ${err}`, 'error');
      }
      hasError = true;
    }

    await sleep(800);
    if (!hasError) {
      addLog('Booting OS...', 'pending');
      await sleep(1000);
      
      setBootStatus('benchmarking');
      
      setBenchmarkProgress(10);
      setBenchmarkStage('Initialising Environment...');
      await sleep(800);
      
      setBenchmarkProgress(30);
      setBenchmarkStage('Testing CPU Rendering & Multitasking...');
      await sleep(1200);
      
      setBenchmarkProgress(60);
      setBenchmarkStage('Testing GPU Compute & Ray Tracing...');
      await sleep(1200);

      const storage = selectedParts['Storage'] as Storage;
      setBenchmarkProgress(85);
      setBenchmarkStage('Testing Memory & Storage I/O...');
      await sleep(1000);

      setBenchmarkProgress(100);
      setBenchmarkStage('Finalizing Scores...');
      await sleep(500);

      // Calculate score based on performance
      let cpuPerf = cpu.performance || 50;
      let gpuPerf = gpu.performance || 50;
      let storageBoost = storage.type === 'NVMe' ? 20 : (storage.type === 'SATA' ? 10 : 0);
      
      let gamingScore = Math.floor((gpuPerf * 0.7 + cpuPerf * 0.3) * 100);
      let productivityScore = Math.floor((cpuPerf * 0.6 + gpuPerf * 0.2 + storageBoost) * 100);
      
      // Bonus for optimal power supply (not too close, not massively overkill)
      const powerDiff = psu.maxWattage - totalWattage;
      const powerBonus = powerDiff >= 100 && powerDiff <= 400 ? 500 : 0;
      
      const overallScore = Math.floor((gamingScore + productivityScore) / 2) + powerBonus;

      setScores({
        gaming: gamingScore + Math.floor(powerBonus * 0.5),
        productivity: productivityScore + Math.floor(powerBonus * 0.5),
        overall: overallScore
      });

      // 10 points = $1
      setMoney(prev => prev + Math.floor(overallScore / 10));

      setBootStatus('success');
    } else {
      setBootStatus('failure');
    }
  };

  const resetBuild = () => {
    setSelectedParts({});
    setBootStatus('idle');
    setBootLogs([]);
    setScores({ gaming: 0, productivity: 0, overall: 0 });
    setBenchmarkProgress(0);
    setBenchmarkStage('');
    setActiveCategory('Motherboard');
    setActiveWindow('none');
  };

  if (gameplayMode === 'menu') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center gap-6">
          <CircuitBoard className="w-16 h-16 text-indigo-400" />
          <h1 className="text-4xl font-black tracking-tight text-white m-0 text-center">RIG BUILDER</h1>
          <p className="text-slate-400 text-center mb-4">Choose your gameplay mode to start assembling components.</p>

          <button 
             onClick={() => { setGameplayMode('normal'); resetBuild(); }}
             className="w-full py-4 px-6 rounded-xl font-bold transition-all bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg space-y-1 flex flex-col items-center group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-300"></div>
            <div className="text-xl relative z-10">Normal Mode</div>
            <div className="text-xs text-indigo-200 font-normal relative z-10">Start limited, earn money by fulfilling benchmarks</div>
          </button>
          
          <button 
             onClick={() => { setGameplayMode('sandbox'); resetBuild(); }}
             className="w-full py-4 px-6 rounded-xl font-bold transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg space-y-1 flex flex-col items-center group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-300"></div>
            <div className="text-xl relative z-10">Sandbox Mode</div>
            <div className="text-xs text-emerald-100 font-normal relative z-10">Unlimited funds and all components unlocked</div>
          </button>
        </div>
      </div>
    );
  }

  if (bootStatus === 'os') {
    return (
      <div className="min-h-screen bg-black flex flex-col font-sans relative overflow-hidden select-none">
        {/* Desktop Wallpaper */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Desktop Area */}
        <div className="relative z-10 flex-1 p-4 flex flex-col gap-4 items-start content-start flex-wrap">
          <div className="w-20 p-2 flex flex-col items-center gap-1.5 rounded hover:bg-white/10 cursor-pointer transition-colors text-center"
               onClick={() => setActiveWindow('mypc')}>
            <div className="w-10 h-10 mb-1 flex items-center justify-center">
              <HardDrive className="w-8 h-8 text-slate-200" fill="currentColor" opacity={0.8} />
            </div>
            <span className="text-[11px] font-medium text-white shadow-black drop-shadow-md leading-tight">My PC</span>
          </div>

          <div className="w-20 p-2 flex flex-col items-center gap-1.5 rounded hover:bg-white/10 cursor-pointer transition-colors text-center"
               onClick={() => setActiveWindow('benchmark')}>
            <div className="w-10 h-10 mb-1 rounded bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center backdrop-blur-sm">
              <MonitorPlay className="w-6 h-6 text-indigo-300" />
            </div>
            <span className="text-[11px] font-medium text-white shadow-black drop-shadow-md leading-tight">Benchmark</span>
          </div>

          <div className="w-20 p-2 flex flex-col items-center gap-1.5 rounded hover:bg-white/10 cursor-pointer transition-colors text-center"
               onClick={() => setActiveWindow('taskmanager')}>
            <div className="w-10 h-10 mb-1 rounded bg-slate-800/80 border border-slate-600/50 flex items-center justify-center backdrop-blur-sm shadow-inner shadow-black/50">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[11px] font-medium text-white shadow-black drop-shadow-md leading-tight">Task Manager</span>
          </div>

          <div className="w-20 p-2 flex flex-col items-center gap-1.5 rounded hover:bg-white/10 cursor-pointer transition-colors text-center"
               onClick={() => setBootStatus('idle')}>
            <div className="w-10 h-10 mb-1 rounded bg-red-500/20 border border-red-400/50 flex items-center justify-center backdrop-blur-sm">
              <Power className="w-6 h-6 text-red-300" />
            </div>
            <span className="text-[11px] font-medium text-white shadow-black drop-shadow-md leading-tight">Shut Down</span>
          </div>
        </div>

        {/* OS Windows */}
        <AnimatePresence>
          {activeWindow === 'mypc' && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white text-slate-800 rounded-lg shadow-2xl overflow-hidden z-20 flex flex-col"
               style={{ maxHeight: '80vh' }}
            >
              <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 select-none">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <HardDrive className="w-4 h-4" /> System Properties
                </div>
                <button onClick={() => setActiveWindow('none')} className="hover:bg-red-500 hover:text-white p-1 rounded transition-colors">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto font-sans">
                 <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                   <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                     <Cpu className="w-8 h-8" />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Processor</p>
                     <p className="text-sm font-medium text-slate-900">{selectedParts['CPU']?.name}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                   <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                     <MonitorPlay className="w-8 h-8" />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Graphics</p>
                     <p className="text-sm font-medium text-slate-900">{selectedParts['GPU']?.name}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                   <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                     <CircuitBoard className="w-8 h-8" />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Motherboard</p>
                     <p className="text-sm font-medium text-slate-900">{selectedParts['Motherboard']?.name}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                     <HardDrive className="w-8 h-8" />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Storage</p>
                     <p className="text-sm font-medium text-slate-900">{selectedParts['Storage']?.name} ({(selectedParts['Storage'] as Storage)?.type})</p>
                   </div>
                 </div>
                 <div className="mt-4 bg-slate-50 p-3 rounded text-xs text-slate-600">
                    <p><strong>Cooling:</strong> {selectedParts['Cooling']?.name}</p>
                    <p><strong>Chassis:</strong> {selectedParts['Case']?.name}</p>
                    <p><strong>Power:</strong> {selectedParts['Power Supply']?.name}</p>
                 </div>
              </div>
            </motion.div>
          )}

          {activeWindow === 'benchmark' && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-slate-900 text-slate-200 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-20 flex flex-col"
            >
              <div className="bg-slate-800 px-4 py-2 flex items-center justify-between select-none">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <MonitorPlay className="w-4 h-4 text-indigo-400" /> Benchmark Results
                </div>
                <button onClick={() => setActiveWindow('none')} className="hover:text-red-400 p-1 rounded transition-colors text-slate-400">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 flex flex-col items-center font-mono">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] mb-4 bg-slate-950">
                   <MonitorPlay className="w-10 h-10 text-indigo-400" />
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Overall Score</p>
                <p className="text-5xl text-white font-black mb-6">{scores.overall.toLocaleString()}</p>
                
                <div className="w-full flex justify-between items-center text-sm mb-3">
                  <span className="text-slate-400">Gaming:</span>
                  <span className="text-emerald-400 font-bold">{scores.gaming.toLocaleString()} pts</span>
                </div>
                <div className="w-full flex justify-between items-center text-sm">
                  <span className="text-slate-400">Productivity:</span>
                  <span className="text-purple-400 font-bold">{scores.productivity.toLocaleString()} pts</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeWindow === 'taskmanager' && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white text-slate-800 border border-slate-200 rounded-lg shadow-2xl overflow-hidden z-20 flex flex-col"
            >
              <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 select-none">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Activity className="w-4 h-4 text-emerald-600" /> Task Manager
                </div>
                <button onClick={() => setActiveWindow('none')} className="hover:bg-red-500 hover:text-white p-1 rounded transition-colors text-slate-500">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 bg-white flex flex-col gap-4 font-sans text-sm">
                 <div className="flex flex-col gap-1">
                   <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">CPU Usage</span>
                      <span className={`${usageStats.cpu > 80 ? 'text-red-500' : 'text-slate-600'}`}>{usageStats.cpu}%</span>
                   </div>
                   <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${usageStats.cpu > 80 ? 'bg-red-500' : usageStats.cpu > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${usageStats.cpu}%` }}></div>
                   </div>
                   <p className="text-[10px] text-slate-400 uppercase">{selectedParts['CPU']?.name}</p>
                 </div>

                 <div className="flex flex-col gap-1">
                   <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">GPU Usage</span>
                      <span className={`${usageStats.gpu > 80 ? 'text-red-500' : 'text-slate-600'}`}>{usageStats.gpu}%</span>
                   </div>
                   <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${usageStats.gpu > 80 ? 'bg-red-500' : usageStats.gpu > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${usageStats.gpu}%` }}></div>
                   </div>
                   <p className="text-[10px] text-slate-400 uppercase">{selectedParts['GPU']?.name}</p>
                 </div>

                 <div className="flex flex-col gap-1">
                   <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">Memory (RAM)</span>
                      <span className={`${usageStats.ram > 80 ? 'text-red-500' : 'text-slate-600'}`}>{usageStats.ram}%</span>
                   </div>
                   <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 p-[1px]`} >
                        <div className={`h-full rounded-full ${usageStats.ram > 80 ? 'bg-red-500' : usageStats.ram > 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${usageStats.ram}%` }}></div>
                      </div>
                   </div>
                   <p className="text-[10px] text-slate-400 uppercase">System Memory Pool</p>
                 </div>

                 <div className="flex flex-col gap-1">
                   <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">Disk I/O ({((selectedParts['Storage'] as Storage)?.type)})</span>
                      <span className={`${usageStats.disk > 80 ? 'text-red-500' : 'text-slate-600'}`}>{usageStats.disk}%</span>
                   </div>
                   <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-100 ${usageStats.disk > 80 ? 'bg-red-500' : usageStats.disk > 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${usageStats.disk}%` }}></div>
                   </div>
                   <p className="text-[10px] text-slate-400 uppercase">{selectedParts['Storage']?.name}</p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Taskbar */}
        <div className="h-12 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 z-30 flex items-center px-3 justify-between relative shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 h-full py-2">
            <button 
              className="h-full aspect-square flex items-center justify-center hover:bg-white/10 rounded-md transition-colors"
              onClick={resetBuild}
              title="Start Menu / Power Off"
            >
              <div className="flex flex-wrap w-4 h-4 gap-[2px]">
                 <div className="w-[7px] h-[7px] bg-cyan-400 rounded-sm"></div>
                 <div className="w-[7px] h-[7px] bg-cyan-400 rounded-sm"></div>
                 <div className="w-[7px] h-[7px] bg-cyan-400 rounded-sm"></div>
                 <div className="w-[7px] h-[7px] bg-cyan-400 rounded-sm"></div>
              </div>
            </button>
            <button 
              className={`px-3 h-full flex items-center justify-center text-xs text-white hover:bg-white/10 rounded-md transition-colors ${activeWindow === 'mypc' || activeWindow === 'benchmark' || activeWindow === 'taskmanager' ? 'bg-white/10 border-b-2 border-indigo-400' : ''}`}
              onClick={() => setActiveWindow(activeWindow !== 'none' ? 'none' : 'mypc')}
            >
              {activeWindow !== 'none' ? 'Close Window' : 'Apps'}
            </button>
          </div>
          <div className="flex bg-slate-900 border border-white/10 rounded overflow-hidden">
             
          </div>
          <div className="flex items-center text-xs text-white font-medium px-3 py-1 hover:bg-white/10 rounded-md transition-colors">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  if (bootStatus === 'booting' || bootStatus === 'benchmarking' || bootStatus === 'success' || bootStatus === 'failure') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-6 font-mono relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-white/5 px-4 py-3 flex items-center gap-3 border-b border-white/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="font-semibold text-xs tracking-widest text-slate-400 uppercase">BIOS BOOT SEQUENCE</span>
          </div>

          <div className="p-6 space-y-4 min-h-[300px]">
            <AnimatePresence>
              {bootLogs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-indigo-400 mt-0.5">{'>'}</span>
                  <p className={`
                    ${log.status === 'error' ? 'text-red-400' : ''}
                    ${log.status === 'ok' ? 'text-emerald-400' : ''}
                    ${log.status === 'pending' ? 'text-slate-300 animate-pulse' : ''}
                  `}>
                    {log.message}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {bootStatus === 'benchmarking' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-6 border-t border-white/10 text-center"
              >
                <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-4 animate-pulse">
                  <MonitorPlay className="w-12 h-12 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">RUNNING DIAGNOSTICS</h2>
                <p className="text-slate-400 mb-6">{benchmarkStage}</p>
                
                <div className="w-full max-w-sm mx-auto h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${benchmarkProgress}%` }}
                    transition={{ ease: "easeInOut", duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-indigo-300 mt-2 font-mono">{benchmarkProgress}%</p>
              </motion.div>
            )}

            {bootStatus === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 pt-6 border-t border-white/10 text-center"
              >
                <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">BENCHMARK COMPLETE</h2>
                <p className="text-slate-400 mb-6">All systems nominal. Performance data generated.</p>
                
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
                    <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-widest">GAMING</p>
                    <p className="text-3xl font-black text-indigo-400">{scores.gaming.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
                    <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-widest">PRODUCTIVITY</p>
                    <p className="text-3xl font-black text-purple-400">{scores.productivity.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 bg-emerald-500/10 backdrop-blur-md rounded-xl p-6 border border-emerald-500/30 text-center ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] mb-4">
                    <p className="text-sm text-emerald-400 mb-1 font-bold uppercase tracking-widest">OVERALL SCORE</p>
                    <p className="text-5xl font-black text-emerald-400">{scores.overall.toLocaleString()}</p>
                  </div>

                  <div className="col-span-2 bg-indigo-500/10 backdrop-blur-md rounded-xl p-4 border border-indigo-500/30 text-center flex justify-between items-center px-8 flex-row">
                    <div className="text-left">
                       <p className="text-xs text-indigo-300 mb-1 font-bold uppercase tracking-widest">Performance Payout</p>
                       <p className="text-[10px] text-slate-400">10 Pts = $1</p>
                    </div>
                    <p className="text-3xl font-black text-emerald-400">+${Math.floor(scores.overall / 10).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => setBootStatus('os')}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    <MonitorPlay className="w-5 h-5" /> Boot into OS
                  </button>
                  <button 
                    onClick={resetBuild}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> New Build
                  </button>
                </div>
              </motion.div>
            )}

            {bootStatus === 'failure' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-6 border-t border-white/10 text-center"
              >
                <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-4">
                  <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-red-400 mb-2">SYSTEM BOOT FAILED</h2>
                <p className="text-slate-400 mb-8">Hardware conflict or power failure prevented boot.</p>

                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => setBootStatus('idle')}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Revise Build
                  </button>
                  <button 
                    onClick={resetBuild}
                    className="px-6 py-3 border border-white/10 hover:bg-white/10 text-slate-300 rounded-lg font-bold transition-colors flex items-center gap-2 relative bg-white/5"
                  >
                    Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col overflow-hidden relative">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>

      <header className="flex items-center justify-between px-8 py-6 z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CircuitBoard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">RIG BUILDER <span className="text-indigo-400 text-sm font-medium ml-2 hidden sm:inline">PRO EDITION</span></h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest hidden sm:block">Component Compatibility Simulator</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-semibold">Funds</p>
            <p className="text-lg font-mono text-emerald-400 font-bold">
              {gameplayMode === 'sandbox' ? '∞' : `$${money.toLocaleString()}`}
            </p>
          </div>
          <div className="text-right border-l border-white/10 pl-6">
            <p className="text-xs text-slate-400 uppercase font-semibold">Parts Selected</p>
            <p className="text-lg font-mono text-indigo-300">{Object.keys(selectedParts).length} / {CATEGORIES.length}</p>
          </div>
          <div className="text-right border-l border-white/10 pl-6">
            <button onClick={() => setGameplayMode('menu')} className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-600 transition-colors">
               Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 z-10 max-w-[1400px] w-full mx-auto overflow-y-auto">
        
        {/* Left Column: Categories */}
        <aside className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Build Process</div>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map(category => {
              const Icon = CategoryIcons[category];
              const isSelected = activeCategory === category;
              const hasPart = !!selectedParts[category];

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-indigo-500/20 border border-indigo-500/40 backdrop-blur-sm ring-1 ring-indigo-500/30' 
                      : hasPart
                      ? 'bg-white/10 border border-white/20 backdrop-blur-sm'
                      : 'bg-white/5 border border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-300'}`} />
                    <span className={`text-sm ${isSelected ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>{category}</span>
                  </div>
                  {isSelected ? (
                    <span className="text-[10px] bg-indigo-500 px-2 py-0.5 rounded text-white font-bold ml-2">SELECTING</span>
                  ) : hasPart ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </div>
          
          <div className="mt-auto pt-6 hidden lg:block">
            <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">System State</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${isComplete ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                  {isComplete ? 'VALID' : 'PENDING'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isComplete ? 'All required components selected. Ready for initialization.' : 'Awaiting component selections to complete system build.'}
              </p>
            </div>
          </div>
        </aside>

        {/* Middle Column: Parts Inventory */}
        <section className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              Select {activeCategory}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {availableParts.map((part) => {
                const isSelected = selectedParts[activeCategory]?.id === part.id;
                const isUnlocked = gameplayMode === 'sandbox' || unlockedParts.has(part.id);
                
                return (
                  <motion.div
                    key={part.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      onClick={() => isUnlocked ? togglePart(part) : null}
                      className={`w-full h-full text-left p-5 rounded-2xl border transition-all relative flex flex-col ${
                        isSelected 
                          ? 'bg-white/10 border-white/20 backdrop-blur-sm ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20' 
                          : isUnlocked
                          ? 'bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 cursor-pointer group'
                          : 'bg-white/5 border-white/10 backdrop-blur-sm opacity-80 cursor-default'
                      }`}
                    >
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-10 p-4 pointer-events-auto">
                            <Lock className="w-8 h-8 text-slate-400 mb-2 drop-shadow-md" />
                            <p className="text-white font-bold mb-3 drop-shadow-md">LOCKED</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (money >= part.price) {
                                  setMoney(prev => prev - part.price);
                                  setUnlockedParts(prev => new Set([...prev, part.id]));
                                }
                              }}
                              disabled={money < part.price}
                              className={`px-4 py-2 rounded-lg font-bold text-sm w-full transition-colors shadow-lg ${
                                money >= part.price ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700'
                              }`}
                            >
                              Unlock for ${part.price}
                            </button>
                        </div>
                      )}
                      
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-indigo-400">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-bold mb-1 text-lg pr-8">
                          {part.name}
                        </h3>
                        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{part.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {part.category === 'Motherboard' && (
                            <>
                              <Badge>{(part as Motherboard).socket}</Badge>
                              <Badge>{(part as Motherboard).formFactor}</Badge>
                            </>
                          )}
                          {part.category === 'CPU' && (
                            <Badge>{(part as CPU).socket}</Badge>
                          )}
                          {part.category === 'GPU' && (
                            <Badge>{(part as GPU).lengthMm}mm</Badge>
                          )}
                          {part.category === 'Case' && (
                            <>
                              <Badge>Max GPU {(part as Case).maxGPULengthMm}mm</Badge>
                              <Badge>PSU {(part as Case).supportedPSU.join(', ')}</Badge>
                            </>
                          )}
                          {part.category === 'Power Supply' && (
                            <>
                              <Badge>{(part as PowerSupply).maxWattage}W</Badge>
                              <Badge>{(part as PowerSupply).psuFormFactor}</Badge>
                            </>
                          )}
                          {part.category === 'Cooling' && (
                            <Badge>Sockets {(part as Cooling).supportedSockets.join(', ')}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto w-full">
                        <span className="text-slate-400 font-mono text-sm">{part.wattage}W Draw</span>
                        <span className={`font-bold text-lg ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                          ${part.price}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        {/* Right Column: Build Summary */}
        <aside className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex-1 backdrop-blur-xl flex flex-col shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Build Analysis</h2>
            
            {/* Power Supply Meter */}
            <div className="mb-8">
              <div className="flex justify-between text-xs mb-2 font-bold uppercase">
                <span>Total Wattage</span>
                <span className="text-indigo-400">{totalWattage}W / {powerSupply ? powerSupply.maxWattage + 'W' : '---'}</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10 relative">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                  style={{ width: `${Math.min((totalWattage / (powerSupply ? powerSupply.maxWattage : 1000)) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic">
                {powerSupply && totalWattage > powerSupply.maxWattage 
                  ? <span className="text-red-400">Exceeds Capacity!</span> 
                  : `Headroom: ${powerSupply ? powerSupply.maxWattage - totalWattage : '---'}W`}
              </p>
            </div>
            
            {/* Configuration Specs */}
            <div className="space-y-4">
              {CATEGORIES.map(category => {
                const part = selectedParts[category];
                return (
                  <div key={category}>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{category}</p>
                    <p className={`text-sm font-semibold truncate ${part ? 'text-white' : 'text-slate-600 italic'}`}>
                      {part ? part.name : 'Unselected'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Total Price */}
            <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm text-slate-400 font-bold uppercase">Total Price</span>
              <span className="text-xl font-mono text-emerald-400 font-bold">
                 ${Object.values(selectedParts).reduce((sum, p) => sum + p.price, 0)}
              </span>
            </div>
          </div>

          <button 
            onClick={handleBoot}
            disabled={!isComplete}
            className={`w-full py-6 rounded-3xl font-black text-xl lg:text-2xl tracking-tighter transition-all uppercase ${
              isComplete 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-[#0f172a] shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-95' 
                : 'bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed'
            }`}
          >
            {isComplete ? 'Initialize Boot' : 'Missing Parts'}
          </button>
        </aside>

      </main>
    </div>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'ghost' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
      variant === 'default' 
        ? 'bg-white/10 text-slate-300 border border-white/10' 
        : 'bg-transparent text-slate-400 border border-white/10'
    }`}>
      {children}
    </span>
  );
}

