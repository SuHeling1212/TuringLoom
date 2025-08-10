import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { TapeState, TuringMachineRule } from '@/lib/types';
import RuleEditor from '@/components/turing-machine/RuleEditor';
import TapeSimulator from '@/components/turing-machine/TapeSimulator';
import ControlPanel from '@/components/turing-machine/ControlPanel';

import { getTranslation } from '@/lib/locales';

export default function Home() {
  // 语言选择状态管理
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'zh' | 'en'>('zh');
  const [translations, setTranslations] = useState(getTranslation('zh'));
  // 初始化语言设置
  useEffect(() => {
    // 检查localStorage中是否有保存的语言偏好
    const savedLanguage = localStorage.getItem('preferredLanguage') as 'zh' | 'en';
    
    if (savedLanguage) {
      // 应用保存的语言偏好
      setCurrentLanguage(savedLanguage);
      setTranslations(getTranslation(savedLanguage));
    } else {
      // 显示语言选择界面
      setShowLanguageSelector(true);
    }
  }, []);
  
  // 处理语言选择
  const handleLanguageSelect = (lang: 'zh' | 'en') => {
    setCurrentLanguage(lang);
    setTranslations(getTranslation(lang));
    localStorage.setItem('preferredLanguage', lang);
    setShowLanguageSelector(false);
  };
  
  // 切换语言处理函数 - 保留现有切换按钮功能
  const toggleLanguage = () => {
    const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
    setCurrentLanguage(newLang);
    setTranslations(getTranslation(newLang));
    localStorage.setItem('preferredLanguage', newLang);
  };
  // Initial tape state with 20 cells and head in the middle
  const [initialTapeContent, setInitialTapeContent] = useState('00000000000000000000');
  const [tapes, setTapes] = useState<TapeState[]>([
    {
      id: 'tape-1',
      name: 'Main Tape',
      cells: initialTapeContent.split(''),
      headPosition: Math.min(10, initialTapeContent.length - 1),
    },
  ]);
  
  // Initial empty rules array
  const [rules, setRules] = useState<TuringMachineRule[]>([]);
  
   // Simulation state
   const [currentState, setCurrentState] = useState('q0');
   const [isRunning, setIsRunning] = useState(false);
   const [isHalted, setIsHalted] = useState(false);
   
   // Refs to track running and halted states in callbacks
   const isRunningRef = useRef(isRunning);
   const isHaltedRef = useRef(isHalted);
  
  // Add a new rule
  const addRule = (rule: Omit<TuringMachineRule, 'id'>) => {
    // 添加符号长度校验
    if (rule.writeSymbol.length !== 1) {
      toast.error('写入符号必须是单个字符', { position: 'top-right' });
      return;
    }
    
    const newRule: TuringMachineRule = {
      ...rule,
      id: `rule-${Date.now()}`,
    };
    setRules([...rules, newRule]);
  };

  // 改进的文件导入处理
  const handleImportRules = (importedRules: TuringMachineRule[]) => {
    if (!importedRules || importedRules.length === 0) {
      toast.error('导入的规则为空或格式不正确', { position: 'top-right' });
      return;
    }
    
    // 验证导入的规则格式并找出最大的纸带索引
    let maxTapeIndex = -1;
    const validRules = importedRules.filter((rule) => {
      // 基本验证
      const isValid = rule.currentState && 
                     rule.newState && 
                     rule.tapeIndex >= 0 &&
                     rule.writeSymbol.length === 1;
      
      // 跟踪最大纸带索引
      if (isValid && rule.tapeIndex > maxTapeIndex) {
        maxTapeIndex = rule.tapeIndex;
      }
      
      return isValid;
    });
    
    if (validRules.length === 0) {
      toast.error('导入的规则无效，请检查格式', { position: 'top-right' });
      return;
    }
    
    // 计算需要的纸带数量 (maxTapeIndex + 1) 并扩展纸带
    const requiredTapeCount = maxTapeIndex + 1;
    const currentTapeCount = tapes.length;
    
    if (requiredTapeCount > currentTapeCount) {
      const tapesToAdd = requiredTapeCount - currentTapeCount;
      // 添加所需的新纸带
      for (let i = 0; i < tapesToAdd; i++) {
        addTape();
      }
      toast.info(`已自动扩展纸带数量至 ${requiredTapeCount} 个`, { position: 'top-right' });
    }
    
    // 为导入的规则生成新的ID，避免冲突
    const rulesWithNewIds = validRules.map(rule => ({
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    setRules(rulesWithNewIds);
    setCurrentState('q0');
    setIsHalted(false);
    
    toast.success(`成功导入 ${validRules.length} 条规则`, { position: 'top-right' });
  };
  
  // Update an existing rule
  const updateRule = (updatedRule: TuringMachineRule) => {
    // 添加符号长度校验
    if (updatedRule.writeSymbol.length !== 1) {
      toast.error('写入符号必须是单个字符', { position: 'top-right' });
      return;
    }
    
    setRules(rules.map(rule => 
      rule.id === updatedRule.id ? updatedRule : rule
    ));
  };
  
  // Remove a rule
  const removeRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };
  
   // Add a new tape
  const addTape = () => {
     const newTape: TapeState = {
      id: `tape-${Date.now()}`, // Use timestamp for unique ID
      name: `${currentLanguage === 'zh' ? '纸带' : 'Tape'} ${tapes.length + 1}`,
      cells: initialTapeContent.padEnd(20, '0').split(''),
      headPosition: Math.min(10, initialTapeContent.length - 1),
    };
    setTapes([...tapes, newTape]);
  };

   // Delete a tape and renumber remaining tapes
  const handleDeleteTape = (tapeId: string): void => {
    // Ensure at least one tape remains
    if (tapes.length <= 1) {
      toast.error(translations.atLeastOneTape, { position: 'top-right' });
      return;
    }
    
    // Remove the tape with the given ID and update remaining tape names
    const updatedTapes = tapes
      .filter(tape => tape.id !== tapeId)
      .map((tape, index) => ({
        ...tape,
        name: `${currentLanguage === 'zh' ? '纸带' : 'Tape'} ${index + 1}`
      }));
    
    setTapes(updatedTapes);
    
    // Show success message
    toast.success(translations.tapeDeleted, { position: 'top-right' });
  };
  
  // 使用 useCallback 优化函数，避免不必要的数据重渲染
  const findCurrentRule = useCallback(() => {
    // 找到所有匹配当前状态的规则
    const candidateRules = rules.filter(rule => rule.currentState === currentState);
    
    if (candidateRules.length === 0) return null;
    
    // 尝试找到匹配符号的规则
    for (const rule of candidateRules) {
      const tape = tapes[rule.tapeIndex];
      if (!tape) continue;
      
      const currentSymbol = tape.cells[tape.headPosition];
      if (rule.readSymbol === currentSymbol) {
        return rule;
      }
    }
    
    // 没有匹配的规则时返回null
    return null;
  }, [rules, currentState, tapes]);

  // 改进的步进逻辑
  const handleStep = useCallback(() => {
    if (isHalted) return;
    
    const currentRule = findCurrentRule();
    
    if (!currentRule) {
      toast.error('未找到匹配的规则', { position: 'top-right' });
      setIsHalted(true);
      setIsRunning(false);
      return;
    }
    
    // 获取规则指定的纸带
    const currentTapeIndex = currentRule.tapeIndex;
    const currentTape = tapes[currentTapeIndex];
    
    if (!currentTape) {
      toast.error(`指定的纸带 ${currentTapeIndex + 1} 不存在`, { position: 'top-right' });
      setIsHalted(true);
      setIsRunning(false);
      return;
    }
    
    // 创建纸带的深拷贝
    const newTapes = [...tapes];
    const newTapeCells = [...currentTape.cells];
    
    // 写入新符号
    newTapeCells[currentTape.headPosition] = currentRule.writeSymbol;
    
    // 移动纸带头
    let newHeadPosition = currentTape.headPosition;
     switch (currentRule.moveDirection) {
      case 'left':
        newHeadPosition -= 1;
        break;
      case 'right':
        newHeadPosition += 1;
        break;
      case 'stay':
        break;
    }
    
    // 确保头位置有效
    newHeadPosition = Math.max(0, newHeadPosition);
    
    // 如果头位置超出当前纸带长度，扩展纸带
    if (newHeadPosition >= newTapeCells.length - 1) {
      // 添加新的空白符号
      newTapeCells.push('0');
    }
    
    // 更新纸带状态
    newTapes[currentTapeIndex] = {
      ...currentTape,
      cells: newTapeCells,
      headPosition: newHeadPosition
    };
    
    setTapes(newTapes);
    
    // 更新当前状态
    setCurrentState(currentRule.newState);
    
    // 检查是否应该停机
    if (currentRule.shouldHalt || currentRule.newState === 'halt') {
      setIsHalted(true);
      setIsRunning(false);
      toast.success('图灵机已停机', { position: 'top-right' });
    }
  }, [findCurrentRule, tapes, setIsHalted, setIsRunning]);

   // 模拟速度状态
   const [simulationSpeed, setSimulationSpeed] = useState<string>('medium');
   
   // 获取速度延迟
   const getSpeedDelay = useCallback(() => {
     switch (simulationSpeed) {
       case 'slow': return 1000;
       case 'medium': return 500;
       case 'fast': return 200;
       case 'very-fast': return 50;
       default: return 500;
     }
   }, [simulationSpeed]);
   
   // 模拟执行控制
   useEffect(() => {
     let interval: number;
     
     if (isRunning && !isHalted) {
       interval = window.setInterval(() => {
         handleStep();
       }, getSpeedDelay());
     }
     
     return () => {
       if (interval) window.clearInterval(interval);
     };
   }, [isRunning, isHalted, getSpeedDelay, handleStep]);
   
   // 处理速度变化
  const handleSpeedChange = (speed: string) => {
    const wasRunning = isRunning;
    
    // 如果正在运行，先停止再重启以应用新速度
    if (wasRunning) {
      setIsRunning(false);
    }
    
    setSimulationSpeed(speed);
    
    // 重启模拟
    if (wasRunning) {
      setTimeout(() => setIsRunning(true), 50);
    }
  };
  
  // 运行/停止模拟
  const handleRun = () => {
    if (!isRunning && isHalted) {
      handleReset();
    }
    setIsRunning(!isRunning);
  };
  
  // 重置模拟
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsHalted(false);
    setCurrentState('q0');
    // 重置纸带到初始状态
    setTapes(tapes.map(tape => ({
      ...tape,
      cells: initialTapeContent.padEnd(initialTapeContent.length || 20, '0').split(''),
      headPosition: Math.min(10, initialTapeContent.length - 1)
    })));
  }, [tapes, initialTapeContent]);

  // 模拟速度状态


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${
            currentLanguage === 'zh' ? 'font-sans' : 'font-mono'
          }`}>
            {translations.appTitle}
          </h1>
          <div className="flex items-center gap-2">
             <button 
              onClick={toggleLanguage}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md text-sm font-medium shadow-sm hover:shadow transition-all flex items-center"
            >
              <i className="fa-solid fa-globe mr-2"></i> {currentLanguage === 'zh' ? '中文' : 'English'}
            </button>
            <button 
              onClick={addTape}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm hover:shadow transition-all flex items-center"
            >
              <i className="fa-solid fa-plus mr-2"></i> {translations.newTape}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rule Editor Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <h2 className={`text-xl font-semibold text-slate-800 dark:text-slate-200 ${
              currentLanguage === 'zh' ? 'font-sans' : 'font-mono'
            }`}>{translations.ruleEditor}</h2>
          </div>
          <RuleEditor 
            rules={rules} 
            onAddRule={addRule}
            onUpdateRule={updateRule}
            onRemoveRule={removeRule}
            tapeCount={tapes.length}
            language={currentLanguage}
            translations={translations}
          />
        </div>

        {/* Tape Simulation Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
              <h2 className={`text-xl font-semibold text-slate-800 dark:text-slate-200 ${
                currentLanguage === 'zh' ? 'font-sans' : 'font-mono'
              }`}>{translations.tapeSimulation}</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={addTape}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium shadow-sm hover:shadow transition-all flex items-center"
                >
                  <i className="fa-solid fa-plus mr-1"></i> {translations.addTape}
                </button>
                <div className={`text-sm bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full ${
                  currentLanguage === 'zh' ? 'font-sans' : 'font-mono'
                }`}>
                   {translations.currentState}: <span className="font-medium">{currentState}</span>
                   {isHalted && <span className="ml-2 text-red-500">({translations.halted})</span>}
                 </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <label className={`text-sm font-medium text-slate-700 dark:text-slate-300 w-24 ${
                  currentLanguage === 'zh' ? 'font-sans' : 'font-mono'
                }`}>{translations.initialTapeContent}:</label>
                <input
                  type="text"
                  value={initialTapeContent}
                  onChange={(e) => setInitialTapeContent(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  placeholder={currentLanguage === 'zh' ? "输入初始纸带符号，例如00101" : "Enter initial tape symbols, e.g., 00101"}
                  maxLength={50}
                />
                <button
                  onClick={() => {
                    setTapes(tapes.map(tape => ({
                      ...tape,
                      cells: initialTapeContent.padEnd(initialTapeContent.length || 20, '0').split(''),
                      headPosition: Math.min(10, initialTapeContent.length - 1)
                    })));
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >  
                  {translations.applyInitialContent}
                </button>
              </div>
              <TapeSimulator tapes={tapes} onDeleteTape={handleDeleteTape} />
            </div>
          </div>

          {/* Control Panel */}
            <ControlPanel 
             isRunning={isRunning}
             isHalted={isHalted}
             onStep={handleStep}
             onRun={handleRun}
             onReset={handleReset}
             rules={rules}
             onImportRules={handleImportRules}
             speed={simulationSpeed}
             onSpeedChange={handleSpeedChange}
              language={currentLanguage}
              translations={translations || getTranslation(currentLanguage)}
              tapes={tapes}
            />
        </div>
      </main>

       {/* 语言选择模态框 */}


      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {translations.turingMachineSimulator} &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}