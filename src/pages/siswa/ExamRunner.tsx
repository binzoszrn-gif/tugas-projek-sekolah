import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/lib/AuthContext';
import { type Question, type Exam } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Send, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export default function ExamRunner() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: examData, error: examError } = await supabase.from('exams').select('*').eq('id', id).single();
        if (examError) throw examError;
        setExam(examData);
        setTimeLeft(examData.duration * 60);

        // In real app, we use exam_questions table. Here we fetch all for demo.
        const { data: qData, error: qError } = await supabase.from('questions').select('*').limit(20);
        if (qError) throw qError;
        setQuestions(qData || []);
      } catch (err: any) {
        toast.error('Gagal memuat ujian');
        navigate('/app/siswa/exams');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, navigate]);

  // Timer
  useEffect(() => {
    if (loading || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, timeLeft]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    
    try {
      // Calculate Score
      let correctCount = 0;
      questions.forEach(q => {
        if (answers[q.id] === q.correct_answer) correctCount++;
      });
      const score = (correctCount / questions.length) * 100;

      // Save to Results table (omitted for brevity, just demo toast)
      toast.success(`Ujian Selesai! Nilai Anda: ${score.toFixed(1)}`);
      navigate('/app');
    } catch (err) {
      toast.error('Gagal mengirim jawaban');
    } finally {
      setSubmitting(false);
    }
  }, [answers, questions, navigate, submitting]);

  if (loading) return <div>Memuat...</div>;
  if (questions.length === 0) return <div>Tidak ada soal.</div>;

  const currentQuestion = questions[currentIdx];
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header Runner */}
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg text-primary">{exam?.title}</h1>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-2 text-muted-foreground font-mono">
            <Clock size={16} />
            <span className={timeLeft < 300 ? 'text-destructive font-bold' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">Progres: {Object.keys(answers).length}/{questions.length}</span>
          <Button variant="default" size="sm" onClick={() => { if(confirm('Selesaikan ujian sekarang?')) handleSubmit(); }} disabled={submitting}>
            <Send size={16} className="mr-2" /> Akhiri Ujian
          </Button>
        </div>
      </header>

      <div className="flex-1 container max-w-5xl py-8 flex gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Progress value={progress} className="h-2" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-lg border-none">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-8">
                    <span className="flex-none w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {currentIdx + 1}
                    </span>
                    <h2 className="text-xl font-medium leading-relaxed pt-1">
                      {currentQuestion.question_text}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {['a', 'b', 'c', 'd'].map((opt) => {
                      const key = `option_${opt}` as keyof Question;
                      const isSelected = answers[currentQuestion.id] === opt;
                      
                      return (
                        <button
                          key={opt}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }))}
                          className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                            isSelected 
                              ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20' 
                              : 'border-border hover:border-primary/30 hover:bg-secondary/50'
                          }`}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold uppercase ${
                            isSelected ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                          }`}>
                            {opt}
                          </span>
                          <span className="text-lg">{currentQuestion[key] as string}</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-border">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="gap-2"
            >
              <ChevronLeft size={18} /> Sebelumnya
            </Button>
            <div className="text-sm font-medium">Soal {currentIdx + 1} dari {questions.length}</div>
            <Button 
              onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIdx === questions.length - 1}
              className="gap-2"
            >
              Selanjutnya <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {/* Sidebar Nav */}
        <aside className="w-64 space-y-6 hidden lg:block">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen size={16} /> Navigasi Soal
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      currentIdx === i 
                        ? 'bg-primary text-white' 
                        : answers[questions[i].id] 
                          ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                          : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="p-5 bg-orange-50 border border-orange-200 rounded-xl flex gap-3 text-orange-800">
             <AlertTriangle size={20} className="shrink-0 pt-1" />
             <p className="text-xs font-medium leading-relaxed">
               Jangan menutup halaman ini sebelum menekan tombol Akhiri Ujian.
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
