import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/contexts/NotesContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const CreateNotePage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { isAuthenticated } = useAuth();
  const { addNote, updateNote, getNote } = useNotes();
  const navigate = useNavigate();
  const isEditMode = !!id;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      const note = getNote(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      } else {
        toast.error('Note not found');
        navigate('/');
      }
    }
  }, [isAuthenticated, isEditMode, id, getNote, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isEditMode) {
      updateNote(id, title, content);
      toast.success('Note updated successfully');
    } else {
      addNote(title, content);
      toast.success('Note created successfully');
    }
    
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1">
              {isEditMode ? 'Edit Note' : 'Create New Note'}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              margin="normal"
              multiline
              rows={12}
              required
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{ mt: 3, bgcolor: 'hsl(var(--primary))', '&:hover': { bgcolor: 'hsl(var(--primary) / 0.9)' } }}
            >
              {isEditMode ? 'Update Note' : 'Save Note'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CreateNotePage;
