"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchCategories } from "@/api/fetchs/get_categorias";

const ChartThree: React.FC = () => {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategories();
      const quantities = data.map((categoria: any) => categoria.quantity);
      const names = data.map((categoria: any) => categoria.name);

      setSeries(quantities);
      setLabels(names);
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#5750F1", "#5475E5", "#8099EC", "#ADBCF2"],
    labels: labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Productos",
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Productos por Categoria
          </h4>
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center items-center" style={{ height: "300px" }}>
          {series.length > 0 && labels.length > 0 ? (
            <ReactApexChart options={options} series={series} type="donut" />
          ) : (
            <div className="text-center text-gray-500 text-xl font-sans">
              No hay productos disponibles
            </div>
          )}
        </div>
      </div>

      {series.length > 0 && labels.length > 0 && (
        <div className="mx-auto w-full max-w-[350px]">
          <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
            {labels.map((label, index) => (
              <div key={index} className="w-full px-7.5 sm:w-1/2">
                <div className="flex w-full items-center">
                  <span className={`mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light-${index + 1}`}></span>
                  <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                    <span>{label}</span>
                    <span>{series[index]}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartThree;
