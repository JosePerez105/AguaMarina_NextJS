"use server"
import { cookies } from "next/headers";

export const checkToken = async () => {
    const cookieStore = await cookies(); // Await the cookies
    const token = cookieStore.get('token')?.value;

    try {
        const response = await fetch(
          "https://api-aguamarina-mysql-v2.onrender.com/api/v2/check_cookie",
          { 
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ token: token }),
          }
        );

        const responseJson = await response.json();

        if (!response.ok) {
          const errorMessage = responseJson.message || "No hay sesión activa";
          throw new Error(errorMessage);
        }

        if (responseJson.ok) {
          const payload = responseJson.body;
          return { data: payload, result: true };
        } else {
          const errorMessage = responseJson.message || "Error Desconocido";
          return { result: false };
        }
    } catch (error: any) {
        console.error("Error:", error);
        return { result: false };
    }
};
