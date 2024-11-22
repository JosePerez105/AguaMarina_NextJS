import React, { useState } from 'react';
import { Badge, Drawer } from 'antd';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ButtonOnClick from '../../Buttons/ButtonOnClick';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import AlertWarning from '@/components/Alerts/AlertWarning';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

const Carrito: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { cartItems, cantBadge, removeFromCart, updateCartItemQuantity } = useCart();
  const [removedItemId, setRemovedItemId] = useState<number | null>(null);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  function formatCurrency(value: string | number): string {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) {
      return "Invalid price";
    } 
    return numericValue.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

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

  return (
    <div className="m-5">
      <Badge count={cantBadge}>
        <ButtonOnClick
          customClasses="text-xl font-semibold border border-primary text-primary hover:bg-primary duration-300 hover:text-white rounded-[5px] p-3"
          onClick={showDrawer}
        >
          <ShoppingCartOutlinedIcon />
        </ButtonOnClick>
      </Badge>

      <Drawer
        title={<span className="text-3xl font-semibold text-gray-800 dark:text-white">Carrito ({cantBadge})</span>}
        onClose={onClose}
        open={open}
        className="dark:bg-dark-2 shadow-lg"
        style={{ padding: '0px', borderRadius: '30px 0 0 30px' }}
        width={400}
      >
        <div className="text-dark dark:text-white flex flex-col justify-between h-full space-y-4">
          {cartItems.length > 0 ? (
            <div className="flex flex-col flex-grow space-y-4 overflow-y-auto overflow-x-hidden">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-3 rounded-lg cursor-pointer transform transition-all ${
                    removedItemId === item.id ? 'scale-95 opacity-0' : ''
                  }`}
                >
                  {/* Imagen del producto */}
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image || "https://via.placeholder.com/60"}
                      alt="producto"
                      width={60}
                      height={60}
                      className="rounded-md w-16 h-16 object-cover shadow-lg"
                    />
                    {/* Información del producto */}
                    <div className="flex flex-col justify-between">
                      <span className="text-base font-semibold text-gray-800 dark:text-white">
                        {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Cantidad:
                        <div className="flex items-center space-x-2 mt-1">
                          {/* Botón de disminución */}
                          <button
                            onClick={() => handleDecreaseQuantity(item.id)}
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300 p-2 rounded-lg transition duration-200"
                            disabled={item.quantity <= 1} // Deshabilitar si la cantidad es 1
                          >
                            -
                          </button>
                          {/* Display de cantidad */}
                          <span className="text-md text-gray-800 dark:text-white">{item.quantity}</span>
                          {/* Botón de aumento */}
                          <button
                            onClick={() => handleIncreaseQuantity(item.id)}
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300 p-2 rounded-lg transition duration-200"
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
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg transition duration-300"
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
          <div className="flex flex-col gap-5 justify-between border-t border-gray-200 dark:border-gray-700 p-4 sticky bottom-0 bg-white dark:bg-dark-2">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">Subtotal de productos:</p>
            <p className="font-semibold text-gray-800 dark:text-white">
              <span className="text-2xl font-semibold text-gray-800 dark:text-white">Total:</span>
              <span className="text-md font-semibold text-gray-800 dark:text-white">
                ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString("en-US")}
              </span>
            </p>
            <ButtonDefault
              // onClick={() => { console.log("reservando..."); }}
              link='/pedido'
              customClasses="duration-300 py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all"
            >
              Finalizar reserva
            </ButtonDefault>
          </div>
          ) : (
            <></>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default Carrito;
