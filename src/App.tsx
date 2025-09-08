
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

// Define the structure for our sections and features
interface Feature {
  id: string;
  title: string;
  description: string;
  content: string;
  functionality: string;
  icon?: string;
}

interface Section {
  id: string;
  title: string;
  features: Feature[];
}

// Define the inventory item interface based on the actual DynamoDB structure
interface InventoryItem {
  id: string;
  qty: number;
  rebuyQty: number;
  createdAt?: string;
  updatedAt?: string;
}

// Define the new API response interface
interface ApiInventoryItem {
  Item: string;
  Qty: number;
  RebuyQty: number;
  Status: string;
  Tolerance: number;
  Description: string;
}



// Define the booking interface for the new API
interface Booking {
  bookingId: string;
  checkinDate: string;
  guests: number;
  listingNickname: string;
  nights: number;
  roomType: string;
}

// Define the expected usage interface for the new API
interface ExpectedUsageItem {
  Item: string;
  ExactConsumption: number;
  Tolerance: number;
  AcceptedConsumption: number;
}

// Define the alarm interface for the new API
interface AlarmItem {
  Date: string;
  Status: string;
  Description: string;
  Alarm: string;
  ID: string;
}


const sections: Section[] = [
  {
    id: 'ops',
    title: 'Ops',
    features: [
      {
        id: 'inventory',
        title: 'Inventory',
        description: 'Track and manage amenities inventory',
        content: 'Comprehensive inventory management system for tracking stock levels, orders, and supplies across all operational locations. Features real-time updates, automated reorder points, and detailed reporting.',
        functionality: 'This system will provide real-time inventory tracking, automated reorder notifications, barcode scanning capabilities, supplier management, and comprehensive reporting for all operational locations.',
        icon: 'bi-boxes'
      },
      {
        id: 'cleaning-report',
        title: 'Cleaning Report',
        description: 'Generate and manage cleaning reports',
        content: 'Advanced cleaning report system for monitoring maintenance schedules, quality control, and compliance tracking. Includes automated scheduling and performance analytics.',
        functionality: 'This module will enable staff to create detailed cleaning reports, schedule maintenance tasks, track quality metrics, ensure compliance with standards, and generate performance analytics for cleaning operations.',
        icon: 'bi-brush'
      },
      {
        id: 'auto-pc-assignation',
        title: 'Auto PC Assignment',
        description: 'Automated PC assignment system',
        content: 'Intelligent system for automatically assigning PCs to users based on availability, requirements, and usage patterns. Optimizes resource allocation and reduces manual overhead.',
        functionality: 'This system will automatically assign computers to users based on availability, user requirements, and usage patterns. It will optimize resource allocation, reduce manual overhead, and provide real-time availability tracking.',
        icon: 'bi-laptop'
      },
      {
        id: 'sms-central',
        title: 'SMS Central',
        description: 'Centralized SMS communication platform',
        content: 'Centralized SMS management system for sending notifications and communications to staff and customers. Features templates, scheduling, and delivery tracking.',
        functionality: 'This platform will centralize all SMS communications, allowing staff to send notifications to customers and team members. It will include message templates, scheduled sending, delivery tracking, and contact management.',
        icon: 'bi-phone'
      }
    ]
  },
  {
    id: 'tech',
    title: 'Tech',
    features: [
      {
        id: 'data-warehouse',
        title: 'Data Warehouse',
        description: 'Centralized data storage and analytics',
        content: 'Enterprise data warehouse solution for storing, processing, and analyzing business data from multiple sources. Provides real-time insights and advanced reporting capabilities.',
        functionality: 'This data warehouse will consolidate data from all business systems, providing a single source of truth for analytics. It will enable real-time reporting, data visualization, and advanced analytics for business intelligence.',
        icon: 'bi-database'
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Grow',
    features: [
      {
        id: 'guest-crm',
        title: 'Guest CRM',
        description: 'Customer relationship management for guests',
        content: 'Specialized CRM system designed for managing guest relationships, preferences, and interactions. Tracks guest history and personalizes experiences.',
        functionality: 'This CRM will manage guest relationships, track preferences, store interaction history, and enable personalized experiences. It will help improve guest satisfaction and increase repeat visits.',
        icon: 'bi-people'
      },
      {
        id: 'client-crm',
        title: 'Client CRM',
        description: 'Customer relationship management for clients',
        content: 'Comprehensive CRM platform for managing client relationships, sales pipeline, and business opportunities. Includes lead management and sales forecasting.',
        functionality: 'This comprehensive CRM will manage client relationships, track sales opportunities, manage leads, provide sales forecasting, and enable customer lifecycle management for business clients.',
        icon: 'bi-briefcase'
      }
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    features: [
      {
        id: 'accounting',
        title: 'Accounting',
        description: 'Financial accounting and bookkeeping system',
        content: 'Comprehensive accounting system for managing financial records, transactions, and reporting. Features automated bookkeeping, invoice management, and financial analytics.',
        functionality: 'This system will handle all financial transactions, generate invoices, manage accounts payable and receivable, provide financial reporting, and ensure compliance with accounting standards.',
        icon: 'bi-calculator'
      },
      {
        id: 'budgeting',
        title: 'Budgeting',
        description: 'Budget planning and expense management',
        content: 'Advanced budgeting system for planning, tracking, and managing financial resources. Includes budget forecasting, expense tracking, and financial planning tools.',
        functionality: 'This module will enable budget creation, expense tracking, financial forecasting, variance analysis, and provide insights for better financial decision making.',
        icon: 'bi-graph-up-arrow'
      },
      {
        id: 'payroll',
        title: 'Payroll',
        description: 'Employee payroll and benefits management',
        content: 'Complete payroll management system for processing employee salaries, benefits, and tax calculations. Features automated payroll processing and compliance reporting.',
        functionality: 'This system will handle employee salary calculations, tax deductions, benefits management, payroll processing, and generate all necessary payroll reports and tax documents.',
        icon: 'bi-credit-card'
      }
    ]
  }
];

function App() {
  const { signOut, user } = useAuthenticator();
  const [currentSection, setCurrentSection] = useState<string>('ops');
  const [currentFeature, setCurrentFeature] = useState<string>('inventory');
  const [showInventoryTable, setShowInventoryTable] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdateInfo, setLastUpdateInfo] = useState<{date: string, user: string}>({date: 'Loading...', user: 'Loading...'});
  const [updateQuantities, setUpdateQuantities] = useState<{[key: string]: number}>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showExpectedUsageTable, setShowExpectedUsageTable] = useState<boolean>(false);
  const [showBookingsTable, setShowBookingsTable] = useState<boolean>(false);
  const [showAlarmsTable, setShowAlarmsTable] = useState<boolean>(false);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [bookingsError, setBookingsError] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [apiInventoryItems, setApiInventoryItems] = useState<ApiInventoryItem[]>([]);
  const [apiError, setApiError] = useState<string>('');
  const [expectedUsageItems, setExpectedUsageItems] = useState<ExpectedUsageItem[]>([]);
  const [loadingExpectedUsage, setLoadingExpectedUsage] = useState<boolean>(false);
  const [expectedUsageError, setExpectedUsageError] = useState<string>('');
  const [alarmItems, setAlarmItems] = useState<AlarmItem[]>([]);
  const [loadingAlarms, setLoadingAlarms] = useState<boolean>(false);
  const [alarmsError, setAlarmsError] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Calculate stock status for preview
  const getStockStatus = () => {
    const validItems = inventoryItems.filter(item => item !== null);
    const lowStock = validItems.filter(item => item && item.qty && item.rebuyQty && item.qty <= item.rebuyQty && item.qty > item.rebuyQty * 0.5).length;
    const reorderNeeded = validItems.filter(item => item && item.qty && item.rebuyQty && item.qty <= item.rebuyQty).length;
    return { lowStock, reorderNeeded };
  };

  const stockStatus = getStockStatus();

  // Pagination calculations
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  // Load inventory data when component mounts
  useEffect(() => {
    fetchInventoryData();
    loadLastUpdateInfo();
    fetchBookingsCount();
    
    // Check for direct link parameters
    const urlParams = new URLSearchParams(window.location.search);
    const directSection = urlParams.get('section');
    const directFeature = urlParams.get('feature');
    const directView = urlParams.get('view');
    
    if (directSection && directFeature) {
      setCurrentSection(directSection);
      setCurrentFeature(directFeature);
      
      // If direct view is specified, open that view
      if (directView === 'update' && directFeature === 'inventory') {
        setShowUpdateForm(true);
        setShowInventoryTable(false);
        setShowBookingsTable(false);
        setShowExpectedUsageTable(false);
        setShowAlarmsTable(false);
        setShowRules(false);
      } else if (directView === 'stock' && directFeature === 'inventory') {
        setShowInventoryTable(true);
        setShowUpdateForm(false);
        setShowBookingsTable(false);
        setShowExpectedUsageTable(false);
        setShowAlarmsTable(false);
        setShowRules(false);
      } else if (directView === 'bookings' && directFeature === 'inventory') {
        setShowBookingsTable(true);
        setShowInventoryTable(false);
        setShowUpdateForm(false);
        setShowExpectedUsageTable(false);
        setShowAlarmsTable(false);
        setShowRules(false);
      } else if (directView === 'expected-usage' && directFeature === 'inventory') {
        setShowExpectedUsageTable(true);
        setShowInventoryTable(false);
        setShowUpdateForm(false);
        setShowBookingsTable(false);
        setShowAlarmsTable(false);
        setShowRules(false);
      } else if (directView === 'alarms' && directFeature === 'inventory') {
        setShowAlarmsTable(true);
        setShowInventoryTable(false);
        setShowUpdateForm(false);
        setShowBookingsTable(false);
        setShowExpectedUsageTable(false);
        setShowRules(false);
      }
    }
  }, []);

  useEffect(() => {
    if (showInventoryTable) {
      fetchApiInventoryData();
    }
  }, [showInventoryTable]);

  useEffect(() => {
    if (currentFeature === 'inventory') {
      loadLastUpdateInfo();
      fetchBookingsCount();
      // Llamada automática a la nueva API para actualizar información de bookings
      fetchBookingsData();
    }
  }, [currentFeature]);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      // Add timeout to prevent freezing
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });
      
      const apiPromise = client.models.Inventory.list();
      const result = await Promise.race([apiPromise, timeoutPromise]) as any;
      const { data } = result;
      
      // Filter out null items
      const validItems = data.filter((item: any) => item !== null);
      setInventoryItems(validItems);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setInventoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiInventoryData = async () => {
    setLoading(true);
    setApiError('');
    try {
      console.log('Fetching API inventory data...');
      const response = await fetch('https://7a4ejsev6lliagmuiawmoki2va0iculn.lambda-url.eu-central-1.on.aws/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response received:', data);
      
      // Check if the response has the expected structure
      if (data && data.items && Array.isArray(data.items)) {
        console.log('=== INVENTORY DATA RECEIVED ===');
        console.log('Total items received:', data.items.length);
        console.log('Items data:', JSON.stringify(data.items, null, 2));
        console.log('Setting inventory items to state...');
        setApiInventoryItems(data.items);
        setApiError('');
        console.log('Inventory items state updated successfully');
        console.log('=====================================');
      } else {
        console.error('=== INVENTORY DATA ERROR ===');
        console.error('Response structure:', data);
        console.error('No items array found in response');
        setApiInventoryItems([]);
        setApiError('No items array found in response');
        console.error('====================================');
      }
    } catch (error) {
      console.error('Error fetching API inventory data:', error);
      setApiInventoryItems([]);
      setApiError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchApiInventoryDataForUpdate = async () => {
    setLoading(true);
    setApiError('');
    try {
      console.log('Fetching API inventory data for update...');
      const response = await fetch('https://7a4ejsev6lliagmuiawmoki2va0iculn.lambda-url.eu-central-1.on.aws/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response for update received:', data);
      
              // Check if the response has the expected structure
        if (data && data.items && Array.isArray(data.items)) {
          console.log('=== UPDATE FORM INVENTORY DATA RECEIVED ===');
          console.log('Total items received for update form:', data.items.length);
          console.log('Items data for update form:', JSON.stringify(data.items, null, 2));
          console.log('Setting inventory items for update form...');
          setApiInventoryItems(data.items);
          
          // Initialize update quantities with API data
          console.log('Initializing update quantities...');
          const initialQuantities: {[key: string]: number} = {};
          data.items.forEach((item: any) => {
            if (item && item.Item) {
              initialQuantities[item.Item] = item.Qty || 0;
              console.log(`Setting ${item.Item}: ${item.Qty}`);
            }
          });
          console.log('Final update quantities object:', initialQuantities);
          setUpdateQuantities(initialQuantities);
          
          setApiError('');
          console.log('Update form inventory data updated successfully');
          console.log('==============================================');
        } else {
          console.error('=== UPDATE FORM INVENTORY DATA ERROR ===');
          console.error('Response structure for update form:', data);
          console.error('No items array found in response for update');
          setApiInventoryItems([]);
          setApiError('No items array found in response');
          console.error('==============================================');
        }
    } catch (error) {
      console.error('Error fetching API inventory data for update:', error);
      setApiInventoryItems([]);
      setApiError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSection = () => sections.find(s => s.id === currentSection);
  const getCurrentFeature = () => {
    const section = getCurrentSection();
    return section?.features.find(f => f.id === currentFeature);
  };


  const handleFeatureChange = (featureId: string) => {
    setCurrentFeature(featureId);
    setShowInventoryTable(false);
    setIsSidebarOpen(false); // Cerrar sidebar móvil al seleccionar feature
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleFeatureSelect = (sectionId: string, featureId: string) => {
    setCurrentSection(sectionId);
    setCurrentFeature(featureId);
    setIsMobileMenuOpen(false);
    setExpandedSection(null);
    
    // Update URL without page reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('section', sectionId);
    newUrl.searchParams.set('feature', featureId);
    newUrl.searchParams.delete('view'); // Clear view parameter when navigating to main feature
    window.history.pushState({}, '', newUrl.toString());
  };


  const handleInventoryCardClick = () => {
    console.log('handleInventoryCardClick called');
    setShowInventoryTable(true);
    setShowUpdateForm(false);
    setShowBookingsTable(false);
    setShowExpectedUsageTable(false);
    setShowAlarmsTable(false);
    setShowRules(false);
  };

  const handleUpdateCardClick = async () => {
    setShowUpdateForm(true);
    setShowInventoryTable(false);
    setShowBookingsTable(false);
    setShowExpectedUsageTable(false);
    setShowAlarmsTable(false);
    setShowRules(false);
    
    // Update URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('view', 'update');
    window.history.pushState({}, '', newUrl.toString());
    
    // Fetch API data and initialize update quantities
    await fetchApiInventoryDataForUpdate();
  };

  const handleBookingsCardClick = async () => {
    setShowBookingsTable(true);
    setShowInventoryTable(false);
    setShowUpdateForm(false);
    setShowExpectedUsageTable(false);
    setShowAlarmsTable(false);
    setShowRules(false);
    setCurrentPage(1); // Reset to first page when opening
    await fetchBookingsCount();
    await fetchBookingsData();
  };

  const handleExpectedUsageCardClick = async () => {
    setShowExpectedUsageTable(true);
    setShowInventoryTable(false);
    setShowUpdateForm(false);
    setShowBookingsTable(false);
    setShowAlarmsTable(false);
    setShowRules(false);
    setCurrentPage(1); // Reset to first page when opening
    await fetchExpectedUsageData();
  };

  const handleAlarmsCardClick = async () => {
    setShowAlarmsTable(true);
    setShowInventoryTable(false);
    setShowUpdateForm(false);
    setShowBookingsTable(false);
    setShowExpectedUsageTable(false);
    setShowRules(false);
    await fetchAlarmsData();
  };

  const fetchExpectedUsageData = async () => {
    setLoadingExpectedUsage(true);
    setExpectedUsageError('');
    try {
      console.log('Fetching expected usage data...');
      const response = await fetch('https://li3uzmnpcgiyhwz6xazuy5hdnq0zamwg.lambda-url.eu-central-1.on.aws/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Expected usage API response received:', data);
      
      if (data.items && Array.isArray(data.items)) {
        setExpectedUsageItems(data.items);
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (error) {
      console.error('Error fetching expected usage data:', error);
      setExpectedUsageItems([]);
      setExpectedUsageError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoadingExpectedUsage(false);
    }
  };

  const fetchAlarmsData = async () => {
    setLoadingAlarms(true);
    setAlarmsError('');
    try {
      console.log('Fetching alarms data...');
      const response = await fetch('https://bffybrv4gmr57qfkgvim7hrooa0wypjz.lambda-url.eu-central-1.on.aws/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Alarms API response received:', data);
      
      // Check if the response has the expected structure
      if (data.alarms && Array.isArray(data.alarms)) {
        setAlarmItems(data.alarms);
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (error) {
      console.error('Error fetching alarms data:', error);
      setAlarmItems([]);
      setAlarmsError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoadingAlarms(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    console.log(`Changed items per page to ${newItemsPerPage}`);
  };

  const handleQuantityChange = (itemName: string, value: string) => {
    const numValue = parseInt(value) || 0;
    console.log(`🔄 handleQuantityChange called: ${itemName} = ${value} (parsed: ${numValue})`);
    
    setUpdateQuantities(prev => {
      const newState = {
        ...prev,
        [itemName]: numValue
      };
      console.log(`📝 Updated updateQuantities state:`, newState);
      return newState;
    });
  };

  const handleSubmitUpdate = async () => {
    setSubmitting(true);
    try {
      console.log('Submitting inventory updates...');
      
      // Format the data as required JSON structure
      const updatesData: { updates: { [key: string]: number } } = {
        updates: {}
      };
      
      // Collect all updates from the form
      console.log('=== COLLECTING FORM DATA ===');
      console.log('Raw updateQuantities:', updateQuantities);
      console.log('Current apiInventoryItems:', apiInventoryItems);
      console.log('Comparing values:');
      
      // Compare what we're sending vs what the API currently has
      for (const [itemName, newQty] of Object.entries(updateQuantities)) {
        const apiItem = apiInventoryItems.find(i => i.Item === itemName);
        const currentQty = apiItem ? apiItem.Qty : 'N/A';
        console.log(`${itemName}: Current API: ${currentQty} → New Form: ${newQty}`);
      }
      
      for (const [itemName, newQty] of Object.entries(updateQuantities)) {
        console.log(`Processing item: ${itemName}, new quantity: ${newQty}`);
        if (newQty !== undefined && newQty !== null && newQty >= 0) {
          updatesData.updates[itemName] = newQty;
          console.log(`Added to updates: ${itemName} = ${newQty}`);
        } else {
          console.log(`Skipped item ${itemName}: invalid quantity ${newQty}`);
        }
      }
      
      console.log('Final updatesData object:', updatesData);
      console.log('================================');
      
      // Compare with working format
      const workingFormat = {
        updates: {
          "Water": 22,
          "Coffee": 33,
          "Olive Oil": 44,
          "Wine": 55
        }
      };
      
      console.log('=== COMPARISON WITH WORKING FORMAT ===');
      console.log('Our format:', updatesData);
      console.log('Working format:', workingFormat);
      console.log('JSON strings match?', JSON.stringify(updatesData) === JSON.stringify(workingFormat));
      console.log('Our JSON length:', JSON.stringify(updatesData).length);
      console.log('Working JSON length:', JSON.stringify(workingFormat).length);
      console.log('=====================================');
      
      console.log('=== INVENTORY UPDATE REQUEST ===');
      console.log('JSON being sent to API:');
      console.log(JSON.stringify(updatesData, null, 2));
      console.log('Raw JSON string length:', JSON.stringify(updatesData).length);
      console.log('JSON string bytes:', new TextEncoder().encode(JSON.stringify(updatesData)));
      console.log('API endpoint:', 'https://tflcapk4oltm7lkggzbi3zlidu0tvvka.lambda-url.eu-central-1.on.aws/');
      console.log('Request method: POST');
      console.log('Request headers:', { 'Content-Type': 'application/json' });
      console.log('================================');
      
      // Send the updates to the API
      const response = await fetch('https://tflcapk4oltm7lkggzbi3zlidu0tvvka.lambda-url.eu-central-1.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatesData)
      });
      
      console.log('=== API RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Response body (parsed JSON):');
      console.log(JSON.stringify(result, null, 2));
      console.log('==============================');
      
      // Check if the API actually processed the updates
      if (result.currentInventoryItemsUpdated === 0) {
        console.warn('⚠️ WARNING: API reports 0 inventory items were updated!');
        console.warn('This might indicate an issue with the data format or API processing');
        console.warn('Check if the API expects a different data structure');
      } else {
        console.log(`✅ API successfully updated ${result.currentInventoryItemsUpdated} inventory items`);
      }
      
      // Wait a moment for the API to process the updates
      console.log('Waiting for API to process updates...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh all data after successful update
      console.log('=== REFRESHING DATA AFTER UPDATE ===');
      console.log('1. Loading last update info...');
      await loadLastUpdateInfo();
      
      console.log('2. Refreshing API inventory data for update form...');
      await fetchApiInventoryDataForUpdate();
      
      console.log('3. Refreshing main inventory view...');
      await fetchApiInventoryData();
      
      console.log('4. Refreshing bookings count...');
      await fetchBookingsCount();
      
      console.log('All data refresh completed');
      console.log('====================================');
      
      // Log the final state to verify if data was updated
      console.log('=== FINAL STATE VERIFICATION ===');
      console.log('Current apiInventoryItems state:', apiInventoryItems);
      console.log('Current updateQuantities state:', updateQuantities);
      console.log('================================');
      
      // Close the update form
      setShowUpdateForm(false);
      
      // Show success message
      const message = result.currentInventoryItemsUpdated > 0 
        ? `Inventory update completed successfully!\n\nUpdated ${result.currentInventoryItemsUpdated} items.\n\nThe changes have been applied to the database.`
        : `Inventory update request sent successfully!\n\nHowever, the API reports that 0 items were updated.\n\nThis might indicate:\n- The data format is not what the API expects\n- The API is not processing the updates correctly\n- There's a mismatch between item names\n\nPlease check the console logs for more details.\n\nYou can use the "Test API" button to test with simple data.`;
      
      alert(message);
      
    } catch (error) {
      console.error('Error submitting updates:', error);
      alert('Error updating inventory. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const loadLastUpdateInfo = async () => {
    try {
      const response = await fetch('https://ydyv5ew3mamt4x4jd4ozp3yaee0kveku.lambda-url.eu-central-1.on.aws/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.message === 'No execution history found.') {
        setLastUpdateInfo({
          date: 'Error',
          user: 'Error'
        });
      } else if (data.ExecutionDate && data.User) {
        const formattedDate = new Date(data.ExecutionDate).toLocaleDateString('en-GB');
        setLastUpdateInfo({
          date: formattedDate,
          user: data.User
        });
      } else {
        setLastUpdateInfo({
          date: 'Error',
          user: 'Error'
        });
      }
    } catch (error) {
      console.error('Error loading last update info:', error);
      setLastUpdateInfo({
        date: 'Error',
        user: 'Error'
      });
    }
  };

  const fetchBookingsCount = async () => {
    try {
      const response = await fetch('https://a2hytc4pdf3gqsfdosgukc3l3u0tgukb.lambda-url.eu-central-1.on.aws/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Bookings count response:', data);
      
      // Use the totalReturned from the response (new API structure)
      if (data.totalReturned !== undefined) {
        setBookingsCount(data.totalReturned);
        setBookingsError('');
        console.log(`Successfully loaded bookings count: ${data.totalReturned}`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching bookings count:', error);
      setBookingsError('Error fetching bookings data');
      setBookingsCount(0);
    }
  };

  const fetchBookingsData = async () => {
    setLoadingBookings(true);
    try {
      const response = await fetch('https://a2hytc4pdf3gqsfdosgukc3l3u0tgukb.lambda-url.eu-central-1.on.aws/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Raw response data:', data);
      
      // The response is already parsed JSON, no need to parse data.body
      // Extract bookings from the bookings array (new API structure) and map the field names
      const bookingsData = (data.bookings || []).map((item: any) => ({
        bookingId: item.BookingID,
        checkinDate: item.CheckinDate,
        guests: item.Guests,
        listingNickname: item.ListingNickname,
        nights: item.Nights,
        roomType: item.RoomType
      }));
      
      console.log('Processed bookings data:', bookingsData);
      
      setBookings(bookingsData);
      setBookingsError('');
      console.log(`Successfully loaded ${bookingsData.length} bookings`);
    } catch (error) {
      console.error('Error fetching bookings data:', error);
      setBookingsError('Error fetching bookings data');
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav d-flex justify-content-between align-items-center sticky-top" style={{ zIndex: 1030 }}>
        <div className="d-flex align-items-center">
          <a href="#" className="nav-brand me-4" onClick={(e) => e.preventDefault()}>
            <img src="/vite.svg" alt="noc.ai Logo" className="me-2" style={{ width: '24px', height: '24px' }} />
            noc.ai
          </a>
          
          {/* Desktop Navigation - Hidden, using hamburger menu for all screen sizes */}
          <ul className="nav-links d-none">
            {sections.map((section) => (
              <li key={section.id} className="nav-section">
                <div 
                  className="nav-section-header"
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="nav-section-title">{section.title}</span>
                  <i className={`bi ${expandedSection === section.id ? 'bi-chevron-up' : 'bi-chevron-down'} nav-chevron`}></i>
                </div>
                
                {expandedSection === section.id && (
                  <ul className="nav-features">
                    {section.features.map((feature) => (
                      <li key={feature.id}>
                        <a
                          href="#"
                          className={currentFeature === feature.id ? 'active' : ''}
                          onClick={(e) => {
                            e.preventDefault();
                            handleFeatureSelect(section.id, feature.id);
                          }}
                        >
                          <i className={`${feature.icon} me-2`}></i>
                          {feature.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <span className="text-white small d-none d-sm-inline">
            {user?.username || 'User'}
          </span>
          {/* Show logout button only when menu is closed */}
          {!isMobileMenuOpen && (
            <button className="btn btn-link text-white p-0" onClick={signOut}>
              <i className="bi-box-arrow-right fs-5"></i>
            </button>
          )}
          {/* Hamburger menu button - always in top right corner */}
          <button 
            className="btn btn-link text-white p-0" 
            onClick={toggleMobileMenu}
            style={{ fontSize: '1.5rem' }}
          >
            <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
          </button>
        </div>
      </nav>

      {/* Full Screen Navigation Menu - All screen sizes */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-fullscreen">
          {/* Header with close button only */}
          <div className="mobile-nav-header">
            <div></div> {/* Empty div for spacing */}
            <button 
              className="btn btn-link text-white p-0" 
              onClick={toggleMobileMenu}
              style={{ fontSize: '1.5rem' }}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
          
          {/* Centered navigation options */}
          <div className="mobile-nav-content">
            <ul className="mobile-nav-links-fullscreen">
              {sections.map((section) => (
                <li key={section.id} className="mobile-nav-section">
                  <div 
                    className="mobile-nav-section-header"
                    onClick={() => toggleSection(section.id)}
                  >
                    <span className="mobile-nav-section-title">{section.title}</span>
                  </div>
                  
                  {expandedSection === section.id && (
                    <ul className="mobile-nav-features">
                      {section.features.map((feature) => (
                        <li key={feature.id}>
                          <a
                            href="#"
                            className={currentFeature === feature.id ? 'active' : ''}
                            onClick={(e) => {
                              e.preventDefault();
                              handleFeatureSelect(section.id, feature.id);
                            }}
                          >
                            <i className={`${feature.icon} me-2`}></i>
                            {feature.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">

        {/* Sidebar - Hidden on mobile */}
        <aside className={`sidebar position-fixed d-none d-lg-block ${isSidebarOpen ? 'sidebar-open' : ''}`} style={{ top: '60px', left: 0, width: '250px', height: 'calc(100vh - 60px)', overflowY: 'auto', zIndex: 1020 }}>
          {getCurrentSection() && (
            <div>
              {/* <div className="sidebar-title">{getCurrentSection()?.title}</div> */}
              {getCurrentSection()?.features.map((feature) => (
                <div
                  key={feature.id}
                  className={`sidebar-item ${currentFeature === feature.id ? 'active' : ''}`}
                  onClick={() => handleFeatureChange(feature.id)}
                >
                  <i className={`${feature.icon} me-2`}></i>
                  {feature.title}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Content Area */}
        <main className="content-area" style={{ marginLeft: '250px' }}>
          {getCurrentFeature() && (
            <>

              
              <div className="content-body">
                {(() => {
                  return null;
                })()}
                {currentFeature === 'inventory' && !showInventoryTable && !showUpdateForm && !showExpectedUsageTable && !showBookingsTable && !showAlarmsTable && !showRules && (
                  <>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleInventoryCardClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-database me-2"></i>Stock</h5>
                            <p className="mb-2 small">Displays the last saved inventory update.</p>
                            <div className="mt-auto">
                              <ul className="list-unstyled small">
                                <li className="d-flex align-items-center justify-content-between mb-1">
                                  <span style={{ color: 'rgba(243, 156, 18, 0.8)' }}>
                                    <i className="bi-exclamation-triangle me-2"></i>
                                    Low Stock
                                  </span>
                                  <strong style={{ color: 'rgba(243, 156, 18, 0.8)' }}>{stockStatus.lowStock}</strong>
                                </li>
                                <li className="d-flex align-items-center justify-content-between">
                                  <span style={{ color: 'rgba(231, 76, 60, 0.8)' }}>
                                    <i className="bi-x-circle me-2"></i>
                                    Reorder
                                  </span>
                                  <strong style={{ color: 'rgba(231, 76, 60, 0.8)' }}>{stockStatus.reorderNeeded}</strong>
                                </li>
                              </ul>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">Detailed stock →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleUpdateCardClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-pencil-square me-2"></i>Update</h5>
                            <p className="mb-2 small">Update the actual stock to reflect current levels.</p>
                            <div className="mt-auto">
                              <h6 className="small mb-1">Last update: {lastUpdateInfo.date}</h6>
                              <h6 className="small">By: {lastUpdateInfo.user}</h6>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">Update inventory →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleBookingsCardClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-calendar-check me-2"></i>Bookings</h5>
                            <p className="mb-2 small">Shows bookings since the last inventory update.</p>
                            <div className="mt-auto">
                              {bookingsError ? (
                                <h6 className="small text-danger">{bookingsError}</h6>
                              ) : (
                                <h6 className="small">Bookings: {bookingsCount}</h6>
                              )}
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">View details →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Second row of cards */}
                    <div className="row mt-4">
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleExpectedUsageCardClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-graph-up me-2"></i>Expected Usage</h5>
                            <p className="mb-2 small">Calculates expected inventory consumption based on current bookings.</p>
                            <div className="mt-auto">
                              <div className="alert alert-info py-2">
                                <small>
                                  <strong>Functionality:</strong> Analyzes booking data to predict inventory needs.
                                </small>
                              </div>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">Click to view →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={() => {
                          setShowRules(true);
                          setShowInventoryTable(false);
                          setShowUpdateForm(false);
                          setShowExpectedUsageTable(false);
                        }}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-gear me-2"></i>Rules</h5>
                            <p className="mb-2 small">Business logic for inventory consumption calculations.</p>
                            <div className="mt-auto">
                              <p className="mb-0 small text-muted">Click to view detailed rules</p>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">View rules →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleAlarmsCardClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-exclamation-triangle me-2"></i>Alarms</h5>
                            <p className="mb-2 small">Get alerts for low stock and unusual consumption.</p>
                            <div className="mt-auto">
                              <p className="mb-0 small text-muted">Click to view alarm settings</p>
                              <h6 className="small mt-2">Total alarms: {alarmItems.length}</h6>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">View alarms →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {currentFeature === 'inventory' && showInventoryTable ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-database text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Stock</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={fetchApiInventoryData}
                          disabled={loading}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loading ? 'Loading...' : 'Refresh'}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => setShowInventoryTable(false)}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading inventory data...</p>
                      </div>
                    ) : apiError ? (
                      <div className="text-center py-4">
                        <div className="alert alert-danger">
                          <h5>Error loading inventory data</h5>
                          <p className="mb-2">{apiError}</p>
                          <button 
                            className="btn btn-outline-danger" 
                            onClick={fetchApiInventoryData}
                          >
                            <i className="bi-arrow-clockwise me-1"></i>
                            Retry
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start ps-3">Item</th>
                              <th className="text-start">Description</th>
                              <th className="text-center">Qty</th>
                              <th className="text-center">Status</th>
                              <th className="text-center">Rebuy Qty</th>
                              <th className="text-center">Tolerance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {apiInventoryItems.length > 0 ? (
                              apiInventoryItems.map((item) => (
                                <tr key={item.Item}>
                                  <td className="text-start ps-3">
                                    {item.Item}
                                  </td>
                                  <td className="text-start">
                                    {item.Description}
                                  </td>
                                  <td className="text-center">
                                    {item.Qty?.toLocaleString() || 0}
                                  </td>
                                  <td className="text-center">
                                    {item.Status === 'Healthy' ? (
                                      <span className="badge" style={{ backgroundColor: 'rgba(39, 174, 96, 0.8)', color: 'white', minWidth: '100px' }}>
                                        <i className="bi-check-circle me-1"></i>
                                        Healthy
                                      </span>
                                    ) : item.Status === 'Low Stock' ? (
                                      <span className="badge" style={{ backgroundColor: 'rgba(243, 156, 18, 0.8)', color: 'white', minWidth: '100px' }}>
                                        <i className="bi-exclamation-triangle me-1"></i>
                                        Low Stock
                                      </span>
                                    ) : item.Status === 'Reorder' ? (
                                      <span className="badge" style={{ backgroundColor: 'rgba(231, 76, 60, 0.8)', color: 'white', minWidth: '100px' }}>
                                        <i className="bi-x-circle me-1"></i>
                                        Reorder
                                      </span>
                                    ) : (
                                      <span className="badge" style={{ backgroundColor: 'rgba(128, 128, 128, 0.8)', color: 'white', minWidth: '100px' }}>
                                        <i className="bi-question-circle me-1"></i>
                                        {item.Status}
                                      </span>
                                    )}
                                  </td>
                                  <td className="text-center">
                                    {item.RebuyQty?.toLocaleString() || 0}
                                  </td>
                                  <td className="text-center">
                                    {item.Tolerance?.toLocaleString() || 0}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center text-muted py-5">
                                  <i className="bi-inbox fs-1 d-block mb-3"></i>
                                  <h5>No inventory items found</h5>
                                  <p>No data available from the API at the moment.</p>
                                  <small className="text-muted">
                                    The system will automatically fetch data when you open this view.
                                  </small>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        
                        {apiInventoryItems.length > 0 && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <div className="row text-center">
                              <div className="col-md-4">
                                <div style={{ color: 'rgba(39, 174, 96, 0.8)' }}>
                                  <i className="bi-check-circle fs-4"></i>
                                  <div className="small">Healthy</div>
                                  <strong>{apiInventoryItems.filter(item => item.Status === 'Healthy').length}</strong>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div style={{ color: 'rgba(243, 156, 18, 0.8)' }}>
                                  <i className="bi-exclamation-triangle fs-4"></i>
                                  <div className="small">Low Stock</div>
                                  <strong>{apiInventoryItems.filter(item => item.Status === 'Low Stock').length}</strong>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div style={{ color: 'rgba(231, 76, 60, 0.8)' }}>
                                  <i className="bi-x-circle fs-4"></i>
                                  <div className="small">Reorder Needed</div>
                                  <strong>{apiInventoryItems.filter(item => item.Status === 'Reorder').length}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : currentFeature === 'inventory' && showUpdateForm ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-pencil-square text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Update</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={fetchApiInventoryDataForUpdate}
                          disabled={loading}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={async () => {
                          setShowUpdateForm(false);
                          // Refresh data when going back to main view
                          await Promise.all([
                            fetchApiInventoryData(),
                            fetchBookingsCount()
                          ]);
                        }}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading inventory data...</p>
                      </div>
                    ) : apiError ? (
                      <div className="text-center py-4">
                        <div className="alert alert-danger">
                          <h5>Error loading inventory data</h5>
                          <p className="mb-2">{apiError}</p>
                          <button 
                            className="btn btn-outline-danger" 
                            onClick={fetchApiInventoryDataForUpdate}
                          >
                            <i className="bi-arrow-clockwise me-1"></i>
                            Retry
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="table-responsive">
                          <table className="table">
                            <thead className="table-light">
                              <tr>
                                <th className="text-start ps-3">Item</th>
                                <th className="text-center">New Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {apiInventoryItems.length > 0 ? (
                                apiInventoryItems.map((item) => (
                                  <tr key={item.Item}>
                                    <td className="text-start ps-3">
                                      {item.Item}
                                    </td>
                                    <td className="text-center">
                                      <div className="d-flex justify-content-center align-items-center">
                                        {/* Mobile-friendly quantity controls */}
                                        <div className="quantity-controls">
                                          <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                              const currentValue = updateQuantities[item.Item] || 0;
                                              const newValue = Math.max(0, currentValue - 1);
                                              handleQuantityChange(item.Item, newValue.toString());
                                            }}
                                          >
                                            <i className="bi-dash"></i>
                                          </button>
                                          
                                          <input
                                            type="number"
                                            className="form-control text-center"
                                            value={updateQuantities[item.Item] || ''}
                                            onChange={(e) => handleQuantityChange(item.Item, e.target.value)}
                                            min="0"
                                            onFocus={() => console.log(`🔍 Input focused: ${item.Item}, current value: ${updateQuantities[item.Item]}, API value: ${item.Qty}`)}
                                          />
                                          
                                          <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                              const currentValue = updateQuantities[item.Item] || 0;
                                              const newValue = currentValue + 1;
                                              handleQuantityChange(item.Item, newValue.toString());
                                            }}
                                          >
                                            <i className="bi-plus"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={2} className="text-center text-muted py-5">
                                    <i className="bi-inbox fs-1 d-block mb-3"></i>
                                    <h5>No inventory items found</h5>
                                    <p>No data available from the API at the moment.</p>
                                    <small className="text-muted">
                                      The system will automatically fetch data when you open this view.
                                    </small>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <div className="text-muted">
                            <small>Make sure all quantities are filled before submitting</small>
                            {submitting && (
                              <div className="mt-2">
                                <small className="text-info">
                                  <i className="bi-info-circle me-1"></i>
                                  Processing update... Please wait.
                                </small>
                              </div>
                            )}
                          </div>
                          
                          {/* Debug button to show current form state */}
                          <button 
                            type="button"
                            className="btn btn-outline-info btn-sm"
                            onClick={() => {
                              console.log('=== DEBUG: CURRENT FORM STATE ===');
                              console.log('updateQuantities:', updateQuantities);
                              console.log('apiInventoryItems:', apiInventoryItems);
                              console.log('Form values vs API values:');
                              apiInventoryItems.forEach(item => {
                                const formValue = updateQuantities[item.Item];
                                console.log(`${item.Item}: API=${item.Qty}, Form=${formValue}, Changed=${formValue !== item.Qty}`);
                              });
                              console.log('====================================');
                            }}
                          >
                            <i className="bi-bug me-1"></i>
                            Debug Form State
                          </button>
                          
                          {/* Test API with simple data */}
                          <button 
                            type="button"
                            className="btn btn-outline-warning btn-sm"
                            onClick={async () => {
                              console.log('=== TESTING API WITH SIMPLE DATA ===');
                              const testData = {
                                updates: {
                                  "Wine": 999,
                                  "Coffee": 888
                                }
                              };
                              
                              console.log('Sending test data:', testData);
                              
                              try {
                                const response = await fetch('https://tflcapk4oltm7lkggzbi3zlidu0tvvka.lambda-url.eu-central-1.on.aws/', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify(testData)
                                });
                                
                                const result = await response.json();
                                console.log('Test API response:', result);
                                console.log('Items updated:', result.currentInventoryItemsUpdated);
                                console.log('==========================================');
                              } catch (error) {
                                console.error('Test API error:', error);
                              }
                            }}
                          >
                            <i className="bi-flask me-1"></i>
                            Test API
                          </button>
                          
                          {/* Test API with exact working format */}
                          <button 
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={async () => {
                              console.log('=== TESTING API WITH EXACT WORKING FORMAT ===');
                              const workingData = {
                                updates: {
                                  "Water": 22,
                                  "Coffee": 33,
                                  "Olive Oil": 44,
                                  "Wine": 55
                                }
                              };
                              
                              console.log('Sending working format data:', workingData);
                              console.log('JSON string:', JSON.stringify(workingData));
                              
                              try {
                                const response = await fetch('https://tflcapk4oltm7lkggzbi3zlidu0tvvka.lambda-url.eu-central-1.on.aws/', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify(workingData)
                                });
                                
                                const result = await response.json();
                                console.log('Working format API response:', result);
                                console.log('Items updated:', result.currentInventoryItemsUpdated);
                                console.log('==========================================');
                              } catch (error) {
                                console.error('Working format API error:', error);
                              }
                            }}
                          >
                            <i className="bi-check-circle me-1"></i>
                            Test Working Format
                          </button>
                                                      <button 
                              className="btn" 
                              onClick={handleSubmitUpdate}
                              disabled={submitting || Object.keys(updateQuantities).length === 0}
                              style={{ 
                                backgroundColor: '#5a1f8a', 
                                borderColor: '#5a1f8a',
                                color: 'white',
                                transition: 'all 0.2s ease-in-out'
                              }}
                              onMouseOver={(e) => {
                                const target = e.target as HTMLButtonElement;
                                target.style.backgroundColor = '#380a5e';
                                target.style.borderColor = '#380a5e';
                              }}
                              onMouseOut={(e) => {
                                const target = e.target as HTMLButtonElement;
                                target.style.backgroundColor = '#5a1f8a';
                                target.style.borderColor = '#5a1f8a';
                              }}
                            >
                              {submitting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Processing Update...
                                </>
                              ) : (
                                <>
                                  <i className="bi-check-circle me-2"></i>
                                  Submit Update
                                </>
                              )}
                            </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : currentFeature === 'inventory' && showExpectedUsageTable ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-graph-up text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Expected Usage Analysis</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-secondary" 
                          onClick={() => {
                            fetchExpectedUsageData();
                          }}
                          disabled={loadingExpectedUsage}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loadingExpectedUsage ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => setShowExpectedUsageTable(false)}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>
                    
                    {loadingExpectedUsage ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading expected usage data...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start ps-3">Item</th>
                              <th className="text-center">Exact Consumption</th>
                              <th className="text-center">Tolerance</th>
                              <th className="text-center">Accepted Consumption</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expectedUsageItems.length > 0 ? (
                              expectedUsageItems.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-start ps-3">
                                    <strong>{item.Item}</strong>
                                  </td>
                                  <td className="text-center">
                                    <span className="badge bg-primary">{item.ExactConsumption}</span>
                                  </td>
                                  <td className="text-center">
                                    <span className="badge bg-warning text-dark">{item.Tolerance}</span>
                                  </td>
                                  <td className="text-center">
                                    <span className="badge bg-success">{item.AcceptedConsumption}</span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center text-muted py-5">
                                  <i className="bi-graph-up fs-1 d-block mb-3"></i>
                                  <h5>No expected usage data found</h5>
                                  <p>No consumption data available at the moment.</p>
                                  <small className="text-muted">
                                    {expectedUsageError || 'The data is automatically fetched from the API when the page loads.'}
                                  </small>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        
                        {expectedUsageItems.length > 0 && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <div className="row text-center">
                              <div className="col-md-3">
                                <div style={{ color: 'rgba(39, 174, 96, 0.8)' }}>
                                  <i className="bi-graph-up fs-4"></i>
                                  <div className="small">Total Items</div>
                                  <strong>{expectedUsageItems.length}</strong>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div style={{ color: 'rgba(243, 156, 18, 0.8)' }}>
                                  <i className="bi-calculator fs-4"></i>
                                  <div className="small">Total Consumption</div>
                                  <strong>{expectedUsageItems.reduce((sum, item) => sum + item.ExactConsumption, 0)}</strong>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div style={{ color: 'rgba(231, 76, 60, 0.8)' }}>
                                  <i className="bi-shield-check fs-4"></i>
                                  <div className="small">Total Tolerance</div>
                                  <strong>{expectedUsageItems.reduce((sum, item) => sum + item.Tolerance, 0)}</strong>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div style={{ color: 'rgba(128, 0, 255, 0.8)' }}>
                                  <i className="bi-check-circle fs-4"></i>
                                  <div className="small">Total Accepted</div>
                                  <strong>{expectedUsageItems.reduce((sum, item) => sum + item.AcceptedConsumption, 0)}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : currentFeature === 'inventory' && showBookingsTable ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-calendar-check text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Bookings since last inventory</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-secondary" 
                          onClick={() => {
                            fetchBookingsData();
                            fetchBookingsCount();
                          }}
                          disabled={loadingBookings}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loadingBookings ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => setShowBookingsTable(false)}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>
                    
                    {loadingBookings ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading bookings data...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start ps-3">Booking ID</th>
                              <th className="text-center">Checkin Date</th>
                              <th className="text-center">Guests</th>
                              <th className="text-start">Listing Nickname</th>
                              <th className="text-center">Nights</th>
                              <th className="text-start">Room Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentBookings.length > 0 ? (
                              currentBookings.map((booking) => (
                                <tr key={booking.bookingId}>
                                  <td className="text-start ps-3">
                                    {booking.bookingId}
                                  </td>
                                  <td className="text-center">
                                    {(() => {
                                      try {
                                        return new Date(booking.checkinDate).toLocaleDateString('en-GB');
                                      } catch (error) {
                                        console.error('Error parsing date:', booking.checkinDate, error);
                                        return booking.checkinDate || 'Invalid Date';
                                      }
                                    })()}
                                  </td>
                                  <td className="text-center">
                                    {booking.guests}
                                  </td>
                                  <td className="text-start">
                                    {booking.listingNickname}
                                  </td>
                                  <td className="text-center">
                                    {booking.nights}
                                  </td>
                                  <td className="text-start">
                                    {booking.roomType}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center text-muted py-5">
                                  <i className="bi-calendar-x fs-1 d-block mb-3"></i>
                                  <h5>No bookings found</h5>
                                  <p>No booking data available at the moment.</p>
                                  <small className="text-muted">
                                    {bookingsError || 'The data is automatically fetched from the API when the page loads.'}
                                  </small>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        
                        {bookings.length > 0 && (
                          <>
                            {/* Pagination Controls */}
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                              {/* Items per page selector */}
                              <div className="d-flex align-items-center gap-2">
                                <label className="form-label mb-0 small">Items per page:</label>
                                <select
                                  className="form-select form-select-sm"
                                  style={{ width: 'auto' }}
                                  value={itemsPerPage}
                                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                >
                                  <option value={5}>5</option>
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
                                  <option value={50}>50</option>
                                </select>
                              </div>

                              {/* Pagination navigation */}
                              {totalPages > 1 && (
                                <div className="d-flex align-items-center gap-3">
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                  >
                                    <i className="bi-chevron-left me-1"></i>
                                    Previous
                                  </button>
                                  
                                  <div className="d-flex gap-1">
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                      <button
                                        key={page}
                                        className={`btn ${currentPage === page ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                        onClick={() => handlePageChange(page)}
                                        style={{ minWidth: '40px' }}
                                      >
                                        {page}
                                      </button>
                                    ))}
                                  </div>
                                  
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                  >
                                    Next
                                    <i className="bi-chevron-right ms-1"></i>
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Pagination Info */}
                            <div className="mt-3 p-3 bg-light rounded">
                              <div className="row text-center">
                                <div className="col-md-3">
                                  <div style={{ color: 'rgba(39, 174, 96, 0.8)' }}>
                                    <i className="bi-calendar-check fs-4"></i>
                                    <div className="small">Total Bookings</div>
                                    <strong>{bookings.length}</strong>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div style={{ color: 'rgba(243, 156, 18, 0.8)' }}>
                                    <i className="bi-people fs-4"></i>
                                    <div className="small">Total Guests</div>
                                    <strong>{bookings.reduce((sum, booking) => sum + booking.guests, 0)}</strong>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div style={{ color: 'rgba(231, 76, 60, 0.8)' }}>
                                    <i className="bi-moon fs-4"></i>
                                    <div className="small">Total Nights</div>
                                    <strong>{bookings.reduce((sum, booking) => sum + booking.nights, 0)}</strong>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div style={{ color: 'rgba(128, 0, 255, 0.8)' }}>
                                    <i className="bi-layers fs-4"></i>
                                    <div className="small">Page {currentPage} of {totalPages}</div>
                                    <strong>Showing {startIndex + 1}-{Math.min(endIndex, bookings.length)}</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : currentFeature === 'inventory' && showAlarmsTable ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-exclamation-triangle text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Alarms</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-secondary" 
                          onClick={() => {
                            fetchAlarmsData();
                          }}
                          disabled={loadingAlarms}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loadingAlarms ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => setShowAlarmsTable(false)}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>
                    
                    {loadingAlarms ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading alarms data...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start ps-3">Date</th>
                              <th className="text-center">Alarm Type</th>
                              <th className="text-start">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {alarmItems.length > 0 ? (
                              alarmItems.map((alarm, index) => (
                                <tr key={index}>
                                  <td className="text-start ps-3">
                                    {(() => {
                                      try {
                                        return new Date(alarm.Date).toLocaleDateString('en-GB');
                                      } catch (error) {
                                        console.error('Error parsing date:', alarm.Date, error);
                                        return alarm.Date || 'Invalid Date';
                                      }
                                    })()}
                                  </td>
                                  <td className="text-center">
                                    <span className={`badge ${
                                      alarm.Alarm === 'Low Stock' ? 'bg-primary' :
                                      alarm.Alarm === 'Consistency error' ? 'bg-warning text-dark' :
                                      alarm.Alarm === 'Reorder' ? 'bg-danger' : 'bg-secondary'
                                    }`}>
                                      {alarm.Alarm}
                                    </span>
                                  </td>
                                  <td className="text-start">
                                    {alarm.Description}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="text-center text-muted py-5">
                                  <i className="bi-exclamation-triangle fs-1 d-block mb-3"></i>
                                  <h5>No alarms found</h5>
                                  <p>No alarm data available at the moment.</p>
                                  <small className="text-muted">
                                    {alarmsError || 'The data is automatically fetched from the API when the page loads.'}
                                  </small>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        

                      </div>
                    )}
                  </div>
                ) : currentFeature === 'inventory' && showRules ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-gear text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Rules</h3>
                      </div>
                      <button className="btn btn-outline-secondary" onClick={() => setShowRules(false)}>
                        <i className="bi-arrow-left me-1"></i>Back
                      </button>
                    </div>
                    
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title mb-4">Inventory Consumption Rules</h5>
                            <p className="text-muted mb-4">
                              The following rules are used in the calculation of expected usage for inventory management. 
                              These rules determine how much inventory should be consumed based on guest bookings and property types.
                            </p>
                            
                            <div className="list-group list-group-flush">
                              <div className="list-group-item d-flex align-items-center py-3">
                                <div className="me-3">
                                  <i className="bi-droplet-fill text-primary fs-5"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Water Bottles</h6>
                                  <p className="mb-0 text-muted">One water bottle per guest</p>
                                </div>
                              </div>
                              
                              <div className="list-group-item d-flex align-items-center py-3">
                                <div className="me-3">
                                  <i className="bi-cup-hot-fill text-warning fs-5"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Wine Bottles</h6>
                                  <p className="mb-0 text-muted">One wine bottle per reservation</p>
                                </div>
                              </div>
                              
                              <div className="list-group-item d-flex align-items-center py-3">
                                <div className="me-3">
                                  <i className="bi-cup-straw text-success fs-5"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Coffee Capsules</h6>
                                  <p className="mb-0 text-muted">Two coffee capsules per guest</p>
                                </div>
                              </div>
                              
                              <div className="list-group-item d-flex align-items-center py-3">
                                <div className="me-3">
                                  <i className="bi-droplet-half text-info fs-5"></i>
                                </div>
                                <div>
                                  <h6 className="mb-1">Olive Oil</h6>
                                  <p className="mb-0 text-muted">One olive oil bottle if the property type is "Entire home/apt"</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-lg-4">
                        <div className="card">
                          <div className="card-body">
                            <h6 className="card-title">How it works</h6>
                            <p className="small text-muted">
                              These rules are automatically applied when calculating expected inventory consumption 
                              based on your current bookings. The system will use guest counts, reservation details, 
                              and property information to determine the appropriate inventory levels.
                            </p>
                            <div className="mt-3">
                              <small className="text-muted">
                                <i className="bi-info-circle me-1"></i>
                                Rules are applied per night of stay
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
