import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { TapeState, TuringMachineRule } from '@/lib/types';
import RuleEditor from '@/components/turing-machine/RuleEditor';
import TapeSimulator from '@/components/turing-machine/TapeSimulator';
import ControlPanel from '@/components/turing-machine/ControlPanel';
import { Button } from '@/components/ui';
import * as api from '@/lib/api';

import { getTranslation } from '@/lib/locales';

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return window.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      window.localStorage?.setItem(key, value);
    } catch {
    }
  }
};

export default function Home() {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'zh' | 'en'>('zh');
  const [translations, setTranslations] = useState(getTranslation('zh'));
  useEffect(() => {
    const savedLanguage = safeLocalStorage.getItem('preferredLanguage') as 'zh' | 'en' | null;
    
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      setTranslations(getTranslation(savedLanguage));
    } else {
      setShowLanguageSelector(true);
    }
  }, []);
  
  const handleLanguageSelect = (lang: 'zh' | 'en') => {
    setCurrentLanguage(lang);
    setTranslations(getTranslation(lang));
    safeLocalStorage.setItem('preferredLanguage', lang);
    setShowLanguageSelector(false);
  };
  
  const toggleLanguage = () => {
    const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
    setCurrentLanguage(newLang);
    setTranslations(getTranslation(newLang));
    safeLocalStorage.setItem('preferredLanguage', newLang);
  };
  
  const defaultInitialContent = '00000000000000000000';
  const [tapes, setTapes] = useState<TapeState[]>([
    {
      id: 'tape-1',
      type: '1d',
      name: 'Main Tape',
      initialContent: defaultInitialContent,
      cells: defaultInitialContent.split(''),
      headPosition: 0,
    },
  ]);
  
  const [rules, setRules] = useState<TuringMachineRule[]>([]);
  
   const [currentState, setCurrentState] = useState('q0');
   const [isRunning, setIsRunning] = useState(false);
   const [isHalted, setIsHalted] = useState(false);
  
  const addRule = (rule: Omit<TuringMachineRule, 'id'>) => {
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
     
     if (importedData.tapeTypes && importedData.tapeTypes.length > 0) {
         const newTapes: TapeState[] = importedData.tapeTypes.map((tapeType) => {
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
       
       setTapes(newTapes);
       toast.info(`已导入 ${newTapes.length} 个纸带`, { position: 'top-right' });
     }
     
     const validRules = importedData.rules.filter((rule) => {
       const stateValid = rule.stateAny || (rule.currentState && rule.currentState.length > 0);
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
     
     const ruleIdMap: Record<string, string> = {};
     const rulesWithNewIds = validRules.map(rule => {
       const newId = `rule-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
       ruleIdMap[rule.id] = newId;
       return {
         ...rule,
         id: newId,
         readAny: rule.readAny || rule.readSymbol === '',
         stateAny: rule.stateAny || rule.currentState === '',
         nextRuleId: undefined
       };
     });
     
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
  
  const updateRule = (updatedRule: TuringMachineRule) => {
    if (updatedRule.writeSymbol.length !== 1) {
      toast.error('写入符号必须是单个字符', { position: 'top-right' });
      return;
    }
    
    setRules(rules.map(rule => 
      rule.id === updatedRule.id ? updatedRule : rule
    ));
  };
  
  const removeRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };
  
    const addTape = () => {
     const newTape: TapeState = {
      id: `tape-${Date.now()}`,
      type: '1d',
      name: `${currentLanguage === 'zh' ? '纸带' : 'Tape'} ${tapes.length}`,
      initialContent: defaultInitialContent,
      cells: defaultInitialContent.split(''),
      headPosition: 0,
    };
    setTapes([...tapes, newTape]);
  };

   const handleDeleteTape = (tapeId: string): void => {
    if (tapes.length <= 1) {
      toast.error(translations.atLeastOneTape, { position: 'top-right' });
      return;
    }
    
    const updatedTapes = tapes.filter(tape => tape.id !== tapeId);
    
    setTapes(updatedTapes);
    
    toast.success(translations.tapeDeleted, { position: 'top-right' });
  };
  
  const handleStep = useCallback(async () => {
    if (isHalted) return;
    
    try {
      const response = await api.step({
        rules,
        tapes,
        currentState,
      });
      
      if (!response.success) {
        if (response.duplicateRules && response.duplicateRules.length > 0) {
          const errorMsg = currentLanguage === 'zh'
            ? `存在重复规则: ${response.duplicateRules.join(', ')}（相同状态、符号、纸带），无法确定执行哪个规则`
            : `Duplicate rules found: ${response.duplicateRules.join(', ')} (same state, symbol, tape), cannot determine which rule to execute`;
          toast.error(errorMsg, { position: 'top-right' });
        } else {
          toast.error(response.message, { position: 'top-right' });
        }
        setIsHalted(true);
        setIsRunning(false);
        return;
      }
      
      setTapes(response.tapes);
      setCurrentState(response.finalState);
      
      if (response.halted) {
        setIsHalted(true);
        setIsRunning(false);
        toast.success(currentLanguage === 'zh' ? '图灵机已停机' : 'Turing machine halted', { position: 'top-right' });
      }
    } catch (error) {
      toast.error(currentLanguage === 'zh' ? 'API调用失败' : 'API call failed', { position: 'top-right' });
      setIsRunning(false);
    }
  }, [rules, tapes, currentState, isHalted, currentLanguage]);

   const [simulationSpeed, setSimulationSpeed] = useState<string>('medium');
   
   const getSpeedDelay = useCallback(() => {
     switch (simulationSpeed) {
       case 'slow': return 1000;
       case 'medium': return 500;
       case 'fast': return 200;
       case 'very-fast': return 50;
       default: return 500;
     }
   }, [simulationSpeed]);
   
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
   
   const handleSpeedChange = (speed: string) => {
    const wasRunning = isRunning;
    
    if (wasRunning) {
      setIsRunning(false);
    }
    
    setSimulationSpeed(speed);
    
    if (wasRunning) {
      setTimeout(() => setIsRunning(true), 50);
    }
  };
  
  const handleRun = () => {
    if (!isRunning && isHalted) {
      handleReset();
    }
    setIsRunning(!isRunning);
  };
  
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsHalted(false);
    setCurrentState('q0');
    
    setTapes(tapes.map(tape => {
      const content = tape.initialContent || defaultInitialContent;
      return {
        ...tape,
         cells: content.padEnd(content.length || 20, '0').split(''),
        headPosition: 0
      };
    }));
  }, [tapes]);
   
   const handleImportTapes = () => {
     try {
       const fileInput = document.createElement('input');
       fileInput.type = 'file';
       fileInput.accept = '.json';
       
       fileInput.onchange = (e) => {
         const file = (e.target as HTMLInputElement).files?.[0];
         if (!file) {
           toast.warning(translations.noFileSelected, { position: 'top-right' });
           return;
         }
         
         const reader = new FileReader();
         reader.onload = (event) => {
           try {
             const content = event.target?.result as string;
             const importedTapes = JSON.parse(content);
             
             if (!Array.isArray(importedTapes)) {
               throw new Error(translations.invalidTapeFormat);
             }
             
              const newTapes: TapeState[] = importedTapes.map((tape: any, index: number) => ({
                id: `tape-imported-${Date.now()}-${index}`,
                type: '1d' as const,
                initialContent: tape.initialContent || defaultInitialContent,
                cells: tape.cells || (tape.initialContent || defaultInitialContent).padEnd(20, '0').split(''),
                headPosition: typeof tape.headPosition === 'number' ? tape.headPosition : 0,
                name: tape.name || `${currentLanguage === 'zh' ? '纸带' : 'Tape'} ${index}`
              }));
             
             setTapes(newTapes);
             toast.success(`${translations.imported} ${newTapes.length} ${translations.tapes}`, { position: 'top-right' });
           } catch (parseError) {
             console.error('解析纸带失败:', parseError);
             toast.error(`${translations.failedToImportTapes}: ${(parseError as Error).message}`, { position: 'top-right' });
           }
         };
         
         reader.readAsText(file);
       };
       
       fileInput.click();
     } catch (error) {
       console.error('导入纸带失败:', error);
       toast.error(translations.failedToImportTapes, { position: 'top-right' });
     }
   };

  const handleSetInitialContent = (tapeId: string, content: string) => {
    setTapes(tapes.map(tape => 
      tape.id === tapeId 
        ? { 
            ...tape, 
            initialContent: content,
          }
        : tape
    ));
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold text-blue-600 ${
            currentLanguage === 'zh' ? 'font-sans' : 'font-mono'
          }`}>
            {translations.appTitle}
          </h1>
          <div className="flex items-center gap-2">
             <Button 
              variant="secondary"
              onClick={toggleLanguage}
              icon={<i className="fa-solid fa-globe"></i>}
            >
              {currentLanguage === 'zh' ? '中文' : 'English'}
            </Button>
            <Button 
              variant="primary"
              onClick={addTape}
              icon={<i className="fa-solid fa-plus"></i>}
            >
              {translations.newTape}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
              <h2 className={`text-xl font-semibold text-slate-800 dark:text-slate-200 ${
                currentLanguage === 'zh' ? 'font-sans' : 'font-mono'
              }`}>{translations.tapeSimulation}</h2>
              <div className="flex items-center gap-3">
                <Button 
                  variant="success"
                  size="sm"
                  onClick={addTape}
                  icon={<i className="fa-solid fa-plus"></i>}
                >
                  {translations.addTape}
                </Button>
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
                 isRunning={isRunning}
                 isHalted={isHalted}
               />
            </div>
          </div>

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

        {showLanguageSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md p-6 transform transition-all duration-300 scale-100">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-slate-200">{translations.welcome}</h2>
              <p className="text-center text-slate-600 dark:text-slate-400 mb-8">{translations.selectLanguagePrompt}</p>
              <div className="flex gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => handleLanguageSelect('zh')}
                >
                  {translations.chinese}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => handleLanguageSelect('en')}
                >
                  {translations.english}
                </Button>
              </div>
            </div>
          </div>
        )}


      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {translations.turingMachineSimulator} &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
