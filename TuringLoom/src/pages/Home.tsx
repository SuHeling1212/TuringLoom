import { useState, useEffect, useCallback } from 'react';
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
  const defaultInitialContent = '00000000000000000000';
  const [tapes, setTapes] = useState<TapeState[]>([
    {
      id: 'tape-1',
      type: '1d',
      name: 'Main Tape',
      initialContent: defaultInitialContent,
      cells: defaultInitialContent.split(''),
      headPosition: 0, // 初始位置设置为0，即初始内容的第一位
    },
  ]);
  
  // Initial empty rules array
  const [rules, setRules] = useState<TuringMachineRule[]>([]);
  
   // Simulation state
   const [currentState, setCurrentState] = useState('q0');
   const [isRunning, setIsRunning] = useState(false);
   const [isHalted, setIsHalted] = useState(false);
  
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
    // 定义导入数据的接口
    interface ImportData {
      rules: TuringMachineRule[];
      tapeTypes?: Array<{
        id: string;
        name: string;
        type?: string;
        initialContent?: string;
      }>;
    }

    const handleImportRules = (importedData: ImportData) => {
     if (!importedData || !importedData.rules || importedData.rules.length === 0) {
       toast.error('导入的规则为空或格式不正确', { position: 'top-right' });
       return;
     }
     
     // 处理导入的纸带类型
     if (importedData.tapeTypes && importedData.tapeTypes.length > 0) {
        // 创建新的纸带数组
         const newTapes: TapeState[] = importedData.tapeTypes.map((tapeType) => {
          // 获取导入的initialContent，如果没有则使用默认值
          const initialContent = tapeType.initialContent || defaultInitialContent;
          return {
            id: tapeType.id,
            name: tapeType.name,
            type: (tapeType.type as TapeState['type']) || '1d',
            initialContent: initialContent,
            cells: initialContent.split(''),
            headPosition: Math.min(10, initialContent.length - 1),
          };
        });
       
        // 更新纸带状态
       setTapes(newTapes);
       toast.info(`已导入 ${newTapes.length} 个纸带`, { position: 'top-right' });
     }
     
     // 验证导入的规则格式
     // 空字符串的 currentState/readSymbol 表示任意（配合 readAny/stateAny）
     const validRules = importedData.rules.filter((rule) => {
       // 基本验证：stateAny 为 true 时 currentState 可为空，否则必须有值
       const stateValid = rule.stateAny || (rule.currentState && rule.currentState.length > 0);
       // readAny 为 true 时 readSymbol 可为空，否则必须是单个字符
       const readValid = rule.readAny || (rule.readSymbol && rule.readSymbol.length === 1);
       return stateValid && 
              readValid &&
              rule.newState && 
              rule.tapeIndex >= 0 &&
              typeof rule.tapeIndex === 'number' &&
              rule.writeSymbol.length === 1;
     });
     
     if (validRules.length === 0) {
       toast.error('导入的规则无效，请检查格式', { position: 'top-right' });
       return;
     }
     
     // 为导入的规则生成新的ID，避免冲突
     // 同时处理 readAny/stateAny：空字符串时设置为 true
     const ruleIdMap: Record<string, string> = {};
     const rulesWithNewIds = validRules.map(rule => {
       const newId = `rule-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
       ruleIdMap[rule.id] = newId;
       return {
         ...rule,
         id: newId,
         // 空字符串时识别为任意
         readAny: rule.readAny || rule.readSymbol === '',
         stateAny: rule.stateAny || rule.currentState === '',
         nextRuleId: undefined
       };
     });
     
     // 更新规则引用
     const updatedRules = rulesWithNewIds.map(rule => {
       if (rule.nextRuleId && ruleIdMap[rule.nextRuleId]) {
         return {
           ...rule,
           nextRuleId: ruleIdMap[rule.nextRuleId]
         };
       }
       return rule;
     });
     
     setRules(updatedRules);
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
      type: '1d',
      name: `${currentLanguage === 'zh' ? '纸带' : 'Tape'} ${tapes.length}`,
      initialContent: defaultInitialContent,
      cells: defaultInitialContent.split(''), // 直接使用默认内容分割，不需要额外填充
      headPosition: 0, // 初始位置设置为0，即初始内容的第一位
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
    
    // Remove the tape with the given ID, keep other tape names unchanged
    const updatedTapes = tapes.filter(tape => tape.id !== tapeId);
    
    setTapes(updatedTapes);
    
    // Show success message
    toast.success(translations.tapeDeleted, { position: 'top-right' });
  };
  
  // 使用 useCallback 优化函数，避免不必要的数据重渲染
  const findMatchingRules = useCallback(() => {
    // 找到所有匹配当前状态和符号的规则
    const matchingRules: TuringMachineRule[] = [];
    
    for (const rule of rules) {
      // 检查规则是否匹配当前状态（stateAny 为 true 时匹配任意状态）
      if (!rule.stateAny && rule.currentState !== currentState) continue;
      
      // 获取规则对应的纸带
      const tape = tapes[rule.tapeIndex];
      if (!tape || typeof tape.headPosition !== 'number') continue;
      
    // 检查规则是否匹配当前符号（readAny 为 true 时匹配任意符号）
      const currentSymbol = tape.cells[tape.headPosition] || '0';
      if (rule.readAny || rule.readSymbol === currentSymbol) {
        matchingRules.push(rule);
      }
    }
    
    // 检测重复规则：相同状态+相同符号+相同纸带（考虑 readAny 和 stateAny）
    const ruleKeyMap = new Map<string, TuringMachineRule[]>();
    for (const rule of matchingRules) {
      // 生成 key：stateAny 时用 "*"，否则用实际状态；readAny 时用 "*"，否则用实际符号
      const stateKey = rule.stateAny ? '*' : rule.currentState;
      const symbolKey = rule.readAny ? '*' : rule.readSymbol;
      const key = `${stateKey}|${symbolKey}|${rule.tapeIndex}`;
      if (!ruleKeyMap.has(key)) {
        ruleKeyMap.set(key, []);
      }
      ruleKeyMap.get(key)!.push(rule);
    }
    
    // 查找重复的规则组
    for (const [key, rulesList] of ruleKeyMap) {
      if (rulesList.length > 1) {
        const ruleNames = rulesList.map(r => `"${r.name}"`).join(', ');
        return { matchingRules: [], hasDuplicate: true, duplicateRules: ruleNames, duplicateKey: key };
      }
    }
    
    return { matchingRules, hasDuplicate: false, duplicateRules: null, duplicateKey: null };
  }, [rules, currentState, tapes]);

  // 改进的步进逻辑 - 支持同时执行多个规则
  const handleStep = useCallback(() => {
    if (isHalted) return;
    
    const result = findMatchingRules();
    
    if (result.hasDuplicate) {
      const errorMsg = currentLanguage === 'zh' 
        ? `存在重复规则: ${result.duplicateRules}（相同状态、符号、纸带），无法确定执行哪个规则`
        : `Duplicate rules found: ${result.duplicateRules} (same state, symbol, tape), cannot determine which rule to execute`;
      toast.error(errorMsg, { position: 'top-right' });
      setIsHalted(true);
      setIsRunning(false);
      return;
    }
    
    const matchingRules = result.matchingRules;
    
    if (matchingRules.length === 0) {
      toast.error(currentLanguage === 'zh' ? '未找到匹配的规则' : 'No matching rules found', { position: 'top-right' });
      setIsHalted(true);
      setIsRunning(false);
      return;
    }
    
    // 创建纸带的深拷贝
    const newTapes = [...tapes];
    let newState = currentState;
    let shouldHalt = false;
    
    // 执行所有匹配的规则
    for (const rule of matchingRules) {
      // 获取规则指定的纸带
      const currentTapeIndex = rule.tapeIndex;
      const currentTape = newTapes[currentTapeIndex];
      
      if (!currentTape || typeof currentTape.headPosition !== 'number') {
        toast.error(currentLanguage === 'zh' ? `指定的纸带 ${currentTapeIndex + 1} 不存在` : `Tape ${currentTapeIndex + 1} does not exist`, { position: 'top-right' });
        continue;
      }
      
       // 创建纸带单元格的深拷贝
       let newTapeCells = [...currentTape.cells];
      
      // 写入新符号
      newTapeCells[currentTape.headPosition] = rule.writeSymbol;
      
      // 移动纸带头
      let newHeadPosition = currentTape.headPosition;
      switch (rule.moveDirection) {
        case 'left':
          newHeadPosition -= 1;
          break;
        case 'right':
          newHeadPosition += 1;
          break;
        case 'stay':
          break;
      }
      
       // 如果头位置为负数，向左扩展纸带
      if (newHeadPosition < 0) {
        // 在纸带左侧添加新的空白符号
        const numNewCells = Math.abs(newHeadPosition);
        const newCells = Array(numNewCells).fill('0').concat(newTapeCells);
        // 更新头位置为0
        newTapeCells = newCells;
        newHeadPosition = 0;
      }
      
      // 如果头位置超出当前纸带长度，向右扩展纸带
      if (newHeadPosition >= newTapeCells.length) {
        // 在纸带右侧添加新的空白符号
        const numNewCells = newHeadPosition - newTapeCells.length + 1;
        for (let i = 0; i < numNewCells; i++) {
          newTapeCells.push('0');
        }
      }
      
      // 更新纸带状态
      newTapes[currentTapeIndex] = {
        ...currentTape,
        cells: newTapeCells,
        headPosition: newHeadPosition
      };
      
      // 更新状态（如果规则指定了新状态）
      if (rule.newState) {
        newState = rule.newState;
      }
      
      // 检查是否应该停机
      if (rule.shouldHalt || rule.newState === 'halt') {
        shouldHalt = true;
      }
    }
    
    // 更新所有纸带
    setTapes(newTapes);
    
    // 更新当前状态
    setCurrentState(newState);
    
    // 检查是否应该停机
    if (shouldHalt) {
      setIsHalted(true);
      setIsRunning(false);
      toast.success(currentLanguage === 'zh' ? '图灵机已停机' : 'Turing machine halted', { position: 'top-right' });
     }
  }, [findMatchingRules, tapes, setIsHalted, setIsRunning, currentLanguage]);

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
   
  // 模拟执行控制 - 添加规则执行反馈
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
    
    // 重置纸带到各自的初始状态
    setTapes(tapes.map(tape => {
      const content = tape.initialContent || defaultInitialContent;
      return {
        ...tape,
         cells: content.padEnd(content.length || 20, '0').split(''),
        headPosition: 0 // 初始位置设置为0，即初始内容的第一位
      };
    }));
  }, [tapes]);
   
   // 处理纸带导入
   const handleImportTapes = () => {
     try {
       // 创建文件输入元素
       const fileInput = document.createElement('input');
       fileInput.type = 'file';
       fileInput.accept = '.json';
       
       // 文件选择变化时处理
       fileInput.onchange = (e) => {
         const file = (e.target as HTMLInputElement).files?.[0];
         if (!file) {
           toast.warning(translations.noFileSelected, { position: 'top-right' });
           return;
         }
         
         // 读取文件内容
         const reader = new FileReader();
         reader.onload = (event) => {
           try {
             const content = event.target?.result as string;
             const importedTapes = JSON.parse(content);
             
             // 验证导入的数据格式
             if (!Array.isArray(importedTapes)) {
               throw new Error(translations.invalidTapeFormat);
             }
             
              // 处理导入的纸带
              const newTapes: TapeState[] = importedTapes.map((tape: any, index: number) => ({
                id: `tape-imported-${Date.now()}-${index}`,
                type: '1d' as const,
                initialContent: tape.initialContent || defaultInitialContent,
                cells: tape.cells || (tape.initialContent || defaultInitialContent).padEnd(20, '0').split(''),
                headPosition: typeof tape.headPosition === 'number' ? tape.headPosition : 0,
                name: tape.name || `${currentLanguage === 'zh' ? '纸带' : 'Tape'} ${index}`
              }));
             
             // 更新纸带状态
             setTapes(newTapes);
             toast.success(`${translations.imported} ${newTapes.length} ${translations.tapes}`, { position: 'top-right' });
           } catch (parseError) {
             console.error('解析纸带失败:', parseError);
             toast.error(`${translations.failedToImportTapes}: ${(parseError as Error).message}`, { position: 'top-right' });
           }
         };
         
         reader.readAsText(file);
       };
       
       // 触发文件选择对话框
       fileInput.click();
     } catch (error) {
       console.error('导入纸带失败:', error);
       toast.error(translations.failedToImportTapes, { position: 'top-right' });
     }
   };

  // 设置单个纸带的初始内容并立即应用
  const handleSetInitialContent = (tapeId: string, content: string) => {
    // 确保内容不为空，使用默认值作为后备
    const validContent = content || defaultInitialContent;
    
    setTapes(tapes.map(tape => 
      tape.id === tapeId 
        ? { 
            ...tape, 
            initialContent: content,
            // 立即更新cells数组以显示变化
            cells: validContent.split(''),
             // 设置纸带头位置到初始内容的第一位
            headPosition: 0
          }
        : tape
    ));
  };


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
            tapes={tapes}
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
               <TapeSimulator 
                 tapes={tapes} 
                 onDeleteTape={handleDeleteTape} 
                 onSetInitialContent={handleSetInitialContent}
                 language={currentLanguage}
                 translations={translations}
               />
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
              translations={translations}
              tapes={tapes}
              onImportTapes={handleImportTapes}
             />
        </div>
      </main>

        {/* 语言选择模态框 */}
        {showLanguageSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md p-6 transform transition-all duration-300 scale-100">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-slate-200">{translations.welcome}</h2>
              <p className="text-center text-slate-600 dark:text-slate-400 mb-8">{translations.selectLanguagePrompt}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleLanguageSelect('zh')}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors text-lg"
                >
                  {translations.chinese}
                </button>
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors text-lg"
                >
                  {translations.english}
                </button>
              </div>
            </div>
          </div>
        )}


      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {translations.turingMachineSimulator} &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}