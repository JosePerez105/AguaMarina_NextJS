import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";
import CrearProducto from "./crearProductoForm";
import AgregarProducto from "./agregarProductoForm";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import dataProductos from "./dataProductos";
import BasicModal from "@/components/Modals/BasicModal";


export const metadata: Metadata = {
  title: "Lista de Productos",
  description: "Aquí está contenido el crud de productos",
};

const TablesPage = async() => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Lista de Productos" />

      <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
        {/* Producto Nuevo */}
        <BasicModal tituloBtn="Producto Nuevo" tituloModal="Producto Nuevo">
          <CrearProducto />
        </BasicModal>

        {/* Producto Existente */}
        <BasicModal tituloBtn="Producto Existente" tituloModal="Producto Existente"> 
          <AgregarProducto />
        </BasicModal>
      </div>
      <div className="flex flex-col gap-10">
        <CardTable data={dataProductos()}/>
      </div>

      
    </DefaultLayout>
  );
};

export default TablesPage;
