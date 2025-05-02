import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { DocumentFile } from '../types/etudiant';

interface FileUploadProps {
  type: 'cv' | 'lettre_motivation';
  currentFile?: DocumentFile;
  onUpload: (file: DocumentFile) => void;
  onDelete: () => void;
  userId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  type,
  currentFile,
  onUpload,
  onDelete,
  userId,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const documentFile: DocumentFile = {
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      };
      onUpload(documentFile);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={`file-upload-${type}-${userId}`}
      />
      <label htmlFor={`file-upload-${type}-${userId}`}>
        <Button
          variant="outlined"
          component="span"
          disabled={isUploading}
          sx={{ mb: 1 }}
        >
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            `Uploader ${type === 'cv' ? 'CV' : 'Lettre de motivation'}`
          )}
        </Button>
      </label>
      {currentFile && (
        <Box>
          <Typography variant="body2">
            {currentFile.name} ({Math.round(currentFile.size / 1024)} KB)
          </Typography>
          <Button
            variant="text"
            color="error"
            onClick={onDelete}
            size="small"
          >
            Supprimer
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload; 