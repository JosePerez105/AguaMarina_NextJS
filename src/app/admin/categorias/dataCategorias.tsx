"use client"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { fetchCategories } from "@/api/fetchs/get_categorias";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { Categoria } from "@/types/admin/Categoria";
import { useState, useEffect } from "react";
import LoaderBasic from "@/components/Loaders/LoaderBasic";

const dataCategorias = () => {
  const [data, setData] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // const data = await fetchCategories();

  useEffect(() => {
    const loadData = async () => {
      try {
        const cateogorias = await fetchCategories();
        setData(cateogorias);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
      <div>
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6 w-5">
                <h1 className="text-sm font-semibold xsm:text-base">
                  Id
                </h1>
              </TableCell>
              <TableCell align="center" className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
                <h1 className="text-sm font-semibold xsm:text-base">Nombre categoria</h1>
              </TableCell>
              <TableCell align="center" className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
                <h1 className="text-sm font-semibold xsm:text-base">Cantidad productos</h1>
              </TableCell>
              <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium text-sm dark:text-dark-6 w-5">
                <h1 className="text-sm font-semibold xsm:text-base">Acciones</h1>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={1000}>
                <LoaderBasic />
              </TableCell>
            </TableRow>) : 
            data.map((categoria, key) => (
              <TableRow
                key={categoria.id_category}
                className={key !== data.length - 1 ? "border-b border-stroke dark:border-dark-3" : ""}
              >

                {/* Id Categoría */}
                <TableCell className="px-2 py-4">
                  <p className="font-medium text-dark dark:text-dark-6">{categoria.id_category}</p>
                </TableCell>

                {/* Nombre Categoría */}
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-medium text-dark dark:text-dark-6">{categoria.name}</p>
                </TableCell>

                {/* Cantidad Productos */}
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-medium text-dark dark:text-dark-6">{categoria.quantity}</p>
                </TableCell>

                {/* Acciones */}
                <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                  <div className="gap-4 flex flex-col ">
                    <ButtonDefault
                      label="Eliminar"
                      link="/"
                      customClasses=" text-xl font-semibold border border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
                    />
                    <ButtonDefault
                      label="Editar"
                      link="/"
                      customClasses="text-xl font-semibold border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
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

export default dataCategorias;
