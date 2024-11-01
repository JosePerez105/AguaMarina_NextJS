import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";
// import CrearProducto from "./crearProductoForm";
// import AgregarProducto from "./agregarProductoForm";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
// import dataProductos from "./dataProductos";
import BasicModal from "@/components/Modals/BasicModal";


export const metadata: Metadata = {
  title: "Compras",
  description: "Aquí está contenido el historial de compras",
};

const TablesPage = async() => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Compras" />

      <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
        {/* Producto Nuevo */}
        <BasicModal tituloBtn="Producto Nuevo"> 
          {/* <CrearProducto /> */}
        </BasicModal>

        {/* Producto Existente */}
        {/* <BasicModal tituloBtn="Producto Existente"> 
          <AgregarProducto />
        </BasicModal> */}
      </div>
      <div className="flex flex-col gap-10">
        {/* <CardTable data={dataProductos()}/> */}
      </div>

      
        
    </DefaultLayout>
  );
};

export default TablesPage;
