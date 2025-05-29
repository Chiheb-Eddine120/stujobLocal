import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Select, MenuItem, FormControl, InputLabel, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Container
} from '@mui/material';
import { supabase } from '../../services/supabaseClient';
import DashboardBackButton from '../../components/DashboardBackButton';

const PRIORITES = [
  { value: 'basse', label: 'Basse', color: 'default' },
  { value: 'normale', label: 'Normale', color: 'primary' },
  { value: 'haute', label: 'Haute', color: 'warning' },
  { value: 'critique', label: 'Critique', color: 'error' },
];
const STATUTS = [
  { value: 'ouvert', label: 'Ouvert' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'resolu', label: 'Résolu' },
];

const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState('');
  const [filterPriorite, setFilterPriorite] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ email: '', message: '', priorite: 'normale' });
  const [saving, setSaving] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    let query = supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (filterStatut) query = query.eq('statut', filterStatut);
    if (filterPriorite) query = query.eq('priorite', filterPriorite);
    const { data, error } = await query;
    if (!error) setTickets(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTickets(); }, [filterStatut, filterPriorite]);

  const handleEdit = (ticket: any) => {
    setSelectedTicket({
      ...ticket,
      statut: ticket.statut || 'ouvert',
      priorite: ticket.priorite || 'normale'
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedTicket?.id) return;
    const statut = selectedTicket.statut || 'ouvert';
    const priorite = selectedTicket.priorite || 'normale';
    setSaving(true);
    await supabase.from('tickets').update({
      statut,
      priorite
    }).eq('id', selectedTicket.id);
    setEditDialogOpen(false);
    setSaving(false);
    fetchTickets();
  };

  const handleNewTicket = async () => {
    setSaving(true);
    await supabase.from('tickets').insert([
      { ...newTicket, statut: 'ouvert' }
    ]);
    setNewTicketDialogOpen(false);
    setNewTicket({ email: '', message: '', priorite: 'normale' });
    setSaving(false);
    fetchTickets();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <DashboardBackButton />
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
        Support - Tickets
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel>Statut</InputLabel>
            <Select value={filterStatut} label="Statut" onChange={e => setFilterStatut(e.target.value)}>
              <MenuItem value="">Tous</MenuItem>
              {STATUTS.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel>Priorité</InputLabel>
            <Select value={filterPriorite} label="Priorité" onChange={e => setFilterPriorite(e.target.value)}>
              <MenuItem value="">Toutes</MenuItem>
              {PRIORITES.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" color="secondary" onClick={() => setNewTicketDialogOpen(true)}>
            Nouveau ticket
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Priorité</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6}><CircularProgress /></TableCell></TableRow>
              ) : tickets.length === 0 ? (
                <TableRow><TableCell colSpan={6}>Aucun ticket</TableCell></TableRow>
              ) : tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.email}</TableCell>
                  <TableCell>{ticket.message.length > 60 ? ticket.message.slice(0, 60) + '…' : ticket.message}</TableCell>
                  <TableCell>
                    <Chip label={STATUTS.find(s => s.value === ticket.statut)?.label || ticket.statut} color={ticket.statut === 'resolu' ? 'success' : ticket.statut === 'en_cours' ? 'warning' : 'default'} />
                  </TableCell>
                  <TableCell>
                    <Chip label={PRIORITES.find(p => p.value === ticket.priorite)?.label || ticket.priorite} color={PRIORITES.find(p => p.value === ticket.priorite)?.color as any} />
                  </TableCell>
                  <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(ticket)}>Gérer</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog édition ticket */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gérer le ticket</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography variant="subtitle2">Email : {selectedTicket.email}</Typography>
              <Typography variant="subtitle2">Message :</Typography>
              <Paper sx={{ p: 2, bgcolor: '#F3F4F6' }}>{selectedTicket.message}</Paper>
              <FormControl size="small">
                <InputLabel>Statut</InputLabel>
                <Select value={selectedTicket.statut} label="Statut" onChange={e => setSelectedTicket({ ...selectedTicket, statut: e.target.value })}>
                  {STATUTS.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Priorité</InputLabel>
                <Select value={selectedTicket.priorite} label="Priorité" onChange={e => setSelectedTicket({ ...selectedTicket, priorite: e.target.value })}>
                  {PRIORITES.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={saving}>{saving ? <CircularProgress size={20} /> : 'Enregistrer'}</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog création ticket admin */}
      <Dialog open={newTicketDialogOpen} onClose={() => setNewTicketDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouveau ticket (admin)</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Email"
              value={newTicket.email}
              onChange={e => setNewTicket({ ...newTicket, email: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Message"
              value={newTicket.message}
              onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
              required
              fullWidth
              multiline
              minRows={3}
            />
            <FormControl size="small">
              <InputLabel>Priorité</InputLabel>
              <Select value={newTicket.priorite} label="Priorité" onChange={e => setNewTicket({ ...newTicket, priorite: e.target.value })}>
                {PRIORITES.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTicketDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleNewTicket} variant="contained" disabled={saving || !newTicket.email || !newTicket.message}>{saving ? <CircularProgress size={20} /> : 'Créer'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminSupport; 