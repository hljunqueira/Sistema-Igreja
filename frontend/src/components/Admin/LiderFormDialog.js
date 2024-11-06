import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

function LiderFormDialog({ open, onClose, onSave, data }) {
  const [formData, setFormData] = useState({
    area_lideranca: data?.area_lideranca || "",
    descricao_funcao: data?.descricao_funcao || "",
    data_inicio: data?.data_inicio || "",
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
      <DialogTitle>Informações do Líder</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          label="Área de Liderança"
          name="area_lideranca"
          value={formData.area_lideranca}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Descrição da Função"
          name="descricao_funcao"
          value={formData.descricao_funcao}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Data de Início"
          type="date"
          name="data_inicio"
          value={formData.data_inicio}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
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

export default LiderFormDialog;
