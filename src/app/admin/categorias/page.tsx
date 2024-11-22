import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataCategorias from "./dataCategorias";
import ChartThree from "@/components/Charts/ChartThree";
import BasicModal from "@/components/Modals/BasicModal";
import CrearCategoria from "./crearCategoriaForm";
import ButtonReload from "@/components/Buttons/ButtonReload";

export const metadata: Metadata = {
  title: "Categorias",
  description: "Aquí está contenido el crud de categorias",
};

const TablesPage = async() => {
  return (
    // <DefaultLayout>
    <div>
      <Breadcrumb pageName="Categorias" />

      <div className="flex flex-row justify-between">
        <div className="flex p-6 items-end">
            <ButtonReload/>
        </div>

        <div className="text-right pb-6 pt-6 flex flex-row justify-end gap-6">
          {/* Categoría Nueva */}
          <BasicModal tituloBtn="Categoría nueva" tituloModal="Categoría Nueva">
            <CrearCategoria />
          </BasicModal>
      </div>
      </div>
      

      <div className="flex flex-row gap-10">
        <CardTable data={<DataCategorias />} /* width={"75%"} *//>
        <ChartThree />
      </div>7
      {/* </DefaultLayout> */}
    </div>
    
  );
};

export default TablesPage;
