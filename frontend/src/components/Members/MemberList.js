// frontend/src/components/Members/MemberList.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { api } from "../../services/api";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get("/members");
      setMembers(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar membros: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este membro?")) {
      try {
        await api.delete(`/members/${id}`);
        setMembers(members.filter((member) => member.id !== id));
      } catch (err) {
        setError("Erro ao excluir membro: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" component="h1">
          Membros
        </Typography>
        <Button
          component={Link}
          to="/members/add"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Adicionar Membro
        </Button>
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>
                  <IconButton
                    component={Link}
                    to={`/members/edit/${member.id}`}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(member.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default MemberList;
