"use client"
import { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { postCategories } from "@/api/fetchs/posts/post_categoria";

const crearCategoria = () => {

    const [formData, setFormData] = useState({
        name: ''
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

        try {
            const dataPostCategories = {
                name: formData.name
                // status: formData.status
            }

            const createdCategory = await postCategories(dataPostCategories);
            console.log("Categoría creada:", createdCategory);
            
            const nameCategory = createdCategory.name;
            setFormData({
                name: '',
                // status: true,
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
                            label="Nombre de la categoría"
                            type="text"
                            placeholder="Ingresa el nombre completo de la categoría"
                            customClasses="w-full"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div> 

                    <button type="submit" className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                        Crear categoría
                    </button>
                </div>
            </form>
        </div>
    );
};

export default crearCategoria;
