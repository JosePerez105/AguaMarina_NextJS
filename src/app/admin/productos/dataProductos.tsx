"use client";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Typography, Chip, Button } from "@mui/material";
import { fetchProducts } from "@/api/fetchs/get_productos";
import { Progress } from "antd";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import changeStatus from "@/api/functions/changeStatus_Productos";
import { useState, useEffect } from "react";
import { Producto } from "@/types/admin/Producto";
import ButtonOnClick from "@/components/Buttons/ButtonOnClick";
import { Reserva } from "@/types/admin/Reserva";
import BasicModal from "@/components/Modals/BasicModal";
import EditarProducto from "./editarProducto";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import dayjs from "dayjs";
import Fecha from "@/components/Clients/Pricing/FiltroFecha";
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);


function capitalizeFirstLetter(str: string): string {
  return str
    .split(' ') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
    .join(' ');
}


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

const dataProductos = () => {
  const [data, setData] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<[string, string] | null>(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Llamada al API con filtro de fechas
        const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/products_catalog", {
          method: selectedDates ? "POST" : "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: selectedDates
            ? JSON.stringify({
                start_date: selectedDates[0],
                end_date: selectedDates[1],
              })
            : null,
        });
        const products = await response.json();
        setData(products.body); // Asumiendo que los productos están en el campo 'body'
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedDates]);

  
  
  const filteredData = selectedDates
  ? data.filter((producto) => {
      const productDate = dayjs(producto.createdAt); 
      console.log('Producto fecha:', productDate.format('YYYY-MM-DD'), 'Fechas seleccionadas:', selectedDates);
      return productDate.isBetween(selectedDates[0], selectedDates[1], 'null', '[]');
    })
  : data;

  const handleDateChange = (dates: [string, string] | null) => {
    setSelectedDates(dates);
  };



  const handleChangeStatus = async (id: any) => {
    try {
      const response = await changeStatus(id);
      return response;
    } catch (error) {
      console.error("Error al cambiar el estado del producto:", error);
      return false;
    }
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); 
  };


  // Función para abrir la modal
  const handleOpenModal = (producto: Producto) => {
    setSelectedProduct(producto);
    setOpenModal(true);
  };

  // Función para cerrar la modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const paginatedFilteredData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalFilteredPages = Math.ceil(filteredData.length / rowsPerPage);

  /* const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(data.length / rowsPerPage);
 */
  return (
    <div>
      {/* Filtro de fechas */}
      <div className="mb-4">
        <Fecha onDateChange={handleDateChange} />
      </div>
      

      {/* Tabla */}
      <Table className="min-w-full text-sm">
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
              <h1 className="text-sm font-semibold xsm:text-base">Descripción</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Estado</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Acciones</h1>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <LoaderBasic />
              </TableCell>
            </TableRow>
          ) : paginatedFilteredData.length === 0 ? ( // Verifica si no hay productos
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="h6" className="py-6 text-gray-500">
                  No hay productos disponibles.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            paginatedFilteredData.map((producto, key) => (
              <TableRow
                key={producto.id_product}
                className={`${
                  key !== filteredData.length - 1 ? "border-b border-stroke dark:border-dark-3" : ""
                }`}
              >
                {/* Imagen y Nombre */}
                <TableCell className="flex items-center gap-3.5 px-0.5 py-14 flex-col">
                  <div className="flex items-center gap-3.5 flex-row text-center">
                    <div
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90, minHeight: 90 }}
                      className="bg-primary/[.2] dark:bg-white/10 p-2 rounded-2xl hover:scale-125 duration-300 cursor-pointer"
                    >
                      <Image
                        src={producto.images[0] || "https://via.placeholder.com/60"}
                        alt="producto"
                        width={90}
                        height={90}
                        className="flex-shrink-0 rounded-[10px]"
                      />
                    </div>
                    <p className="hidden sm:block font-medium font-estandar text-base text-dark dark:text-dark-6">
                      {capitalizeFirstLetter(producto.name)}
                    </p>
                  </div>
                </TableCell>

                {/* Categoría */}
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-medium font-estandar text-base text-dark dark:text-dark-6">{producto.category}</p>
                </TableCell>

                {/* Precio */}
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-bold font-estandar text-2xl text-green-light-1">{formatCurrency(producto.price)}</p>
                </TableCell>

                {/* Disponibilidad */}
                <TableCell align="center" className="px-2 dark:text-dark-6">
                  <div
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", height: 110 }}
                    className="bg-primary/[.2] dark:bg-white/10 p-2 rounded-2xl hover:scale-105 duration-300 mb-4"
                  >
                    <Progress
                      size={150}
                      type="dashboard"
                      percent={(producto.disponibility / producto.total_quantity) * 100}
                      gapDegree={165}
                      status="normal"
                      strokeWidth={10}
                      strokeColor={"#00ff"}
                      strokeLinecap="round"
                    />
                    <Typography
                      className="flex flex-row"
                      variant="h6"
                      style={{ marginTop: "-45px", whiteSpace: "nowrap" }}
                    >
                      {`${producto.disponibility} / ${producto.total_quantity}`}
                    </Typography>
                  </div>
                </TableCell>

                {/* Descripción */}
                <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                  <textarea
                    className="bg-primary/[.2] text-dark dark:bg-white/10 dark:text-white text-lg font-estandar"
                    value={producto.description}
                    readOnly
                    rows={4}
                    style={{
                      width: 250,
                      height: 150,
                      minHeight: 50,
                      resize: "vertical",
                      fontFamily: "inherit",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  />
                </TableCell>

                {/* Estado */}
                <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                  <div className="flex flex-col gap-3 items-center">
                    <SwitcherThree id={producto.id_product} checked={producto.status} />
                  </div>
                </TableCell>

                {/* Acciones */}
                <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                  <div className="gap-4 flex flex-col">
                    <ButtonOnClick
                      label="Editar"
                      onClick={() => handleOpenModal(producto)}
                      customClasses="text-sm font-semibold border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
                    />
                    <ButtonDefault
                      label="Eliminar"
                      link="/admin"
                      customClasses="text-sm font-semibold border border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-[3px] px-6 py-2.5 lg:px-8 xl:px-10"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

      </Table>

      {/* Controles de Paginación */}
      <div className="pagination-controls flex justify-between items-center mt-4 ">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalFilteredPages}
        </span>
        <Button
          disabled={currentPage === totalFilteredPages}
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
      {/* Modal para editar producto */}
      {openModal && (
        <BasicModal tituloBtn="Editar producto" tituloModal="Editar producto" >
          <EditarProducto productId={selectedProduct?.id_product} handleClose={handleCloseModal} />
        </BasicModal>
      )}
    </div>
  );
};

export default dataProductos;
