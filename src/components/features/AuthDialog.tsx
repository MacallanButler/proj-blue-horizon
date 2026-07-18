"use client";

import { useState } from "react";
import { Loader2, Key, Mail, User, Phone, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/apiClient";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
  defaultTab?: "login" | "signup";
}

export default function AuthDialog({ isOpen, onClose, onSuccess, defaultTab = "login" }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Input States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiClient.login({ email, password });
      setSuccessMsg("Logged in successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        onSuccess?.(res.data);
        onClose();
        window.location.reload(); // refresh page to reload authentication state globally
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First attempt standard registration
      // If there are guest bookings under this email, the backend will auto-detect or we can run upgrade
      const res = await apiClient.register({
        email,
        password,
        name,
        phone
      });
      
      setSuccessMsg("Account created successfully!");
      
      // Attempt guest upgrade linking in parallel
      try {
        await apiClient.guestUpgrade({ email, password, name, phone });
      } catch (upgradeErr) {
        console.error("Failed to upgrade guest bookings", upgradeErr);
      }
      
      setTimeout(() => {
        setSuccessMsg("");
        onSuccess?.(res.data);
        onClose();
        window.location.reload();
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] bg-ocean-dark border-ocean-light/20 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center">
            {activeTab === "login" ? "Welcome Back" : "Start Your Journey"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400 text-xs">
            {activeTab === "login" 
              ? "Access your dive logs and verify PADI certifications." 
              : "Create an account to book advanced dive trips and track statistics."}
          </DialogDescription>
        </DialogHeader>

        {successMsg ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-primary animate-bounce" />
            <p className="text-green-300 font-bold text-base">{successMsg}</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(val: any) => { setActiveTab(val); setError(""); }} className="space-y-4">
            <TabsList className="grid grid-cols-2 bg-ocean-mid/60 border border-ocean-light/10 p-1 rounded-lg">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-ocean-deep text-slate-400 text-xs font-bold py-1.5 rounded-md">
                Log In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-ocean-deep text-slate-400 text-xs font-bold py-1.5 rounded-md">
                Register
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-lg">
                {error}
              </div>
            )}

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-ocean-mid/40 border-ocean-light/20 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-ocean-mid/40 border-ocean-light/20 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-ocean-deep font-bold mt-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Log In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-ocean-mid/40 border-ocean-light/20 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-ocean-mid/40 border-ocean-light/20 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 bg-ocean-mid/40 border-ocean-light/20 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-ocean-mid/40 border-ocean-light/20 text-white placeholder:text-slate-500"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-ocean-deep font-bold mt-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Register & Upgrade
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
