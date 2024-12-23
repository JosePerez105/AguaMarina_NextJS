"use client"
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import InputGroup from "@/components/FormElements/InputGroup";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useState, useEffect } from "react";
import { fetchProductById, fetchProducts } from "@/api/fetchs/get_productos";
import { checkToken } from "@/api/validations/check_cookie";
import SelectSearch from "@/components/FormElements/SelectGroup/SelectSearch";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { postPurchases } from "@/api/fetchs/posts/post_compra";
import Swal from "sweetalert2";

const agregarProducto: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
    const [productosOpc, setProductosOpc] = useState<{ id: number; name: string }[]>([]);
    const [dataUser, setDataUser] = useState({id_user : 1});

    useEffect(() => {
        const getCategorias = async () => {
            const productos = await fetchProducts();
            setProductosOpc(productos.map((prod) => ({
                id: prod.id_product,
                name: prod.name
            })).sort((a, b) => a.id - b.id));
        };
        const getDataUser = async () => {
            const {data} = await checkToken();
            setDataUser(data);
        }
        getCategorias();
        getDataUser();
    }, []);

    const [formData, setFormData] = useState({
        id_product: '',
        total_quantity: '',
        unit_price: '',
        unit_price_public: '',
        purchase_date: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, name, type } = event.target;
        const fieldName = id || name;
    
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
        }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData(prevState => ({
            ...prevState,
            purchase_date: date ? date.toISOString() : "",
        }));
    };

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault()
        console.log(formData, "FormData")

        try {
            const dataPostPurchase = {
                id_user : dataUser.id_user,
                id_product : formData.id_product,
                purchase_date : formData.purchase_date,
                quantity : formData.total_quantity,
                unit_price : formData.unit_price
            }
            const createdPurchase = await postPurchases(dataPostPurchase);
            const product = await fetchProductById(createdPurchase.id_product);
            const quantity = createdPurchase.quantity;
            const nameProduct = product.name;
            console.log("Compra creada : ", createdPurchase);
            handleClose();

            await Swal.fire({
                icon: "success",
                iconColor: "#111928",
                color: "#111928",
                title: "Productos Agregados!!",
                text: `Se ha generado la compra de (${quantity}) unidades de '${nameProduct}'`,
                showConfirmButton : false,
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                background: "url(/images/grids/bg-aguamarina-azul.jpg)",
                customClass: {
                  popup: 'rounded-3xl shadow shadow-6',
                }
              });
            
            setFormData({
                id_product: '',
                total_quantity: '',
                unit_price: '',
                unit_price_public: '',
                purchase_date: '',
            });
            
      
          } catch (error) {
            console.error("Error al crear el producto:", error);
          }
        };

    return (
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
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
                            customClasses="mb-3 w-full "
                            id="purchase_date"
                            name="purchase_date"
                            label="Fecha de Compra"
                            required
                            value={formData.purchase_date}
                            onChange={handleDateChange}
                        />
                    </div>

                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="total_quantity"
                            name="total_quantity"
                            label="Cantidad de Productos"
                            type="number"
                            placeholder="Ingresa la cantidad de productos de la compra"
                            customClasses="mb-2 w-full"
                            required
                            value={formData.total_quantity}
                            onChange={handleChange}
                        />
                        
                        <InputGroup
                            id="unit_price"
                            name="unit_price"
                            label="Valor unitario de compra"
                            type="number"
                            placeholder="Ingresa el valor de compra por unidad"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.unit_price}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                        Agregar Producto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default agregarProducto;





