"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loader from "@/components/common/Loader";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import Modal from "@/app/Modal/modal"; 

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    names: "",
    lastnames: "",
    dni: "",
    mail: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
    modalOpen: false,
    verificationData: null,
  });
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/landing-client");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password: string) => {
    if (password.length < 6) return "Muy débil";
    if (password.length < 10) return "Débil";
    if (/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) return "Fuerte";
    return "Moderada";
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({ ...prev, acceptedTerms: !prev.acceptedTerms }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const {
      names, lastnames, dni, mail, phone_number, password, confirmPassword, acceptedTerms
    } = formData;

    if (!acceptedTerms) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes aceptar los términos y condiciones para registrarte.',
        confirmButtonColor: "#0000ff",
      });
      return;
    }

    if (password !== confirmPassword) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: "#0000ff",
      });
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.',
        confirmButtonColor: "#0000ff",
      });
      return;
    }
    try {
      const checkResponse = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail })
      });

      const checkResponseJson = await checkResponse.json();

      if (!checkResponseJson.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El correo electrónico ya está registrado.',
          confirmButtonColor: "#0000ff",
        });
        return;
      }

      const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/verificationcodes_generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail })
      });

      const responseJson = await response.json();

      if (!responseJson.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al generar el código de verificación',
          confirmButtonColor: "#0000ff",
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          modalOpen: true,
          verificationData: { mail },
        }));
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error en el servidor',
        confirmButtonColor: "#0000ff",
      });
    }
  };

  const handleModalSubmit = async (code: string) => {
    setFormData((prev) => ({ ...prev, loading: true, modalOpen: false }));

    const {
      names, lastnames, dni, mail, phone_number, password
    } = formData;

    try {
      const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          names,
          lastnames,
          dni,
          mail,
          password,
          phone_number,
        })
      });

      const responseJson = await response.json();
      if (!responseJson.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: responseJson.message,
        });
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Usuario registrado exitosamente',
      });
      router.push('/login-page');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    } finally {
      setFormData((prev) => ({ ...prev, loading: false }));
    }
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <ClienteLayout>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card px-10 py-40">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full sm:p-12.5 xl:p-15 p-4">
              <section>
                <div className="container">
                  <form onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div className="mb-[22px]">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Nombre:
                            <span className="text-red">*</span>
                        </label>
                      <input
                        type="text"
                        name="names"
                        placeholder="Names"
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3"
                      />
                    </div>
                    <div className="mb-[22px]">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Apelidos:
                            <span className="text-red">*</span>
                        </label>
                      <input
                        type="text"
                        name="lastnames"
                        placeholder="Last Names"
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3"
                      />
                    </div>
                    <div className="mb-[22px]">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Correo:
                            <span className="text-red">*</span>
                        </label>
                      <input
                        type="email"
                        name="mail"
                        placeholder="Email"
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3"
                      />
                    </div>
                    <div className="mb-[22px]">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Contraseña:
                            <span className="text-red">*</span>
                        </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3"
                      />
                      <small>{passwordStrength}</small>
                    </div>
                    <div className="mb-[22px]">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Confirmar contraseña:
                            <span className="text-red">*</span>
                        </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3"
                      />
                    </div>
                    <div className="mb-[22px]">
                    <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Cedula:
                            <span className="text-red">*</span>
                        </label>
                      <input
                        type="number"
                        name="dni"
                        placeholder="DNI"
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3"
                      />
                    </div>
                    <div className="mb-[22px]">
                      <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Celular:
                            <span className="text-red">*</span>
                        </label>
                      <input
                        type="text"
                        name="phone_number"
                        placeholder="Phone Number"
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3"
                      />
                    </div>
                    <div className="mb-9">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.acceptedTerms}
                          onChange={handleCheckboxChange}
                        />
                        Acepto los términos y condiciones
                      </label>
                    </div>
                    <div className="mb-9">
                      <button
                        type="submit"
                        className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white"
                        disabled={formData.loading || !formData.acceptedTerms}
                      >
                        {formData.loading ? "REGISTRANDO..." : "CREAR CUENTA"}
                      </button>
                    </div>
                  </form>
                  <p className="text-body-secondary text-base">
                    Estás registrado?{" "}
                    <Link href="/login" className="text-primary hover:underline">Ingresa</Link>
                  </p>

                  {/* Modal for verification code */}
                  <Modal
                    isOpen={formData.modalOpen}
                    onClose={() => setFormData((prev) => ({ ...prev, modalOpen: false }))}
                    onSubmit={handleModalSubmit}
                    data={{mail : formData.mail}}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="hidden w-full p-7.5 xl:block xl:w-1/2 mb-15">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-1.5 dark:!bg-dark-2 dark:bg-none">
              <Link className="mb-10 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/LogoCompletoNegativo.png"}
                  alt="Logo"
                  width={400}
                  height={100}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/LogoCompleto.png"}
                  alt="Logo"
                  width={400}
                  height={100}
                />
              </Link>
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                Registrate para obtener tu Cuenta
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Bienvenido!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Registrate completando todos los datos a continuación
              </p>

              <div className="mt-31">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClienteLayout>
  );
};

export default Register;
