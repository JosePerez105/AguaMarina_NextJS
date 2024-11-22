"use client";
import AlertWarning from "@/components/Alerts/AlertWarning";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Image from "next/image";
import es_ES from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import ImageInput from "@/components/ImageInput/ImageInput";
import React, { useState, useEffect } from "react";
import { Steps } from "antd";
import { useCart } from "@/context/CartContext";
import { RangePickerProps } from "antd/es/date-picker";
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { TextField, Button, Container, Typography, Grid, Card, SelectChangeEvent, FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import { DatePicker, Space, ConfigProvider } from "antd";
import { checkToken } from "@/api/validations/check_cookie";
import { validateLogin } from "@/api/validations/validate_login"; 

function formatCurrency(value: string | number): string {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) {
    return "Invalid price";
  }
  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

interface ImageData {
  uid: string;
  name: string;
  status: string;
  url: string;
}

const reservas: React.FC = () => {
  const { cartItems, cantBadge, removeFromCart, updateCartItemQuantity } = useCart();
  const [removedItemId, setRemovedItemId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { Step } = Steps;
  const { RangePicker } = DatePicker;
  const onDateChange = (dates: [string, string] | null) => { return; };
  const [direccion, setDireccion] = useState('');
  const [loginData, setLoginData] = useState({ mail: "", password: "" });
  const [loading, setLoading] = useState(false); 
  

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const { result } = await checkToken();
      if (result) {
        setCurrentStep(1);
      }
    };
    checkIfLoggedIn();
  }, []);

  const handleRemoveItem = (itemId: number) => {
    setRemovedItemId(itemId);
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovedItemId(null);
    }, 300);
  };

  const handleIncreaseQuantity = (itemId: number) => {
    updateCartItemQuantity(itemId, 1);
  };

  const handleDecreaseQuantity = (itemId: number) => {
    updateCartItemQuantity(itemId, -1);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const disabledDate = (current: any) => {
    return current && current.isBefore(dayjs().startOf("day"), "day"); 
  };

  const handleDateChange: RangePickerProps["onChange"] = (
    dates,
    dateStrings,
  ) => {
    if (dates) {
      onDateChange([dateStrings[0], dateStrings[1]]);
    } else {
      onDateChange(null);
    }
  };

  const handleDireccionChange = (event: SelectChangeEvent<string>) => {
    setDireccion(event.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await validateLogin(loginData);
      if (response.result) {
        localStorage.setItem("isAuthenticated", "true");
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          text: "Bienvenido a tu cuenta.",
        }).then(() => {
          setCurrentStep(1); 
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Correo o contraseña incorrectos.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al iniciar sesión. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (images.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No has subido ninguna imagen.",
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Imagenes subidas",
      html: `
        <div style="display: flex; justify-content: space-around;">
          ${images.map((image, index) => `<img src="${image.url}" alt="Imagen ${index + 1}" style="width: 100px; height: 100px; object-fit: cover; margin: 5px;"/>`).join("")}
        </div>
      `,
      confirmButtonText: "Aceptar",
    }).then(() => {
      handleNextStep();
    });
  };

  const openImageModal = () => {
    Swal.fire({
      title: "Sube tus imágenes",
      html: `
        <div id="image-upload-container" style="text-align: center;">
          <div style="margin-bottom: 15px;">
            <p>Despues del pago agrega tu comprobante:</p>
            <img src="/images/qr_transferencias.jpeg" alt="QR Transferencias">
            <div id="image-input"></div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      didOpen: () => {
        new ImageInput({
          target: document.getElementById("image-input"),
          setImages: handleImageChange,
        });
      },
      preConfirm: () => {
        if (images.length === 0) {
          Swal.showValidationMessage("Debes subir al menos una imagen.");
          return false;
        }
        return true;
      },
    });
  };

  return (
    <Container>
      {/* Parte del formulario de reserva */}
      <Steps current={1}>
        <Step
          title={<span className="dark:text-white">Login</span>}
          icon={<UserOutlined style={{ color: "#5750f1" }} />}
        />
        <Step
          title={<span className="dark:text-white">Detalles</span>}
          icon={<SolutionOutlined style={{ color: "#5750f1" }} />}
        />
        <Step
          title={<span className="dark:text-white">Pago</span>}
          icon={<LoadingOutlined style={{ color: "#5750f1" }} />}
        />
        <Step
          title={<span className="dark:text-white">Finalizado</span>}
          icon={<SmileOutlined style={{ color: "#5750f1" }} />}
        />
      </Steps>
      {currentStep === 0 && (
        <Card variant="outlined"
        sx={{ padding: 2, marginTop: 2 }}
        className="dark:bg-dark dark:text-white">
          <Typography variant="h5" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleLogin}> 
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Correo"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  color="info"
                  InputProps={{
                    style: { color: "white" },}} // Cambia el color del texto a blanco
                  value={loginData.mail}
                  onChange={(e) => setLoginData({ ...loginData, mail: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    style: { color: "white" },}}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  color="info"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}

      {currentStep === 1 && (
        <Card
          variant="outlined"
          sx={{ padding: 2, marginTop: 2 }}
          className="dark:bg-dark dark:text-white"
        >
          <Typography variant="h4" align="center" gutterBottom>
            Detalles de la Reserva
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ConfigProvider
                  locale={es_ES}
                  theme={{
                    token: {
                      colorPrimary: "#5750f1",
                    },
                  }}
                >
                  <Space direction="vertical" size={12}>
                    <RangePicker
                      size="large" // Este es el tamaño que controlará la apariencia
                      onChange={handleDateChange}
                      disabledDate={disabledDate}
                      className="h-14 w-[132%] text-dark-7 dark:bg-dark-4"
                    />
                  </Space>
                </ConfigProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  required
                  className="rounded-lg bg-white shadow-lg dark:bg-[#26334A]"
                >
                  <InputLabel id="direccion-label" style={{ color: "white" }}>
                    Dirección
                  </InputLabel>
                  <Select
                    labelId="direccion-label"
                    id="direccion"
                    label="Dirección"
                    value={direccion} 
                    onChange={handleDireccionChange} 
                    className="text-dark-7 dark:bg-dark-4"
                    MenuProps={{
                      PaperProps: {
                        style: { backgroundColor: "#26334A" },
                      },
                    }}
                  >
                    <MenuItem value="direccion1">Dirección 1</MenuItem>
                    <MenuItem value="direccion2">Dirección 2</MenuItem>
                    <MenuItem value="direccion3">Dirección 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePreviousStep}
                  className="flex w-full cursor-pointer items-center justify-center 
                  rounded-md border border-primary bg-primary px-5 py-3 text-base text-white 
                  transition duration-300 ease-in-out hover:bg-primary/90"
                >
                  Volver
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextStep}
                  className="flex w-full cursor-pointer items-center justify-center 
                  rounded-md border border-primary bg-primary px-5 py-3 text-base text-white 
                  transition duration-300 ease-in-out hover:bg-primary/90"
                >
                  Continuar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}

      {currentStep === 2 && (
        <Card
          variant="outlined"
          sx={{ padding: 2, marginTop: 2 }}
          className="dark:bg-dark dark:text-white"
        >
          <Typography variant="h5" align="center" gutterBottom>
            Seleccione el Método de Pago
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="flex w-full cursor-pointer items-center justify-center 
                  rounded-md border border-primary bg-primary px-5 py-3 text-base text-white 
                  transition duration-300 ease-in-out hover:bg-primary/90"
          >
            Efectivo
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ marginTop: 1 }}
            onClick={openImageModal}
            className="flex w-full cursor-pointer items-center justify-center 
            rounded-md border border-primary bg-primary px-5 py-3 text-base text-white 
            transition duration-300 ease-in-out hover:bg-primary/90"
          >
            Transferencia
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePreviousStep}
            sx={{ marginTop: 2 }}
            className="flex w-full cursor-pointer items-center justify-center 
            rounded-md border border-primary bg-primary px-5 py-3 text-base text-white 
            transition duration-300 ease-in-out hover:bg-primary/90"
          >
            Volver
          </Button>
        </Card>
      )}

      {currentStep === 3 && (
        <Typography variant="h4" align="center" sx={{ marginTop: 2 }}>
          Proceso Completado
        </Typography>
      )}
      {/* Aqui termina la parte del formulario de reserva */}
      {/* Parte de donde se ven los productos*/}
      <div className="mt-2 flex h-full flex-col justify-between space-y-4 text-dark dark:text-white">
        {cartItems.length > 0 ? (
          <div className="flex flex-grow flex-col space-y-4 overflow-y-auto overflow-x-hidden">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`flex transform cursor-pointer items-center justify-between rounded-lg border-b border-gray-200 p-4 transition-all hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-dark-3 ${
                  removedItemId === item.id ? "scale-95 opacity-0" : ""
                }`}
              >
                {/* Imagen del producto */}
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.image || "https://via.placeholder.com/60"}
                    alt="producto"
                    width={60}
                    height={60}
                    className="h-16 w-16 rounded-md object-cover shadow-lg"
                  />
                  {/* Información del producto */}
                  <div className="flex flex-col justify-between">
                    <span className="text-base font-semibold text-gray-800 dark:text-white">
                      {item.name.length > 20
                        ? `${item.name.slice(0, 20)}...`
                        : item.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad:
                      <div className="mt-1 flex items-center space-x-2">
                        {/* Botón de disminución */}
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="rounded-lg bg-gray-200 p-2 text-gray-800 transition duration-200 hover:bg-gray-300"
                          disabled={item.quantity <= 1} // Deshabilitar si la cantidad es 1
                        >
                          -
                        </button>
                        {/* Display de cantidad */}
                        <span className="text-md text-gray-800 dark:text-white">
                          {item.quantity}
                        </span>
                        {/* Botón de aumento */}
                        <button
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className="rounded-lg bg-gray-200 p-2 text-gray-800 transition duration-200 hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Precio: {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
                {/* Botón de eliminación */}
                <div className="flex items-center">
                  <button
                    className="rounded-lg p-2 text-red-600 transition duration-300 hover:text-red-800"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <ClearOutlinedIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <AlertWarning title="Tu carrito está vacío" />
          </div>
        )}
        {/* Contenedor de Total Fijo en la parte inferior */}
        {cartItems.length > 0 ? (
          <div className="sticky bottom-0 flex flex-col justify-between gap-5 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-dark-2">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              Subtotal de productos:
            </p>
            <p className="font-semibold text-gray-800 dark:text-white">
              <span className="text-2xl font-semibold text-gray-800 dark:text-white">
                Total:
              </span>
              <span className="text-md font-semibold text-gray-800 dark:text-white">
                $
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  )
                  .toLocaleString("en-US")}
              </span>
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* Aqui termina la parte de donde se ven los productos*/}
    </Container>
  );
};

export default reservas;
