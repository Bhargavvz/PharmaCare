// Mock data service for pharmacy management
// This service provides mock data for the pharmacy management system
// until the backend API is ready

export interface Pharmacy {
  id: number;
  name: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  active: boolean;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: number;
  pharmacyId: number;
  pharmacyName: string;
  medicationName: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  minimumStockLevel: number;
  costPrice: number;
  sellingPrice: number;
  active: boolean;
  medicationType: 'PRESCRIPTION' | 'OVER_THE_COUNTER' | 'CONTROLLED_SUBSTANCE' | 'DONATED';
  description?: string;
  dosageForm?: string;
  strength?: string;
  storageConditions?: string;
  lowStock: boolean;
  expired: boolean;
  expiringWithin30Days: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalInventoryItems: number;
  lowStockItems: number;
  expiringItems: number;
  totalSales: number;
  pendingBills: number;
  totalDonations: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface BillItem {
  id: number;
  inventoryItemId: number;
  medicationName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  medicationType: 'PRESCRIPTION' | 'OVER_THE_COUNTER' | 'CONTROLLED_SUBSTANCE' | 'DONATED';
}

export interface Bill {
  id: number;
  pharmacyId: number;
  pharmacyName: string;
  billNumber: string;
  customerId: number | null;
  customerName: string | null;
  items: BillItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'INSURANCE' | 'MOBILE_PAYMENT';
  paymentStatus: 'PAID' | 'PENDING' | 'CANCELLED';
  prescriptionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Pharmacy service
export const mockPharmacyService = {
  getPharmacies: (): Pharmacy[] => {
    const storedPharmacies = localStorage.getItem('mockPharmacies');
    return storedPharmacies ? JSON.parse(storedPharmacies) : [];
  },
  
  createPharmacy: (pharmacyData: Omit<Pharmacy, 'id' | 'createdAt' | 'updatedAt'>): Pharmacy => {
    const newPharmacy: Pharmacy = {
      id: Date.now(),
      ...pharmacyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const existingPharmacies = mockPharmacyService.getPharmacies();
    existingPharmacies.push(newPharmacy);
    localStorage.setItem('mockPharmacies', JSON.stringify(existingPharmacies));
    
    return newPharmacy;
  },
  
  getPharmacyStats: (): DashboardStats => {
    return {
      totalInventoryItems: 156,
      lowStockItems: 12,
      expiringItems: 8,
      totalSales: 24500,
      pendingBills: 5,
      totalDonations: 23,
    };
  }
};

// Inventory service
export const mockInventoryService = {
  getInventoryItems: (pharmacyId: number): InventoryItem[] => {
    const storageKey = `mockInventory_${pharmacyId}`;
    const mockInventory = localStorage.getItem(storageKey);
    
    if (!mockInventory) {
      // Create mock inventory data for this pharmacy
      const mockData: InventoryItem[] = [
        {
          id: 1,
          pharmacyId: pharmacyId,
          pharmacyName: "Unknown", // Will be updated later
          medicationName: 'Paracetamol',
          manufacturer: 'Generic Pharma',
          batchNumber: 'BATCH123',
          expiryDate: '2024-12-31',
          quantity: 150,
          minimumStockLevel: 20,
          costPrice: 5.00,
          sellingPrice: 8.50,
          active: true,
          medicationType: 'OVER_THE_COUNTER',
          description: 'Pain reliever and fever reducer',
          dosageForm: 'Tablet',
          strength: '500mg',
          storageConditions: 'Store at room temperature',
          lowStock: false,
          expired: false,
          expiringWithin30Days: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        },
        {
          id: 2,
          pharmacyId: pharmacyId,
          pharmacyName: "Unknown", // Will be updated later
          medicationName: 'Amoxicillin',
          manufacturer: 'Antibiotics Inc',
          batchNumber: 'BATCH456',
          expiryDate: '2023-08-15',
          quantity: 10,
          minimumStockLevel: 15,
          costPrice: 12.00,
          sellingPrice: 18.00,
          active: true,
          medicationType: 'PRESCRIPTION',
          description: 'Antibiotic',
          dosageForm: 'Capsule',
          strength: '250mg',
          storageConditions: 'Store in a cool, dry place',
          lowStock: true,
          expired: true,
          expiringWithin30Days: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        },
        {
          id: 3,
          pharmacyId: pharmacyId,
          pharmacyName: "Unknown", // Will be updated later
          medicationName: 'Ibuprofen',
          manufacturer: 'Pain Relief Ltd',
          batchNumber: 'BATCH789',
          expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quantity: 75,
          minimumStockLevel: 25,
          costPrice: 6.50,
          sellingPrice: 10.00,
          active: true,
          medicationType: 'OVER_THE_COUNTER',
          description: 'Anti-inflammatory pain reliever',
          dosageForm: 'Tablet',
          strength: '200mg',
          storageConditions: 'Store at room temperature',
          lowStock: false,
          expired: false,
          expiringWithin30Days: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ];
      
      // Save mock data to localStorage
      localStorage.setItem(storageKey, JSON.stringify(mockData));
      return mockData;
    }
    
    return JSON.parse(mockInventory);
  },
  
  deleteInventoryItem: (pharmacyId: number, itemId: number): void => {
    const storageKey = `mockInventory_${pharmacyId}`;
    const mockInventory = localStorage.getItem(storageKey);
    
    if (mockInventory) {
      const inventoryData: InventoryItem[] = JSON.parse(mockInventory);
      // Filter out the item to delete
      const updatedInventory = inventoryData.filter(item => item.id !== itemId);
      // Save updated inventory back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(updatedInventory));
    }
  }
};

// Billing service
export const mockBillingService = {
  getBills: (pharmacyId: number): Bill[] => {
    const storageKey = `mockBills_${pharmacyId}`;
    const mockBills = localStorage.getItem(storageKey);
    
    if (!mockBills) {
      // Create mock billing data for this pharmacy
      const mockData: Bill[] = [
        {
          id: 1,
          pharmacyId: pharmacyId,
          pharmacyName: "Unknown", // Will be updated later
          billNumber: "BILL-2023-001",
          customerId: 1,
          customerName: "John Doe",
          items: [
            {
              id: 1,
              inventoryItemId: 1,
              medicationName: "Paracetamol",
              quantity: 2,
              unitPrice: 8.50,
              totalPrice: 17.00,
              medicationType: "OVER_THE_COUNTER"
            },
            {
              id: 2,
              inventoryItemId: 3,
              medicationName: "Ibuprofen",
              quantity: 1,
              unitPrice: 10.00,
              totalPrice: 10.00,
              medicationType: "OVER_THE_COUNTER"
            }
          ],
          subtotal: 27.00,
          taxAmount: 2.70,
          discountAmount: 0,
          totalAmount: 29.70,
          paymentMethod: "CASH",
          paymentStatus: "PAID",
          createdAt: "2023-05-15T10:30:00Z",
          updatedAt: "2023-05-15T10:30:00Z"
        },
        {
          id: 2,
          pharmacyId: pharmacyId,
          pharmacyName: "Unknown", // Will be updated later
          billNumber: "BILL-2023-002",
          customerId: 2,
          customerName: "Jane Smith",
          items: [
            {
              id: 3,
              inventoryItemId: 2,
              medicationName: "Amoxicillin",
              quantity: 1,
              unitPrice: 18.00,
              totalPrice: 18.00,
              medicationType: "PRESCRIPTION"
            }
          ],
          subtotal: 18.00,
          taxAmount: 1.80,
          discountAmount: 0,
          totalAmount: 19.80,
          paymentMethod: "CREDIT_CARD",
          paymentStatus: "PAID",
          prescriptionId: "RX-2023-123",
          createdAt: "2023-05-16T14:45:00Z",
          updatedAt: "2023-05-16T14:45:00Z"
        },
        {
          id: 3,
          pharmacyId: pharmacyId,
          pharmacyName: "Unknown", // Will be updated later
          billNumber: "BILL-2023-003",
          customerId: 3,
          customerName: "Robert Johnson",
          items: [
            {
              id: 4,
              inventoryItemId: 1,
              medicationName: "Paracetamol",
              quantity: 3,
              unitPrice: 8.50,
              totalPrice: 25.50,
              medicationType: "OVER_THE_COUNTER"
            }
          ],
          subtotal: 25.50,
          taxAmount: 2.55,
          discountAmount: 5.00,
          totalAmount: 23.05,
          paymentMethod: "INSURANCE",
          paymentStatus: "PENDING",
          notes: "Insurance claim in process",
          createdAt: "2023-05-17T09:15:00Z",
          updatedAt: "2023-05-17T09:15:00Z"
        }
      ];
      
      // Save mock data to localStorage
      localStorage.setItem(storageKey, JSON.stringify(mockData));
      return mockData;
    }
    
    return JSON.parse(mockBills);
  },
  
  createBill: (pharmacyId: number, billData: Omit<Bill, 'id' | 'pharmacyId' | 'pharmacyName' | 'billNumber' | 'createdAt' | 'updatedAt'>): Bill => {
    const pharmacy = mockPharmacyService.getPharmacies().find(p => p.id === pharmacyId);
    const pharmacyName = pharmacy ? pharmacy.name : "Unknown";
    
    // Generate a bill number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const existingBills = mockBillingService.getBills(pharmacyId);
    const billCount = existingBills.length + 1;
    const billNumber = `BILL-${year}${month}${day}-${String(billCount).padStart(3, '0')}`;
    
    // Create new bill
    const newBill: Bill = {
      id: Date.now(),
      pharmacyId,
      pharmacyName,
      billNumber,
      ...billData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Update inventory quantities
    if (newBill.paymentStatus !== 'CANCELLED') {
      const inventoryItems = mockInventoryService.getInventoryItems(pharmacyId);
      
      newBill.items.forEach(item => {
        const inventoryItem = inventoryItems.find(i => i.id === item.inventoryItemId);
        if (inventoryItem) {
          inventoryItem.quantity -= item.quantity;
          inventoryItem.lowStock = inventoryItem.quantity <= inventoryItem.minimumStockLevel;
        }
      });
      
      // Save updated inventory
      const storageKey = `mockInventory_${pharmacyId}`;
      localStorage.setItem(storageKey, JSON.stringify(inventoryItems));
    }
    
    // Save the new bill
    const storageKey = `mockBills_${pharmacyId}`;
    const bills = existingBills;
    bills.push(newBill);
    localStorage.setItem(storageKey, JSON.stringify(bills));
    
    return newBill;
  },
  
  getBillById: (pharmacyId: number, billId: number): Bill | null => {
    const bills = mockBillingService.getBills(pharmacyId);
    return bills.find(bill => bill.id === billId) || null;
  },
  
  updateBillStatus: (pharmacyId: number, billId: number, status: 'PAID' | 'PENDING' | 'CANCELLED'): Bill | null => {
    const bills = mockBillingService.getBills(pharmacyId);
    const billIndex = bills.findIndex(bill => bill.id === billId);
    
    if (billIndex === -1) return null;
    
    bills[billIndex].paymentStatus = status;
    bills[billIndex].updatedAt = new Date().toISOString();
    
    // Save updated bills
    const storageKey = `mockBills_${pharmacyId}`;
    localStorage.setItem(storageKey, JSON.stringify(bills));
    
    return bills[billIndex];
  },
  
  generateQRCode: (billId: number): string => {
    // In a real implementation, this would generate a QR code
    // For mock purposes, we'll just return a placeholder URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bill_${billId}`;
  }
}; 