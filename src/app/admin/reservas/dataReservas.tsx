"use client";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, TableContainer, Paper, Collapse, Card, Typography } from "@mui/material";
import { fetchReservations, approveReservationById, denyReservationById, finalizeReservationById, annularReservationById} from "@/api/fetchs/get_reservas";
import { Tooltip, Select } from "antd";
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import { useState, useEffect, useRef } from "react";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import { Reserva } from "@/types/admin/Reserva";
import React from "react";
import CardTable from "@/components/Tables/CardTable";
import SliderObjects from "@/components/SliderObjects/SliderObjects";
import Swal from "sweetalert2";
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";


const { Option } = Select;


function formatCurrency(value: string | number): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) {
    return "Invalid price";
  }
  return numericValue.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',  
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

interface RowProps {
  row: Reserva;
}

const Row: React.FC<RowProps> = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [loadingReservationId, setLoadingReservationId] = useState<number | null>(null);
  const [loadingInfo, setLoadingInfo] = useState<string | null>(null);
  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString('es-CO'); 
  };

  const isFinalizable = new Date() > new Date(row.end_date);
  const isCancelable = new Date() < new Date(row.end_date);

  

  const handleActionClick = async (id_reservation: string | number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const handleButtonClick = async(key : any) => {
      await handleAction(key)
    }

    const opciones = {
      'Aprobar': 'Aprobar',
      'Denegar': 'Denegar',
      'Finalizar': 'Finalizar',
      'Anular': 'Anular'
    }
    
    const { value } = await Swal.fire({
      icon: "info",
      iconColor: "#000",
      color: "#000",
      title: `¿Qué quieres hacer con la reserva #${id_reservation}?`,
      html: `
        <div id="button-container" style="width: 100%; padding: 15px; background-color: transparent; border-radius: 16px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between;">
          ${Object.entries(opciones)
            .map(
              ([key, label]) => `
                <button 
                  id="btn-${key}" 
                  style="flex: 1 1 calc(50% - 10px); padding: 10px 20px; border: none; border-radius: 16px; font-size: 16px; cursor: pointer; transition: background-color 0.3s, color 0.3s, transform 0.5s, opacity 0.2s; background-color: ${
                    label === "Aprobar"
                      ? "#28a745"
                      : label === "Denegar"
                      ? "#dc3545"
                      : label === "Finalizar"
                      ? "#ffc107"
                      : "#6c757d"
                  }; color: ${label === "Finalizar" ? "black" : "white"};"
                >
                  ${label}
                </button>
              `
            )
            .join("")}
        </div>
      `,
      showCancelButton: true,
      cancelButtonText: "Volver",
      cancelButtonColor: "#000",
      showConfirmButton: false,
      didOpen: () => {
        Object.keys(opciones).forEach((key) => {
          const button = document.getElementById(`btn-${key}`);
          button?.addEventListener("click", () => handleButtonClick(key));
        });
      },
      background: "url(/images/grids/bg-morado-bordes.avif) no-repeat center center/cover",
      customClass: {
        popup: "rounded-3xl shadow shadow-6",
        container: "custom-background",
        cancelButton: "rounded-xl"
      },
    });
  
    // Si hay una acción seleccionada, la manejamos
    if (value) {
      await handleAction(value);
    }
  };

  const handleAction = async (action: string) => {
    let confirmationMessage = '';
    let result = false;

    switch (action) {
      case 'Aprobar':
        confirmationMessage = '¿Estás seguro de que deseas aprobar esta reserva?';
        result = await Swal.fire({
          title: 'Confirmación',
          text: confirmationMessage,
          iconColor: "#000",
          color: "#000",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: "#000",
          confirmButtonColor: "#000",
          confirmButtonText: 'Aprobar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: 'custom-background',
            cancelButton: "rounded-xl",
            confirmButton: "rounded-xl",
          },
        }).then((res) => res.isConfirmed);
        
        if (result) {
            toast.promise(
              approveReservationById(row.id_reservation),
               {
                 loading: 'Aprobando...',
                 success: <b>Reserva Aprobada!</b>,
                 error: <b>Error al intentar a la Reserva.</b>,
               }
             );
            // await approveReservationById(row.id_reservation);
            // toast.success(`Reserva #${row.id_reservation} aprobada correctamente`);
        }
        break;

      case 'Denegar':


      result = await Swal.fire({
        title: 'Motivo de denegación',
        html: `Cuéntale a <span class="font-bold">${row.name_client}</span> el motivo de la denegación:`,
        iconColor: "#000",
        color: "#000",
        icon: 'question',
        input: 'text', // Agrega un input de texto
        inputPlaceholder: 'Escribe tu motivo aquí...', // Placeholder para el input
        showCancelButton: true,
        cancelButtonColor: "#000",
        confirmButtonColor: "#000",
        confirmButtonText: 'Denegar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
          cancelButton: "rounded-xl",
          confirmButton: "rounded-xl",
          input: "rounded-xl border border-stroke bg-dark-2 shadow shadow-xl text-base text-white outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary", // Personalización del input
        },
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage('¡Debes ingresar un motivo!');
            return false;
          }
          return value;
        },
      }).then((res) => {
        if (res.isConfirmed) {
          const motivoDenegacion = res.value;
          toast.promise(
            denyReservationById(row.id_reservation, motivoDenegacion),
             {
               loading: 'Denegando...',
               success: <b>Reserva Denegada!</b>,
               error: <b>Error al intentar a la Reserva.</b>,
             }
           );

          console.log("Motivo de denegación:", motivoDenegacion);
        }
        return res.isConfirmed || false;
      });

        break;

      case 'Finalizar':
        confirmationMessage = '¿Estás seguro de que deseas finalizar esta reserva?';
        result = await Swal.fire({
          title: 'Confirmación',
          text: confirmationMessage,
          iconColor: "#000",
          color: "#000",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: "#000",
          confirmButtonColor: "#000",
          confirmButtonText: 'Finalizar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: 'custom-background',
            cancelButton: "rounded-xl",
            confirmButton: "rounded-xl",
          }
        }).then((res) => res.isConfirmed);
        
        if (result) {

          confirmationMessage = 'Esta es la Lista de Chequeo';
          result = await Swal.fire({
          title: 'Confirmación',
          html: `<span class="font-bold">Tabla para la lista de chequeo, indica las cantidades dañadas de los productos</span>`,
          text: confirmationMessage,
          iconColor: "#000",
          color: "#000",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: "#000",
          confirmButtonColor: "#000",
          confirmButtonText: 'Finalizar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: 'custom-background',
            cancelButton: "rounded-xl",
            confirmButton: "rounded-xl",
          }
        }).then((res) => res.isConfirmed);

          if (result) {
            toast.promise(
              finalizeReservationById(row.id_reservation),
               {
                 loading: 'Finalizando...',
                 success: <b>Reserva Finalizada!</b>,
                 error: <b>Error al intentar finalizar la Reserva.</b>,
               }
             );
          }
          
        }
        break;

      case 'Anular':
      
        result = await Swal.fire({
          title: 'Motivo de anulación',
          html: `Cuéntale a <span class="font-bold">${row.name_client}</span> el motivo de la anulación:`,
          iconColor: "#000",
          color: "#000",
          icon: 'question',
          input: 'text', // Agrega un input de texto
          inputPlaceholder: 'Escribe tu motivo aquí...', // Placeholder para el input
          showCancelButton: true,
          cancelButtonColor: "#000",
          confirmButtonColor: "#000",
          confirmButtonText: 'Anular',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: 'custom-background',
            cancelButton: "rounded-xl",
            confirmButton: "rounded-xl",
            input: "rounded-xl border border-stroke bg-dark-2 shadow shadow-xl text-base text-white outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary", // Personalización del input
          },
          preConfirm: (value) => {
            if (!value) {
              Swal.showValidationMessage('¡Debes ingresar un motivo!');
              return false;
            }
            return value;
          },
        }).then((res) => {
          if (res.isConfirmed) {
            const motivoAnulacion = res.value;
            toast.promise(
              annularReservationById(row.id_reservation, motivoAnulacion),
               {
                 loading: 'Anulando...',
                 success: <b>Reserva Anulada!</b>,
                 error: <b>Error al intentar anular la Reserva.</b>,
               }
             );
  
            console.log("Motivo de anulación:", motivoAnulacion);
          }
          return res.isConfirmed || false;
        });
        break;

      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f7f7f7',
            boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.4)',
          },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell component="th" scope="row">{row.id_reservation}</TableCell>
        <TableCell align="right">{row.name_client}</TableCell>
        <TableCell align="right">{formatDate(row.start_date)}</TableCell>
        <TableCell align="right">{formatDate(row.end_date)}</TableCell>
        <TableCell align="right">{row.address}</TableCell>
        <TableCell align="right">{row.city}</TableCell>
        <TableCell align="right">{row.neighborhood}</TableCell>
        <TableCell align="right">{formatCurrency(row.total_reservation)}</TableCell>
        <TableCell align="right">
          <Typography>{row.status}</Typography>
        </TableCell>
        <TableCell align="right">
        <Button
            variant="outlined"
            onClick={(event) => handleActionClick(row.id_reservation, event)} 
            startIcon={<RuleRoundedIcon />}
            style={{ margin: '0 5px', borderRadius: '10px' }}
          >
            Acciones
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10000}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: '100%' }}>
                <CardTable
                  data={
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Producto</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell align="right">Precio Unitario</TableCell>
                          <TableCell align="right">Precio Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.details.map((detail) => (
                          <Tooltip placement="right" title={<SliderObjects urls={detail.urls} id_product={detail.id_product} />} key={detail.id_product}>
                            <TableRow sx={{ cursor: 'pointer' }}>
                              <TableCell align="left">{detail.id_product}</TableCell>
                              <TableCell component="th" scope="row">{detail.name}</TableCell>
                              <TableCell align="right">{detail.quantity}</TableCell>
                              <TableCell align="right">{formatCurrency(detail.unit_price)}</TableCell>
                              <TableCell align="right">{formatCurrency(detail.total_price)}</TableCell>
                            </TableRow>
                          </Tooltip>
                        ))}
                        <TableRow>
                          <TableCell rowSpan={3} />
                          <TableCell colSpan={2}>Subtotal</TableCell>
                          <TableCell align="right">{formatCurrency(row.total_reservation)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  }
                />
              </div>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const ReservationsTable: React.FC = () => {
  const [reservationsData, setReservationsData] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null); 
  const searchInput = useRef<HTMLInputElement>(null);
  const [changeStatus, setChangeStatus] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetchReservations();
    setReservationsData(response);
    setLoading(false);
  };

  const sortReservations = (direction: 'asc' | 'desc') => {
    const sortedData = [...reservationsData].sort((a, b) => {
      if (direction === 'asc') {
        return a.id_reservation - b.id_reservation;
      } else {
        return b.id_reservation - a.id_reservation;
      }
    });
    setReservationsData(sortedData);
  };

  const handleSortToggle = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    sortReservations(newDirection);
  };

  useEffect(() => {
    fetchData();
  }, [changeStatus]);

  const uniqueStatuses = Array.from(new Set(reservationsData.map(row => row.status)));

  const filteredData = reservationsData.filter((row) => {
    const matchesSearch = row.name_client.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? row.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoaderBasic />;
  }

  return (
    <TableContainer component={Paper}>
      <Button onClick={handleSortToggle}>
        <SwapVertRoundedIcon />
      </Button>
      <Table sx={{ minWidth: 650 }} aria-label="reservations table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">
              Cliente{" "}
              <Input className="rounded-xl"
                ref={searchInput}
                placeholder="Buscar"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 100 }}
                prefix={<SearchOutlined />}
              />
            </TableCell>
            <TableCell align="right">Fecha Inicio</TableCell>
            <TableCell align="right">Fecha Fin</TableCell>
            <TableCell align="right">Dirección</TableCell>
            <TableCell align="right">Ciudad</TableCell>
            <TableCell align="right">Barrio</TableCell>
            <TableCell align="right">Teléfono</TableCell>
            <TableCell align="right">
              Estado :{" "}
              <select className="rounded-xl"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                style={{ width: 90  }}
              >
                <option value="">Todos</option>
                {uniqueStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </TableCell>
            <TableCell align="right">Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row) => (
            <Row key={row.id_reservation} row={row} />
          ))}
        </TableBody>
      </Table>
      <Toaster position="bottom-right" />
    </TableContainer>
  );
};

export default ReservationsTable;