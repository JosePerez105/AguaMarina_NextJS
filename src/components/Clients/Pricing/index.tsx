"use client";
import { useEffect, useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import PricingBox from "./PricingBox";
import { ProductoCliente } from "@/types/Clients/productoCliente";

const Pricing = () => {
  const [products, setProducts] = useState<ProductoCliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://api-aguamarina-mysql-v2.onrender.com/api/v2/products_catalog"); 
        const data = await response.json();
        setProducts(data.body);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section
      id="pricing"
      className="relative z-20 overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px] px-20 lg:px-50"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            title="Nuestros Productos"
            paragraph="Estos son nuestros productos; espero que encuentres lo que necesites."
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
              <PricingBox products={products} />
          )}
        </div>
      </div>
    </section>
  );
};
export default Pricing;