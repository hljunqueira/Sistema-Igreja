// src/components/Admin/UserManagement.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Checkbox,
  Button,
  Alert,
} from "@mui/material";
import { CSVLink } from "react-csv";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({
    userType: "all",
    isBaptized: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user } = useAuth();

  // Preparar dados para exportação CSV
  const csvData = users.map((user) => ({
    Nome: user.name,
    Email: user.email,
    Tipo: user.user_type,
    Batizado: user.is_baptized ? "Sim" : "Não",
    Telefone: user.phone || "",
    "Data de Nascimento": user.birth_date || "",
    Status: user.status || "",
  }));

  const csvHeaders = [
    { label: "Nome", key: "Nome" },
    { label: "Email", key: "Email" },
    { label: "Tipo", key: "Tipo" },
    { label: "Batizado", key: "Batizado" },
    { label: "Telefone", key: "Telefone" },
    { label: "Data de Nascimento", key: "Data de Nascimento" },
    { label: "Status", key: "Status" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Erro ao carregar usuários: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = async (userId, newType) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, {
        user_type: newType,
      });
      setUsers(
        users.map((user) => (user.id === userId ? response.data : user))
      );
    } catch (err) {
      setError(
        "Erro ao atualizar tipo de usuário: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBulkAction = async (action, userId = null) => {
    const usersToDelete = userId ? [userId] : selectedUsers;

    if (
      action === "delete" &&
      window.confirm("Tem certeza que deseja excluir os usuários selecionados?")
    ) {
      try {
        await Promise.all(
          usersToDelete.map((id) => api.delete(`/admin/users/${id}`))
        );
        await fetchUsers();
        setSelectedUsers([]);
        setError(null); // Limpa o erro após a exclusão
      } catch (err) {
        setError(
          "Erro ao excluir usuários: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (filter.userType === "all" || user.user_type === filter.userType) &&
      (filter.isBaptized === "all" ||
        user.is_baptized === (filter.isBaptized === "true")) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (user?.user_type !== "administrador") {
    return <div>Acesso negado</div>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Usuários
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box my={2}>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Tipo de Usuário</InputLabel>
          <Select
            value={filter.userType}
            onChange={(e) => setFilter({ ...filter, userType: e.target.value })}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="visitante">Visitante</MenuItem>
            <MenuItem value="membro">Membro</MenuItem>
            <MenuItem value="administrador">Administrador</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Batizado</InputLabel>
          <Select
            value={filter.isBaptized}
            onChange={(e) =>
              setFilter({ ...filter, isBaptized: e.target.value })
            }
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="true">Sim</MenuItem>
            <MenuItem value="false">Não</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Buscar usuários"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Box my={2}>
        <Button
          variant="contained"
          color="secondary"
          disabled={selectedUsers.length === 0}
          onClick={() => handleBulkAction("delete")}
        >
          Excluir Selecionados
        </Button>

        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename={"usuarios.csv"}
          className="button"
          style={{
            textDecoration: "none",
            marginLeft: "10px",
          }}
        >
          <Button variant="contained" color="primary">
            Exportar para CSV
          </Button>
        </CSVLink>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(filteredUsers.map((u) => u.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Batizado</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data de Nascimento</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(
                          selectedUsers.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <FormControl variant="outlined" size="small">
                    <Select
                      value={user.user_type}
                      onChange={(e) =>
                        handleUserTypeChange(user.id, e.target.value)
                      }
                    >
                      <MenuItem value="visitante">Visitante</MenuItem>
                      <MenuItem value="membro">Membro</MenuItem>
                      <MenuItem value="administrador">Administrador</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{user.is_baptized ? "Sim" : "Não"}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>
                  {user.birth_date
                    ? new Date(user.birth_date).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleBulkAction("delete", user.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
}

export default UserManagement;
