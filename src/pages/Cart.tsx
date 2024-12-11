import React, { useState } from 'react';
import { Minus, Plus, Trash2, Send, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';

type PaymentMethod = 'cash' | 'transfer';

export const Cart: React.FC = () => {
  const { cart, config, updateQuantity, removeFromCart, clearCart } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>('');

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateItemTotal = (item: typeof cart[0]) => {
    const basePrice = item.selectedSize && item.product.sizes
      ? item.product.sizes.find(s => s.id === item.selectedSize)?.price || item.product.price
      : item.product.price;

    const addonsTotal = item.selectedAddons.reduce((sum, addonId) => {
      const addon = item.product.addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return (basePrice + addonsTotal) * item.quantity;
  };

  const total = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const handleWhatsAppOrder = () => {
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert('Por favor complete todos los datos requeridos');
      return;
    }

    if (paymentMethod === 'transfer' && !paymentProof) {
      alert('Por favor adjunte el comprobante de pago');
      return;
    }

    const orderNumber = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    let message = `🛍️ *Nuevo Pedido #${orderNumber}*\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📱 *Teléfono:* ${customerPhone}\n`;
    message += `📍 *Dirección de entrega:* ${deliveryAddress}\n`;
    message += `💳 *Método de pago:* ${paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'}\n\n`;
    message += `*Pedido:*\n`;
    
    cart.forEach(item => {
      message += `\n• ${item.quantity}x ${item.product.name}`;
      if (item.selectedSize && item.product.sizes) {
        const size = item.product.sizes.find(s => s.id === item.selectedSize);
        if (size) {
          message += ` (${size.name})`;
        }
      }
      if (item.selectedAddons.length > 0) {
        message += '\n   Adicionales:';
        item.selectedAddons.forEach(addonId => {
          const addon = item.product.addons.find(a => a.id === addonId);
          if (addon) {
            message += `\n   - ${addon.name} (+$${addon.price.toFixed(2)})`;
          }
        });
      }
      message += `\n   Subtotal: $${calculateItemTotal(item).toFixed(2)}`;
    });
    
    if (notes) {
      message += `\n\n📝 *Notas:* ${notes}`;
    }
    
    message += `\n\n💰 *Total:* $${total.toFixed(2)}`;

    const whatsappUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-light mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8">¡Agrega algunos productos para comenzar!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-light mb-8">Tu Carrito</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedAddons.join('-')}-${item.selectedSize}`}
                className="flex items-center gap-4 bg-white p-4 shadow-sm rounded-lg"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  {item.selectedSize && item.product.sizes && (
                    <p className="text-sm text-gray-500">
                      Tamaño: {item.product.sizes.find(s => s.id === item.selectedSize)?.name}
                    </p>
                  )}
                  {item.selectedAddons.length > 0 && (
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">Adicionales:</p>
                      <ul className="text-sm text-gray-500">
                        {item.selectedAddons.map(addonId => {
                          const addon = item.product.addons.find(a => a.id === addonId);
                          return addon && (
                            <li key={addon.id}>
                              - {addon.name} (+${addon.price.toFixed(2)})
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <p className="text-sm font-medium mt-1">
                    ${calculateItemTotal(item).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, Math.max(0, item.quantity - 1))
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 hover:bg-gray-100 rounded ml-2"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* Order Form */}
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h3 className="text-xl font-medium mb-4">Datos de Entrega</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección de Entrega
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`px-4 py-2 rounded-lg border ${
                      paymentMethod === 'cash'
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`px-4 py-2 rounded-lg border ${
                      paymentMethod === 'transfer'
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Transferencia
                  </button>
                </div>
              </div>

              {paymentMethod === 'transfer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comprobante de Pago
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {paymentProofPreview ? (
                        <img
                          src={paymentProofPreview}
                          alt="Payment proof preview"
                          className="mx-auto h-32 w-auto"
                        />
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-black hover:text-gray-700">
                          <span>Subir comprobante</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handlePaymentProofChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas adicionales
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-xl font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleWhatsAppOrder}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"
              >
                <Send className="h-5 w-5" />
                Enviar Pedido por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};