import { Routes, Route, Navigate } from "react-router-dom";
import { Component, ErrorInfo, ReactNode } from "react";
import Home from "@/pages/Home";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';

// 错误边界组件，用于捕获子组件错误
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("React Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-slate-900">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4 text-red-500">⚠️</div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">应用发生错误</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {this.state.error?.message || "未知错误导致应用无法加载"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              尝试重新加载
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

   return (
     <AuthContext.Provider
       value={{ isAuthenticated, setIsAuthenticated, logout }}
     >
       <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
            {/* 添加重定向以处理所有不匹配的路由 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
       </ErrorBoundary>
     </AuthContext.Provider>
   );
}
