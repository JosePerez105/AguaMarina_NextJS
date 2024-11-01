import Image from "next/image";
import React, { useState } from "react";
import { ProductoCliente } from "@/types/Clients/productoCliente";
import type { InputNumberProps } from "antd";
import { InputNumber } from "antd";

const onChange: InputNumberProps["onChange"] = (value) => {
  console.log("changed", value);
};

const cantidadNumerica: React.FC<InputNumberProps> = (props) => (
  <InputNumber
    min={1}
    max={10}
    defaultValue={5}
    onChange={props.onChange}
    changeOnWheel
    className="w-32 text-center"
    {...props} 
  />
);

const PricingBox: React.FC<{ products: ProductoCliente[] }> = ({
  products = [],
}) => {
  return (
    <div className="flex flex-wrap">
      {products.map((product) => (
        <div
          key={product.id_product}
          className="mb-10 flex w-full px-4 lg:w-1/2"
        >
          <div
            className="relative z-10 flex flex-col items-center overflow-hidden rounded-xl bg-white p-6 shadow-md dark:bg-dark-2 lg:flex-row lg:p-10"
            data-wow-delay=".1s"
          >
            {/* Imagen a la izquierda */}
            <div className="mb-4 flex-shrink-0 lg:mb-0 lg:mr-6">
              <Image
                src={product.images[0]}
                alt="producto"
                width={100}
                height={100}
                className="rounded-[10px]"
              />
            </div>

            {/* Contenido a la derecha */}
            <div>
              <span className="mb-4 block text-xl font-medium text-dark dark:text-white">
                {product.name}
              </span>
              <h2 className="mb-4 text-4xl font-semibold text-dark dark:text-white">
                <span className="text-xl font-medium">$ </span>
                <span className="-ml-1 -tracking-[2px]">
                  {parseFloat(product.price).toLocaleString("en-US", {
                    currency: "COP",
                  })}
                </span>
                <span className="text-body-color text-base font-normal dark:text-dark-6">
                  {" "} <h1> por unidad </h1>
                </span>
              </h2>
              <p className="mb-2 text-lg font-medium text-dark dark:text-white">
                {product.description}
              </p>
              <p className="mb-5 text-lg font-medium text-dark dark:text-white">
                {product.disponibility} disponibles
              </p>
              <div className="flex items-center space-x-4">
                {cantidadNumerica({
                  min: 1,
                  max: product.disponibility,
                  onChange,
                })}
                <button
                  // onClick={() => handleSubscription(product.id_product)}
                  className="inline-block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition duration-300 hover:bg-primary/90"
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingBox;
