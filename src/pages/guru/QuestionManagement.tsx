import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/lib/AuthContext';
import { type Question } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function QuestionManagement() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState<'a' | 'b' | 'c' | 'd'>('a');

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    setLoading(true);
    const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Gagal mengambil data soal');
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('questions').insert([
        {
          question_text: questionText,
          option_a: optA,
          option_b: optB,
          option_c: optC,
          option_d: optD,
          correct_answer: correct,
          created_by: user.id
        }
      ]);

      if (error) throw error;

      toast.success('Soal berhasil ditambahkan!');
      setIsAddOpen(false);
      resetForm();
      fetchQuestions();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function resetForm() {
    setQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrect('a');
  }

  async function handleDelete(id: string) {
    if (confirm('Hapus soal ini?')) {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) toast.error('Gagal menghapus soal');
      else {
        toast.success('Soal dihapus');
        fetchQuestions();
      }
    }
  }

  const filtered = questions.filter(q => q.question_text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Soal</h1>
          <p className="text-muted-foreground">Kelola semua soal pilihan ganda di sini.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} /> Tambah Soal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buat Soal Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Pertanyaan</Label>
                <Textarea value={questionText} onChange={e => setQuestionText(e.target.value)} required placeholder="Masukkan pertanyaan..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Opsi A</Label>
                  <Input value={optA} onChange={e => setOptA(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Opsi B</Label>
                  <Input value={optB} onChange={e => setOptB(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Opsi C</Label>
                  <Input value={optC} onChange={e => setOptC(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Opsi D</Label>
                  <Input value={optD} onChange={e => setOptD(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Jawaban Benar</Label>
                <Select value={correct} onValueChange={(v: any) => setCorrect(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Opsi A</SelectItem>
                    <SelectItem value="b">Opsi B</SelectItem>
                    <SelectItem value="c">Opsi C</SelectItem>
                    <SelectItem value="d">Opsi D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Simpan Soal</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Cari soal..." 
              className="pl-10" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Soal</TableHead>
                <TableHead>Jawaban</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center">Memuat...</TableCell></TableRow>
              ) : filtered.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="max-w-xs truncate">{q.question_text}</TableCell>
                  <TableCell className="uppercase font-bold text-primary">{q.correct_answer}</TableCell>
                  <TableCell className="text-right space-x-2">
                     <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}>
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
           </Table>
        </CardContent>
      </Card>
    </div>
  );
}
