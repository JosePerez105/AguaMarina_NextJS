"use client";
import { useEffect, useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import PricingBox from "./PricingBox";
import { ProductoCliente } from "@/types/Clients/productoCliente";
import SlideCard from "./SlideCard";
import Loader from "@/components/common/Loader";

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
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
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
      className="relative z-20 overflow-hidden bg-white px-20 pb-12 pt-20 dark:bg-dark lg:px-50 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            title="Nuestros Productos"
            paragraph="Estos son nuestros productos; espero que encuentres lo que necesites."
            center
          /> 
        </div>
        <SlideCard
          onSearch={setSearchTerm}
          onPriceFilter={handlePriceFilter}
          onDateChange={handleDateChange}
          products={products}
          categories={categories}
          onCategorySelect={handleCategoryFilter}
        />
        <div className="-mx-4 flex flex-wrap justify-center">
          {loading ? <Loader /> : <PricingBox products={filteredProducts} />}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
