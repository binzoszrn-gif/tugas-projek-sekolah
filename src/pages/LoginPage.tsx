import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Berhasil Masuk!');
      navigate('/app');
    } catch (error: any) {
      toast.error(error.message || 'Gagal masuk. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;

      toast.success('Pendaftaran berhasil! Silakan login (atau cek email jika konfirmasi aktif).');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-primary/20 rounded-none">
          <CardHeader className="space-y-1 text-center bg-primary/5 py-8 border-b border-border">
            <div className="mx-auto w-16 h-16 bg-primary flex items-center justify-center text-white mb-4">
               <span className="text-2xl font-black italic">CBT</span>
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight uppercase">PRIMA UNGGUL</CardTitle>
            <CardDescription className="font-semibold uppercase text-[10px] tracking-[0.2em] opacity-60">
              Assessment Management System
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none h-12 bg-slate-100 p-0">
              <TabsTrigger value="login" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-primary font-bold text-[11px] tracking-widest h-full">MASUK</TabsTrigger>
              <TabsTrigger value="register" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-primary font-bold text-[11px] tracking-widest h-full">DAFTAR</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-8 px-8">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Email Utama</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="user@sekolah.sch.id" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-border focus-visible:ring-primary rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Kata Sandi</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-border focus-visible:ring-primary rounded-none"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pb-8 px-8">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-sm font-extrabold shadow-lg shadow-primary/20 rounded-none uppercase tracking-widest" 
                    disabled={loading}
                  >
                    {loading ? 'MEMPROSES...' : 'LOGIN KE SISTEM'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-8 px-8">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Nama Lengkap</Label>
                    <Input 
                      id="reg-name" 
                      placeholder="Nama Lengkap Sesuai Ijazah" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 border-border focus-visible:ring-primary rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Email Institusi</Label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="user@sekolah.sch.id" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 border-border focus-visible:ring-primary rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Buat Kata Sandi</Label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-border focus-visible:ring-primary rounded-none"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pb-8 px-8">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-sm font-extrabold shadow-lg shadow-primary/20 rounded-none uppercase tracking-widest" 
                    disabled={loading}
                  >
                    {loading ? 'MEMPROSES...' : 'DAFTARKAN IDENTITAS'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}

