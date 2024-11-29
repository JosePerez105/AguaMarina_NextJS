"use client";
import { useEffect, useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import PricingBox from "./PricingBox";
import { ProductoCliente } from "@/types/Clients/productoCliente";
import SlideCard from "./SlideCard";
import Loader from "@/components/common/Loader";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import Fecha from "./FiltroFecha";

const Pricing = () => {
  const [products, setProducts] = useState<ProductoCliente[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductoCliente[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://api-aguamarina-mysql-v2.onrender.com/api/v2/products_catalog",
        );
        const data = await response.json();
        const processedData = data.body.map((product: ProductoCliente) => ({
          ...product,
          price: Number(product.price),
        }));
        setProducts(processedData);
        setFilteredProducts(processedData);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api-aguamarina-mysql-v2.onrender.com/api/v2/categories",
        );
        const data = await response.json();
        if (data.ok) {
          setCategories(data.body);
        } else {
          console.error("Error al cargar las categorías");
        }
      } catch (error) {
        console.error("Error al hacer fetch de categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://api-aguamarina-mysql-v2.onrender.com/api/v2/products_catalog",
          {
            method: dateRange ? "POST" : "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body: dateRange
              ? JSON.stringify({
                  startDate: dateRange[0],
                  endDate: dateRange[1],
                })
              : null,
          },
        );
        const data = await response.json();
        const processedData = data.body.map((product: ProductoCliente) => ({
          ...product,
          price: Number(product.price),
        }));
        setProducts(processedData);
        setFilteredProducts(processedData);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [dateRange]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPrice = priceRange
        ? product.price >= priceRange[0] && product.price <= priceRange[1]
        : true;
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.id_category);
      return matchesSearch && matchesPrice && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, priceRange, selectedCategories, products]);

  const handleDateChange = (dates: [string, string] | null) => {
    setDateRange(dates);
  };

  const handlePriceFilter = (minPrice: number, maxPrice: number) => {
    setPriceRange([minPrice, maxPrice]);
  };

  const handleCategoryFilter = (selectedCategories: number[]) => {
    setSelectedCategories(selectedCategories);
  };

  return (
    <section
      id="pricing"
      className="relative z-20 min-h-[120vh] overflow-hidden bg-white px-0 pb-20 pt-20 dark:bg-dark sm:px-10 md:px-20 lg:pb-[90px] lg:pt-[120px]"
    >
      
      <div className="container"
      style = {{
        filter: isHovered ? "blur(5px)" : "none",
        transition: "filter 0.5s ease"
      }}>
        
        <div className="mb-10">
          <SectionTitle
            title="Nuestros Productos"
            paragraph="Estos son nuestros productos; espero que encuentres lo que necesites."
            center
          />
        </div>
        <div
          className="flex flex-col gap-10 md:flex-row md:gap-0"
        >
          {/* Products */}
          <div
            className="mb-5 w-full md:w-3/4"
            style={{
              position: "relative",
              left: "20%",
              bottom: "100%",
            }}
          >
            {loading ? <LoaderBasic /> : <PricingBox products={filteredProducts} />}
          </div>
        </div>
      </div>
      <div>
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="z-50 mt-5"
            style={{
              position: "absolute",
              left: "0%",
              top: "22%"
            }}
          >
            <div className="mb-5">
              <Fecha onDateChange={handleDateChange} customClasses="rounded-none rounded-r-xl"/>
              </div>
            <SlideCard
              onSearch={setSearchTerm}
              onPriceFilter={handlePriceFilter}
              onDateChange={handleDateChange}
              products={products}
              categories={categories}
              onCategorySelect={handleCategoryFilter}
            />
          </div>
      </div>
    </section>
  );
};

export default Pricing;