import type { Direccion } from "@/types/Clients/direccion";

export const fetchProducts = async (): Promise<Direccion[]> => {
    try {
      const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/addresses", {
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
      console.error("Error obteniendo los productos:", error);
      return [];
    }
  };

export const fetchAddressesByUser = async (id: string | number): Promise<Direccion[]> => {
    try {
      const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/addresses_user/${id}`, {
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
      console.error("Error obteniendo als direcciones de usuario:", error);
      return [];
    }
  };