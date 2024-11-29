// Archivo: src/api/fetchs/update_product.ts

export const updateProduct = async (productId: number, updatedProductData: any) => {
    try {
      const response = await fetch(`/api/products/${productId}`, { // Ruta de la API que actualiza el producto
        method: "PUT", // O "PATCH" si tu API usa PATCH para actualizaciones parciales
        headers: {
          "Content-Type": "application/json", // Enviar datos en formato JSON
        },
        body: JSON.stringify(updatedProductData), // El cuerpo de la solicitud contiene los datos actualizados del producto
      });
  
      if (!response.ok) { // Verifica si la respuesta fue exitosa
        throw new Error("Error al actualizar el producto");
      }
  
      const data = await response.json(); // Procesa la respuesta JSON de la API
      return data; // Devuelve los datos actualizados
    } catch (error) {
      console.error("Error en updateProduct:", error); // Manejo de errores
      throw error; // Lanza el error para que lo manejes en el componente
    }
  };
  