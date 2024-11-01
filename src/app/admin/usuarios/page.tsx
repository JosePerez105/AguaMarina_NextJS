import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CardTable from "@/components/Tables/CardTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import dataUsuarios from "./dataUsuarios";

export const metadata: Metadata = {
  title: "Lista de Usuarios",
  description: "Aquí está contenido el crud de Usuarios",
};

const TablesPage = async() => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Lista de Usuarios" />

      <div className="flex flex-col gap-10">
        <CardTable data={dataUsuarios()}/>
      </div>
      
    </DefaultLayout>
  );
};

export default TablesPage;
