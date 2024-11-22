import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataUsuarios from "./dataUsuarios";

export const metadata: Metadata = {
  title: "Lista de Usuarios",
  description: "Aquí está contenido el crud de Usuarios",
};

const TablesPage = async() => {
  return (
    // <DefaultLayout>
      <div>
      <Breadcrumb pageName="Lista de usuarios" />

      <div className="flex flex-col gap-10">
        <CardTable data={<DataUsuarios />}/>
      </div>
      </div>
    // </DefaultLayout>
  );
};

export default TablesPage;
