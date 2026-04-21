import React, { useState, useEffect } from 'react';
import { supabase, type Profile, type Role } from '@/src/lib/supabase';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('siswa');
  const [newUserEmail, setNewUserEmail] = useState(''); // Only for placeholder

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      toast.error('Gagal mengambil data user');
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    toast.error('Menambah user ke Auth Supabase membutuhkan Service Role Key. Silakan tambahkan user melalui dashboard Supabase atau implementasi Cloud Functions.');
    // Demo: only updating the UI/DB if possible
    setIsAddOpen(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Yakin ingin menghapus user ini?')) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) {
        toast.error('Gagal menghapus profile');
      } else {
        toast.success('Profile berhasil dihapus');
        fetchUsers();
      }
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground">Kelola Guru, Siswa, dan Admin sistem.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} /> Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={newUserName} onChange={e => setNewUserName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUserRole} onValueChange={(v: Role) => setNewUserRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="guru">Guru</SelectItem>
                    <SelectItem value="siswa">Siswa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Simpan User</Button>
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
              placeholder="Cari user..." 
              className="pl-10" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2 border-border">
                <TableHead className="uppercase text-[11px] font-extrabold tracking-widest text-muted-foreground">Nama</TableHead>
                <TableHead className="uppercase text-[11px] font-extrabold tracking-widest text-muted-foreground">Role</TableHead>
                <TableHead className="uppercase text-[11px] font-extrabold tracking-widest text-muted-foreground">ID / NIS</TableHead>
                <TableHead className="text-right uppercase text-[11px] font-extrabold tracking-widest text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">Memuat...</TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Tidak ada user ditemukan.</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${
                        user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                        user.role === 'guru' ? 'bg-blue-100 text-blue-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>{user.nis || user.id.slice(0, 8)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="text-blue-500">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(user.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
