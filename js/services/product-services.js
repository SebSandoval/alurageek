// URL base de la API para productos
const API_URL = "http://localhost:3001/products";


const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);

    // Verificar si la respuesta es exitosa (código 200-299)
    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status} ${response.statusText}`);
    }

    // Parsear la respuesta a formato JSON
    return await response.json();
  } catch (error) {
    console.error("Error al obtener la lista de productos:", error.message);
    return undefined;
  }
};


const addProduct = async (name, price, image) => {
  const productData = { name, price, image };
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error al crear producto: ${response.status} ${response.statusText}`);
    }

    const newProduct = await response.json();
    console.log("Producto creado exitosamente:", newProduct);
    return newProduct;
  } catch (error) {
    console.error("Error en la solicitud de creación de producto:", error.message);
    return undefined;
  }
};


const removeProduct = async (id) => {
  if (!id) {
    console.error("El ID del producto es requerido para eliminar.");
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error al eliminar producto: ${response.status} ${response.statusText}`);
    }

    console.log(`Producto con ID ${id} eliminado exitosamente`);
    return true;
  } catch (error) {
    console.error("Error en la solicitud de eliminación de producto:", error.message);
    return false;
  }
};

// Exportar los métodos como un objeto de servicios para manejar productos
export const productService = {
  fetchProducts,
  addProduct,
  removeProduct,
};
