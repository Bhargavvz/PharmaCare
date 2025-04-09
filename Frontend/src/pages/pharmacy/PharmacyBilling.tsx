import React, { useState, useEffect, useMemo } from 'react';
import { Receipt, ArrowLeft, PlusCircle, Trash2, User, Phone, Mail, Search, X, Package } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, isPharmacyStaffUser } from '../../context/AuthContext';
import { API_URL } from '../../config';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

// --- Interfaces ---
// Match backend DTOs where possible
interface InventoryItemDto {
    id: number;
    medicationName: string;
    sellingPrice: number;
    quantity: number; // Available quantity
    // Add other fields if needed for display (e.g., manufacturer)
}

interface BillItem {
    inventoryId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    availableQuantity: number; // Add available stock info
}

interface CreateBillPayload {
    pharmacyId: number;
    customerId?: number; // For linking existing users (future feature?)
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    paymentMethod: string; // Match backend enum keys (e.g., "CASH", "CREDIT_CARD")
    paymentStatus: string; // Match backend enum keys (e.g., "PAID", "PENDING")
    items: { inventoryId: number; quantity: number }[];
    discountAmount?: number;
    taxAmount?: number;
    notes?: string;
    prescriptionReference?: string;
}

// Mock Payment Methods/Statuses (replace with fetch or constants)
const paymentMethods = ["CASH", "CREDIT_CARD", "DEBIT_CARD", "MOBILE_PAYMENT", "INSURANCE", "OTHER"];
const paymentStatuses = ["PAID", "PENDING", "CANCELLED"]; // Only relevant statuses for creation?

const PharmacyBilling: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, token } = useAuth();
    
    // Assume pharmacyId is passed via state or derived from currentUser
    // For now, let's try getting it from location state passed from dashboard link
    const pharmacyIdFromState = location.state?.pharmacyId; 
    // Or find it from the logged-in user context if possible
    const staffPharmacyId = isPharmacyStaffUser(currentUser) ? currentUser.pharmacyId : null;
    const pharmacyId = pharmacyIdFromState || staffPharmacyId;

    const [billItems, setBillItems] = useState<BillItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<string>(paymentMethods[0]);
    const [paymentStatus, setPaymentStatus] = useState<string>("PAID");
    const [discount, setDiscount] = useState<number>(0);
    const [tax, setTax] = useState<number>(0); // Simple tax for now
    const [notes, setNotes] = useState('');
    const [prescriptionRef, setPrescriptionRef] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<InventoryItemDto[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

     // Redirect if no pharmacy context
    useEffect(() => {
        if (!pharmacyId) {
            toast.error("Pharmacy context is missing. Please select a pharmacy.");
            navigate('/pharmacy/dashboard');
        }
    }, [pharmacyId, navigate]);

    // --- Calculations --- 
    const subtotal = useMemo(() => 
        billItems.reduce((sum, item) => sum + item.subtotal, 0),
    [billItems]);

    const totalAmount = useMemo(() => 
        subtotal - discount + tax,
    [subtotal, discount, tax]);

    // --- Event Handlers --- 
    const handleSearch = async () => {
        if (!searchTerm.trim() || !pharmacyId || !token) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await fetch(`${API_URL}/inventories/${pharmacyId}/items?search=${encodeURIComponent(searchTerm.trim())}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to search inventory');
            const data: InventoryItemDto[] = await response.json();
            setSearchResults(data);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Inventory search failed');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const addItemToBill = (item: InventoryItemDto) => {
        if (item.quantity <= 0) {
            toast.error(`${item.medicationName} is out of stock.`);
            return;
        }
        setBillItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(i => i.inventoryId === item.id);
            
            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                const existingItem = updatedItems[existingItemIndex];

                 // Check available stock vs quantity already in bill + 1
                if (existingItem.availableQuantity < existingItem.quantity + 1) {
                     toast.error(`Not enough stock for ${item.medicationName}. Available: ${existingItem.availableQuantity}`);
                     return prevItems; // Return unchanged state
                 }
                // Increment quantity
                updatedItems[existingItemIndex] = {
                     ...existingItem,
                     quantity: existingItem.quantity + 1, 
                     subtotal: (existingItem.quantity + 1) * existingItem.unitPrice 
                };
                return updatedItems;
            } else {
                // Add new item, storing available quantity
                return [...prevItems, {
                    inventoryId: item.id,
                    name: item.medicationName,
                    quantity: 1,
                    unitPrice: item.sellingPrice,
                    subtotal: item.sellingPrice * 1,
                    availableQuantity: item.quantity // Store available stock here
                }];
            }
        });
         // Clear search term and results after adding an item
         setSearchTerm('');
         setSearchResults([]);
    };

    const updateItemQuantity = (inventoryId: number, newQuantity: number) => {
         if (newQuantity < 1) {
             removeItemFromBill(inventoryId);
             return;
         }

        setBillItems(prevItems => {
            const itemIndex = prevItems.findIndex(i => i.inventoryId === inventoryId);
            if (itemIndex === -1) return prevItems; // Item not found
            
            const itemToUpdate = prevItems[itemIndex];

            // *** Stock Check ***
            if (newQuantity > itemToUpdate.availableQuantity) {
                toast.error(`Cannot set quantity above available stock (${itemToUpdate.availableQuantity}) for ${itemToUpdate.name}.`);
                // Optionally clamp the value instead of just showing an error:
                // newQuantity = itemToUpdate.availableQuantity;
                return prevItems; // Don't update if requested quantity exceeds stock
            }
            // *******************
            
            const updatedItems = [...prevItems];
            updatedItems[itemIndex] = {
                 ...itemToUpdate, 
                 quantity: newQuantity, 
                 subtotal: newQuantity * itemToUpdate.unitPrice 
            };
            return updatedItems;
        });
    };

    const removeItemFromBill = (inventoryId: number) => {
        setBillItems(prevItems => prevItems.filter(item => item.inventoryId !== inventoryId));
    };

    const handleCreateBill = async () => {
        setError(null);
        if (billItems.length === 0) {
            toast.error('Cannot create an empty bill.');
            return;
        }
        if (!customerName.trim()) {
            toast.error('Customer name is required.');
            return;
        }
        if (!pharmacyId || !token) {
             toast.error('Authentication or Pharmacy ID missing.');
             return;
        }

        setIsLoading(true);
        const payload: CreateBillPayload = {
            pharmacyId: pharmacyId,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim() || undefined,
            customerEmail: customerEmail.trim() || undefined,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            items: billItems.map(item => ({ inventoryId: item.inventoryId, quantity: item.quantity })),
            discountAmount: discount > 0 ? discount : undefined,
            taxAmount: tax > 0 ? tax : undefined,
            notes: notes.trim() || undefined,
            prescriptionReference: prescriptionRef.trim() || undefined,
        };

        try {
             console.log("Creating bill with payload:", payload);
            const response = await fetch(`${API_URL}/bills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `Failed to create bill (Status: ${response.status})`);
            }
            
            toast.success(`Bill #${responseData.billNumber} created successfully!`);
            // Reset form or navigate to bill details page?
            setBillItems([]);
            setCustomerName('');
            setCustomerPhone('');
            setCustomerEmail('');
            setDiscount(0);
            setTax(0);
            setNotes('');
            setPrescriptionRef('');
            // Maybe navigate(`/pharmacy/billing/${responseData.id}`);

        } catch (err) {
            console.error("Bill creation error:", err);
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(message);
            toast.error(`Error: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
             <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                         <button
                            onClick={() => navigate('/pharmacy/dashboard')}
                            className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600"
                            aria-label="Back to Dashboard"
                         >
                            <ArrowLeft className="w-5 h-5" />
                         </button>
                        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                            <Receipt className="w-6 h-6 mr-2 text-green-600" />
                            New Bill
                        </h1>
                    </div>
                    {/* Maybe add Pharmacy Name display here */} 
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Side: Search & Bill Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Item Search */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <label htmlFor="search-inventory" className="block text-sm font-medium text-gray-700 mb-1">Search Inventory</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search-inventory"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Search on Enter
                                    placeholder="Search by medication name..."
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                {searchTerm && (
                                    <button 
                                        onClick={() => { setSearchTerm(''); setSearchResults([]); }}
                                        className="absolute inset-y-0 right-10 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                                <button 
                                     onClick={handleSearch}
                                     disabled={isSearching || !searchTerm.trim()}
                                     className="absolute inset-y-0 right-0 px-3 flex items-center bg-green-600 text-white rounded-r-md hover:bg-green-700 disabled:opacity-50"
                                 >
                                    {isSearching ? '...' : 'Go'}
                                </button>
                            </div>
                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <ul className="mt-2 border border-gray-200 rounded-md max-h-48 overflow-y-auto bg-white absolute z-10 w-[calc(100%-2rem)] shadow-lg">
                                    {searchResults.map(item => (
                                        <li 
                                            key={item.id} 
                                            onClick={() => addItemToBill(item)} 
                                            className="p-3 hover:bg-green-50 cursor-pointer flex justify-between items-center text-sm"
                                        >
                                            <span>{item.medicationName}</span>
                                            <span className="text-xs text-gray-500">Stock: {item.quantity} | Price: ${item.sellingPrice.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                             {searchTerm && !isSearching && searchResults.length === 0 && (
                                <p className="text-xs text-gray-500 mt-1">No items found matching "{searchTerm}".</p>
                            )}
                        </div>

                        {/* Bill Items Table */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <h2 className="text-lg font-semibold text-gray-800 p-4 border-b">Bill Items ({billItems.length})</h2>
                            {billItems.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No items added yet. Search and add items above.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                                <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                                <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {billItems.map(item => (
                                                <tr key={item.inventoryId}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                                                        <input 
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItemQuantity(item.inventoryId, parseInt(e.target.value) || 0)}
                                                            min="1"
                                                            // Add max based on available stock if possible
                                                            className="w-16 p-1 border border-gray-300 rounded-md text-center focus:ring-green-500 focus:border-green-500"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 text-right">${item.unitPrice.toFixed(2)}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 text-right">${item.subtotal.toFixed(2)}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-center">
                                                        <button onClick={() => removeItemFromBill(item.inventoryId)} className="text-red-600 hover:text-red-800 p-1">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                         {/* Notes & Prescription Ref */}
                        <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                 <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                                 <textarea 
                                    id="notes" 
                                    rows={3} 
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Optional notes for this bill..."
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="prescriptionRef" className="block text-sm font-medium text-gray-700">Prescription Ref#</label>
                                <input 
                                    type="text"
                                    id="prescriptionRef" 
                                    value={prescriptionRef}
                                    onChange={(e) => setPrescriptionRef(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Optional reference number..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Customer, Payment & Summary */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 flex items-center">
                                <User className="w-5 h-5 mr-2 text-gray-500" />
                                Customer Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                                    <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input type="tel" id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" id="customerEmail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                                </div>
                                {/* Add search/link existing customer later */} 
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Payment</h2>
                             <div className="space-y-3">
                                <div>
                                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Method</label>
                                    <select 
                                        id="paymentMethod" 
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm py-2 px-3"
                                    >
                                        {paymentMethods.map(method => (
                                            <option key={method} value={method}>{method.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                     <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Status</label>
                                     <select 
                                        id="paymentStatus" 
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm py-2 px-3"
                                     >
                                        {paymentStatuses.map(status => (
                                             <option key={status} value={status}>{status}</option>
                                        ))}
                                     </select>
                                </div>
                             </div>
                        </div>

                        {/* Bill Summary & Action */}
                        <div className="bg-white p-4 rounded-lg shadow space-y-3">
                             <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Summary</h2>
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-600">Subtotal:</span>
                                 <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-sm items-center">
                                 <label htmlFor="discount" className="text-gray-600">Discount:</label>
                                 <input 
                                    type="number" 
                                    id="discount"
                                    value={discount}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    className="w-24 p-1 border border-gray-300 rounded-md text-right focus:ring-green-500 focus:border-green-500"
                                    placeholder="0.00"
                                />
                             </div>
                              <div className="flex justify-between text-sm items-center">
                                 <label htmlFor="tax" className="text-gray-600">Tax:</label>
                                  <input 
                                    type="number" 
                                    id="tax"
                                    value={tax}
                                    onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    className="w-24 p-1 border border-gray-300 rounded-md text-right focus:ring-green-500 focus:border-green-500"
                                    placeholder="0.00"
                                />
                             </div>
                             <div className="flex justify-between text-lg font-semibold border-t pt-3 mt-2">
                                 <span className="text-gray-800">Total:</span>
                                 <span className="text-green-700">${totalAmount.toFixed(2)}</span>
                             </div>

                            {error && (
                                <p className="text-xs text-red-600 text-center">Error: {error}</p>
                            )}

                             <button 
                                onClick={handleCreateBill}
                                disabled={isLoading || billItems.length === 0}
                                className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                             >
                                {isLoading ? <LoadingSpinner /> : 'Create Bill'}
                             </button>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default PharmacyBilling; 