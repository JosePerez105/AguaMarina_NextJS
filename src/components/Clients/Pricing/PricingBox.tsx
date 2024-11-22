import Image from "next/image";
import React, { useState } from "react";
import { ProductoCliente } from "@/types/Clients/productoCliente";
import { InputNumber } from "antd";
import { useCart } from "@/context/CartContext";
import toast, { Toaster } from "react-hot-toast";

const PricingBox: React.FC<{ products: ProductoCliente[] }> = ({ products = [] }) => {
  const { addToCart, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities({ ...quantities, [productId]: quantity });
  };

  const handleAddToCart = (product: ProductoCliente) => {
    const quantity = quantities[product.id_product] || 1;
    addToCart({
      id: product.id_product,
      name: product.name,
      price: parseFloat(product.price),
      quantity: quantity,
      image: product.images[0] || "https://via.placeholder.com/60",
    });
    toast.success("Producto añadido correctamente");
  };

  return (
    <div className="grid gap-6 grid-cols-2 lg:grid-cols-2 justify-end mx-auto ml-36 w-screen">
      {products.map((product) => (
        <div
          key={product.id_product}
          className="flex flex-col lg:flex-row items-center lg:items-start overflow-hidden rounded-xl bg-white p-4 shadow-md dark:bg-dark-2 transition-transform transform hover:scale-105"
          data-wow-delay=".1s"
        >
          {/* Imagen a la izquierda */}
          <div className="w-full lg:w-1/3 mb-4 lg:mb-0 flex-shrink-0">
            <Image
              src={product.images[0] || "https://via.placeholder.com/60"}
              alt="producto"
              width={150}
              height={150}
              className="rounded-[10px] w-full h-auto object-cover"
            />
          </div>

          {/* Contenido a la derecha */}
          <div className="text-center lg:text-left lg:ml-6">
            <span className="mb-2 block text-lg font-medium text-dark dark:text-white">
              {product.name}
            </span>
            <h2 className="mb-2 text-2xl font-semibold text-dark dark:text-white">
              <span className="text-xl font-medium">$ </span>
              <span className="-ml-1 -tracking-[2px]">
                {parseFloat(product.price.toString()).toLocaleString("en-US", {
                  currency: "COP",
                })}
              </span>
              <span className="text-body-color text-base font-normal dark:text-dark-6">
                {" "} por unidad
              </span>
            </h2>
            <p className="mb-1 text-lg font-medium text-dark dark:text-white">
              {product.description}
            </p>
            <p className="mb-4 text-lg font-medium text-dark dark:text-white">
              {product.disponibility} disponibles
            </p>
            <div className="flex flex-col items-center lg:flex-row lg:space-x-4">
              {/* Selector de cantidad */}
              <InputNumber
                min={1}
                max={product.disponibility}
                value={quantities[product.id_product] || 1}
                onChange={(value) =>
                  handleQuantityChange(product.id_product, value || 1)
                }
                className="w-32 text-center rounded px-2 py-1"
              />
              <button
                className="mt-4 lg:mt-0 inline-block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition duration-300 hover:bg-primary/90"
                onClick={() => handleAddToCart(product)}
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      ))}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default PricingBox;
