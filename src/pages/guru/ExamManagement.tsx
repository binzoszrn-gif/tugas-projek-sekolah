import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/lib/AuthContext';
import { type Exam, type Question } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, BookOpen, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ExamManagement() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('60');

  useEffect(() => {
    fetchExams();
  }, []);

  async function fetchExams() {
    setLoading(true);
    const { data, error } = await supabase.from('exams').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Gagal mengambil data ujian');
    else setExams(data || []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('exams').insert([
      { title, duration: parseInt(duration), created_by: user.id }
    ]);

    if (error) toast.error('Gagal membuat ujian');
    else {
      toast.success('Ujian berhasil dibuat!');
      setIsAddOpen(false);
      setTitle('');
      fetchExams();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Ujian</h1>
          <p className="text-muted-foreground">Buat dan kelola jadwal ujian siswa.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} /> Buat Ujian
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Ujian Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Ujian</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Contoh: UTS Matematika" />
              </div>
              <div className="space-y-2">
                <Label>Durasi (Menit)</Label>
                <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Simpan Ujian</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Memuat...</p>
        ) : exams.length === 0 ? (
          <p className="col-span-full text-center py-10 text-muted-foreground">Belum ada ujian.</p>
        ) : exams.map(exam => (
          <Card key={exam.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">{exam.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={16} />
                  <span>Durasi: {exam.duration} Menit</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen size={16} />
                  <span>Jum. Soal: (Dikelola di Bank Soal)</span>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">Kelola Soal</Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
