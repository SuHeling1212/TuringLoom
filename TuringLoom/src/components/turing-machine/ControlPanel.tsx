import { useState } from 'react';
import { TuringMachineRule, TapeState, MoveDirection } from '@/lib/types';
import { toast } from 'sonner';
import { Button, Select } from '@/components/ui';

import { Translation } from '@/lib/locales';

interface ImportData {
  rules: TuringMachineRule[];
  tapeTypes?: Array<{
    id: string;
    name: string;
  }>;
}

interface ControlPanelProps {
  isRunning: boolean;
  isHalted: boolean;
  onStep: () => void;
  onRun: () => void;
  onReset: () => void;
  rules: TuringMachineRule[];
  speed: string;
  onSpeedChange: (speed: string) => void;
  onImportRules: (data: ImportData) => void;
  tapes: TapeState[];
  language: 'zh' | 'en';
  translations: Translation;
  onImportTapes: () => void;
}

export default function ControlPanel({ 
  isRunning, 
  isHalted,
  onStep, 
  onRun, 
  onReset,
  rules,
  speed,
  onSpeedChange,
  onImportRules,
  tapes,
  language,
  translations,
}: ControlPanelProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [importContent, setImportContent] = useState<string | null>(null);

  if (!translations) {
    console.error("translations prop is missing");
    return null;
  }

  const handleExportRules = async () => {
    try {
      if (!rules || rules.length === 0) {
        toast.warning(language === 'zh' ? '没有可导出的规则' : 'No rules to export', { position: 'top-right' });
        return;
      }
      
      const exportData = {
        rules: rules.map(rule => ({
          ...rule,
          readSymbol: rule.readAny ? '' : rule.readSymbol,
          currentState: rule.stateAny ? '' : rule.currentState
        })),
        tapeTypes: tapes.map(tape => ({
          id: tape.id,
          name: tape.name,
          type: tape.type,
          initialContent: tape.initialContent
        }))
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      
      const response = await fetch('/api/file/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: jsonString })
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        toast.success(`${language === 'zh' ? '规则已导出到' : 'Rules exported to'}: ${result.path}`, { position: 'top-right' });
      } else if (result.status === 'cancelled') {
        toast.info(language === 'zh' ? '已取消导出' : 'Export cancelled', { position: 'top-right' });
      } else {
        toast.error(`${language === 'zh' ? '导出失败' : 'Export failed'}: ${result.error}`, { position: 'top-right' });
      }
    } catch (error) {
      console.error('导出规则失败:', error);
      toast.error(language === 'zh' ? '导出失败，请重试' : 'Export failed', { position: 'top-right' });
    }
  };

  const importRules = async () => {
    try {
      const response = await fetch('/api/file/import');
      const result = await response.json();
      
      if (result.status === 'cancelled') {
        toast.info(language === 'zh' ? '已取消导入' : 'Import cancelled', { position: 'top-right' });
        return;
      }
      
      if (result.status === 'error') {
        toast.error(`${language === 'zh' ? '导入失败' : 'Import failed'}: ${result.error}`, { position: 'top-right' });
        return;
      }
      
      if (result.status === 'success' && result.content) {
        setImportContent(result.content);
        setShowConfirmModal(true);
      }
    } catch (error) {
      console.error('导入规则失败:', error);
      toast.error(language === 'zh' ? '导入失败，请重试' : 'Import failed', { position: 'top-right' });
    }
  };

   const handleConfirmImport = () => {
    if (!importContent) return;
    
    try {
      const importData = JSON.parse(importContent);
      
      if (!importData || typeof importData !== 'object' || !Array.isArray(importData.rules)) {
        throw new Error(language === 'zh' ? '导入的规则格式不正确，缺少规则数组' : 'Invalid format: missing rules array');
      }
      
      onImportRules(importData);
      toast.success(`${language === 'zh' ? '成功导入' : 'Successfully imported'} ${importData.rules.length} ${language === 'zh' ? '条规则' : 'rules'}`, { position: 'top-right' });
    } catch (parseError) {
      console.error('解析规则失败:', parseError);
      toast.error(`${language === 'zh' ? '解析规则失败' : 'Parse failed'}: ${(parseError as Error).message}`, { position: 'top-right' });
    }
    
    setShowConfirmModal(false);
    setImportContent(null);
  };

  const handleCancelImport = () => {
    toast.info(language === 'zh' ? '已取消导入' : 'Import cancelled', { position: 'top-right' });
    setShowConfirmModal(false);
    setImportContent(null);
  };

  const speedOptions = [
    { value: 'slow', label: translations.slow },
    { value: 'medium', label: translations.medium },
    { value: 'fast', label: translations.fast },
    { value: 'very-fast', label: translations.veryFast },
  ];

  return (
    <>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center">
                <i className="fa-solid fa-exclamation-circle text-blue-500 mr-2"></i>
                {language === 'zh' ? '确认导入' : 'Confirm Import'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {language === 'zh' ? '加载文件将清除当前所有规则。是否继续？' : 'Loading will clear all current rules. Continue?'}
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={handleCancelImport}>
                  {language === 'zh' ? '取消' : 'Cancel'}
                </Button>
                <Button variant="primary" onClick={handleConfirmImport}>
                  {language === 'zh' ? '继续' : 'Continue'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={onStep}
              disabled={isRunning || isHalted}
              icon={<i className="fa-solid fa-step-forward"></i>}
            >
              <span>{translations.step}</span>
            </Button>
            
            <Button
              variant={isRunning ? 'danger' : 'success'}
              onClick={onRun}
              disabled={isHalted}
              icon={isRunning ? <i className="fa-solid fa-stop"></i> : <i className="fa-solid fa-play"></i>}
            >
              <span>{isRunning ? translations.stop : translations.run}</span>
            </Button>
            
            <Button
              variant="secondary"
              onClick={onReset}
              icon={<i className="fa-solid fa-rotate-left"></i>}
            >
              <span>{translations.reset}</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-tachometer-alt text-slate-500 dark:text-slate-400"></i>
              <span>{translations.speed}:</span>
              <Select
                options={speedOptions}
                value={speed}
                onChange={(e) => onSpeedChange(e.target.value)}
                disabled={isRunning}
                selectSize="sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost"
                size="icon"
                onClick={importRules}
                title={translations.import}
              >
                <i className="fa-solid fa-file-import"></i>
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleExportRules}
                title={translations.exportRules}
              >
                <i className="fa-solid fa-file-export"></i>
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                className="relative group"
              >
                <i className="fa-solid fa-share-alt" title={translations.importRules}></i>
                <span className="absolute bottom-full right-0 mb-2 w-max bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {language === 'zh' ? '功能正在开发' : 'Coming soon'}
                </span>
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => {
                  try {
                    if (!tapes || tapes.length === 0) {
                      toast.error(language === 'zh' ? '请先添加至少一个纸带' : 'Please add at least one tape first', { position: 'top-right' });
                      return;
                    }
                    
                    const validTapeIndex = 0;
                    
                    const baseId = Date.now();
                    const exampleRules: TuringMachineRule[] = [
                      {
                        "name": language === 'zh' ? "转换0为1" : "Convert 0 to 1",
                        "tapeIndex": validTapeIndex,
                        "currentState": "q0",
                        "readSymbol": "0",
                        "writeSymbol": "1",
                        "moveDirection": "right" as MoveDirection,
                        "newState": "q0",
                        "shouldHalt": false,
                        "id": `rule-${baseId}-1`
                      }
                    ];
                    
                    if (typeof onImportRules === 'function') {
                      onImportRules({ rules: exampleRules });
                      toast.success(language === 'zh' ? '已加载示例规则' : 'Example rules loaded', { position: 'top-right' });
                    } else {
                      toast.error(language === 'zh' ? '导入功能未初始化' : 'Import function not initialized', { position: 'top-right' });
                    }
                  } catch (error) {
                    console.error('加载示例规则失败:', error);
                    toast.error(language === 'zh' ? '加载示例规则失败' : 'Failed to load example rules', { position: 'top-right' });
                  }
                }}
              >
                <i className="fa-solid fa-book" title={translations.example}></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
