"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ClienteLayout from "@/components/Layouts/ClienteLayout";

const SignIn: React.FC = () => {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/landing-client");
    }
  }, [router]);

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://api-aguamarina-mysql-v2.onrender.com/api/v2/validate_login",
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ mail: loginData.email, password: loginData.password }),
        }
      );

      const responseJson = await response.json();

      if (!response.ok) {
        const errorMessage = responseJson.message || "No hay un usuario con los datos ingresados";
        throw new Error(errorMessage);
      }

      if (responseJson.logged) {
        localStorage.setItem("isAuthenticated", "true");
        const payload = responseJson.data;

        if (payload && payload.id_rol === 1) {
          await Swal.fire({
            icon: "success",
            title: "Bienvenido Administrador",
            text: "Acceso concedido.",
            confirmButtonColor: "#0000ff",
          });
        }

        // Alerta de inicio de sesión exitoso
        await Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "Redirigiendo a la página de inicio...",
        });

        toast.success("Login successful");
        router.push("/landing-client");
      } else {
        const errorMessage = responseJson.message || "Error Desconocido";
        toast.error(errorMessage);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#0000ff",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.",
        confirmButtonColor: "#0000ff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClienteLayout>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card px-10">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full sm:p-12.5 xl:p-15 p-4">
              <section>
                <div className="container">
                  <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                      <div className="wow fadeInUp relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]" data-wow-delay=".15s">
                        <form onSubmit={loginUser}>
                          <div className="mb-[22px]">
                          <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Correo:
                            <span className="text-red">*</span>
                              </label>
                            <input
                              type="email"
                              placeholder="Email"
                              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                              required
                            />
                          </div>
                          <div className="mb-[22px]">
                          <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Contraseña:
                            <span className="text-red">*</span>
                            </label>
                            <input
                              type="password"
                              placeholder="Password"
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                              required
                            />
                          </div>
                          <div className="mb-9">
                            <button
                              type="submit"
                              className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-primary/90"
                            >
                              Ingresar 
                            </button>
                          </div>
                        </form>

                        <Link href="/recoverPassword" className="mb-2 inline-block text-base text-dark hover:text-primary dark:text-white dark:hover:text-primary">
                          Perdiste tu contraseña?
                        </Link>
                        <p className="text-body-secondary text-base">
                          No estás registrado?{" "}
                          <Link href="/register" className="text-primary hover:underline">Regístrate</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="hidden w-full p-7.5 xl:block xl:w-1/2 mt-50">
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
                Inicia Sesión en tu Cuenta  
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Bienvenido!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Inicie sesión en su cuenta completando los campos necesarios a continuación
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

export default SignIn;
