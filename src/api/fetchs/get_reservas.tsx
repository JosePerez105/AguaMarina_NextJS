import { Reserva } from "@/types/admin/Reserva";

export const fetchReservations = async (): Promise<Reserva[]> => {
  try {
    const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error obteniendo las reservas:", error);
    return [];
  }
};

export const fetchReservationById = async (id: string | number): Promise<Reserva[]> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error obteniendo la reserva:", error);
    return [];
  }
};

export const fetchReservationsByUser = async (id: string | number): Promise<Reserva[]> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_user/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error obteniendo las reservas del usuario:", error);
    return [];
  }
};


//Cambios de Estado Reservas


export const approveReservationById = async (id : string | number): Promise<boolean> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_approve/${id}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.body.isApproved) {
      throw new Error("La reserva no pudo ser aprobada.");
    }
    return true;
  } catch (error) {
    console.error("Error aprobando la reserva del usuario:", error);
    return false;
  }
}
//Denegar, por parte de un vendedor
export const denyReservationById = async (id : string | number, cancel_reason : string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_deny/${id}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cancel_reason
      }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.body.isDennied) {
      throw new Error("La reserva no pudo ser denegada.");
    }
    return true;
  } catch (error) {
    console.error("Error denegando la reserva:", error);
    return false;
  }
}
//Cancelar, por parte del usuario
export const cancelReservationById = async (id : string | number, cancel_reason : string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_cancel/${id}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cancel_reason
      }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.body.isCanceled) {
      throw new Error("La reserva no pudo ser cancelada.");
    }
    return true;
  } catch (error) {
    console.error("Error cancelando la reserva del usuario:", error);
    return false;
  }
}

export const annularReservationById = async (id : string | number, cancel_reason : string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_annular/${id}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cancel_reason
      }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!data.body.isAnnulled) {
      throw new Error("La reserva no pudo ser anulada.");
    }
    return true;
  } catch (error) {
    console.error("Error anulando la reserva del usuario:", error);
    return false;
  }
}

export const finalizeReservationById = async (id : string | number): Promise<boolean> => {
  try {
    const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_finalize/${id}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.body.isFinalized) {
      throw new Error("La reserva no pudo ser finalizada.");
    }
    return true;
  } catch (error) {
    console.error("Error finalizando la reserva del usuario:", error);
    return false;
  }
}