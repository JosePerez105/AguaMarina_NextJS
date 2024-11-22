import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
import AgendaPrueba from "@/components/Agenda/AgendaPrueba";

export const metadata: Metadata = {
  title: "Calender Page",
  description:
    "This is Next.js Calender page for NextAdmin  Tailwind CSS Admin Dashboard Kit",
  // other metadata
};



const CalendarPage = () => {
  return (
    // <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Calendar" />

        {/* <CalendarBox /> */}
        <AgendaPrueba />
      </div>
    // </DefaultLayout>
  );
};

export default CalendarPage;
