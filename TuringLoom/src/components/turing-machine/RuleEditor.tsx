import { useState } from 'react';
import { toast } from 'sonner';
import { TuringMachineRule, MoveDirection, TapeState } from '@/lib/types';
import { Button, Input, Select, Checkbox } from '@/components/ui';

import { Translation } from '@/lib/locales';

interface RuleEditorProps {
  rules: TuringMachineRule[];
  tapes: TapeState[];
  onAddRule: (rule: Omit<TuringMachineRule, 'id'>) => void;
  onUpdateRule: (rule: TuringMachineRule) => void;
  onRemoveRule: (ruleId: string) => void;
  language: 'zh' | 'en';
  translations: Translation;
}

  const validateRule = (rule: Omit<TuringMachineRule, 'id'>, language: 'zh' | 'en'): string | null => {
    if (!rule.currentState.trim()) {
      return language === 'zh' ? '当前状态不能为空' : 'Current state cannot be empty';
    }
    if (!rule.newState.trim()) {
      return language === 'zh' ? '新状态不能为空' : 'New state cannot be empty';
    }
    if (rule.writeSymbol.length > 1) {
      return language === 'zh' ? '写入符号只能是单个字符' : 'Write symbol must be a single character';
    }
    if (rule.readSymbol.length > 1) {
      return language === 'zh' ? '读取符号只能是单个字符' : 'Read symbol must be a single character';
    }
    return null;
  };

  const getDefaultRule = (language: 'zh' | 'en'): Omit<TuringMachineRule, 'id'> => ({
    name: language === 'zh' ? '新规则' : 'New Rule',
    tapeIndex: 0,
    currentState: 'q0',
    readSymbol: '0',
    readAny: false,
    stateAny: false,
    writeSymbol: '1',
    moveDirection: 'right',
    newState: 'q1',
    shouldHalt: false,
    nextRuleId: undefined,
  });

export default function RuleEditor({ 
  rules, 
  tapes,
  onAddRule, 
  onUpdateRule, 
  onRemoveRule,
  language,
  translations
}: RuleEditorProps) {
  const [newRule, setNewRule] = useState<Omit<TuringMachineRule, 'id'>>(getDefaultRule(language));
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editRule, setEditRule] = useState<Omit<TuringMachineRule, 'id'>>(getDefaultRule(language));

   const handleAddRule = () => {
    const validationError = validateRule(newRule, language);
    if (validationError) {
      toast.error(validationError, { position: 'top-right' });
      return;
    }
    onAddRule(newRule);
    setNewRule(getDefaultRule(language));
  };

  const handleEditRule = (rule: TuringMachineRule) => {
    setEditingRuleId(rule.id);
    setEditRule({
      name: rule.name,
      tapeIndex: rule.tapeIndex,
      currentState: rule.currentState,
      readSymbol: rule.readSymbol,
      readAny: rule.readAny,
      stateAny: rule.stateAny,
      writeSymbol: rule.writeSymbol,
      moveDirection: rule.moveDirection,
      newState: rule.newState,
      shouldHalt: rule.shouldHalt,
      nextRuleId: rule.nextRuleId,
    });
  };

   const handleSaveEdit = (ruleId: string) => {
    const validationError = validateRule(editRule, language);
    if (validationError) {
      toast.error(validationError, { position: 'top-right' });
      return;
    }
    onUpdateRule({
      id: ruleId,
      ...editRule,
    });
    setEditingRuleId(null);
  };

  const handleCancelEdit = () => {
    setEditingRuleId(null);
  };

  const tapeOptions = tapes.map((tape, i) => ({
    value: i,
    label: tape.name || (language === 'zh' ? `纸带 ${i}` : `Tape ${i}`)
  }));

  const moveDirectionOptions = [
    { value: 'left', label: language === 'zh' ? "左" : "Left" },
    { value: 'right', label: language === 'zh' ? "右" : "Right" },
    { value: 'stay', label: language === 'zh' ? "不动" : "Stay" },
  ];

  const getNextRuleOptions = (excludeId?: string) => {
    const filteredRules = excludeId ? rules.filter(r => r.id !== excludeId) : rules;
    return [
      { value: '', label: `${translations.no} (${language === 'zh' ? "自动匹配" : "Auto Match"})` },
      ...filteredRules.map(rule => ({ value: rule.id, label: rule.name }))
    ];
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className={`text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200 ${
            language === 'zh' ? 'font-sans' : 'font-mono'
          }`}>{translations.addRule}</h3>
        
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
           <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.ruleName}</label>
             <Input
               type="text"
               value={newRule.name}
               onChange={(e) => setNewRule({...newRule, name: e.target.value})}
             />
           </div>
           
           <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.tape}</label>
             <Select
               options={tapeOptions}
               value={newRule.tapeIndex}
               onChange={(e) => setNewRule({...newRule, tapeIndex: parseInt(e.target.value)})}
             />
           </div>
           
           <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.currentStateInput}</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  value={newRule.currentState}
                  onChange={(e) => setNewRule({...newRule, currentState: e.target.value})}  
                  disabled={newRule.stateAny}
                  className={newRule.stateAny ? 'opacity-50' : ''}
                  placeholder={language === 'zh' ? "例如 q0" : "e.g., q0"}
                />
                <Checkbox
                  checked={newRule.stateAny || false}
                  onChange={(e) => setNewRule({...newRule, stateAny: e.target.checked})}
                  label={language === 'zh' ? '任意' : 'Any'}
                />
              </div>
           </div>
           
            
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.readSymbol}</label>
               <div className="flex gap-2 items-center">
                 <Input
                   type="text"
                   value={newRule.readSymbol}
                   onChange={(e) => setNewRule({...newRule, readSymbol: e.target.value})}
                   disabled={newRule.readAny}
                   className={newRule.readAny ? 'opacity-50' : ''}
                   placeholder={language === 'zh' ? "例如 0" : "e.g., 0"}
                 />
                 <Checkbox
                   checked={newRule.readAny || false}
                   onChange={(e) => setNewRule({...newRule, readAny: e.target.checked})}
                   label={language === 'zh' ? '任意' : 'Any'}
                 />
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.writeSymbol}</label>
               <Input
                 type="text"
                 value={newRule.writeSymbol}
                 onChange={(e) => setNewRule({...newRule, writeSymbol: e.target.value})}
                 placeholder={language === 'zh' ? "例如 1" : "e.g., 1"}
               />
             </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.moveDirection}</label>
             <Select
               options={moveDirectionOptions}
               value={newRule.moveDirection}
               onChange={(e) => setNewRule({...newRule, moveDirection: e.target.value as MoveDirection})}
             />
           </div>
           
           <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.newStateInput}</label>
             <Input
               type="text"
               value={newRule.newState}
               onChange={(e) => setNewRule({...newRule, newState: e.target.value})}
               placeholder={language === 'zh' ? "例如 q1" : "e.g., q1"}
             />
            </div>
            
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.nextRule}</label>
               <Select
                 options={getNextRuleOptions()}
                 value={newRule.nextRuleId || ''}
                 onChange={(e) => setNewRule({...newRule, nextRuleId: e.target.value || undefined})}
               />
             </div>
            
            <div className="flex items-end">
             <Checkbox
               checked={newRule.shouldHalt}
               onChange={(e) => setNewRule({...newRule, shouldHalt: e.target.checked})}
               label={translations.shouldHalt}
             />
           </div>
         </div>
         
         <Button
           onClick={handleAddRule}
           fullWidth
           icon={<i className="fa-solid fa-plus"></i>}
         >
           {translations.addRule}
         </Button>
      </div>

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
                         <Input
                           type="text"
                           value={editRule.name}
                           onChange={(e) => setEditRule({...editRule, name: e.target.value})}
                           inputSize="sm"
                         />
                       </div>
                       
                       <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.tape}</label>
                         <Select
                           options={tapeOptions}
                           value={editRule.tapeIndex}
                           onChange={(e) => setEditRule({...editRule, tapeIndex: parseInt(e.target.value)})}
                           selectSize="sm"
                         />
                       </div>
                       
                       <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.currentStateInput}</label>
                         <div className="flex gap-2 items-center">
                           <Input
                             type="text"
                             value={editRule.currentState}
                             onChange={(e) => setEditRule({...editRule, currentState: e.target.value})}
                             disabled={editRule.stateAny}
                             inputSize="sm"
                             className={editRule.stateAny ? 'opacity-50' : ''}
                           />
                           <Checkbox
                             checked={editRule.stateAny || false}
                             onChange={(e) => setEditRule({...editRule, stateAny: e.target.checked})}
                             label={language === 'zh' ? '任意' : 'Any'}
                           />
                         </div>
                       </div>
                       
                        
                        <div>
               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.readSymbol}</label>
               <div className="flex gap-2 items-center">
                 <Input
                   type="text"
                   value={editRule.readSymbol}
                   onChange={(e) => setEditRule({...editRule, readSymbol: e.target.value})}
                   disabled={editRule.readAny}
                   inputSize="sm"
                   className={editRule.readAny ? 'opacity-50' : ''}
                 />
                 <Checkbox
                   checked={editRule.readAny || false}
                   onChange={(e) => setEditRule({...editRule, readAny: e.target.checked})}
                   label={language === 'zh' ? '任意' : 'Any'}
                 />
               </div>
             </div>
             
             <div>
               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.writeSymbol}</label>
               <Input
                 type="text"
                 value={editRule.writeSymbol}
                 onChange={(e) => setEditRule({...editRule, writeSymbol: e.target.value})}
                 inputSize="sm"
               />
             </div>
                        
                        <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.moveDirection}</label>
                         <Select
                           options={moveDirectionOptions}
                           value={editRule.moveDirection}
                           onChange={(e) => setEditRule({...editRule, moveDirection: e.target.value as MoveDirection})}
                           selectSize="sm"
                         />
                       </div>
                       
                       <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.newStateInput}</label>
                         <Input
                           type="text"
                           value={editRule.newState}
                           onChange={(e) => setEditRule({...editRule, newState: e.target.value})}
                           inputSize="sm"
                         />
                        </div>
                        
                        <div>
               <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{translations.nextRule}</label>
               <Select
                 options={getNextRuleOptions(editingRuleId)}
                 value={editRule.nextRuleId || ''}
                 onChange={(e) => setEditRule({...editRule, nextRuleId: e.target.value || undefined})}
                 selectSize="sm"
               />
             </div>
                        
                        <div className="flex items-end">
                         <Checkbox
                           checked={editRule.shouldHalt}
                           onChange={(e) => setEditRule({...editRule, shouldHalt: e.target.checked})}
                           label={translations.shouldHalt}
                         />
                       </div>
                     </div>
                     
                     <div className="flex gap-2 mt-3">
                       <Button
                         onClick={() => handleSaveEdit(rule.id)}
                         variant="success"
                         size="sm"
                         fullWidth
                       >
                        {translations.save}
                       </Button>
                       <Button
                         onClick={handleCancelEdit}
                         variant="secondary"
                         size="sm"
                         fullWidth
                       >
                        {translations.cancel}
                       </Button>
                     </div>
                   </div>
                 ) : (
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                     <div>
                       <h4 className="font-medium text-slate-900 dark:text-slate-100">{rule.name}</h4>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                             <span className="mr-2"><strong>{language === 'zh' ? '读取:' : 'Read:'}</strong> {rule.readAny ? (language === 'zh' ? '任意' : 'Any') : rule.readSymbol}</span>
                             <span className="mr-2"><strong>{language === 'zh' ? '写入:' : 'Write:'}</strong> {rule.writeSymbol}</span>
                             <span className="mr-2"><strong>{language === 'zh' ? '状态:' : 'State:'}</strong> {rule.stateAny ? (language === 'zh' ? '任意' : 'Any') : rule.currentState} → {rule.newState}</span>
                            {rule.nextRuleId && (
                              <span className="mr-2"><strong>→</strong> {rules.find(r => r.id === rule.nextRuleId)?.name || (language === 'zh' ? '未知' : 'Unknown')}</span>)}
                            {rule.shouldHalt && <span className="text-red-500"><strong>→ {language === 'zh' ? '停机' : 'Halt'}</strong></span>}
                        </div>
                     </div>
                     <div className="flex gap-1">
                       <Button
                         onClick={() => handleEditRule(rule)}
                         variant="ghost"
                         size="icon"
                         className="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                         title={language === 'zh' ? '编辑规则' : 'Edit Rule'}
                       >
                         <i className="fa-solid fa-pen"></i>
                       </Button>
                       <Button
                         onClick={() => onRemoveRule(rule.id)}
                         variant="ghost"
                         size="icon"
                         className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                         title={language === 'zh' ? '删除规则' : 'Delete Rule'}
                       >
                         <i className="fa-solid fa-trash"></i>
                       </Button>
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
