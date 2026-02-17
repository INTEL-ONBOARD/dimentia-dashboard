"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Brain, Loader2, Mail, Lock, Sparkles, Shield, Users, Activity } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful! Welcome back.");
      router.push("/");
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await login("admin@demo.com", "password123");
      toast.success("Welcome to the demo!");
      router.push("/");
    } catch (error) {
      toast.error("Demo login failed. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400 rounded-full blur-3xl opacity-50" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Brain size={28} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">DementiaMithura</span>
          </div>

          {/* Center Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white leading-tight">
                Empowering Care<br />Through Insights
              </h1>
              <p className="text-xl text-purple-100 mt-4 max-w-md">
                Advanced analytics dashboard for dementia care management and patient monitoring.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <Users size={20} className="text-white" />
                </div>
                <p className="text-white font-semibold">5,678+</p>
                <p className="text-purple-200 text-sm">Active Users</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <Activity size={20} className="text-white" />
                </div>
                <p className="text-white font-semibold">Real-time</p>
                <p className="text-purple-200 text-sm">Analytics</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <Shield size={20} className="text-white" />
                </div>
                <p className="text-white font-semibold">HIPAA</p>
                <p className="text-purple-200 text-sm">Compliant</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <Brain size={20} className="text-white" />
                </div>
                <p className="text-white font-semibold">AI-Powered</p>
                <p className="text-purple-200 text-sm">Insights</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-purple-200 text-sm">
            © 2026 DementiaMithura. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600 mb-4">
              <Brain size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DementiaMithura</h1>
            <p className="text-slate-500 dark:text-slate-400">Analytics Dashboard</p>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="w-full mb-6 py-3.5 bg-purple-50 dark:bg-purple-500/10 border-2 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 rounded-xl font-semibold hover:bg-purple-100 dark:hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {demoLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading demo...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Try Demo Account
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || demoLoading}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || demoLoading}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Help Text */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Need help? Contact your administrator
          </p>

          {/* Mobile Footer */}
          <p className="lg:hidden text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
            © 2026 DementiaMithura. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
