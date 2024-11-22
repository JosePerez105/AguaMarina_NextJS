"use client";

import React, { useEffect, useState } from "react";
import { Collapse, Table, Typography, Select, Form, Input, Button } from "antd";
import { fetchCities } from "@/api/fetchs/get_ciudades";
import { Ciudad } from "@/types/admin/Ciudad";
import ButtonOnClick from "../Buttons/ButtonOnClick";

const { Panel } = Collapse;
const { Title } = Typography;
const { Option } = Select;

interface Address {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  barrio: string;
}

const ListaDir: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, nombre: "", direccion: "", ciudad: "", barrio: "" },
  ]);
  const [cities, setCities] = useState<Ciudad[]>([]);

  const items = [
    {
      id: 1,
      name: "Dirección Principal",
      data: [
        { key: "1", nombre: "Juan", edad: 25 },
        { key: "2", nombre: "María", edad: 30 },
      ],
    },
    {
      id: 2,
      name: "Dirección 2",
      data: [
        { key: "1", nombre: "Carlos", edad: 40 },
        { key: "2", nombre: "Ana", edad: 35 },
      ],
    },
    {
      id: 3,
      name: "Dirección 3",
      data: [
        { key: "1", nombre: "Carlos", edad: 40 },
        { key: "2", nombre: "Ana", edad: 35 },
      ],
    },
    {
      id: 4,
      name: "Dirección 4",
      data: [
        { key: "1", nombre: "Carlos", edad: 40 },
        { key: "2", nombre: "Ana", edad: 35 },
      ],
    },
  ];

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Edad",
      dataIndex: "edad",
      key: "edad",
    },
  ];

  // Fetch cities from the API
  const fetchCiudades = async () => {
    try {
      const ciudades = await fetchCities();
      setCities(ciudades);
      console.log({ ciudades });
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchCiudades();
  }, []);

  return (
    <div className="p-4 max-w-full mx-auto bg-white shadow-md rounded-md dark:bg-dark-3">
      <Title level={4} className="text-center mb-4">
        Lista de Direcciones
      </Title>
      <Collapse>
        {items.map((item) => (
          <Panel
            header={<div className=" text-black dark:text-dark-7 rounded-lg">{item.name}</div>}
            key={item.id}
            className="rounded-lg dark:bg-dark-4 dark:text-dark-8"
            style={{
              color: "red"
            }}
          >
            <Form
              // form={form}
              layout="vertical"
              // onFinish={onSubmit}
              className="p-6 rounded-lg shadow-md bg-gray-50 dark:bg-dark-3"
            >
              {/* Dirección */}
              <Form.Item
                label="Dirección"
                name="direccion"
                rules={[{ required: true, message: "Por favor ingresa la dirección" }]}
                className="mb-4"
              >
                <Input
                  placeholder="Ingresa tu dirección"
                  className="dark:bg-dark-3 dark:text-dark-8"
                />
              </Form.Item>

              {/* Municipio */}
              <Form.Item
                label="Municipio"
                name="ciudad"
                rules={[
                  { required: true, message: "Por favor selecciona un municipio" },
                ]}
                className="mb-4"
              >
                <Select
                  placeholder="Selecciona un municipio"
                  className="dark:bg-dark-3 dark:text-dark-8"
                >
                  {cities.map((city) => (
                    <Option key={city.id_city} value={city.name}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Barrio */}
              <Form.Item
                label="Barrio"
                name="barrio"
                rules={[{ required: true, message: "Por favor ingresa el barrio" }]}
                className="mb-4"
              >
                <Input
                  placeholder="Ingresa tu barrio"
                  className="dark:bg-dark-3 dark:text-dark-8"
                />
              </Form.Item>

              {/* Botón Enviar */}
              <Form.Item className="mb-0">
                <ButtonOnClick
                  onClick={() => {console.log("actualizado malo")}}
                  customClasses="w-full font-semibold rounded-lg"
                >
                  Actualizar
                </ButtonOnClick>
                
              </Form.Item>
            </Form>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ListaDir;
