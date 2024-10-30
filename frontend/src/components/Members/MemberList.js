// src/components/Members/MemberList.js

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/members");
        setMembers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
        setError(
          "Erro ao carregar membros. Por favor, tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Lista de Membros
      </Typography>
      <Button
        component={Link}
        to="/members/new"
        variant="contained"
        color="primary"
        style={{ marginBottom: "20px" }}
      >
        Adicionar Novo Membro
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/members/${member.id}`}
                    variant="outlined"
                    color="primary"
                    style={{ marginRight: "10px" }}
                  >
                    Ver
                  </Button>
                  <Button
                    component={Link}
                    to={`/members/${member.id}/edit`}
                    variant="outlined"
                    color="secondary"
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default MemberList;
