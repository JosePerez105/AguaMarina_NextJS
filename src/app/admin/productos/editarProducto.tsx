"use client";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { useState, useEffect } from "react";
import { fetchProductById, updateProduct } from "@/api/fetchs/get_productos"; // Asegúrate de tener la función updateProduct
import Swal from "sweetalert2";

const EditarProducto: React.FC<{ productId?: number; handleClose: () => void }> = ({ productId = 1, handleClose }) => {
    const [productosOpc, setProductosOpc] = useState<{ id: number; name: string }[]>([]);
    const [formData, setFormData] = useState({
        id_product: 0,
        total_quantity: 0,
        unit_price: 0,
        purchase_date: null,
    });

    // Cargar los datos del producto y las opciones
    useEffect(() => {
        const fetchData = async () => {
            try {
                const producto = await fetchProductById(productId);
                setFormData({
                    id_product: producto.id_product,
                    total_quantity: producto.total_quantity,
                    unit_price: producto.price,
                    // purchase_date: producto.purchase_date.split('T')[0], // Formato YYYY-MM-DD
                });
                
                // Cargar las opciones de productos
                const productos = await fetchProducts();
                setProductosOpc(productos.map((prod) => ({
                    id: prod.id_product,
                    name: prod.name
                })));
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        fetchData();
    }, [productId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value, name } = event.target;
        const fieldName = id || name;
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: value,
        }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData(prevState => ({
            ...prevState,
            purchase_date: date ? date.toISOString().split('T')[0] : "",
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const updatedProduct = {
                id_product: formData.id_product,
                total_quantity: formData.total_quantity,
                unit_price: formData.unit_price,
                purchase_date: formData.purchase_date,
            };
            await updateProduct(productId, updatedProduct); // Actualiza en la API
            Swal.fire({
                icon: "success",
                title: "Producto Actualizado",
                text: "Los datos se han actualizado correctamente.",
                timer: 3000,
                showConfirmButton: false,
            });
            handleClose(); // Cerrar el formulario
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            Swal.fire("Error", "No se pudo actualizar el producto.", "error");
        }
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <SelectGroupOne 
                            id="id_product"
                            name="id_product"
                            label="Producto"
                            placeholder="Selecciona el Producto"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.id_product}
                            opciones={productosOpc}
                            onChange={handleChange}
                        />
                        <DatePickerOne
                            customClasses="mb-3 w-full lg:w-1/2"
                            id="purchase_date"
                            name="purchase_date"
                            label="Fecha de Compra"
                            required
                            value={formData.purchase_date}
                            onChange={handleDateChange}
                        />
                    </div>

                    <div className="mb-3 flex gap-4.5 flex-row">
                        <InputGroup
                            id="total_quantity"
                            name="total_quantity"
                            label="Cantidad de Productos"
                            type="number"
                            placeholder="Ingresa la cantidad de productos"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.total_quantity}
                            onChange={handleChange}
                        />
                        
                        <InputGroup
                            id="unit_price"
                            name="unit_price"
                            label="Valor unitario"
                            type="number"
                            placeholder="Ingresa el valor por unidad"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.unit_price}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                        Actualizar Producto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarProducto;
