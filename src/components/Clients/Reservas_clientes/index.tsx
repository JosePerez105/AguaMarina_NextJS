"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Container, Card, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Typography, Collapse, Divider, Tooltip } from "@mui/material"; 
import { fetchReservationsByUser } from "@/api/fetchs/get_reservas";
import { checkToken } from "@/api/validations/check_cookie"; 
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import { Reserva } from "@/types/admin/Reserva";
import SliderObjects from "@/components/SliderObjects/SliderObjects";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { cancelReservationById } from "@/api/fetchs/get_reservas";
import Swal from "sweetalert2";


function formatCurrency(value: string | number): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) {
    return "Precio inválido";
  }
  return numericValue.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

const MisReservas: React.FC = () => {
  const [data, setData] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({}); 
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getUserId = useCallback(async () => {
    try {
      const response = await checkToken();
      if (response.result) {
        console.log("ID de usuario obtenido:", response.data.id_user); 
        return response.data.id_user;
      } else {
        console.log("No se pudo obtener el ID del usuario desde el token.");
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo el ID del usuario desde el token:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = await getUserId();
        if (userId) {
          console.log("Obteniendo reservas para el usuario con ID:", userId);
          const reservas = await fetchReservationsByUser(userId);
          console.log("Reservas obtenidas:", reservas);  

          if (Array.isArray(reservas) && reservas.length > 0) {
            setData(reservas);  
          } else {
            console.log("No se encontraron reservas para este usuario.");
            setData([]);  
          }
        }
      } catch (error) {
        console.error("Error obteniendo las reservas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [getUserId]);

  const handleCancelReservation = async (reservationId: string | number) => {
    try {
      setError(null);
      setSuccess(null); 
      const { value: cancelReason } = await Swal.fire({
        title: '¿Por qué deseas cancelar esta reserva?',
        input: 'select',
        inputOptions: {
          'Cambio de planes': 'Cambio de planes',
          'No necesito la reserva': 'No necesito la reserva',
          'Encontré una opción mejor': 'Encontré una opción mejor',
          'Otro': 'Otro'
        },
        inputPlaceholder: 'Selecciona una razón',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar una razón';
          }
        }
      });
  
      if (cancelReason) {
        const success = await cancelReservationById(reservationId, cancelReason);
  
        if (success) {
          setData((prevData) => prevData.filter(reservation => reservation.id_reservation !== reservationId));
          setSuccess("Reserva cancelada exitosamente.");
        } else {
          setError("No se pudo cancelar la reserva. Intenta nuevamente.");
        }
      } else {
        console.log("Cancelación cancelada por el usuario.");
      }
    } catch (error) {
      console.error("Error cancelando la reserva:", error);
      setError("Hubo un error al cancelar la reserva.");
    }
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id.toString()]: !prev[id.toString()],  
    }));
  };

  const datosPaginados = data && data.length > 0 ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : [];
  const totalPages = data && data.length > 0 ? Math.ceil(data.length / rowsPerPage) : 0;

  return (
    <React.Fragment>
      <Container className="dark:dark-bg">
        <Card variant="outlined" sx={{ padding: 3, marginTop: 3 }}>
          <TableContainer component={Paper}>
            <Table aria-label="tabla de reservas">
              <TableHead>
                <TableRow>
                  <TableCell>ID Reserva</TableCell>
                  <TableCell align="right">Fecha Inicio</TableCell>
                  <TableCell align="right">Fecha Fin</TableCell>
                  <TableCell align="right">Dirección</TableCell>
                  <TableCell align="right">Ciudad</TableCell>
                  <TableCell align="right">Barrio</TableCell>
                  <TableCell align="right">Total Reserva</TableCell>
                  <TableCell align="right">Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <LoaderBasic />
                    </TableCell>
                  </TableRow>
                ) : datosPaginados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No hay reservas disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  datosPaginados.map((row) => (
                    <React.Fragment key={row.id_reservation}>
                      <TableRow
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#f7f7f7",
                            boxShadow: "4px 4px 16px rgba(0, 0, 0, 0.4)",
                          },
                        }}
                        onClick={() => toggleRow(row.id_reservation)}
                      >
                        <TableCell component="th" scope="row">
                          {row.id_reservation}
                        </TableCell>
                        <TableCell align="right">
                          {new Date(row.start_date).toLocaleDateString("es-CO")}
                        </TableCell>
                        <TableCell align="right">
                          {new Date(row.end_date).toLocaleDateString("es-CO")}
                        </TableCell>
                        <TableCell align="right">{row.address}</TableCell>
                        <TableCell align="right">{row.city}</TableCell>
                        <TableCell align="right">{row.neighborhood}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(row.total_reservation)}
                        </TableCell>
                        <TableCell align="right">{row.status}</TableCell>
                        
                        
                      </TableRow>
                      <TableCell><button className="rounded-lg p-2 text-red-600 transition duration-300 hover:text-red-800" onClick={() => handleCancelReservation(row.id_reservation)}>Cancelar</button></TableCell>
                      <TableRow>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={10000}
                        >
                          <Collapse
                            in={openRows[row.id_reservation.toString()]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <div style={{ width: "100%" }}>
                                <Card>
                                  <Table size="small" aria-label="purchases">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Producto</TableCell>
                                        <TableCell align="right">
                                          Cantidad
                                        </TableCell>
                                        <TableCell align="right">
                                          Precio Unitario
                                        </TableCell>
                                        <TableCell align="right">
                                          Precio Total
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {row.details.map((detail) => (
                                        <Tooltip
                                          placement="right"
                                          title={
                                            <SliderObjects
                                              urls={detail.urls}
                                              id_product={detail.id_product}
                                            />
                                          }
                                          key={detail.id_product}
                                        >
                                          <TableRow sx={{ cursor: "pointer" }}>
                                            <TableCell align="left">
                                              {detail.id_product}
                                            </TableCell>
                                            <TableCell
                                              component="th"
                                              scope="row"
                                            >
                                              {detail.name}
                                            </TableCell>
                                            <TableCell align="right">
                                              {detail.quantity}
                                            </TableCell>
                                            <TableCell align="right">
                                              {detail.unit_price}
                                            </TableCell>
                                            <TableCell align="right">
                                              {detail.total_price}
                                            </TableCell>
                                          </TableRow>
                                        </Tooltip>
                                      ))}
                                      <TableRow>
                                        <TableCell colSpan={5}>
                                          <Divider
                                            style={{
                                              borderColor: "#000",
                                              fontSize: 25,
                                            }}
                                          >
                                            Cotización
                                          </Divider>
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell colSpan={2}>
                                          <Typography variant="h3">
                                            Subtotal
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          {formatCurrency(
                                            row.total_reservation,
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </Card>
                              </div>
                            </div>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="pagination-controls mt-4 flex items-center justify-between">
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
          <div className="pagination-controls">
            <label>
              Filas por página:
              <input
                type="number"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                min="1"
              />
            </label>
          </div>
        </Card>
      </Container>
    </React.Fragment>
  );
};

export default MisReservas;
