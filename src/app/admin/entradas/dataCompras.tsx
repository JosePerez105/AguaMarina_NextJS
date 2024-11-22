"use client"
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip } from "@mui/material";
import { fetchPurchases } from "@/api/fetchs/get_compras";
import changeStatus from "@/api/functions/changeStatus_Productos";
import ButtonDelete from "@/components/Buttons/ButtonDelete";
import { Compra } from "@/types/admin/Compra";
import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import ButtonDeny from "@/components/Buttons/ButtonDeny";


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

function formatDate(value: string | Date): string {
  const dateValue = typeof value === 'string' ? new Date(value) : value;

  if (isNaN(dateValue.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateValue);
}


const dataCompras = () => {
  const [data, setData] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);


  // const data = await fetchPurchases();

  useEffect(() => {
    const loadData = async () => {
      try {
        const compras = await fetchPurchases();
        setData(compras);
      } catch (error) {
        console.error("Error fetching purchases:", error);
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
      console.error("Error al cambiar el estado de las compras:", error);
      return false;
    }
  };

  return (
    <div>
      <Table className="min-w-full">
        <TableHead>
          <TableRow>
            <TableCell className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">
                Id entrada
              </h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Fecha</h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Producto</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Comprador</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Cantidad</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Costo unitario</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Total</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Estado</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Acciones</h1>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={1000}>
              <Loader/>
            </TableCell>
          </TableRow>
        ) :  
          data.map((compra, key) => (
            <TableRow
              key={key}
              className={`${key !== data.length - 1 ? "border-b border-stroke dark:border-dark-3" : ""}`}
            >
              {/* ID Compra */}
              <TableCell className="flex items-center gap-3.5 px-2 py-4 flex-col">
                <div className="flex items-center gap-3.5 flex-row">
                  <p className="hidden sm:block font-medium font-estandar text-2xl text-dark dark:text-dark-6">
                    {compra.id_purchase}
                  </p>
                </div>
              </TableCell>

              {/* Fecha de Compra */}
              <TableCell align="center" className="px-2 py-4">
                <p className="font-medium font-estandar text-2xl text-dark dark:text-dark-6">{formatDate(compra.purchase_date)}</p>
              </TableCell>

              {/* Producto */}
              <TableCell align="center" className="px-2 py-4">
                <p className="font-medium font-estandar text-2xl text-dark dark:text-dark-6">{compra.id_product}</p>
              </TableCell>

              {/* Comprador */}
              <TableCell align="center" className="px-2 dark:text-dark-6">
                <p className="font-medium font-estandar text-2xl text-dark dark:text-dark-6">{compra.id_user}</p>
              </TableCell>

              {/* Cantidad */}
              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <p className="font-medium font-estandar text-2xl text-dark dark:text-dark-6">{compra.quantity}</p>
              </TableCell>

              {/* Costo Unitario */}
              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <p className="font-medium font-estandar text-2xl text-dark dark:text-dark-6">{formatCurrency(compra.unit_price)}</p>
              </TableCell>

              {/* Total */}
              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <p className="font-bold font-estandar text-2xl text-green-light-1">{formatCurrency(compra.total_price)}</p>
              </TableCell>

              {/* Estado */}
              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <div className="flex flex-col gap-3 items-center">
                  <div className={`font-bold text-2xl text-dark font-estandar dark:text-dark-6 ${compra.status == true ? "text-green-400" : "text-red-400"}`}> <Chip label={compra.status == true ? "Realizada" : "Denegada"} 
                  style={{
                    backgroundColor: compra.status == true ? "#4ade80" : "#f87171",
                    fontSize: "18px"
                  }}/></div>
                </div>
              </TableCell>
              <TableCell align="center" className="hidden sm:table-cell px-6 py-4">
                <div className="gap-4 flex flex-col min-w-[100px] m-3">
                  <ButtonDelete />
                </div>
              </TableCell>
            </TableRow>
          ))
        }
        </TableBody>
      </Table>
    </div>
  );
};

export default dataCompras;
