import Image from "next/image";
import React, { useState } from "react";
import { ProductoCliente } from "@/types/Clients/productoCliente";
import { InputNumber, Modal } from "antd";
import { useCart } from "@/context/CartContext";
import toast, { Toaster } from "react-hot-toast";

const truncateText = (text: string, limit: number = 10) => {
  if (text.length <= limit) return text;
  return `${text.substring(0, limit)}...`;
};

const PricingBox: React.FC<{ products: ProductoCliente[] }> = ({
  products = [],
}) => {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [selectedProduct, setSelectedProduct] =
    useState<ProductoCliente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities({ ...quantities, [productId]: quantity });
  };

  const handleAddToCart = (product: ProductoCliente) => {
    const quantity = quantities[product.id_product] || 1;
    addToCart({
      id: product.id_product,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0] || "https://via.placeholder.com/60",
    });
    toast.success("Producto añadido correctamente");
  };

  const handleOpenModal = (product: ProductoCliente) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          filter: isModalOpen ? "blur(5px)" : "none",
          transition: "filter 0.5s ease",
        }}
      >
        <div className="max-w-8xl grid-cols- mx-auto grid gap-6 px-0 md:grid-cols-2 lg:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.id_product}
              className="flex max-w-[500px] transform cursor-pointer flex-col items-center overflow-hidden rounded-xl bg-white p-4 shadow-md transition-transform hover:scale-105 dark:bg-dark-2 lg:flex-row lg:items-start"
              onClick={() => handleOpenModal(product)}
            >
              {/* Imagen a la izquierda */}
              <div className="mb-4 w-full flex-shrink-0 lg:mb-0 lg:w-1/3">
                <Image
                  src={product.images[0] || "https://via.placeholder.com/60"}
                  alt="producto"
                  width={150}
                  height={150}
                  className="max-w-[120px] rounded-[10px] object-cover"
                />
              </div>

              {/* Contenido a la derecha */}
              <div
                className="text-center lg:ml-0 lg:text-left"
                style={{
                  marginLeft: 5,
                }}
              >
                <span className="mb-2 block text-lg font-medium text-dark dark:text-white">
                  {product.name}
                </span>
                <h2 className="mb-1 text-2xl font-semibold text-dark dark:text-white">
                  <span className="text-md">$ </span>
                  <span className="text-md -tracking-[2px]">
                    {parseFloat(product.price.toString()).toLocaleString(
                      "en-US",
                      {
                        currency: "COP",
                      },
                    )}
                  </span>
                  <p>
                    <span className="text-body-color text-base font-normal dark:text-dark-6">
                      {" "}
                      por unidad
                    </span>
                  </p>
                </h2>
                <p className="text-md mb-3 text-lg font-medium text-dark dark:text-white">
                  {truncateText(product.description, 8)}
                </p>
                <p className="mb-1 text-lg font-medium text-dark dark:text-white">
                  <p>disponibles</p>
                  {product.disponibility}
                </p>
                <div
                  className="flex flex-col items-center space-y-4 lg:items-start"
                  style={{
                    position: "absolute",
                    bottom: 30,
                    left: 265,
                    padding: 1,
                  }}
                >
                  {/* Selector de cantidad */}
                  <InputNumber
                    min={1}
                    max={product.disponibility}
                    value={quantities[product.id_product] || 1}
                    onChange={(value) =>
                      handleQuantityChange(product.id_product, value || 1)
                    }
                    className="w-32 rounded px-2 py-1 text-center"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {/* Botón */}
                  <button
                    className="inline-block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition duration-300 hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Toaster position="bottom-right" />
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width="auto" // Ajusta automáticamente al contenido interno
        className="dark:bg-dark-2 dark:text-white rounded-lg"
        style={{
          maxWidth: "750px", // Ajusta el tamaño máximo según tus necesidades
          padding: "0px", // Controla el espacio interno
        }}
      >
        {selectedProduct && (
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Contenedor de la imagen */}
            <div className="mb-4 flex flex-shrink-0 justify-center lg:mb-0 lg:w-1/3">
              <Image
                src={
                  selectedProduct.images[0] || "https://via.placeholder.com/300"
                }
                alt={selectedProduct.name}
                width={200}
                height={200}
                className="rounded-[10px] object-cover"
              />
            </div>

            {/* Contenedor de los datos */}
            <div className="text-lg lg:w-2/3">
              <p>
                <strong>{selectedProduct.name}</strong>
              </p>
              <p className="mb-4"></p>
              <p>
                <strong>Descripción</strong>
              </p>
              <p
                className="mb-4"
                style={{
                  wordWrap: "break-word", // Asegura que las palabras largas se rompan
                  wordBreak: "break-word", // Si una palabra es demasiado larga, se corta en el borde
                  overflowWrap: "break-word", // Asegura que el contenido largo se rompa en líneas más pequeñas si es necesario
                }}
              >
                {selectedProduct.description}
              </p>
              <p>
                <strong>Precio por día</strong>
              </p>
              <p className="mb-4">
                {parseFloat(selectedProduct.price.toString()).toLocaleString(
                  "en-US",
                  {
                    currency: "COP",
                  },
                )}
              </p>
              <p>
                <strong>Disponibles</strong>
              </p>
              <p className="mb-4">{selectedProduct.disponibility}</p>

              {/* Contenedor del input y el botón */}
              <div className="mt-4 flex flex-col items-start">
                {/* Input de cantidad */}
                <InputNumber
                  min={1}
                  max={selectedProduct.disponibility}
                  value={quantities[selectedProduct.id_product] || 1}
                  onChange={(value) =>
                    handleQuantityChange(selectedProduct.id_product, value || 1)
                  }
                  className="w-32 rounded px-2 py-1 text-center"
                  onClick={(e) => e.stopPropagation()}
                />
                {/* Botón para añadir al carrito */}
                <button
                  className="mt-2 inline-block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition duration-300 hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(selectedProduct);
                  }}
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PricingBox;
