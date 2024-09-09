import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tab, Tabs, CircularProgress } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { backend } from 'declarations/backend';

interface TaxPayer {
  tid: number;
  firstName: string;
  lastName: string;
  address: string;
}

const columns = [
  { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
  { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
  { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
  { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
];

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TaxPayer) => {
    setLoading(true);
    try {
      await backend.createTaxPayer(BigInt(data.tid), data.firstName, data.lastName, data.address);
      reset();
      await fetchTaxPayers();
    } catch (error) {
      console.error('Error creating tax payer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Management System
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="List Records" />
          <Tab label="Add Record" />
        </Tabs>
      </Box>
      {tabValue === 0 && (
        <Box sx={{ height: 400, width: '100%' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <DataTable
              columns={columns}
              data={taxPayers}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
            />
          )}
        </Box>
      )}
      {tabValue === 1 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="tid"
            control={control}
            defaultValue=""
            rules={{ required: 'TID is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="TID"
                type="number"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: 'First Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={{ required: 'Last Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add TaxPayer'}
          </Button>
        </form>
      )}
    </Container>
  );
}

export default App;
