import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MuiAlert from "@mui/material/Alert";
import { CSVLink } from "react-csv";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import PastorFormDialog from "./PastorFormDialog";
import LiderFormDialog from "./LiderFormDialog";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({
    userType: "all",
    isBaptized: "all",
    status: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openPastorForm, setOpenPastorForm] = useState(false);
  const [openLiderForm, setOpenLiderForm] = useState(false);
  const [openUserTypeDialog, setOpenUserTypeDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newUserType, setNewUserType] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.user_type !== "administrador") {
      setError("Acesso não autorizado");
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(
        response.data.map((user) => ({
          ...user,
          status: user.status || "Pendente", // Define status padrão
        }))
      );
      setLoading(false);
    } catch (error) {
      setError("Erro ao buscar usuários");
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      setSnackbar({
        open: true,
        message: "Status atualizado com sucesso",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setSnackbar({
        open: true,
        message: "Erro ao atualizar status",
        severity: "error",
      });
    }
  };

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

  const filteredUsers = users.filter(
    (user) =>
      (filter.userType === "all" || user.user_type === filter.userType) &&
      (filter.isBaptized === "all" ||
        user.is_baptized === (filter.isBaptized === "Sim")) &&
      (filter.status === "all" || user.status === filter.status) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleBulkAction = async (action, userId) => {
    try {
      if (action === "delete") {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
        setSnackbar({
          open: true,
          message: "Usuário excluído com sucesso",
          severity: "success",
        });
      }
    } catch (error) {
      setError("Erro ao executar ação em massa");
      setSnackbar({
        open: true,
        message: "Erro ao excluir usuário",
        severity: "error",
      });
    }
  };

  const handleOpenUserTypeDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenUserTypeDialog(true);
  };

  const handleCloseUserTypeDialog = () => {
    setOpenUserTypeDialog(false);
    setSelectedUserId(null);
    setNewUserType("");
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleUserTypeChange = async () => {
    if (!selectedUserId || !newUserType) return;

    try {
      await api.put(`/admin/users/${selectedUserId}`, {
        user_type: newUserType,
      });
      fetchUsers();
      handleCloseUserTypeDialog();

      setSnackbar({
        open: true,
        message: `Tipo de usuário alterado com sucesso para ${newUserType}`,
        severity: "success",
      });

      if (newUserType === "pastor") {
        setSelectedUser(users.find((user) => user.id === selectedUserId));
        setOpenPastorForm(true);
      } else if (newUserType === "lider") {
        setSelectedUser(users.find((user) => user.id === selectedUserId));
        setOpenLiderForm(true);
      }
    } catch (error) {
      setError("Erro ao alterar tipo de usuário");
      setSnackbar({
        open: true,
        message: "Erro ao alterar tipo de usuário",
        severity: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSavePastorData = async (data) => {
    try {
      await api.post("/admin/pastores", {
        ...data,
        user_id: selectedUser.id,
      });
      fetchUsers();
      setOpenPastorForm(false);
      setSnackbar({
        open: true,
        message: "Dados do pastor salvos com sucesso",
        severity: "success",
      });
    } catch (error) {
      setError("Erro ao salvar dados do pastor");
      setSnackbar({
        open: true,
        message: "Erro ao salvar dados do pastor",
        severity: "error",
      });
    }
  };

  const handleSaveLiderData = async (data) => {
    try {
      await api.post("/admin/lideres", {
        ...data,
        user_id: selectedUser.id,
      });
      fetchUsers();
      setOpenLiderForm(false);
      setSnackbar({
        open: true,
        message: "Dados do líder salvos com sucesso",
        severity: "success",
      });
    } catch (error) {
      setError("Erro ao salvar dados do líder");
      setSnackbar({
        open: true,
        message: "Erro ao salvar dados do líder",
        severity: "error",
      });
    }
  };

  const exportToPDF = () => {
    setSnackbar({
      open: true,
      message: "Gerando PDF...",
      severity: "info",
    });

    const maxRecords = 1000;
    const dataToExport = users.slice(0, maxRecords);
    const doc = new jsPDF();

    doc.text("Lista de Usuários", 14, 15);

    const columns = [
      "Nome",
      "Email",
      "Tipo",
      "Batizado",
      "Telefone",
      "Data de Nascimento",
      "Status",
    ];

    const data = dataToExport.map((user) => [
      user.name,
      user.email,
      user.user_type,
      user.is_baptized ? "Sim" : "Não",
      user.phone || "",
      user.birth_date || "",
      user.status || "",
    ]);

    doc.autoTable({
      head: [columns],
      body: data,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
        cellWidth: "wrap",
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
      },
    });

    doc.save("usuarios.pdf");

    setSnackbar({
      open: true,
      message: "PDF gerado com sucesso!",
      severity: "success",
    });
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <>
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
              onChange={(e) =>
                setFilter({ ...filter, userType: e.target.value })
              }
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="visitante">Visitante</MenuItem>
              <MenuItem value="membro">Membro</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="pastor">Pastor</MenuItem>
              <MenuItem value="lider">Líder</MenuItem>
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

          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Inativo">Inativo</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Pesquisar"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />

          <Button variant="contained" onClick={exportToPDF}>
            Exportar PDF
          </Button>
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={"usuarios.csv"}
          >
            <Button variant="contained" sx={{ ml: 2 }}>
              Exportar CSV
            </Button>
          </CSVLink>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell> Tipo</TableCell>
                <TableCell>Batizado</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.user_type}</TableCell>
                  <TableCell>{user.is_baptized ? "Sim" : "Não"}</TableCell>
                  <TableCell>{user.status || "Pendente"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenUserTypeDialog(user.id)}>
                      Editar
                    </Button>
                    <Button onClick={() => handleBulkAction("delete", user.id)}>
                      Excluir
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusChange(
                          user.id,
                          user.status === "Ativo" ? "Pendente" : "Ativo"
                        )
                      }
                    >
                      Mudar Status para{" "}
                      {user.status === "Ativo" ? "Pendente" : "Ativo"}
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => handleCloseSnackbar({ ...snackbar, open: false })}
        >
          <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Container>

      {/* Diálogo para alteração de tipo de usuário */}
      <Dialog open={openUserTypeDialog} onClose={handleCloseUserTypeDialog}>
        <DialogTitle>Alterar Tipo de Usuário</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Novo Tipo de Usuário</InputLabel>
            <Select
              value={newUserType}
              onChange={(e) => setNewUserType(e.target.value)}
            >
              <MenuItem value="visitante">Visitante</MenuItem>
              <MenuItem value="membro">Membro</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="pastor">Pastor</MenuItem>
              <MenuItem value="lider">Líder</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserTypeDialog}>Cancelar</Button>
          <Button onClick={handleUserTypeChange} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para o formulário do Pastor */}
      {openPastorForm && (
        <PastorFormDialog
          open={openPastorForm}
          onClose={() => setOpenPastorForm(false)}
          onSave={handleSavePastorData}
          data={selectedUser ? selectedUser.pastorData : {}}
        />
      )}

      {/* Diálogo para o formulário do Líder */}
      {openLiderForm && (
        <LiderFormDialog
          open={openLiderForm}
          onClose={() => setOpenLiderForm(false)}
          onSave={handleSaveLiderData}
          data={selectedUser ? selectedUser.liderData : {}}
        />
      )}
    </>
  );
}

export default UserManagement;
