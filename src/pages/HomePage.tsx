import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import { NoteAdd } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/contexts/NotesContext';
import Navbar from '@/components/Navbar';
import NoteCard from '@/components/NoteCard';
import { toast } from 'sonner';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { notes, deleteNote } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      toast.success('Note deleted successfully');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Notes
          </Typography>
          <Button
            variant="contained"
            startIcon={<NoteAdd />}
            onClick={() => navigate('/create')}
            sx={{ bgcolor: 'hsl(var(--primary))', '&:hover': { bgcolor: 'hsl(var(--primary) / 0.9)' } }}
          >
            New Note
          </Button>
        </Box>

        {notes.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notes yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your first note to get started!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3 
          }}>
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default HomePage;
