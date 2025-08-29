import React from 'react';
import { Grid, TextField, MenuItem, Autocomplete, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ROLE_OPTIONS = ['Agent', 'Partner', 'Sales Manager', 'Company', 'Association'];

const AddSplit = ({ index, split = {}, onChange = () => {}, onRemove = () => {} }) => {
  const handleRoleChange = (e) => {
    onChange(index, { ...split, role: e.target.value });
  };

  const handleNameChange = (event, value) => {
    onChange(index, { ...split, name: value || '' });
  };

  const handlePercentageChange = (e) => {
    const raw = e.target.value;
    const numeric = raw.replace(/[^0-9.]/g, '');
    if (numeric === '') {
      onChange(index, { ...split, percentage: '' });
      return;
    }
    const num = parseFloat(numeric);
    if (!Number.isNaN(num) && num >= 0 && num <= 100) {
      onChange(index, { ...split, percentage: `${num}%` });
    } else {
      onChange(index, { ...split, percentage: raw });
    }
  };

  return (
    <Grid container spacing={2} alignItems="flex-start" style={{ marginTop: 8, marginBottom: 8 }}>
      <Grid item xs={12} sm={3}>
        <TextField
          select
          fullWidth
          label="Role"
          value={split.role || ''}
          onChange={handleRoleChange}
          variant="outlined"
          size="small"
        >
          {ROLE_OPTIONS.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Autocomplete
          freeSolo
          options={[]} // populate later
          value={split.name || ''}
          onChange={handleNameChange}
          onInputChange={(e, v, reason) => {
            if (reason === 'input') onChange(index, { ...split, name: v });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Name"
              variant="outlined"
              size="small"
              fullWidth
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Percentage"
          value={split.percentage || ''}
          onChange={handlePercentageChange}
          placeholder="0%"
          variant="outlined"
          size="small"
          inputProps={{ pattern: "[0-9.]*", inputMode: "numeric" }}
          helperText="0 - 100"
        />
      </Grid>

      <Grid item xs={12} sm={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton size="small" onClick={() => onRemove(index)} aria-label="remove split">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default AddSplit;