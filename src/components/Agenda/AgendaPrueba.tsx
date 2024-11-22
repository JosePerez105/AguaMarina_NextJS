"use client";
import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importa el idioma español para dayjs
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles.css";

dayjs.locale("es"); // Configura dayjs en español

const AgendaPrueba = () => {
  const localizer = dayjsLocalizer(dayjs);

  const events = [
    {
      start: new Date(2024, 10, 10), // Meses en JavaScript son base 0
      end: new Date(2024, 10, 14),
      title: "Evento 1",
    },
    {
      start: new Date(2024, 10, 10),
      end: new Date(2024, 10, 15),
      title: "Evento 2",
    },
    {
      start: new Date(2024, 10, 30),
      end: new Date(2024, 10, 14),
      title: "Evento 3",
    },
  ];

  const messages = {
    today: "Hoy",
    previous: "Anterior",
    next: "Siguiente",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    allDay: "Todo el día",
    noEventsInRange: "No hay eventos en este rango",
    showMore: (total: number) => `+ Ver más (${total})`,
  };

  const customViews = {
    month: true,
    week: true,
    day: false,
    agenda: true,
    
  };

  return (
    <div className="max-w-full max-h-full p-4">
      <Calendar
      views={customViews}
        defaultDate={new Date()}
        // onSelectEvent={(event) => alert(`Evento seleccionado: ${event.title}`)} Para mostrar modal del evento y caracteristicas
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        style={{
          height: 700,
        }}
      />
    </div>
  );
};

export default AgendaPrueba;