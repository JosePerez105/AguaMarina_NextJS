import React from "react";
import Buscar from "./FiltroBuscar";
import Precio from "./FiltroPrecio";
import Categoria from "./FiltroCategoria";
import Fecha from "./FiltroFecha";
import Image from "next/image";

interface SlideCardProps {
  onSearch: (term: string) => void;
  onPriceFilter: (minPrice: number, maxPrice: number) => void;
  onDateChange: (dates: [string, string] | null) => void;
  products: { price: number }[];
  categories: { id_category: number; name: string }[];
  onCategorySelect: (selectedCategories: number[]) => void;
  pathUrl: string; // Asegúrate de definir esta propiedad
  sticky: boolean; // Asegúrate de definir esta propiedad
}

const SlideCard: React.FC<SlideCardProps> = ({
  onSearch,
  onPriceFilter,
  onDateChange,
  products,
  categories,
  onCategorySelect,
  pathUrl,
  sticky,
}) => {
  return (                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    <div className="fixed left-0 top-0 h-screen">
      <div className="absolute top-[15%] z-50 box-border h-[80vh] w-[300px] overflow-y-auto rounded-r-xl border-r border-gray-300 bg-white p-5 shadow-md transition-shadow duration-300 transform dark:bg-dark-2">
        <div className="mb-4 flex items-center space-x-4">
          {pathUrl !== "/" ? (
            <>
              <Image
                src={`/images/logo/logoSimbolo.png`}
                alt="logo"
                width={50}
                height={50}
                className="h-16 w-16 object-cover header-logo dark:hidden"
              />
              <Image
                src={`/images/logo/LogoSimboloNegativo.png`}
                alt="logo"
                width={50}
                height={50}
                className="h-16 w-16 object-cover header-logo hidden dark:block"
              />
            </>
          ) : (
            <>
              <Image
                src={
                  sticky
                    ? "/images/logo/logoSimbolo.png"
                    : "/images/logo/logoSimbolo.png"
                }
                alt="logo"
                width={50}
                height={50}
                className="h-16 w-16 object-cover header-logo dark:hidden"
              />
              <Image
                src={"/images/logo/LogoSimboloNegativo.png"}
                alt="logo"
                width={50}
                height={50}
                className="h-16 w-16 object-cover header-logo dark:hidden"
              />
            </>
          )}
          <h2 className="flex-1 text-left text-2xl font-bold text-gray-800 dark:text-white">
            Filtros
          </h2>
        </div>
        <div className="mb-5">
          <span>Filtrar por Fecha</span>
          <Fecha onDateChange={onDateChange} />
        </div>
        <div className="mb-5">
          <span>Filtrar por nombre o descripción</span>
          <Buscar onSearch={onSearch} />
        </div>
        <div className="mb-5">
          <span>Filtrar por categoría</span>
          <Categoria categories={categories} onCategorySelect={onCategorySelect} />
        </div>
        <div className="mb-5">
          <span>Filtrar por precio</span>
          <Precio products={products} onFilterChange={onPriceFilter} />
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
