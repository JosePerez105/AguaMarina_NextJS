"use client"
import { useState, useEffect } from "react";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import InputGroup from "@/components/FormElements/InputGroup";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import { fetchCategories } from "@/api/fetchs/get_categorias";
import SliderObjects from "@/components/SliderObjects/SliderObjects";
import ImageInput from "@/components/ImageInput/ImageInput";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { postProducts } from "@/api/fetchs/posts/post_producto";
import { postImagenes } from "@/api/fetchs/posts/post_imagenes";
import cambiar_estado_productos from "@/api/functions/changeStatus_Productos";
import SwitcherProductsForm from "@/components/FormElements/Switchers/SwitcherProductsForm";

interface ImageData {
    uid: string;
    name: string;
    status: string;
    url: string;
}

const crearProducto = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [clearImages, setClearImages] = useState(false);
    const [opcionesCategorias, setOpcionesCategorias] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        const getCategorias = async () => {
            const categories = await fetchCategories();
            setOpcionesCategorias(categories.map((cat) => ({
                id: cat.id_category,
                name: cat.name
            })).sort((a, b) => a.id - b.id));
        };
        getCategorias();
    }, []);


    const [formData, setFormData] = useState({
        name: '',
        id_category: '',
        total_quantity: '',
        unit_price: '',
        unit_price_public: '',
        description: '',
        purchase_date: '',
        status: true,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, name, type } = event.target;
        const fieldName = id || name;
    
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault()
        console.log(formData, "FormData")
        console.log(images, "imagenes")
        const dataPostProducts = {
            name: formData.name,
            total_quantity: formData.total_quantity,
            price: formData.unit_price,
            description: formData.description,
            id_category: formData.id_category,
            status: formData.status
        }


        try {
            const createdProduct = await postProducts(dataPostProducts);
            const createdImages = await postImagenes(createdProduct, images);
            setImages([]);
            setClearImages(true);
            console.log("Imagenes Creadas : ", createdImages)
            console.log("Producto creado:", createdProduct);
            const nameProduct = createdProduct.name;
            setFormData({
                name: '',
                id_category: '',
                total_quantity: '',
                unit_price: '',
                unit_price_public: '',
                description: '',
                purchase_date: '',
                status: true,
            });
      
          } catch (error) {
            console.error("Error al crear el producto:", error);
          }
        };

    return (
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card text-xl">
            <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="name"
                            name="name"
                            label="Nombre del Producto"
                            type="text"
                            placeholder="Ingresa el nombre completo del producto"
                            customClasses="w-full"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                        
                        <SelectGroupOne 
                            id="id_category"
                            name="id_category"
                            label="Categoría"
                            placeholder="Selecciona una Catgoría"
                            customClasses="mb-3 w-full xl:w-1/2"
                            required
                            value={formData.id_category}
                            opciones={opcionesCategorias}
                            onChange={handleChange}
                        />
                    </div>
                    
                    
                    <div className="mb-3 flex gap-4.5 flex-row">
                        <InputGroup
                            id="total_quantity"
                            name="total_quantity"
                            label="Cantidad Inicial"
                            type="number"
                            placeholder="Ingresa la cantidad inicial del producto"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.total_quantity}
                            onChange={handleChange}
                        />
                        
                        <DatePickerOne  
                            customClasses="mb-3 w-full lg:w-1/2"
                            id="purchase_date"
                            name="purchase_date"
                            required
                            onChange={handleChange}
                        />
                        
                       
                    </div>

                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="unit_price"
                            name="unit_price"
                            label="Valor Unitario de Compra"
                            type="number"
                            placeholder="Ingresa el costo de compra por unidad"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.unit_price}
                            onChange={handleChange}
                        />

                        <InputGroup
                            id="unit_price_public"
                            name="unit_price_public"
                            label="Valor Unitario al Público"
                            type="number"
                            placeholder="Ingresa la cantidad inicial del producto"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.unit_price_public}
                            onChange={handleChange}
                        />
                    </div>
                    

                    <div className="mb-3">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Descripción:
                            <span className="text-red">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={6}
                            placeholder="Escribe la descripción del producto"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Imágenes:
                            <span className="text-red">*</span>
                        </label>
                        <ImageInput setImages={setImages} clearImages={clearImages} />
                    </div>
                    <div className="mb-6">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Estado:
                        </label>
                        <SwitcherProductsForm id="status" name="status" checked={formData.status} onChange={handleChange}/>
                    </div>

                    <button type="submit" className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                        Crear Producto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default crearProducto;
