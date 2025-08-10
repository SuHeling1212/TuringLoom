import { TapeState } from '@/lib/types';

interface TapeSimulatorProps {
  tapes: TapeState[];
  onDeleteTape: (tapeId: string) => void;
}

export default function TapeSimulator({ tapes, onDeleteTape }: TapeSimulatorProps) {
  return (
    <div className="space-y-8">
      {tapes.map((tape) => (
        <div key={tape.id} className="space-y-2">
           <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {tape.name || `Tape ${tapes.indexOf(tape) + 1}`}
            </h3>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Head Position: {tape.headPosition}
              </div>
              <button
                onClick={() => onDeleteTape(tape.id)}
                disabled={tapes.length <= 1}
                className={`p-1.5 rounded-full transition-colors ${
                  tapes.length <= 1
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30'
                }`}
                title={tapes.length <= 1 ? "至少需要保留一个纸带" : "删除纸带"}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          
          {/* Tape visualization */}
           <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 overflow-x-auto">
             <div className="inline-flex items-center space-x-0.5 min-w-full justify-center">
                {Array.isArray(tape.cells) && tape.cells.length > 0 ?
                  Array.isArray(tape.cells[0]) ? (
                    // 处理意外二维数组的降级显示
                    (tape.cells.flat() as string[]).map((cell, index) => (
                      <div 
                        key={`${tape.id}-${index}`}
                        className={`w-10 h-10 flex items-center justify-center border text-slate-900 dark:text-slate-100 ${
                          typeof tape.headPosition === 'number' && index === tape.headPosition 
                            ? 'border-blue-500 bg-blue-100 dark:bg-blue-900 dark:border-blue-400' 
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        } rounded-md font-mono text-sm transition-all`}
                      >
                        {cell === ' ' ? <span className="text-slate-300 dark:text-slate-600">␣</span> : (cell || '0')}
                      </div>
                    ))
                  ) : (
                    (tape.cells as string[]).map((cell, index) => (
                      <div 
                        key={`${tape.id}-${index}`}
                        className={`w-10 h-10 flex items-center justify-center border text-slate-900 dark:text-slate-100 ${
                          typeof tape.headPosition === 'number' && index === tape.headPosition 
                            ? 'border-blue-500 bg-blue-100 dark:bg-blue-900 dark:border-blue-400' 
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        } rounded-md font-mono text-sm transition-all`}
                      >
                        {cell === ' ' ? <span className="text-slate-300 dark:text-slate-600">␣</span> : (cell || '0')}
                      </div>
                    ))
                  )
                : (
                  <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                    纸带为空，请设置初始内容
                  </div>
                )}
              </div>
          </div>
          
          {/* Tape position indicators */}
           <div className="flex justify-center text-xs text-slate-500 dark:text-slate-400">
            <div className="flex justify-between w-full max-w-md">
              <span>0</span>
              <span>{Math.floor(tape.cells.length / 2)}</span>
              <span>{tape.cells.length - 1}</span>
            </div>
          </div>
        </div>
      ))}
      
      {tapes.length === 0 && (
        <div className="text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
           <i className="fa-regular fa-file-lines text-4xl text-slate-400 dark:text-slate-500 mb-3"></i>
           <p className="text-slate-500 dark:text-slate-400">无可用纸带</p>
           <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">使用上方按钮添加纸带</p>
        </div>
      )}
    </div>
  );
}