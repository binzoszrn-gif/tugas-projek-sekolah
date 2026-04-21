import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { type Exam } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function SiswaExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  async function fetchExams() {
    setLoading(true);
    const { data, error } = await supabase.from('exams').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Gagal mengambil daftar ujian');
    else setExams(data || []);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daftar Ujian</h1>
        <p className="text-muted-foreground">Pilih ujian yang ingin Anda kerjakan hari ini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <p>Memuat...</p>
        ) : exams.length === 0 ? (
          <p className="col-span-full text-center py-20 text-muted-foreground bg-white rounded-none border border-dashed">Belum ada ujian yang tersedia.</p>
        ) : exams.map(exam => (
          <Card key={exam.id} className="group hover:border-primary transition-all rounded-none p-8 flex flex-col gap-4">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-primary">JURUSAN TKJ</div>
            <h2 className="text-3xl font-extrabold tracking-tight group-hover:text-primary transition-colors">{exam.title}</h2>
            <div className="flex gap-6 text-[12px] text-muted-foreground font-semibold">
              <span className="flex items-center gap-2 border-r border-border pr-6">Guru: Bpk. Sutarman</span>
              <span className="flex items-center gap-2">Durasi: {exam.duration} Menit</span>
            </div>
            <div className="pt-4 mt-auto">
              <Link to={`/app/siswa/exam/${exam.id}`}>
                <Button className="w-fit px-8 py-6 text-[13px] font-extrabold uppercase tracking-widest" size="lg">
                  Kerjakan Sekarang
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}
