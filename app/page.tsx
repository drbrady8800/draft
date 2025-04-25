'use client';

import { useState } from 'react';
import { Button, Menu, MenuItem, Box, Typography, CircularProgress } from '@mui/material';
import FootballField from '@/components/FootballField';
import { Draft } from '@/lib/types';
import { useDrafts } from '@/hooks/useApi';

export default function Home() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { drafts, isLoading: loading, isError } = useDrafts();
  const open = Boolean(anchorEl);

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          NFL Draft Board
        </Typography>
        
        {loading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography color="error">Error loading drafts</Typography>
        ) : !drafts ? (
          <Typography>No drafts available</Typography>
        ) : (
          <>
            <Button
              id="draft-menu-button"
              aria-controls={open ? 'draft-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              variant="contained"
              sx={{ mb: 2 }}
            >
              Select Draft
            </Button>
            <Menu
              id="draft-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'draft-menu-button',
              }}
            >
              {drafts.map((draft) => (
                <MenuItem
                  key={draft.id}
                  onClick={() => handleMenuItemClick(`/draft/${draft.id}`)}
                >
                  {draft.name}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        
        <FootballField />
      </Box>
    </main>
  );
}
