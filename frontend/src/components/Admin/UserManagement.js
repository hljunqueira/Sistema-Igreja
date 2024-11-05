import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleUserTypeChange = async (userId, newUserType) => {
    try {
      await api.put(`/admin/users/${userId}`, { user_type: newUserType });
      fetchUsers();
    } catch (error) {
      console.error("Erro ao atualizar tipo de usuário:", error);
    }
  };

  if (user?.user_type !== "administrador") {
    return <div>Acesso negado</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Tipo de Usuário</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.user_type}
                  onChange={(e) =>
                    handleUserTypeChange(user.id, e.target.value)
                  }
                >
                  <MenuItem value="administrador">Administrador</MenuItem>
                  <MenuItem value="pastor">Pastor</MenuItem>
                  <MenuItem value="lider">Líder</MenuItem>
                  <MenuItem value="membro">Membro</MenuItem>
                </Select>
              </TableCell>
              <TableCell>Ações aqui</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserManagement;
