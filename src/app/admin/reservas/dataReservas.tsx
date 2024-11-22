"use client";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Typography, Chip, Button, TableContainer, Paper, Collapse, Card } from "@mui/material";
import { fetchReservations } from "@/api/fetchs/get_reservas";
import { Divider, Progress, Tooltip } from "antd";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import changeStatus from "@/api/functions/changeStatus_Productos";
import { useState, useEffect, useCallback } from "react";
import Loader from "@/components/common/Loader";
import { Reserva } from "@/types/admin/Reserva";
import React from "react";
import CardTable from "@/components/Tables/CardTable";
import SliderObjects from "@/components/SliderObjects/SliderObjects";

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
  // fetchData: () => Promise<void>;
}

const Row: React.FC<RowProps> = ({ row }) => {
  // const [alert, setAlert] = useState<Alert | null>(null);
  const [open, setOpen] = useState(false);
  const [loadingReservationId, setLoadingReservationId] = useState<number | null>(null);
  const [loadingInfo, setLoadingInfo] = useState<string | null>(null);

  const approveReservation = async (res: Reserva) => {
    // setAlert(null);
    setLoadingReservationId(res.id_reservation);
    const id = res.id_reservation;
    // Lógica para aprobar la reserva
    // ...
  };

  const denyReservation = async (res: Reserva) => {
    setLoadingInfo('deny');
    // setAlert(null);
    setLoadingReservationId(res.id_reservation);
    const id = res.id_reservation;
    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_deny/${id}`);
      if (response.ok) {
        // await fetchData();
        // setAlert({
        //   Titulo: 'Correcto!!',
        //   Texto: `Reserva #'${id}' aprobada exitosamente`,
        //   Type: 'success'
        // });
        // setTimeout(() => setAlert(null), 4000);
      } else {
        // setAlert({
        //   Titulo: 'Error',
        //   Texto: `No se ha podido denegar la Reserva #'${id}'`,
        //   Type: 'error'
        // });
        // setTimeout(() => setAlert(null), 4000);
      }
    } catch (err) {
      console.error('Error:', err);
      // setAlert({
      //   Titulo: 'Error',
      //   Texto: 'Ha ocurrido un error en el Servidor ...',
      //   Type: 'error'
      // });
      // setTimeout(() => setAlert(null), 4000);
    } finally {
      setLoadingReservationId(null);
    }
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f7f7f7',
            boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.4)'
          }
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          {/* <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton> */}
          Nada
        </TableCell>
        <TableCell component="th" scope="row">{row.id_reservation}</TableCell>
        <TableCell align="right">{row.id_user}</TableCell>
        <TableCell align="right">{row.start_date}</TableCell>
        <TableCell align="right">{row.end_date}</TableCell>
        <TableCell align="right">{row.address}</TableCell>
        <TableCell align="right">{row.city}</TableCell>
        <TableCell align="right">{row.neighborhood}</TableCell>
        <TableCell align="right">
          {/* <Chip
            sx={{
              pl: '4px',
              pr: '4px',
              ml: 1,
              backgroundColor: row.statusColor,
              borderRadius: '8px',
              boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.2)',
              color: getTextColor(row.statusColor),
              fontWeight: 'bold',
              cursor: 'default'
            }}
            size="small"
            label={row.status}
          /> */}
          <Typography>{row.status}</Typography>
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
                              <TableCell align="right">{detail.unit_price}</TableCell>
                              <TableCell align="right">{detail.total_price}</TableCell>
                            </TableRow>
                          </Tooltip>
                        ))}
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Divider style={{ borderColor: '#000', fontSize: 25 }}>Cotización</Divider>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell rowSpan={3} />
                          <TableCell rowSpan={3} />
                          <TableCell colSpan={2}><Typography variant="h3">Subtotal</Typography></TableCell>
                          <TableCell align="right"><Typography variant="h4">{formatCurrency(row.total_reservation)}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}><Typography variant="h3">Total</Typography></TableCell>
                          <TableCell align="right">
                            <Card sx={{ m: 0, p: 1, backgroundColor: '#52c41a', color: 'white', borderRadius: '8px', boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.2)', cursor: 'default' }}>
                              <Typography variant="h4">{formatCurrency(row.total_reservation)}</Typography>
                            </Card>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  }
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '30%' }}>
                {loadingReservationId === row.id_reservation ? (
                  <div /* align="center" */>
                    {(() => {
                      const color = loadingInfo === 'approve' ? 'success' : 'error';
                      const text = loadingInfo === 'approve' ? 'Aprobando ...' : 'Denegando ...';
                      return (
                        <div>
                          {/* <CircularProgress size={100} color={color} /> */}
                          <Loader />
                          <Typography variant="h3">{text}</Typography>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div>
                    {/* {row.status === 'En Espera' && (
                      <>
                        <ButtonBasic text="Aprobar" Icon={CheckOutlinedIcon} Color="#52c41a" height="40px" width="100%" onclick={() => approveReservation(row)} />
                        <ButtonBasic text="Denegar" Icon={CloseOutlinedIcon} Color="#FF5F5F" height="40px" width="100%" onclick={() => denyReservation(row)} />
                      </>
                    )}
                    {row.status === 'Aprobado' && (
                      <ButtonBasic text="Denegar" Icon={CloseOutlinedIcon} Color="#FF5F5F" height="40px" width="100%" onclick={() => denyReservation(row)} />
                    )} */}
                    <Typography>Botones para aceptar y denegar</Typography>
                  </div>
                )}
              </div>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};




const dataProductos = () => {
  const [data, setData] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const loadData = async () => {
      try {
        const reservas = await fetchReservations();
        setData(reservas);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);









  const handleChangeStatus = async (id: any) => {
    try {
      const response = await changeStatus(id);
      return response;
    } catch (error) {
      console.error("Error al cambiar el estado de la reserva:", error);
      return false;
    }
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); 
  };

  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div>
      

      {/* Tabla */}
      <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>

            <TableCell className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Nombre</h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Categoria</h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Precio</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Disponibilidad</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold  xsm:text-base">Descripción</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold  xsm:text-base">Estado</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold  xsm:text-base">Acciones</h1>
            </TableCell>
          </TableRow>
          
        </TableHead>
        <TableBody>
        {loading && (
            <TableRow>
              <TableCell colSpan={100}>
                {/* <SkeletonTable />
                <SkeletonTable />
                <SkeletonTable /> */}
              </TableCell>
            </TableRow>
          )}
          {data.map((row) => (
            // <Row key={row.id_reservation} row={row} /* fetchData={}  *//>

            <div>Nada</div>
          ))}

        </TableBody>
      </Table>
    </TableContainer>

      {/* Controles de Paginación */}
      <div className="pagination-controls flex justify-between items-center mt-4 ">
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
      {/* Control de filas por página */}
      <div className="pagination-controls">
        <label className="dark:text-white text-black">
          Filas por página :
          <input
            type="number"
            className="w-20 px-2 py-1 border rounded dark:bg-gray-800 dark:text-white bg-white text-black"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            min="1"
          />
        </label>
      </div>
    </div>
  );
};

export default dataProductos;
