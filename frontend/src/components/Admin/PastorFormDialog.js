import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

function PastorFormDialog({ open, onClose, onSave, data }) {
  const [formData, setFormData] = useState({
    data_ordenacao: data?.data_ordenacao || "",
    formacao: data?.formacao || "",
    especializacoes: data?.especializacoes || "",
    biografia: data?.biografia || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Informações do Pastor</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          label="Data de Ordenação"
          type="date"
          name="data_ordenacao"
          value={formData.data_ordenacao}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Formação"
          name="formacao"
          value={formData.formacao}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Especializações"
          name="especializacoes"
          value={formData.especializacoes}
          onChange={handleChange}
          multiline
          rows={2}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Biografia"
          name="biografia"
          value={formData.biografia}
          onChange={handleChange}
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PastorFormDialog;
