"use client"
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableRow, Chip, Typography } from "@mui/material";
import {Input, Pagination } from "antd";
import { fetchUsers } from "@/api/fetchs/get_usuarios";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import { Usuario } from "@/types/admin/Usuario";
import { useState, useEffect } from "react";
import LoaderBasic from "@/components/Loaders/LoaderBasic";

const onChangeDatePicker = () => {
  console.log("Cambiado") 
}

const dataUsuarios = () => {
  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [customPageSize, setCustomPageSize] = useState(pageSize);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const usuarios = await fetchUsers();
        console.log(usuarios);
        setData(usuarios);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  const handlePageChange = (page: number, size: number) => {
    if (page <= totalPages) {
      setCurrentPage(page);
      setPageSize(size);
    }
  };

  const handleCustomPageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      setPageSize(newSize);
      setCurrentPage(1); // Reiniciar a la primera página
      setCustomPageSize(newSize);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const totalUsuarios = data.length;
  const totalPages = Math.ceil(totalUsuarios / pageSize);

  return (
    <div>
      <Table className="min-w-full">
        <TableHead>
          <TableRow>
            <TableCell align ="center" className="px-2 pb-3.5 font-medium dark:text-dark-6 table-small-font">
              <h1 className="text-xl font-semibold  xsm:text-base">
                Nombre completo
              </h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium  text-xl dark:text-dark-6">
              <h1 className="text-xl font-semibold  xsm:text-base">Rol</h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium  text-xl dark:text-dark-6">
              <h1 className="text-xl font-semibold  xsm:text-base">Documento</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-xl dark:text-dark-6">
              <h1 className="text-xl font-semibold  xsm:text-base">Correo</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-xl dark:text-dark-6">
              <h1 className="text-xl font-semibold  xsm:text-base">Teléfono</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-xl dark:text-dark-6">
              <h1 className="text-xl font-semibold  xsm:text-base">Estado</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-xl dark:text-dark-6">
              <h1 className="text-xl font-semibold  xsm:text-base">Acciones</h1>
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
          ) : data.length === 0 ? ( // Verifica si no hay usuarios
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="h6" className="py-6 text-gray-500">
                  No hay usuarios disponibles.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            currentData.map((usuario, key) => (
              <TableRow
                key={usuario.id_user}
                className={key !== data.length - 1 ? "border-b border-stroke dark:border-dark-3" : ""}
              >
                {/* Nombres */}
              <TableCell align="center" className="flex items-center gap-1.5 px-2 py-5 text-xl">
                <div className="flex items-center gap-1.5">
                  {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90, minHeight: 90 }} className="bg-primary/[.2] dark:bg-white/10 p-2 rounded-2xl hover:scale-125 duration-300 cursor-pointer">
                     <Image
                      src={usuario.names}
                      alt="usuario"
                      width={90}
                      height={90}*  
                      className="flex-shrink-0 rounded-[10px]"
                    />
                  </div> */}
                  <p className="hidden sm:block font-medium font-estandar text-xl text-dark dark:text-dark-6">
                    {usuario.names} {usuario.lastnames}
                  </p>
                </div>
              </TableCell>
              {/* Categoría */}
              <TableCell align="center" className="px-2 py-4">
                <p className="font-medium font-estandar text-xl text-dark dark:text-dark-6">{usuario.rol}</p>
              </TableCell>

              {/* Precio */}
              <TableCell align="center" className="px-2 py-4">
                <p className="font-bold font-estandar text-xl text-dark dark:text-dark-6">{usuario.dni}</p>
              </TableCell>

              {/* Disponibilidad */}
              <TableCell align="center" className="px-2 dark:text-dark-6">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  height: 110, width: "auto" }} className="bg-primary/[.2] dark:bg-white/10 p-2 rounded-2xl hover:scale-105 duration-300 mb-4">
                {/* <Progress
                  size={150}
                  type="dashboard"
                  percent={(usuario.disponibility / usuario.total_quantity) * 100}
                  gapDegree={165}
                  status="normal"
                  strokeWidth={10}
                  strokeColor={"#00ff"}
                  strokeLinecap="round"
                />
                <Typography variant="h6" style={{ marginTop: '-45px' }}>
                  {`${usuario.disponibility} / ${usuario.total_quantity}`}
                </Typography> */}
                <p className="font-medium font-estandar text-xl text-dark dark:text-dark-6">{usuario.mail}</p>
              </div>
              </TableCell>

              {/* Teléfono */}
              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <p className="font-medium font-estandar text-xl text-dark dark:text-dark-6">{usuario.phone_number}</p>
              </TableCell>

              {/* Estado */}
              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <div className="flex flex-col gap-3 items-center">
                  <SwitcherThree /* id={usuario.id_user.toString()} */ checked={usuario.status} />
                </div>
              </TableCell>
              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <div className="gap-4 flex flex-col ">
                  <ButtonDefault
                    label="Editar"
                    link="/"
                    customClasses="text-xl font-semibold border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
                  />
                  <ButtonDefault
                    label="Eliminar"
                    link="/"
                    customClasses=" text-xl font-semibold border border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
                  />
                </div>
              </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

      </Table>
      {/* Componente de paginación */}
      <div className="flex justify-center mt-4 ">
        <Pagination
          showQuickJumper
          current={currentPage}
          pageSize={pageSize}
          total={50}
          onChange={handlePageChange}
          disabled={data.length === 0 || totalPages === 1} // Deshabilitar si no hay datos
          showSizeChanger={false}
          onShowSizeChange={handlePageChange}
          className="text-white dark:text-dark-6"
        />
        <Input
          type="number"
          min={0}
          max={totalPages}
          placeholder="Registros por página"
          value={customPageSize}
          onChange={handleCustomPageSizeChange}
          className="ml-4 w-25"
        />
      </div>
    </div>
  );
};

export default dataUsuarios;