import { setCookieToken } from "@/utils/validationsTokens";


export const validateLogin = async (formData: any) => {
    console.log("Iniciando Sesión...", formData)
    try {
        const response = await fetch(
          "https://api-aguamarina-mysql-v2.onrender.com/api/v2/validate_login",
          {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ mail: formData.mail, password: formData.password }),
          }
        );
  
        const responseJson = await response.json();
  
        if (!response.ok) {
          const errorMessage = responseJson.message || "No hay un usuario con los datos ingresados";
          throw new Error(errorMessage);
        }
  
        if (responseJson.logged) {
          await setCookieToken(responseJson.token);
          
          localStorage.setItem("isAuthenticated", "true");
          const payload = responseJson.data;
  
          if (payload && payload.id_rol === 1) {
            // await Swal.fire({
            //   icon: "success",
            //   title: "Bienvenido Administrador",
            //   text: "Acceso concedido.",
            //   confirmButtonColor: "#0000ff",
            // });
            // router.push("/admin");
          } else {
            // router.push("/")
          }
  
          // Alerta de inicio de sesión exitoso
        //   await Swal.fire({
        //     icon: "success",
        //     title: "Inicio de sesión exitoso",
        //     text: "Redirigiendo a la página de inicio...",
        //   });
  
        //   toast.success("Login successful");
        //   router.push("/");
            return {data : payload, result : true};
        } else {
          const errorMessage = responseJson.message || "Error Desconocido";
        //   toast.error(errorMessage);
        //   await Swal.fire({
        //     icon: "error",
        //     title: "Error",
        //     text: errorMessage,
        //     confirmButtonColor: "#0000ff",
        //   });
        return {result : false}
        }
      } catch (error: any) {
        console.error("Error:", error);
        // await Swal.fire({
        //   icon: "error",
        //   title: "Error",
        //   text: error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.",
        //   confirmButtonColor: "#0000ff",
        // });
        return {result : false}
      } 
  };