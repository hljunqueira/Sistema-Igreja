// src/components/Members/MemberTable.js
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../contexts/AuthContext";
import { deleteMember } from "../../services/api";
import MemberForm from "./MemberForm";

function MemberTable({ members, onMemberDeleted, onMemberUpdated }) {
  const [editingMember, setEditingMember] = useState(null);
  const { getToken } = useAuth();

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este membro?")) {
      try {
        const token = getToken();
        await deleteMember(token, id);
        onMemberDeleted();
      } catch (error) {
        console.error("Erro ao excluir membro:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data de Nascimento</TableCell>
              <TableCell>Data de Batismo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{formatDate(member.birth_date)}</TableCell>
                <TableCell>{formatDate(member.baptism_date)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => setEditingMember(member)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(member.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!editingMember}
        onClose={() => setEditingMember(null)}
        maxWidth="md"
        fullWidth
      >
        {editingMember && (
          <MemberForm
            initialData={editingMember}
            onMemberAdded={(updatedMember) => {
              onMemberUpdated(updatedMember);
              setEditingMember(null);
            }}
            onCancel={() => setEditingMember(null)}
          />
        )}
      </Dialog>
    </>
  );
}

export default MemberTable;
