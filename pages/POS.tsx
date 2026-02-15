import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addInvoice } from '../features/posSlice';
import { addItem, deductStock } from '../features/inventorySlice';
import { addKitchenOrder, addLedgerEntry } from '../features/businessSlice';
import { Check, Download, MessageCircle, Search, Share2, Trash2, X } from 'lucide-react';
import { PaymentMode } from '../types';

const placeholderSteps = [
  'Search Mobile products...',
  'Search Grocery products...',
  'Search Pharmacy products...',
  'Search Cafe products...',
];

const POS: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.inventory.items);
  const shopName = useSelector((state: RootState) => state.config.shopName);
  const profession = useSelector((state: RootState) => state.config.selectedProfessionId);

  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [search, setSearch] = useState('');
  const [searchPlaceholder, setSearchPlaceholder] = useState(placeholderSteps[0]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [paid, setPaid] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: '',
    costPrice: '',
    sellingPrice: '',
  });

  useEffect(() => {
    let step = 0;
    let char = 0;
    let deleting = false;
    const timer = setInterval(() => {
      const full = placeholderSteps[step];
      if (!deleting) {
        char += 1;
        if (char >= full.length) deleting = true;
      } else {
        char -= 1;
        if (char <= 0) {
          deleting = false;
          step = (step + 1) % placeholderSteps.length;
        }
      }
      const current = placeholderSteps[step].slice(0, Math.max(1, char));
      setSearchPlaceholder(current);
    }, 75);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(
    () => (products || []).filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  const cartItems = useMemo(() => {
    return cart
      .map((c) => {
        const prod = (products || []).find((x) => x.id === c.productId);
        if (!prod) return null;
        return { ...prod, qty: c.qty };
      })
      .filter(Boolean) as Array<(typeof products)[number] & { qty: number }>;
  }, [cart, products]);

  const subtotal = cartItems.reduce((acc, p) => acc + p.sellingPrice * p.qty, 0);
  const total = Math.round(subtotal);
  const hasExpired = cartItems.some((item) => item.expiryDate && new Date(item.expiryDate) < new Date());

  const addToCart = (id: string) => {
    setCart((prev) => {
      const found = prev.find((p) => p.productId === id);
      if (found) return prev.map((p) => (p.productId === id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { productId: id, qty: 1 }];
    });
  };

  const addProductFromCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;
    dispatch(
      addItem({
        name: newProduct.name.trim(),
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        category: newProduct.category.trim() || 'General',
        quantity: Number(newProduct.quantity) || 0,
        minStockLevel: 0,
        costPrice: Number(newProduct.costPrice) || 0,
        sellingPrice: Number(newProduct.sellingPrice) || 0,
      }),
    );
    setNewProduct({ name: '', category: '', quantity: '', costPrice: '', sellingPrice: '' });
  };

  const buildReceiptText = (invoice: any) => {
    const itemRows = invoice.items.map((i: any) => `${i.name} x${i.quantity} @ Rs ${i.price}`).join('\n');
    return `*${shopName || 'DhandaX Tools'}*\nDate: ${new Date(invoice.date).toLocaleString()}\nCustomer: ${invoice.customerName || '-'}\nContact: ${invoice.customerPhone || '-'}\n\n${itemRows}\n\nTotal: Rs ${invoice.total}\nPaid by: ${invoice.paymentMode}\nStatus: ${invoice.paid ? 'Paid' : 'Udhaar'}\n\nThank for visiting come again !!`;
  };

  const handleCheckout = () => {
    if (cart.length === 0 || hasExpired) return;
    const invId = `INV-${Date.now().toString().slice(-6)}`;
    const invoice = {
      id: invId,
      date: new Date().toISOString(),
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      items: cartItems.map((i) => ({ name: i.name, price: i.sellingPrice, quantity: i.qty })),
      total,
      paymentMode,
      paid,
    };

    dispatch(addInvoice(invoice));
    cart.forEach((item) => dispatch(deductStock({ id: item.productId, quantity: item.qty })));

    if (!paid && customerName && customerPhone) {
      dispatch(
        addLedgerEntry({
          id: `UD-${Date.now()}`,
          customerName,
          customerPhone,
          amount: total,
          paid: 0,
          date: new Date().toLocaleDateString(),
          dueDate: dueDate || undefined,
          items: invoice.items.map((i) => i.name).join(', '),
        }),
      );
    }

    if (profession === 'cafe') {
      dispatch(
        addKitchenOrder({
          id: `KOT-${invId}`,
          table: 'Walk-in',
          items: invoice.items.map((i) => ({ name: i.name, qty: i.quantity })),
          status: 'New',
          startTime: new Date().toISOString(),
        }),
      );
    }

    setLastInvoice(invoice);
    setShowSuccess(true);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDueDate('');
    setPaid(true);
    setPaymentMode('Cash');
  };

  const shareReceipt = () => {
    if (!lastInvoice) return;
    const text = buildReceiptText(lastInvoice);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const downloadPdf = () => {
    if (!lastInvoice) return;
    const text = buildReceiptText(lastInvoice).replace(/\n/g, '<br/>');
    const popup = window.open('', '_blank', 'width=700,height=900');
    if (!popup) return;
    popup.document.write(`
      <html>
        <head><title>Receipt ${lastInvoice.id}</title></head>
        <body style="font-family: Arial; padding: 24px;">
          <h2 style="color:#1e90ff;">${shopName || 'DhandaX Tools'}</h2>
          <div>${text}</div>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="bg-white rounded-3xl border border-blue-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex items-center gap-2">
            <Search size={16} className="text-primary" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full outline-none bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-sm" placeholder={searchPlaceholder} />
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 overflow-auto max-h-[58vh]">
            {(filteredProducts || []).map((p) => (
              <button key={p.id} onClick={() => addToCart(p.id)} className="border border-blue-100 bg-white rounded-2xl p-3 text-left hover:border-primary hover:bg-blue-50 transition-all">
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">{p.category}</div>
                <div className="font-bold text-slate-800">{p.name}</div>
                <div className="text-primary font-black mt-2">Rs {p.sellingPrice}</div>
              </button>
            ))}
            {(filteredProducts || []).length === 0 && <div className="text-sm text-slate-400 col-span-full">No products found.</div>}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-blue-100 flex flex-col">
          <div className="p-4 border-b border-blue-100">
            <h3 className="font-black text-slate-800">POS Checkout</h3>
          </div>

          <form onSubmit={addProductFromCheckout} className="p-4 border-b border-blue-100 grid grid-cols-2 gap-2 bg-blue-50/50">
            <input required placeholder="Product name" className="col-span-2 border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            <input placeholder="Category" className="border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
            <input type="number" min="0" placeholder="Qty" className="border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} />
            <input type="number" min="0" placeholder="Cost price" className="border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" value={newProduct.costPrice} onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })} />
            <input type="number" min="0" placeholder="Selling price" className="border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" value={newProduct.sellingPrice} onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })} />
            <button className="col-span-2 bg-primary text-white py-2 rounded-xl font-bold text-sm">Add Product</button>
          </form>

          <div className="p-4 space-y-2 max-h-[220px] overflow-auto">
            {(cartItems || []).map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 border border-blue-100 rounded-xl">
                <div>
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className="text-xs text-slate-500">Rs {item.sellingPrice} x {item.qty}</div>
                </div>
                <button onClick={() => setCart((c) => c.filter((i) => i.productId !== item.id))} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
            {cartItems.length === 0 && <p className="text-sm text-slate-400">No items in cart.</p>}
          </div>

          <div className="p-4 border-t border-blue-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input placeholder="Customer name" className="border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <input placeholder="Customer phone" className="border border-blue-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(['Cash', 'UPI', 'Card', 'Split'] as PaymentMode[]).map((mode) => (
                <button key={mode} onClick={() => setPaymentMode(mode)} type="button" className={`border rounded-xl p-2 text-xs font-bold ${paymentMode === mode ? 'border-primary text-primary bg-blue-50' : 'border-blue-100 text-slate-600'}`}>
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-xl border border-blue-100">
              <span className="font-semibold text-sm">Payment Status</span>
              <button onClick={() => setPaid((v) => !v)} type="button" className={`px-3 py-1 rounded text-xs font-bold ${paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {paid ? 'Paid' : 'Udhaar'}
              </button>
            </div>

            {!paid && <input type="date" className="border border-red-200 rounded-xl px-3 py-2 w-full text-sm" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />}
            {hasExpired && <div className="text-xs text-red-600 font-bold">Expired item in cart. Remove it to bill.</div>}

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total</span>
              <span className="text-2xl font-black text-primary">Rs {total}</span>
            </div>
            <button onClick={handleCheckout} disabled={cartItems.length === 0 || hasExpired} className="w-full bg-primary text-white py-3 rounded-xl font-black disabled:bg-blue-200">
              <Check size={16} className="inline mr-1" /> Complete Bill
            </button>
          </div>
        </div>
      </div>

      {showSuccess && lastInvoice && (
        <div className="fixed inset-0 z-50 bg-blue-950/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-blue-100 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900">Bill Completed</h3>
              <button onClick={() => setShowSuccess(false)}><X size={16} /></button>
            </div>
            <div className="flex items-center gap-2 text-green-600 font-semibold"><Check size={16} /> True check mark: Bill saved successfully.</div>
            <div className="text-sm text-slate-600">Invoice: {lastInvoice.id} | Total: Rs {lastInvoice.total}</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={shareReceipt} className="inline-flex items-center justify-center gap-1 bg-green-500 text-white rounded-xl py-2 font-semibold">
                <MessageCircle size={14} /> WhatsApp
              </button>
              <button onClick={downloadPdf} className="inline-flex items-center justify-center gap-1 bg-primary text-white rounded-xl py-2 font-semibold">
                <Download size={14} /> Download PDF
              </button>
            </div>
            <button onClick={() => setShowSuccess(false)} className="w-full border border-blue-100 rounded-xl py-2 text-sm text-slate-600">
              <Share2 size={14} className="inline mr-1" /> Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
