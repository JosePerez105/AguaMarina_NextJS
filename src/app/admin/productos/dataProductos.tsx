import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip } from "@mui/material";
import { fetchProducts } from "@/api/fetchs/get_productos";
import { Progress } from "antd";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import changeStatus from "@/api/functions/changeStatus_Productos";


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

const onChangeDatePicker = () => {
  console.log("Cambiado")
}

const dataProductos = async () => {
  const data = await fetchProducts();

  const handleChangeStatus = async (id: any) => {
    try {
      const response = await changeStatus(id);
      return response;
    } catch (error) {
      console.error("Error al cambiar el estado del producto:", error);
      return false;
    }
  };

  return (
    <div>
      <Table className="min-w-full">
        <TableHead>
          <TableRow>
            <TableCell className="px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">
                Nombre
              </h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Categoria</h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Precio</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Disponibilidad</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Descripción</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Estado</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Acciones</h1>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((producto, key) => (
            <TableRow
              key={key}
              className={`${key !== data.length - 1 ? "border-b border-stroke dark:border-dark-3" : ""}`}
            >
              {/* Imagen y Nombre */}
              <TableCell className="flex items-center gap-3.5 px-2 py-4 flex-col">
                <div className="flex items-center gap-3.5 flex-row">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90, minHeight: 90 }} className="bg-primary/[.2] dark:bg-white/10 p-2 rounded-2xl hover:scale-125 duration-300 cursor-pointer">
                    <Image
                      src={producto.images[0]}
                      alt="producto"
                      width={90}
                      height={90}
                      className="flex-shrink-0 rounded-[10px]"
                    />
                  </div>
                  <p className="hidden sm:block font-medium font-estandar text-2xl text-dark dark:text-dark-6">
                    {producto.name}
                  </p>
                </div>
              </TableCell>

              {/* Categoría */}
              <TableCell align="center" className="px-2 py-4">
                <p className="font-medium font-estandar text-2xl text-dark dark:text-dark-6">{producto.category}</p>
              </TableCell>

              {/* Precio */}
              <TableCell align="center" className="px-2 py-4">
                <p className="font-bold font-estandar text-2xl text-green-light-1">{formatCurrency(producto.price)}</p>
              </TableCell>

              {/* Disponibilidad */}
              <TableCell align="center" className="px-2 dark:text-dark-6">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  height: 110 }} className="bg-primary/[.2] dark:bg-white/10 p-2 rounded-2xl hover:scale-105 duration-300 mb-4">
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
                <Typography className="flex flex-row" variant="h6" style={{ marginTop: '-45px', whiteSpace: 'nowrap', }}>
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
                    width: 300,
                    height: 150,
                    minHeight: 50,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    borderRadius: "10px",
                    padding: "10px",
                    }}
                />
              </TableCell>

              {/* Estado */}
              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <div className="flex flex-col gap-3 items-center">
                  {/* <p className={`font-bold text-2xl text-dark font-estandar dark:text-dark-6 ${producto.status == true ? "text-green-400" : "text-red-400"}`}> <Chip label={producto.status == true ? "Activo" : "Inactivo"} 
                  style={{
                    backgroundColor: producto.status == true ? "#4ade80" : "#f87171",
                    fontSize: "18px"
                  }}/></p> */}
                  <SwitcherThree id={producto.id_product} checked={producto.status} 
                  />
                </div>
              </TableCell>
              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <div className="gap-4 flex flex-col ">
                  <ButtonDefault
                    label="Editar"
                    link="/admin"
                    customClasses="text-xl font-semibold border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
                  />
                  <ButtonDefault
                    label="Eliminar"
                    link="/admin"
                    customClasses=" text-xl font-semibold border border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default dataProductos;
