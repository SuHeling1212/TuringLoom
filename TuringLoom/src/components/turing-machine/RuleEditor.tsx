import { useState } from 'react';
import { TuringMachineRule, MoveDirection } from '@/lib/types';

import { Translation } from '@/lib/locales';

interface RuleEditorProps {
  rules: TuringMachineRule[];
  tapeCount: number;
  onAddRule: (rule: Omit<TuringMachineRule, 'id'>) => void;
  onUpdateRule: (rule: TuringMachineRule) => void;
  onRemoveRule: (ruleId: string) => void;
  language: 'zh' | 'en';
  translations: Translation;
}

// Default values for a new rule
const DEFAULT_RULE: Omit<TuringMachineRule, 'id'> = {
  name: 'New Rule',
  tapeIndex: 0,
  currentState: 'q0',
  readSymbol: '0',
  writeSymbol: '1',
  moveDirection: 'right',
  newState: 'q1',
  shouldHalt: false,
  nextRuleId: undefined,
};

export default function RuleEditor({ 
  rules, 
  tapeCount,
  onAddRule, 
  onUpdateRule, 
  onRemoveRule,
  language,
  translations
}: RuleEditorProps) {
  const [newRule, setNewRule] = useState<Omit<TuringMachineRule, 'id'>>(DEFAULT_RULE);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editRule, setEditRule] = useState<Omit<TuringMachineRule, 'id'>>(DEFAULT_RULE);

  const handleAddRule = () => {
    onAddRule(newRule);
    setNewRule(DEFAULT_RULE); // Reset form
  };

  const handleEditRule = (rule: TuringMachineRule) => {
    setEditingRuleId(rule.id);
    setEditRule({
      name: rule.name,
      tapeIndex: rule.tapeIndex,
      currentState: rule.currentState,
      readSymbol: rule.readSymbol,
      writeSymbol: rule.writeSymbol,
      moveDirection: rule.moveDirection,
      newState: rule.newState,
      shouldHalt: rule.shouldHalt,
      nextRuleId: rule.nextRuleId,
    });
  };

  const handleSaveEdit = (ruleId: string) => {
    onUpdateRule({
      id: ruleId,
      ...editRule,
    });
    setEditingRuleId(null);
  };

  const handleCancelEdit = () => {
    setEditingRuleId(null);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Add New Rule Form */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className={`text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200 ${
            language === 'zh' ? 'font-sans' : 'font-mono'
          }`}>{translations.addRule}</h3>
        
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
           <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.ruleName}</label>
             <input
               type="text"
               value={newRule.name}
               onChange={(e) => setNewRule({...newRule, name: e.target.value})}
               className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
             />
           </div>
           
           <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.tape}</label>
             <select
               value={newRule.tapeIndex}
               onChange={(e) => setNewRule({...newRule, tapeIndex: parseInt(e.target.value)})}
               className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
             >
               {Array.from({ length: tapeCount }).map((_, i) => (
                 <option key={i} value={i}>{language === 'zh' ? `纸带 ${i + 1}` : `Tape ${i + 1}`}</option>
               ))}
             </select>
           </div>
           
           <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.currentStateInput}</label>
             <input
               type="text"
               value={newRule.currentState}
               onChange={(e) => setNewRule({...newRule, currentState: e.target.value})}  
               className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
               placeholder={language === 'zh' ? "例如 q0" : "e.g., q0"}
             />
           </div>
           
            
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.readSymbol}</label>
               <input
                 type="text"
                 value={newRule.readSymbol}
                 onChange={(e) => setNewRule({...newRule, readSymbol: e.target.value})}
                 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                 placeholder={language === 'zh' ? "例如 0" : "e.g., 0"}
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.writeSymbol}</label>
               <input
                 type="text"
                 value={newRule.writeSymbol}
                 onChange={(e) => setNewRule({...newRule, writeSymbol: e.target.value})}
                 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                 placeholder={language === 'zh' ? "例如 1" : "e.g., 1"}
               />
             </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.moveDirection}</label>
             <select
               value={newRule.moveDirection}
               onChange={(e) => setNewRule({...newRule, moveDirection: e.target.value as MoveDirection})}
               className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
             >
                  <option value="left">{language === 'zh' ? "左" : "Left"}</option>
                 <option value="right">{language === 'zh' ? "右" : "Right"}</option>
                <option value="stay">{language === 'zh' ? "不动" : "Stay"}</option>
             </select>
           </div>
           
           <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.newStateInput}</label>
             <input
               type="text"
               value={newRule.newState}
               onChange={(e) => setNewRule({...newRule, newState: e.target.value})}
               className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
               placeholder={language === 'zh' ? "例如 q1" : "e.g., q1"}
             />
            </div>
            
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.nextRule}</label>
               <select
                 value={newRule.nextRuleId || ''}
                 onChange={(e) => setNewRule({...newRule, nextRuleId: e.target.value || undefined})}
                 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
               >
                 <option value="">{translations.no} ({language === 'zh' ? "自动匹配" : "Auto Match"})</option>
                 {rules.map(rule => (
                   <option key={rule.id} value={rule.id}>{rule.name}</option>
                 ))}
               </select>
             </div>
            
            <div className="flex items-end">
             <label className="flex items-center space-x-2">
               <input
                 type="checkbox"
                 checked={newRule.shouldHalt}
                 onChange={(e) => setNewRule({...newRule, shouldHalt: e.target.checked})}
                 className="rounded text-blue-600 focus:ring-blue-500"
               />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{translations.shouldHalt}</span>
             </label>
           </div>
         </div>
         
         <button
           onClick={handleAddRule}
           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
         >
            <i className="fa-solid fa-plus mr-2"></i> {translations.addRule}
         </button>
      </div>

       {/* Existing Rules List */}
       <div>
          <h3 className={`text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200 ${
            language === 'zh' ? 'font-sans' : 'font-mono'
          }`}>{translations.definedRules} ({rules.length})</h3>
        
         {rules.length === 0 ? (
           <div className="text-center py-6 text-slate-500 dark:text-slate-400">
             <i className="fa-regular fa-file-code text-3xl mb-2"></i>
              <p>{translations.noRulesDefined}</p>
              <p className="text-sm mt-1">{translations.addYourFirstRule}</p>
           </div>
         ) : (
           <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
             {rules.map((rule) => (
               <div 
                 key={rule.id} 
                 className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
               >
                 {editingRuleId === rule.id ? (
                   <div className="space-y-3">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       <div>
                         <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.ruleName}</label>
                         <input
                           type="text"
                           value={editRule.name}
                           onChange={(e) => setEditRule({...editRule, name: e.target.value})}
                           className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                         />
                       </div>
                       
                       <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.tape}</label>
                         <select
                           value={editRule.tapeIndex}
                           onChange={(e) => setEditRule({...editRule, tapeIndex: parseInt(e.target.value)})}
                           className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                         >
                           {Array.from({ length: tapeCount }).map((_, i) => (
                             <option key={i} value={i}>{language === 'zh' ? `纸带 ${i + 1}` : `Tape ${i + 
1}`}</option>
                           ))}
                         </select>
                       </div>
                       
                       <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.currentStateInput}</label>
                         <input
                           type="text"
                           value={editRule.currentState}
                           onChange={(e) => setEditRule({...editRule, currentState: e.target.value})}
                           className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                         />
                       </div>
                       
                        
                        <div>
               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.readSymbol}</label>
               <input
                 type="text"
                 value={editRule.readSymbol}
                 onChange={(e) => setEditRule({...editRule, readSymbol: e.target.value})}
                 className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
               />
             </div>
             
             <div>
               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.writeSymbol}</label>
               <input
                 type="text"
                 value={editRule.writeSymbol}
                 onChange={(e) => setEditRule({...editRule, writeSymbol: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
               />
             </div>
                        
                        <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.moveDirection}</label>
                         <select
                           value={editRule.moveDirection}
                           onChange={(e) => setEditRule({...editRule, moveDirection: e.target.value as MoveDirection})}
                           className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                         >
                 <option value="left">{language === 'zh' ? "左" : "Left"}</option>
                <option value="right">{language === 'zh' ? "右" : "Right"}</option>
                <option value="stay">{language === 'zh' ? "不动" : "Stay"}</option>
                         </select>
                       </div>
                       
                       <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.newStateInput}</label>
                         <input
                           type="text"
                           value={editRule.newState}
                           onChange={(e) => setEditRule({...editRule, newState: e.target.value})}
                           className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                         />
                        </div>
                        
                        <div>
               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.nextRule}</label>
               <select
                 value={editRule.nextRuleId || ''}
                 onChange={(e) => setEditRule({...editRule, nextRuleId: e.target.value || undefined})}
                 className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                 
               >
                 <option value="">{translations.no}</option>
                 {rules.filter(r => r.id !== editingRuleId).map(rule => (
                   <option key={rule.id} value={rule.id}>{rule.name}</option>
                 ))}
               </select>
             </div>
                        
                        <div className="flex items-end">
                         <label className="flex items-center space-x-2">
                           <input
                             type="checkbox"
                             checked={editRule.shouldHalt}
                             onChange={(e) => setEditRule({...editRule, shouldHalt: e.target.checked})}
                             className="rounded text-blue-600 focus:ring-blue-500"
                           />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{translations.shouldHalt}</span>
                         </label>
                       </div>
                     </div>
                     
                     <div className="flex gap-2 mt-3">
                       <button
                         onClick={() => handleSaveEdit(rule.id)}
                         className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-2 rounded-md transition-colors"
                       >
                        {translations.save}
                       </button>
                       <button
                         onClick={handleCancelEdit}
                         className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-sm font-medium py-1 px-2 rounded-md transition-colors"
                       >
                        {translations.cancel}
                       </button>
                     </div>
                   </div>
                 ) : (
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                     <div>
                       <h4 className="font-medium text-slate-900 dark:text-slate-100">{rule.name}</h4>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                             <span className="mr-2"><strong>{language === 'zh' ? '读取:' : 'Read:'}</strong> {rule.readSymbol}</span>
                             <span className="mr-2"><strong>{language === 'zh' ? '写入:' : 'Write:'}</strong> {rule.writeSymbol}</span>
                             <span className="mr-2"><strong>{language === 'zh' ? '状态:' : 'State:'}</strong> {rule.currentState} → {rule.newState}</span>
                            {rule.nextRuleId && (
                              <span className="mr-2"><strong>→</strong> {rules.find(r => r.id === rule.nextRuleId)?.name || (language === 'zh' ? '未知' : 'Unknown')}</span>)}
                            {rule.shouldHalt && <span className="text-red-500"><strong>→ {language === 'zh' ? '停机' : 'Halt'}</strong></span>}
                        </div>
                     </div>
                     <div className="flex gap-1">
                       <button
                         onClick={() => handleEditRule(rule)}
                         className="p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 rounded transition-colors"
                          title={language === 'zh' ? '编辑规则' : 'Edit Rule'}
                       >
                         <i className="fa-solid fa-pen"></i>
                       </button>
                       <button
                         onClick={() => onRemoveRule(rule.id)}
                         className="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 rounded transition-colors"
                          title={language === 'zh' ? '删除规则' : 'Delete Rule'}
                       >
                         <i className="fa-solid fa-trash"></i>
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             ))}
           </div>
         )}
       </div>
    </div>
  );
}