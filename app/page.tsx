'use client';

import { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Box, Typography, CircularProgress } from '@mui/material';
import FootballField from '@/components/FootballField';
import { Draft } from '@/lib/types';

export default function Home() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await fetch('/api/drafts');
        if (!response.ok) throw new Error('Failed to fetch drafts');
        const data = await response.json();
        setDrafts(data);
      } catch (error) {
        console.error('Error fetching drafts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center relative">
      <FootballField />
      <div className="absolute top-0 left-0 text-center text-lg text-white p-5 min-h-full min-w-full flex flex-col items-center justify-start bg-black/30 backdrop-blur-[3px]">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Alchy Draft
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleMenuItemClick('/setup')}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              Setup New Draft
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleClick}
              disabled={loading}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'View Drafts'}
            </Button>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                minWidth: '200px',
              }
            }}
          >
            {drafts.map((draft) => (
              <MenuItem 
                key={draft.id} 
                onClick={() => {
                  handleMenuItemClick(`/draft/${draft.id}`);
                  handleClose();
                }}
              >
                {draft.name} - {new Date(draft.date).toLocaleDateString()}
              </MenuItem>
            ))}
            {drafts.length === 0 && !loading && (
              <MenuItem disabled>No drafts available</MenuItem>
            )}
          </Menu>
        </Box>
      </div>
    </div>
  );
}
