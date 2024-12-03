"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Card,
} from "@mui/material";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { checkToken } from "@/api/validations/check_cookie";
import { logOut } from "@/utils/validationsTokens";
import { fetchUserById } from "@/api/fetchs/get_usuarios";


interface ClientData {
  id_user: string;
  names: string;
  lastnames: string;
  dni: string;
  mail: string;
  phone_number: string;
}

const ProfileDash: React.FC = () => {
  const [clientData, setClientData] = useState<ClientData>({
    id_user: "",
    names: "",
    lastnames: "",
    dni: "",
    mail: "",
    phone_number: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchClientData = async () => {
    setLoading(true);
    const { result, data } = await checkToken();

    if (result) {
      const userData = await fetchUserById(data.id_user); 
      const dataClient = {
        id_user: data.id_user,
        names: userData.names,
        lastnames: userData.lastnames,
        dni: userData.dni,
        mail: userData.mail,
        phone_number: userData.phone_number,
      };
      setClientData(dataClient);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar los datos del perfil.",
      });
      router.push("/login");
    }

    setLoading(false);
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
    const { names, lastnames, phone_number, mail } = clientData;

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

    if (!/^\d{10}$/.test(phone_number)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El número de teléfono debe tener 10 dígitos.",
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(mail)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El correo electrónico no es válido.",
      });
      return false;
    }

    return true;
    window.location.reload();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!validateFields()) return;
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch(
        `https://api-aguamarina-mysql-v2.onrender.com/api/v2/users/${clientData.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(clientData),
        }
      );
  
      const responseJson = await response.json();
  
      if (!response.ok) {
        throw new Error(responseJson.message || "Network response was not ok");
      }
  
      if (responseJson.ok) {
        await fetchClientData();
        Swal.fire({
          icon: "success",
          title: "Actualización Exitosa",
          text: "Tus datos se han actualizado correctamente!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseJson.message || "Error Desconocido",
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

  const handleLogout = async () => {
    try {
      const result = await logOut();

      if (result) {
        router.push("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cerrar la sesión. Inténtalo nuevamente.",
        });
      }
    } catch (error) {
      console.error("Error en el logout:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cerrar sesión.",
      });
    }
  };
  

  return (
    <Container>
      <Card 
      variant="outlined" 
      sx={{
        padding: 3, 
        marginTop: 3,
        backgroundColor: 'white', 
        color: 'black',            
        '&.dark': {
          backgroundColor: '#1a202c', 
          color: 'white',             
        },
      }}
      className="dark:bg-gray-800 dark:text-white mb-5" 
    >
        <Typography variant="h4" align="center" gutterBottom>
          Perfil de personal
        </Typography>
        {loading ? (
          <Typography variant="h6" align="center">
            Cargando...
          </Typography>
        ) : (
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
                  InputProps={{
                    style: { color: "black" },}}
                  color="info"
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
                  InputProps={{
                    style: { color: "black" },}}
                  color="info"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="dni"
                  label="Cedula"
                  variant="outlined"
                  fullWidth
                  value={clientData.dni}
                  onChange={handleChange}
                  required
                  disabled
                  InputProps={{
                    style: { color: "black" },}}
                  color="info"
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
                  InputProps={{
                    style: { color: "black" },}}
                  color="info"
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
                  InputProps={{
                    style: { color: "black" },}}
                  color="info"
                />
              </Grid>
            </Grid>
            <div style={{ textAlign: "center", marginTop: "20px"}}>
              <Button
                className="mt-4 rounded-xl bg-primary px-4 py-2 text-center text-sm font-medium text-white transition duration-300 hover:bg-primary/90 lg:mt-0 capitalize mr-4"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
              {isSubmitting ? "Actualizando..." : "Actualizar"}
              </Button>
              <Button
                className="mt-4 rounded-xl bg-primary px-4 py-2 text-center text-sm font-medium text-white transition duration-300 hover:bg-primary/90 lg:mt-0 capitalize"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </div>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default ProfileDash;
