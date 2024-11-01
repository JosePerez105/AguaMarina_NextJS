import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import dataProductos from "./dataCategorias";
import ChartThree from "@/components/Charts/ChartThree";
import BasicModal from "@/components/Modals/BasicModal";

export const metadata: Metadata = {
  title: "Categorias",
  description: "Aquí está contenido el crud de Categorias",
};

const TablesPage = async() => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Categorias" />

      <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
        {/* Categoría Nueva */}
        <BasicModal tituloBtn="Categoría Nueva" tituloModal="Categoría Nueva">
          {/* <CrearProducto /> */}
        </BasicModal>

      </div>

      <div className="flex flex-row gap-10">
        

        <CardTable data={dataProductos()} width={"75%"}/>
        <ChartThree />
      </div>
      
    </DefaultLayout>
  );
};

export default TablesPage;
