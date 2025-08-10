import { useState } from 'react';
import { TuringMachineRule } from '@/lib/types';
import { TapeState } from '@/lib/types';
import { toast } from 'sonner';

import { Translation } from '@/lib/locales';

interface ControlPanelProps {
  isRunning: boolean;
  isHalted: boolean;
  onStep: () => void;
  onRun: () => void;
  onReset: () => void;
  rules: TuringMachineRule[];
  speed: string;
  onSpeedChange: (speed: string) => void;
  onImportRules: (rules: TuringMachineRule[]) => void;
  tapes: TapeState[];
  language: 'zh' | 'en';
  translations: Translation;
}







const exportRules = (rules: TuringMachineRule[], tapes: TapeState[]) => {
  try {
    // 检查是否有规则可导出
    if (!rules || rules.length === 0) {
      toast.warning('没有可导出的规则', { position: 'top-right' });
      return;
    }
    
    // 创建JSON字符串，添加缩进以提高可读性
     // 添加纸带类型信息到导出数据
    const exportData = {
      rules,
      tapeTypes: tapes.map(tape => ({
        id: tape.id,
        name: tape.name,
        type: tape.type
      }))
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // 设置文件名，包含当前日期以便区分
    const date = new Date().toISOString().split('T')[0];
    a.download = `turing-machine-rules-${date}.json`;
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 显示成功消息
    toast.success('规则已成功导出', { position: 'top-right' });
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('导出规则失败:', error);
    toast.error('导出失败，请重试', { position: 'top-right' });
  }
};

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
  // 状态管理：确认弹窗和要导入的文件
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>(null);

  if (!translations) {
    console.error("translations prop is missing");
    return null;
  }

  // 导入规则文件
  const importRules = () => {
    try {
      // 创建文件输入元素
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      
      // 文件选择变化时处理
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          toast.warning('未选择文件', { position: 'top-right' });
          return;
        }
        
        // 设置要导入的文件并显示确认弹窗
        setFileToImport(file);
        setShowConfirmModal(true);
      };
      
      // 触发文件选择对话框
      fileInput.click();
    } catch (error) {
      console.error('导入规则失败:', error);
      toast.error('导入失败，请重试', { position: 'top-right' });
    }
  };

  const handleConfirmImport = () => {
    if (!fileToImport) return;
    
    // 读取文件内容
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedRules = JSON.parse(content) as TuringMachineRule[];
        
        // 验证导入的规则格式
        if (!Array.isArray(importedRules)) {
          throw new Error('导入的规则格式不正确');
        }
        
        // 调用导入回调函数
        onImportRules(importedRules);
        toast.success(`成功导入 ${importedRules.length} 条规则`, { position: 'top-right' });
      } catch (parseError) {
        console.error('解析规则失败:', parseError);
        toast.error('解析规则失败，请确保文件格式正确', { position: 'top-right' });
      }
    };
    
    reader.readAsText(fileToImport);
    setShowConfirmModal(false);
    setFileToImport(null);
  };

  const handleCancelImport = () => {
    toast.info('已取消导入', { position: 'top-right' });
    setShowConfirmModal(false);
    setFileToImport(null);
  };
  return (
    <>
      {/* 确认导入弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center">
                <i className="fa-solid fa-exclamation-circle text-blue-500 mr-2"></i>
                确认导入
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                加载文件将清除当前所有规则。是否继续？
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelImport}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                >
                  继续
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 控制面板主体 */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onStep}
              disabled={isRunning || isHalted}
              className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${
                isRunning || isHalted
                  ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <i className="fa-solid fa-step-forward"></i>
               <span>{translations.step}</span>
             </button>
             
             <button
               onClick={onRun}
               disabled={isHalted}
               className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${
                 isHalted
                   ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
                   : isRunning
                   ? 'bg-red-600 hover:bg-red-700 text-white'
                   : 'bg-green-600 hover:bg-green-700 text-white'
               }`}
             >
               {isRunning ? (
                 <>
                   <i className="fa-solid fa-stop"></i>
                   <span>{translations.stop}</span>
                 </>
               ) : (
                 <>
                   <i className="fa-solid fa-play"></i>
                   <span>{translations.run}</span>
                 </>
               )}
             </button>
             
             <button
               onClick={onReset}
               className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md font-medium flex items-center gap-2 transition-colors"
             >
               <i className="fa-solid fa-rotate-left"></i>
               <span>{translations.reset}</span>
             </button>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
        <i className="fa-solid fa-tachometer-alt text-slate-500 dark:text-slate-400"></i>
                <span>{translations.speed}:</span>
               <select 
                 className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={speed}
                 onChange={(e) => onSpeedChange(e.target.value)}
                 disabled={isRunning}
               >
                 <option value="slow">{translations.slow}</option>
                  <option value="medium">{translations.medium}</option>
                 <option value="fast">{translations.fast}</option>
                 <option value="very-fast">{translations.veryFast}</option>
               </select>
             </div>
             
             <div className="flex items-center gap-2">
               <button 
                 onClick={importRules}
                 className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" 
                 title={translations.import}
               >
                <i className="fa-solid fa-file-import" title={translations.import}></i>
               </button>
                <button 
                   onClick={() => exportRules(rules, tapes)}
                   aria-label={translations.exportRules}
                  className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all transform hover:scale-105 active:scale-95"
                >
                <i className="fa-solid fa-file-export" title={translations.exportRules}></i>
              </button>
              <button className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative group">
                <i className="fa-solid fa-share-alt" title={translations.importRules}></i>
               <span className="absolute bottom-full right-0 mb-2 w-max bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                 {language === 'zh' ? '功能正在开发' : 'Coming soon'}
               </span>
             </button>
              <button 
                className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                onClick={() => {
                  try {
                    // 检查是否有可用纸带
                    if (!tapes || tapes.length === 0) {
                      toast.error(language === 'zh' ? '请先添加至少一个纸带' : 'Please add at least one tape first', { position: 'top-right' });
                      return;
                    }
                    
                    // 使用有效的纸带索引 (第一个纸带)
                    const validTapeIndex = 0;
                    
      // 生成唯一ID的示例规则 - 将所有0转换为1
      const baseId = Date.now();
      const exampleRules = [
        {
          "name": language === 'zh' ? "转换0为1" : "Convert 0 to 1",
          "tapeIndex": validTapeIndex,
          "currentState": "q0",
          "readSymbol": "0",
          "writeSymbol": "1",
          "moveDirection": "right",
          "newState": "q0",
          "shouldHalt": false,
          "id": `rule-${baseId}-1`
        }
      ];
                    
                    if (onImportRules) {
                      onImportRules(exampleRules);
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}