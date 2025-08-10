/**
 * Types for Turing Machine Simulator
 */

/**
 * ID生成规则说明:
 * - 规则(Rule): 使用前缀"rule-"加上时间戳(如"rule-1620000000000")
 * - 导入规则时: 使用前缀"rule-"加上时间戳和随机字符串(如"rule-1620000000000-abc123def")
 * - 纸带(Tape): 使用前缀"tape-"加上增量数字(如"tape-1", "tape-2")
 * - 配置(Configuration): 使用UUID或类似方法生成唯一标识符
 */

// Direction types for tape head movement
export type MoveDirection = 'left' | 'right' | 'stay';
export type TapeType = '1d';

/**
 * Interface defining a single Turing Machine rule
 * @property {string} id - 规则唯一标识符，格式为"rule-时间戳"或"rule-时间戳-随机字符串"
 */
export interface TuringMachineRule {
  id: string;
  name: string;
  tapeIndex: number;
  currentState: string;
  readSymbol: string;
  writeSymbol: string;
  moveDirection: MoveDirection;
  newState: string;
  shouldHalt: boolean;
  nextRuleId?: string;
}

/**
 * Interface representing the state of a single tape
 * @property {string} id - 纸带唯一标识符，格式为"tape-数字"
 */
export interface TapeState {
  id: string;
  type: TapeType;
  cells: string[] | string[][]; // 1D: string[], 2D: string[][]
  headPosition: number | { x: number; y: number }; // 1D: number, 2D: {x,y}
  name?: string;
  width?: number; // 仅用于2D纸带
  height?: number; // 仅用于2D纸带
}

/**
 * Interface for a complete Turing Machine configuration
 * @property {string} id - 配置唯一标识符，通常为UUID
 */
export interface TuringMachineConfiguration {
  id: string;
  name: string;
  description?: string;
  rules: TuringMachineRule[];
  tapes: TapeState[];
  currentState: string;
  isRunning: boolean;
  isHalted: boolean;
  createdAt: Date;
  createdBy?: string;
}

// Interface for the simulation controls
export interface SimulationControls {
  isRunning: boolean;
  speed: number;
  stepCount: number;
}