"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, Card } from "@mui/material";
import Swal from "sweetalert2";

interface ClientData {
  id_user: string;
  names: string;
  lastnames: string;
  dni: string;
  mail: string;
  phone_number: string;
}

const ProfileClient: React.FC = () => {
  const [clientData, setClientData] = useState<ClientData>({
    id_user: "",
    names: "",
    lastnames: "",
    dni: "",
    mail: "",
    phone_number: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClientData = async () => {
    try {
      const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/check_cookie", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseJson = await response.json();
      setClientData(responseJson.body || {});
    } catch (error) {
      console.error("Error fetching client data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar los datos del perfil.",
      });
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateFields = () => {
    const { names, lastnames, phone_number } = clientData;

    if (!names.trim() || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(names)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Los nombres son obligatorios y solo deben contener letras.",
      });
      return false;
    }
    if (!lastnames.trim() || !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(lastnames)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Los apellidos son obligatorios y solo deben contener letras.",
      });
      return false;
    }

    if (!/^\d{9}$/.test(phone_number)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El número de teléfono debe tener 9 dígitos.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!validateFields()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/users/${clientData.id_user}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(clientData),
      });

      const responseJson = await response.json();
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (responseJson.ok) {
        await fetchClientData();
        Swal.fire({
          icon: "success",
          title: "Actualización Exitosa",
          text: "Tus datos se han actualizado correctamente!",
        });
      } else {
        const errorMessage = responseJson.message || "Error Desconocido";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el perfil.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Card variant="outlined" sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Perfil del cliente
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="names"
                label="Nombres"
                variant="outlined"
                fullWidth
                value={clientData.names}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="lastnames"
                label="Apellidos"
                variant="outlined"
                fullWidth
                value={clientData.lastnames}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="dni"
                label="DNI"
                variant="outlined"
                fullWidth
                value={clientData.dni}
                onChange={handleChange}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="mail"
                label="Correo Electrónico"
                variant="outlined"
                fullWidth
                value={clientData.mail}
                onChange={handleChange}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="phone_number"
                label="Número de Teléfono"
                variant="outlined"
                fullWidth
                value={clientData.phone_number}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
};

export default ProfileClient;
