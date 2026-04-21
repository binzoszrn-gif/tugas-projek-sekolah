import { useAuth } from '@/src/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, LayoutDashboard, Database, BookOpen, GraduationCap, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { profile, isAdmin, isGuru, isSiswa } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/app',
      show: true
    },
    {
      title: 'Manajemen User',
      icon: Users,
      path: '/app/admin/users',
      show: isAdmin
    },
    {
      title: 'Semua Soal',
      icon: Database,
      path: '/app/admin/questions',
      show: isAdmin
    },
    {
      title: 'Semua Ujian',
      icon: GraduationCap,
      path: '/app/admin/exams',
      show: isAdmin
    },
    {
      title: 'Bank Soal',
      icon: BookOpen,
      path: '/app/guru/questions',
      show: isGuru
    },
    {
      title: 'Manajemen Ujian',
      icon: GraduationCap,
      path: '/app/guru/exams',
      show: isGuru
    },
    {
      title: 'Daftar Ujian',
      icon: BookOpen,
      path: '/app/siswa/exams',
      show: isSiswa
    }
  ];

  return (
    <div className="w-[260px] bg-white border-r border-border h-screen flex flex-col fixed left-0 top-0 py-10">
      <div className="px-10 mb-[60px]">
        <h1 className="text-[20px] font-extrabold text-primary tracking-tighter leading-none uppercase">Prima<br/>Unggul</h1>
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.1em] mt-1 opacity-50">SMK CBT System</p>
      </div>

      <nav className="flex-1 space-y-0 text-sm">
        {menuItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-10 py-3 font-semibold transition-all duration-200 border-r-4",
                isActive 
                  ? "bg-primary/5 text-primary border-primary" 
                  : "text-slate-500 hover:text-foreground border-transparent"
              )}
            >
              <Icon size={18} />
              <span className="uppercase tracking-wider text-[13px]">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-10 mt-auto flex flex-wrap gap-2 pt-8">
        {['TKJ', 'DKV', 'AK', 'BC', 'MPLB', 'BD'].map(j => (
          <span key={j} className="text-[9px] font-extrabold px-2 py-1 bg-slate-100 text-slate-500 tracking-tight">{j}</span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const { profile, signOut } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-border flex items-center justify-between px-15 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center font-extrabold text-[12px]">02</div>
        <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-tight">Ujian Aktif</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[14px] font-semibold leading-tight">{profile?.name || 'User'}</p>
          <p className="text-[11px] text-slate-500 capitalize">{profile?.role || 'Role'} • XII TKJ 1</p>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="text-primary hover:bg-primary/5 font-semibold text-[13px] uppercase">
          Logout
        </Button>
      </div>
    </header>
  );
}

