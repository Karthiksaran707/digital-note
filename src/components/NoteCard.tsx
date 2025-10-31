import { Card, CardContent, CardActions, Typography, IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Note } from '@/contexts/NotesContext';

interface NoteCardProps {
  note: Note;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {note.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Updated: {formatDate(note.updatedAt)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          size="small"
          onClick={() => onEdit(note.id)}
          sx={{ color: 'hsl(var(--primary))' }}
        >
          <Edit />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(note.id)}
          sx={{ color: 'hsl(var(--destructive))' }}
        >
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default NoteCard;
