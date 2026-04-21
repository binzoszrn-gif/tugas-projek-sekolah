import { useAuth } from '@/src/lib/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { profile, isAdmin, isGuru, isSiswa } = useAuth();

  const stats = [
    {
      label: 'Total Siswa',
      value: '250',
      icon: Users,
      color: 'bg-blue-500',
      show: isAdmin || isGuru
    },
    {
      label: 'Ujian Aktif',
      value: '4',
      icon: Clock,
      color: 'bg-orange-500',
      show: true
    },
    {
      label: 'Total Soal',
      value: '1,240',
      icon: BookOpen,
      color: 'bg-green-500',
      show: isAdmin || isGuru
    },
    {
      label: 'Rata-rata Nilai',
      value: '82.5',
      icon: GraduationCap,
      color: 'bg-primary',
      show: !isSiswa
    }
  ];

  return (
    <div className="space-y-12">
      <div className="welcome-msg">
        <h1 className="text-[48px] font-extrabold tracking-[-0.04em] leading-none">
          Halo, {profile?.name?.split(' ')[0]}.
        </h1>
        <p className="text-[16px] text-muted-foreground mt-3">
          Siap untuk menunjukkan kemampuan terbaikmu hari ini?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {stats.filter(s => s.show).map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:border-primary transition-all group overflow-hidden">
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-primary mb-2">{stat.label}</p>
                  <p className="text-4xl font-extrabold tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-border group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all`}>
                  <stat.icon size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="hover:border-primary transition-all">
          <CardHeader className="p-8 pb-0 border-none">
            <CardTitle className="text-2xl font-bold tracking-tight">AKTIVITAS TERAKHIR</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-6 p-6 border border-border group hover:border-primary transition-all">
                <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary transition-colors">
                  <CheckCircle2 size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-bold leading-tight">Ujian Kompetensi Keahlian TKJ</p>
                  <p className="text-[12px] text-slate-400 mt-1">Dikerjakan oleh Andi Saputra • 2 jam yang lalu</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-primary">92/100</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {isSiswa && (
          <Card className="bg-primary text-white border-none relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <CardHeader className="p-8 relative z-10">
              <CardTitle className="text-2xl font-bold uppercase tracking-tight">Ujian Mendatang</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 relative z-10">
              <div className="p-8 bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] mb-2 opacity-80 underline underline-offset-4">JADWAL TERDEKAT</p>
                <h3 className="text-3xl font-extrabold tracking-tight mb-4">Administrasi Infrastruktur Jaringan</h3>
                <div className="flex items-center gap-4 text-[14px] font-semibold">
                   <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>BESOK, 08:30 WIB</span>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

