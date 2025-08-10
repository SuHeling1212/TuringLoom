export interface Translation {
  appTitle: string;
  ruleEditor: string;
  tapeSimulation: string;
  currentState: string;
  halted: string;
  addTape: string;
  newTape: string;
  initialTapeContent: string;
  applyInitialContent: string;
  controlPanel: string;
  step: string;
  run: string;
  stop: string;
  reset: string;
  speed: string;
  slow: string;
  medium: string;
  fast: string;
  veryFast: string;
  import: string;
  export: string;
  example: string;
  addRule: string;
  ruleName: string;
  tape: string;
  currentStateInput: string;
  readSymbol: string;
  writeSymbol: string;
  moveDirection: string;
  newStateInput: string;
  nextRule: string;
  no: string;
  shouldHalt: string;
  definedRules: string;
  noRulesDefined: string;
  addYourFirstRule: string;
  save: string;
  cancel: string;
  delete: string;
  confirm: string;
  tapeIsEmpty: string;
  setInitialContent: string;
  atLeastOneTape: string;
  tapeDeleted: string;
  importRules: string;
  exportRules: string;
  exampleRulesLoaded: string;
  turingMachineSimulator: string;
  language: string;
  selectLanguage: string;
  chinese: string;
  english: string;
  welcome: string;
  selectLanguagePrompt: string;
}

export const translations = {
  zh: {
    appTitle: "图灵机模拟器",
    ruleEditor: "规则编辑器",
    tapeSimulation: "纸带模拟",
    currentState: "当前状态",
    halted: "已停机",
    addTape: "添加纸带",
    newTape: "新建纸带",
    initialTapeContent: "初始纸带内容",
    applyInitialContent: "应用初始内容",
    controlPanel: "控制面板",
    step: "单步",
    run: "运行",
    stop: "停止",
    reset: "重置",
    speed: "速度",
    slow: "慢速 (1s)",
    medium: "中速 (500ms)",
    fast: "快速 (200ms)",
    veryFast: "极快 (50ms)",
    import: "导入",
    export: "导出",
    example: "例子",
    addRule: "添加规则",
    ruleName: "规则名称",
    tape: "作用纸带",
    currentStateInput: "当前状态",
    readSymbol: "读取符号",
    writeSymbol: "写入符号",
    moveDirection: "移动方向",
    newStateInput: "新状态",
    nextRule: "下一规则",
    no: "无",
    shouldHalt: "执行后停机",
    definedRules: "已定义规则",
    noRulesDefined: "尚未定义规则",
    addYourFirstRule: "在上方添加您的第一条规则",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    confirm: "确认",
    tapeIsEmpty: "纸带为空",
    setInitialContent: "请设置初始内容",
    atLeastOneTape: "至少需要保留一个纸带",
    tapeDeleted: "纸带已删除",
    importRules: "导入规则",
    exportRules: "导出规则",
    exampleRulesLoaded: "已加载示例规则",
    turingMachineSimulator: "图灵机模拟器",
    language: "语言",
    selectLanguage: "选择语言",
    chinese: "中文",
    english: "英文",
    welcome: "欢迎使用图灵机模拟器",
    selectLanguagePrompt: "请选择您的语言 / Please select your language"
  },
  en: {
    appTitle: "Turing Machine Simulator",
    ruleEditor: "Rule Editor",
    tapeSimulation: "Tape Simulation",
    currentState: "Current State",
    halted: "Halted",
    addTape: "Add Tape",
    newTape: "New Tape",
    initialTapeContent: "Initial Tape Content",
    applyInitialContent: "Apply Initial Content",
    controlPanel: "Control Panel",
    step: "Step",
    run: "Run",
    stop: "Stop",
    reset: "Reset",
    speed: "Speed",
    slow: "Slow (1s)",
    medium: "Medium (500ms)",
    fast: "Fast (200ms)",
    veryFast: "Very Fast (50ms)",
     import: "Import",
    export: "Export",
    importRules: "Import Rules",
    exportRules: "Export Rules",
    example: "Example",
    addRule: "Add Rule",
    ruleName: "Rule Name",
    tape: "Tape",
    currentStateInput: "Current State",
    readSymbol: "Read Symbol",
    writeSymbol: "Write Symbol",
    moveDirection: "Move Direction",
    newStateInput: "New State",
    nextRule: "Next Rule",
    no: "None",
    shouldHalt: "Halt after execution",
    definedRules: "Defined Rules",
    noRulesDefined: "No rules defined yet",
    addYourFirstRule: "Add your first rule above",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirm: "Confirm",
    tapeIsEmpty: "Tape is empty",
    setInitialContent: "Please set initial content",
    atLeastOneTape: "At least one tape must remain",
    tapeDeleted: "Tape deleted",
    exampleRulesLoaded: "Example rules loaded",
    turingMachineSimulator: "Turing Machine Simulator",
    language: "Language",
    selectLanguage: "Select Language",
    chinese: "Chinese",
    english: "English",
    welcome: "Welcome to Turing Machine Simulator",
    selectLanguagePrompt: "请选择您的语言 / Please select your language"
  }
};

export function getTranslation(language: 'zh' | 'en'): Translation {
  return translations[language];
}