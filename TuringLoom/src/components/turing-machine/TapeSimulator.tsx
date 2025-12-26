import { TapeState } from "@/lib/types";

interface TapeSimulatorProps {
    tapes: TapeState[];
    onDeleteTape: (tapeId: string) => void;
    onSetInitialContent: (tapeId: string, content: string) => void;
    language: "zh" | "en";
    translations: any;
}

export default function TapeSimulator(
    {
        tapes,
        onDeleteTape,
        onSetInitialContent,
        language,
        translations
    }: TapeSimulatorProps
) {
    return (
        <div className="space-y-8">
            {tapes.map(tape => <div key={tape.id} className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {tape.name || `${language === "zh" ? "纸带" : "Tape"} ${tapes.indexOf(tape)}`}
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Head Position: {tape.headPosition}
                        </div>
                        <button
                            onClick={() => onDeleteTape(tape.id)}
                            disabled={tapes.length <= 1}
                            className={`p-1.5 rounded-full transition-colors ${tapes.length <= 1 ? "text-slate-300 dark:text-slate-600 cursor-not-allowed" : "text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"}`}
                            title={tapes.length <= 1 ? "至少需要保留一个纸带" : "删除纸带"}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                {}
                <div className="flex items-center gap-3">
                    <label
                        className={`text-sm font-medium text-slate-700 dark:text-slate-300 w-24 ${language === "zh" ? "font-sans" : "font-mono"}`}>
                        {translations.initialTapeContent}:
                                    </label>
                    <input
                        type="text"
                        value={tape.initialContent || ""}
                        onChange={e => onSetInitialContent(tape.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                        placeholder={language === "zh" ? "输入初始符号，例如00101" : "Enter initial symbols, e.g., 00101"}
                        maxLength={50} />
                    {}
                    <></>
                </div>
                {}
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 overflow-x-auto">
                    <div
                        className="inline-flex items-center space-x-0.5 min-w-full justify-center">
                        {Array.isArray(tape.cells) && tape.cells.length > 0 ? tape.cells.map((cell, index) => <div
                            key={`${tape.id}-${index}`}
                            className={`w-10 h-10 flex items-center justify-center border text-slate-900 dark:text-slate-100 ${index === tape.headPosition ? "border-blue-500 bg-blue-100 dark:bg-blue-900 dark:border-blue-400" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"} rounded-md font-mono text-sm transition-all`}>
                            {cell === " " ? <span className="text-slate-300 dark:text-slate-600">␣</span> : cell || "0"}
                        </div>) : <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                            {translations.tapeIsEmpty}
                        </div>}
                    </div>
                </div>
            </div>)}
            {tapes.length === 0 && <div className="text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <i
                    className="fa-regular fa-file-lines text-4xl text-slate-400 dark:text-slate-500 mb-3"></i>
                <p className="text-slate-500 dark:text-slate-400">{translations.tapeIsEmpty}</p>
                <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">{translations.setInitialContent}</p>
            </div>}
        </div>
    );
}