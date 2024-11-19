// Importación del servicio de productos desde el módulo actualizado
import { productService } from "../services/product-services.js";

// Elementos del DOM
const productContainer = document.querySelector("[data-product]");
const productForm = document.querySelector("[data-form]");


const generateProductCard = ({ name, price, image, id }) => {
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");

  productCard.innerHTML = `
    <div class="image-wrapper">
      <img src="${image}" alt="Imagen de ${name}">
    </div>
    <div class="product-info">
      <p>${name}</p>
      <div class="price-delete-wrapper">
        <span>$ ${price}</span>
        <button class="btn-delete" data-product-id="${id}">
          <img src="./assets/trashIcon.svg" alt="Eliminar">
        </button>
      </div>
    </div>
  `;

  // Añadir evento de eliminación a la tarjeta
  attachDeleteHandler(productCard, id);

  return productCard;
};


const attachDeleteHandler = (productCard, productId) => {
  const deleteButton = productCard.querySelector(".btn-delete");

  deleteButton.addEventListener("click", async () => {
    const confirmDelete = confirm(`¿Está seguro de que desea eliminar el producto con ID ${productId}?`);
    if (!confirmDelete) return;

    try {
      const isDeleted = await productService.removeProduct(productId);
      if (isDeleted) {
        productCard.remove();
        console.log(`Producto con ID ${productId} eliminado exitosamente`);
      } else {
        console.error(`No se pudo eliminar el producto con ID ${productId}`);
      }
    } catch (error) {
      console.error(`Error al intentar eliminar el producto con ID ${productId}:`, error.message);
    }
  });
};

/**
 * Renderiza todos los productos obtenidos desde la API.
 */
const displayProducts = async () => {
  try {
    const productsList = await productService.fetchProducts();
    if (!productsList || productsList.length === 0) {
      console.warn("No se encontraron productos para mostrar");
      return;
    }

    // Limpiar contenedor antes de renderizar
    productContainer.innerHTML = "";

    productsList.forEach((product) => {
      const productCard = generateProductCard(product);
      productContainer.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error al intentar renderizar la lista de productos:", error.message);
  }
};

/**
 * Maneja el evento de envío del formulario para agregar un nuevo producto.
 * @param {Event} event - Evento de envío del formulario.
 */
const handleFormSubmit = async (event) => {
  event.preventDefault();

  // Obtener datos del formulario
  const productName = document.querySelector("[data-name]").value.trim();
  const productPrice = parseFloat(document.querySelector("[data-price]").value.trim());
  const productImage = document.querySelector("[data-image]").value.trim();

  // Validar campos del formulario
  if (!productName || isNaN(productPrice) || !productImage) {
    alert("Todos los campos son obligatorios y el precio debe ser un número válido.");
    return;
  }

  try {
    // Crear producto a través del servicio
    const createdProduct = await productService.addProduct(productName, productPrice, productImage);
    if (createdProduct) {
      console.log("Nuevo producto agregado:", createdProduct);

      // Añadir el producto recién creado al contenedor de productos
      const newProductCard = generateProductCard(createdProduct);
      productContainer.appendChild(newProductCard);
    }
  } catch (error) {
    console.error("Error al intentar crear un nuevo producto:", error.message);
  }

  // Reiniciar formulario
  productForm.reset();
};

// Asignar evento al formulario para manejar el envío
productForm.addEventListener("submit", handleFormSubmit);

// Cargar y mostrar productos al iniciar la aplicación
displayProducts();
