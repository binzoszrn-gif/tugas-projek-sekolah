import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, UserCheck, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const jurusan = [
    { name: 'TKJ', desc: 'Teknik Komputer & Jaringan' },
    { name: 'DKV', desc: 'Desain Komunikasi Visual' },
    { name: 'AK', desc: 'Akuntansi' },
    { name: 'BC', desc: 'Broadcasting' },
    { name: 'MPLB', desc: 'Manajemen Perkantoran & Layanan Bisnis' },
    { name: 'BD', desc: 'Bisnis Digital' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="container px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
              SMK Prima Unggul <span className="text-primary-foreground/80">CBT</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10">
              Sistem Ujian Online Terintegrasi untuk Masa Depan Pendidikan yang Lebih Baik.
              Cepat, Adil, dan Transparan.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-10 h-14 font-bold shadow-xl">
                  Masuk Sekarang
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="py-24 container px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Program Keahlian Kami</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jurusan.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-white text-center">
        <p className="text-muted-foreground">© 2024 SMK Prima Unggul. All rights reserved.</p>
      </footer>
    </div>
  );
}
