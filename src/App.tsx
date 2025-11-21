
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { fetchAuthSession } from "aws-amplify/auth";

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



// Define interfaces for Inventory 2
interface InventoryItem2 {
  id: string;
  itemName: string;
  qty: number;
  rebuyQty: number;
  location: string;
  status?: string;
  tolerance?: number;
  description?: string;
  unitPrice?: number;
  consumptionRuleId?: string;
  consumptionRule?: ConsumptionRule;
  createdAt?: string;
  updatedAt?: string;
}

interface ConsumptionRule {
  id: string;
  name: string;
  description?: string;
  formula?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PurchaseRecord {
  id: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
  unitPrice: number;
  supplier: string;
  location: string;
  inventoryItemId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InventorySpotCheck {
  id: string;
  checkDate: string;
  location: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ItemRule {
  id: string;
  itemName: string;
  propertyType: string; // Entire home, Private room, Planta2
  consumptionRuleId: string;
  consumptionRule?: ConsumptionRule;
  inventoryItemId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Property {
  id: string;
  propertyName: string;
  propertyType: string; // Entire home, Private room, Planta2
  guestCapacity: number;
  apiReference?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Alarm {
  id: string;
  name: string;
  description?: string;
  section: string;
  function: string; // Inventory, Cleaning Report, Auto PC, SMS
  type: string;
  status: string; // Pending, Completed, Snoozed, Active
  date?: string; // Fecha de la alarma
  log?: string; // Log de acciones: [user email]: [date]
  createdAt?: string;
  updatedAt?: string;
}

interface Incident {
  id: string;
  reportedBy: string;
  reportDate: string;
  affectedArea: string;
  description: string;
  mentionedUsers?: string[];
  mentionedProperties?: string[];
  priority?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IncidentComment {
  id: string;
  incidentId: string;
  comment: string;
  commentedBy: string;
  commentedAt: string;
  mentionedUsers?: string[];
  mentionedProperties?: string[];
  createdAt?: string;
  updatedAt?: string;
}


const sections: Section[] = [
  {
    id: 'ops',
    title: 'Ops',
    features: [
      {
        id: 'inventory-2',
        title: 'Inventory',
        description: 'New inventory management system',
        content: 'New version of inventory management system',
        functionality: 'This is a new version of the inventory system currently under development.',
        icon: 'bi-boxes'
      },
      {
        id: 'properties',
        title: 'Properties',
        description: 'Manage properties and their configurations',
        content: 'Property management system for tracking property details, types, and capacities.',
        functionality: 'Manage all properties with their types, guest capacities, and API references.',
        icon: 'bi-building'
      },
      {
        id: 'alarms',
        title: 'Alarms',
        description: 'Manage and track system alarms',
        content: 'Alarm management system for tracking and managing all alarms in the Ops section.',
        functionality: 'View, manage, and mark alarms as completed. Track alarm status and details.',
        icon: 'bi-bell'
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
      },
      {
        id: 'incident-tracker',
        title: 'Incident Tracker',
        description: 'Track and manage operational incidents',
        content: 'Comprehensive incident tracking system for monitoring operational issues, improvements, and follow-ups. Features mention support for users and properties, filtering capabilities, and comment threads.',
        functionality: 'This system allows staff to report incidents with detailed descriptions, mention users and properties, add follow-up comments, and filter incidents by various criteria for analysis and improvement tracking.',
        icon: 'bi-exclamation-triangle'
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
  const [userEmail, setUserEmail] = useState<string>('User');
  const [currentSection, setCurrentSection] = useState<string>('ops');
  const [currentFeature, setCurrentFeature] = useState<string>('inventory-2');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Estados para Inventory 2
  const [inventoryItems2, setInventoryItems2] = useState<InventoryItem2[]>([]);
  const [consumptionRules, setConsumptionRules] = useState<ConsumptionRule[]>([]);
  const [loadingInventory2, setLoadingInventory2] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState<boolean>(false);
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [showInventory2Table, setShowInventory2Table] = useState<boolean>(false);
  const [showInventory2Rules, setShowInventory2Rules] = useState<boolean>(false);
  const [showInventory2Purchase, setShowInventory2Purchase] = useState<boolean>(false);
  const [showInventory2SpotCheck, setShowInventory2SpotCheck] = useState<boolean>(false);
  const [showInventory2ItemsRules, setShowInventory2ItemsRules] = useState<boolean>(false);
  const [showInventory2SpotCheckWizard, setShowInventory2SpotCheckWizard] = useState<boolean>(false);
  
  // Estados para el wizard de Spot Check
  const [spotCheckWizardStep, setSpotCheckWizardStep] = useState<number>(1);
  const [spotCheckLocation, setSpotCheckLocation] = useState<string>('');
  const [spotCheckFromDate, setSpotCheckFromDate] = useState<string>('');
  const [spotCheckToDate, setSpotCheckToDate] = useState<string>('');
  const [spotCheckApiResponse, setSpotCheckApiResponse] = useState<any>(null);
  const [spotCheckApiLoading, setSpotCheckApiLoading] = useState<boolean>(false);
  const [spotCheckApiError, setSpotCheckApiError] = useState<string | null>(null);
  const [spotCheckCalculating, setSpotCheckCalculating] = useState<boolean>(false);
  const [spotCheckConsumptions, setSpotCheckConsumptions] = useState<{[itemName: string]: number}>({});
  const [spotCheckVerifiedQuantities, setSpotCheckVerifiedQuantities] = useState<{[itemName: string]: number}>({});
  
  // Estados para registro de compra
  const [purchaseForm, setPurchaseForm] = useState({
    itemName: '',
    quantity: 0,
    totalPrice: 0,
    unitPrice: 0,
    supplier: '',
    location: '',
    inventoryItemId: undefined as string | undefined,
    isNewItem: false,
  });
  const [itemSearchQuery, setItemSearchQuery] = useState<string>('');
  const [showItemSearch, setShowItemSearch] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<InventoryItem2[]>([]);
  const [locationCreateNew, setLocationCreateNew] = useState<boolean>(false);
  
  // Estados para historial de compras
  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([]);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [loadingPurchaseHistory, setLoadingPurchaseHistory] = useState<boolean>(false);
  
  // Estados para spot checks
  const [spotChecks, setSpotChecks] = useState<InventorySpotCheck[]>([]);
  const [loadingSpotChecks, setLoadingSpotChecks] = useState<boolean>(false);
  const [editingSpotCheckId, setEditingSpotCheckId] = useState<string | null>(null);
  
  // Estados para Incident Tracker
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentComments, setIncidentComments] = useState<IncidentComment[]>([]);
  const [allIncidentComments, setAllIncidentComments] = useState<IncidentComment[]>([]);
  const [loadingIncidents, setLoadingIncidents] = useState<boolean>(false);
  const [showIncidentTracker, setShowIncidentTracker] = useState<boolean>(false);
  const [showIncidentDetail, setShowIncidentDetail] = useState<boolean>(false);
  const [showIncidentForm, setShowIncidentForm] = useState<boolean>(false);
  const [showIncidentStats, setShowIncidentStats] = useState<boolean>(false);
  const [showIncidentFilters, setShowIncidentFilters] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [incidentFilters, setIncidentFilters] = useState({
    affectedArea: '',
    mentionedUser: '',
    mentionedProperty: '',
    dateFrom: '',
    dateTo: '',
    priority: '',
    searchText: '',
  });
  const [newIncidentForm, setNewIncidentForm] = useState({
    reportedBy: '',
    reportDate: new Date().toISOString().split('T')[0],
    affectedArea: '',
    description: '',
    priority: 'Medium',
  });
  const [newCommentForm, setNewCommentForm] = useState({
    comment: '',
  });
  
  // Función para obtener el email del usuario autenticado
  const getUserEmail = async (): Promise<string> => {
    try {
      // Intentar obtener el email desde signInDetails
      if (user?.signInDetails?.loginId) {
        return user.signInDetails.loginId;
      }
      
      // Si no está en signInDetails, intentar obtenerlo desde el token
      const session = await fetchAuthSession();
      if (session.tokens?.idToken) {
        const payload = session.tokens.idToken.payload;
        // El email puede estar en 'email' o 'cognito:username'
        if (payload.email) {
          return payload.email as string;
        }
        if (payload['cognito:username']) {
          return payload['cognito:username'] as string;
        }
      }
      
      // Fallback: usar username si está disponible
      if (user?.username) {
        return user.username;
      }
      
      return 'System';
    } catch (error) {
      console.error('Error obteniendo email del usuario:', error);
      // Fallback: usar username si está disponible
      return user?.username || 'System';
    }
  };
  
  // Efecto para obtener y actualizar el email del usuario cuando cambie
  useEffect(() => {
    const loadUserEmail = async () => {
      try {
        // Intentar obtener el email desde signInDetails primero
        if (user?.signInDetails?.loginId) {
          setUserEmail(user.signInDetails.loginId);
          return;
        }
        
        // Si no está en signInDetails, intentar obtenerlo desde el token
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          const payload = session.tokens.idToken.payload;
          // El email puede estar en 'email' o 'cognito:username'
          if (payload.email) {
            setUserEmail(payload.email as string);
            return;
          }
          if (payload['cognito:username']) {
            setUserEmail(payload['cognito:username'] as string);
            return;
          }
        }
        
        // Fallback: usar username si está disponible
        if (user?.username) {
          setUserEmail(user.username);
        }
      } catch (error) {
        console.error('Error obteniendo email del usuario:', error);
        // Fallback: usar username si está disponible
        if (user?.username) {
          setUserEmail(user.username);
        }
      }
    };
    
    if (user) {
      loadUserEmail();
    }
  }, [user]);
  
  // Función para obtener la última fecha de ejecución
  const getLastSpotCheckDate = (): string | null => {
    if (spotChecks.length > 0) {
      // Los spot checks ya están ordenados por fecha más reciente primero
      return spotChecks[0].checkDate;
    }
    return null;
  };
  
  // Estados para Items Rules
  const [itemRules, setItemRules] = useState<ItemRule[]>([]);
  const [loadingItemRules, setLoadingItemRules] = useState<boolean>(false);
  const [expandedItemRuleId, setExpandedItemRuleId] = useState<string | null>(null);
  
  // Tipos de propiedades
  const propertyTypes = ['Entire home', 'Private room', 'Planta2'];
  
  // Estados para Properties
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState<boolean>(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [isAddingNewProperty, setIsAddingNewProperty] = useState<boolean>(false);
  const [newPropertyForm, setNewPropertyForm] = useState<Partial<Property>>({
    propertyName: '',
    propertyType: 'Entire home',
    guestCapacity: 0,
    apiReference: '',
  });
  
  // Estados para Alarms (Ops)
  const [alarmsOps, setAlarmsOps] = useState<Alarm[]>([]);
  const [loadingAlarmsOps, setLoadingAlarmsOps] = useState<boolean>(false);
  const [isAddingNewAlarm, setIsAddingNewAlarm] = useState<boolean>(false);
  const [alarmFilter, setAlarmFilter] = useState<'default' | 'completed'>('default');
  const [newAlarmForm, setNewAlarmForm] = useState<Partial<Alarm>>({
    name: '',
    description: '',
    section: 'Ops',
    function: 'Inventory',
    type: '',
    status: 'Pending',
  });
  const [newItemForm, setNewItemForm] = useState<Partial<InventoryItem2>>({
    itemName: '',
    qty: 0,
    rebuyQty: 0,
    location: '',
    status: 'OK',
    tolerance: 0,
    description: '',
    unitPrice: undefined,
    consumptionRuleId: undefined,
  });
  
  // Estados para gestión de reglas de consumo
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [isAddingNewRule, setIsAddingNewRule] = useState<boolean>(false);
  const [newRuleForm, setNewRuleForm] = useState<Partial<ConsumptionRule>>({
    name: '',
    description: '',
    formula: '',
  });

  // Load inventory data when component mounts
  useEffect(() => {
    
    // Check for direct link parameters
    const urlParams = new URLSearchParams(window.location.search);
    const directSection = urlParams.get('section');
    const directFeature = urlParams.get('feature');
    
    if (directSection && directFeature) {
      setCurrentSection(directSection);
      setCurrentFeature(directFeature);
    }
  }, []);


  useEffect(() => {
    if (currentFeature === 'inventory-2') {
      fetchInventoryItems2();
      fetchConsumptionRules();
      // Resetear vistas al cambiar de feature
      setShowInventory2Table(false);
      setShowInventory2Rules(false);
      setShowInventory2Purchase(false);
      setShowInventory2SpotCheck(false);
      setShowInventory2ItemsRules(false);
      setShowInventory2SpotCheckWizard(false);
    } else if (currentFeature === 'properties') {
      fetchProperties();
    } else if (currentFeature === 'alarms') {
      fetchAlarms();
    } else if (currentFeature === 'incident-tracker') {
      fetchIncidents();
      // Resetear vistas al cambiar de feature
      setShowIncidentTracker(false);
      setShowIncidentDetail(false);
      setShowIncidentForm(false);
      setShowIncidentStats(false);
      setSelectedIncident(null);
      setIncidentComments([]);
    }
  }, [currentFeature]);

  // Efecto para filtrar items cuando cambia la búsqueda
  useEffect(() => {
    if (itemSearchQuery.trim() === '') {
      setFilteredItems([]);
    } else {
      const filtered = inventoryItems2.filter(item =>
        item.itemName.toLowerCase().includes(itemSearchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [itemSearchQuery, inventoryItems2]);

  // Obtener ubicaciones únicas de los items de inventario
  const getUniqueLocations = (): string[] => {
    const locations = new Set<string>();
    inventoryItems2.forEach(item => {
      if (item.location) {
        locations.add(item.location);
      }
    });
    return Array.from(locations).sort();
  };

  // Efecto para calcular precio unitario cuando cambian totalPrice o quantity
  useEffect(() => {
    if (purchaseForm.totalPrice > 0 && purchaseForm.quantity > 0) {
      const unitPrice = purchaseForm.totalPrice / purchaseForm.quantity;
      setPurchaseForm(prev => ({ ...prev, unitPrice: parseFloat(unitPrice.toFixed(2)) }));
    } else {
      setPurchaseForm(prev => ({ ...prev, unitPrice: 0 }));
    }
  }, [purchaseForm.totalPrice, purchaseForm.quantity]);

  // Handlers para Inventory 2 Dashboard
  const handleInventory2TableClick = () => {
    setShowInventory2Table(true);
    setShowInventory2Rules(false);
    setShowInventory2Purchase(false);
    setShowInventory2SpotCheck(false);
    setShowInventory2ItemsRules(false);
  };

  const handleInventory2RulesClick = () => {
    setShowInventory2Rules(true);
    setShowInventory2Table(false);
    setShowInventory2Purchase(false);
    setShowInventory2SpotCheck(false);
    setShowInventory2ItemsRules(false);
    fetchConsumptionRules();
  };

  const handleInventory2ItemsRulesClick = async () => {
    setShowInventory2ItemsRules(true);
    setShowInventory2Table(false);
    setShowInventory2Rules(false);
    setShowInventory2Purchase(false);
    setShowInventory2SpotCheck(false);
    await fetchItemRules();
    await fetchConsumptionRules(); // Cargar reglas para los dropdowns
  };

  const handleInventory2SpotCheckClick = async () => {
    setShowInventory2SpotCheck(true);
    setShowInventory2Table(false);
    setShowInventory2Rules(false);
    setShowInventory2Purchase(false);
    setShowInventory2ItemsRules(false);
    setShowInventory2SpotCheckWizard(false);
    await fetchSpotChecks();
  };
  
  const handleInventory2SpotCheckWizardClick = async () => {
    setShowInventory2SpotCheckWizard(true);
    setShowInventory2Table(false);
    setShowInventory2Rules(false);
    setShowInventory2Purchase(false);
    setShowInventory2SpotCheck(false);
    setShowInventory2ItemsRules(false);
    setSpotCheckWizardStep(1);
    setSpotCheckLocation('');
    setSpotCheckApiResponse(null);
    setSpotCheckApiError(null);
    
    // Obtener la última fecha de Spot Check History para el valor predeterminado de "From"
    await fetchSpotChecks();
    const lastDate = getLastSpotCheckDate();
    if (lastDate) {
      const date = new Date(lastDate);
      setSpotCheckFromDate(date.toISOString().split('T')[0]);
    }
    
    // Establecer fecha de hoy como valor predeterminado de "To"
    const today = new Date();
    setSpotCheckToDate(today.toISOString().split('T')[0]);
  };
  
  // Función para llamar a la API en el paso 3
  const fetchSpotCheckApiData = async () => {
    if (!spotCheckFromDate || !spotCheckToDate) {
      setSpotCheckApiError('Por favor selecciona las fechas antes de continuar.');
      return;
    }
    
    setSpotCheckApiLoading(true);
    setSpotCheckApiError(null);
    
    try {
      const requestBody = {
        fromYmd: spotCheckFromDate,
        toYmd: spotCheckToDate,
      };
      
      console.log('Llamando a la API con:', requestBody);
      
      const response = await fetch('https://a2hytc4pdf3gqsfdosgukc3l3u0tgukb.lambda-url.eu-central-1.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Respuesta de la API:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Error en la API (${response.status}): ${response.statusText}. ${errorText}`);
      }
      
      // Intentar parsear como JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Respuesta no es JSON, intentando parsear:', text);
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          throw new Error(`La respuesta no es un JSON válido. Respuesta: ${text.substring(0, 200)}`);
        }
      }
      
      console.log('Datos recibidos de la API:', data);
      setSpotCheckApiResponse(data);
    } catch (error) {
      console.error('Error fetching spot check API data:', error);
      
      let errorMessage = 'Error desconocido al llamar a la API';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet o que la API esté disponible.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSpotCheckApiError(errorMessage);
    } finally {
      setSpotCheckApiLoading(false);
    }
  };
  
  // Función para avanzar al siguiente paso
  const nextSpotCheckWizardStep = () => {
    if (spotCheckWizardStep === 1) {
      if (!spotCheckLocation) {
        alert('Por favor selecciona una ubicación antes de continuar.');
        return;
      }
      setSpotCheckWizardStep(2);
    } else if (spotCheckWizardStep === 2) {
      if (!spotCheckFromDate || !spotCheckToDate) {
        alert('Por favor selecciona ambas fechas antes de continuar.');
        return;
      }
      setSpotCheckWizardStep(3);
      fetchSpotCheckApiData();
    } else if (spotCheckWizardStep === 3) {
      if (!spotCheckApiResponse) {
        alert('Por favor espera a que se carguen los resultados de la API antes de continuar.');
        return;
      }
      setSpotCheckWizardStep(4);
      calculateSpotCheckConsumptions();
    } else if (spotCheckWizardStep === 4) {
      if (Object.keys(spotCheckConsumptions).length === 0) {
        alert('Por favor espera a que se completen los cálculos de consumo antes de continuar.');
        return;
      }
      setSpotCheckWizardStep(5);
      initializeVerifiedQuantities();
    }
  };
  
  // Función para inicializar las cantidades verificadas
  const initializeVerifiedQuantities = async () => {
    if (!spotCheckLocation) return;
    
    // Asegurar que los items de inventario estén cargados
    if (inventoryItems2.length === 0) {
      await fetchInventoryItems2();
    }
    
    // Filtrar items por ubicación
    const locationItems = inventoryItems2.filter(item => item.location === spotCheckLocation);
    
    const verified: {[itemName: string]: number} = {};
    
    locationItems.forEach(item => {
      const currentQty = item.qty || 0;
      const estimatedConsumption = spotCheckConsumptions[item.itemName] || 0;
      
      // Valor predeterminado: cantidad actual - consumo estimado
      // Si no hay consumo estimado, usar cantidad actual
      verified[item.itemName] = Math.max(0, currentQty - estimatedConsumption);
    });
    
    setSpotCheckVerifiedQuantities(verified);
  };
  
  // Función para actualizar cantidad verificada
  const updateVerifiedQuantity = (itemName: string, value: number) => {
    setSpotCheckVerifiedQuantities(prev => ({
      ...prev,
      [itemName]: Math.max(0, value) // No permitir valores negativos
    }));
  };
  
  // Función para incrementar cantidad
  const incrementQuantity = (itemName: string) => {
    const current = spotCheckVerifiedQuantities[itemName] || 0;
    updateVerifiedQuantity(itemName, current + 1);
  };
  
  // Función para decrementar cantidad
  const decrementQuantity = (itemName: string) => {
    const current = spotCheckVerifiedQuantities[itemName] || 0;
    updateVerifiedQuantity(itemName, current - 1);
  };
  
  // Función para finalizar el Spot Check
  const finalizeSpotCheck = async () => {
    if (!spotCheckLocation || Object.keys(spotCheckVerifiedQuantities).length === 0) {
      alert('Por favor completa todas las cantidades verificadas antes de finalizar.');
      return;
    }
    
    try {
      // Filtrar items por ubicación
      const locationItems = inventoryItems2.filter(item => item.location === spotCheckLocation);
      
      let updatedCount = 0;
      let alarmCount = 0;
      
      // Procesar cada item
      for (const item of locationItems) {
        const verifiedQty = spotCheckVerifiedQuantities[item.itemName];
        if (verifiedQty === undefined) continue;
        
        const currentQty = item.qty || 0;
        const rebuyQty = item.rebuyQty || 0;
        const tolerance = item.tolerance || 0;
        const estimatedConsumption = spotCheckConsumptions[item.itemName] || 0;
        
        // Calcular valor esperado
        const expectedQty = estimatedConsumption > 0 
          ? Math.max(0, currentQty - estimatedConsumption)
          : currentQty;
        
        // Determinar nuevo estado según las reglas
        let newStatus: string;
        const rebuyQty125Percent = rebuyQty * 1.25;
        
        if (verifiedQty > rebuyQty125Percent) {
          newStatus = 'OK';
        } else if (verifiedQty < rebuyQty) {
          newStatus = 'Reorder';
          
          // Crear alarma de Reorder
          try {
            await client.models.Alarm.create({
              name: `Reorder ${item.itemName}`,
              description: `${verifiedQty} remaining on ${spotCheckLocation}`,
              section: 'Ops',
              function: 'Inventory',
              type: 'Reorder',
              status: 'Active',
            });
            alarmCount++;
          } catch (error) {
            console.error(`Error creating reorder alarm for ${item.itemName}:`, error);
          }
        } else {
          newStatus = 'Low stock';
        }
        
        // Actualizar item en inventario
        try {
          await client.models.InventoryItem2.update({
            id: item.id,
            itemName: item.itemName,
            qty: verifiedQty,
            rebuyQty: item.rebuyQty,
            location: item.location,
            status: newStatus,
            tolerance: item.tolerance || undefined,
            description: item.description || undefined,
            unitPrice: item.unitPrice || undefined,
            consumptionRuleId: item.consumptionRuleId || undefined,
          });
          updatedCount++;
        } catch (error) {
          console.error(`Error updating item ${item.itemName}:`, error);
        }
        
        // Crear alarma de inconsistencia si aplica
        const minThreshold = expectedQty - tolerance;
        if (verifiedQty < minThreshold) {
          const missingQty = expectedQty - verifiedQty;
          try {
            await client.models.Alarm.create({
              name: 'Consistency error',
              description: `${item.itemName}, ${missingQty} missing`,
              section: 'Ops',
              function: 'Inventory',
              type: 'Consistency',
              status: 'Active',
            });
            alarmCount++;
          } catch (error) {
            console.error(`Error creating consistency alarm for ${item.itemName}:`, error);
          }
        }
      }
      
      // Crear registro de Spot Check
      try {
        const userEmail = await getUserEmail();
        await client.models.InventorySpotCheck.create({
          checkDate: new Date().toISOString(),
          location: spotCheckLocation,
          userId: userEmail,
        });
      } catch (error) {
        console.error('Error creating spot check record:', error);
      }
      
      // Recargar datos
      await fetchInventoryItems2();
      await fetchAlarms();
      
      // Mostrar mensaje de éxito
      alert(`Spot Check completado exitosamente.\n\nItems actualizados: ${updatedCount}\nAlarmas creadas: ${alarmCount}`);
      
      // Cerrar el wizard
      closeSpotCheckWizard();
      
    } catch (error) {
      console.error('Error finalizing spot check:', error);
      alert('Error al finalizar el Spot Check. Por favor intenta de nuevo.');
    }
  };
  
  // Función para calcular los consumos esperados
  const calculateSpotCheckConsumptions = async () => {
    if (!spotCheckApiResponse || !spotCheckLocation) {
      return;
    }
    
    setSpotCheckCalculating(true);
    setSpotCheckConsumptions({});
    
    try {
      // Cargar items de inventario y reglas si no están cargados
      if (inventoryItems2.length === 0) {
        await fetchInventoryItems2();
      }
      if (itemRules.length === 0) {
        await fetchItemRules();
      }
      if (consumptionRules.length === 0) {
        await fetchConsumptionRules();
      }
      
      // Filtrar items por ubicación
      const locationItems = inventoryItems2.filter(item => item.location === spotCheckLocation);
      
      // Obtener bookings del API response
      const bookings = spotCheckApiResponse.bookings || [];
      
      // Mapeo de RoomType del API a propertyType de ItemRule
      const mapRoomTypeToPropertyType = (roomType: string): string => {
        if (roomType === 'Entire home/apt') return 'Entire home';
        if (roomType === 'Private room') return 'Private room';
        if (roomType === 'Planta2') return 'Planta2';
        return roomType; // Fallback
      };
      
      // Función para parsear y calcular consumo según la regla
      const calculateConsumption = (ruleName: string, guests: number, nights: number): number => {
        if (!ruleName) return 0;
        
        const ruleLower = ruleName.toLowerCase();
        
        // "1 per stay" o "1 per booking"
        if (ruleLower.includes('per stay') || ruleLower.includes('per booking')) {
          const match = ruleLower.match(/(\d+)\s*per\s*(stay|booking)/);
          return match ? parseInt(match[1]) : 1;
        }
        
        // "1 per guest" o "X per guest"
        if (ruleLower.includes('per guest')) {
          const match = ruleLower.match(/(\d+)\s*per\s*guest/);
          const multiplier = match ? parseInt(match[1]) : 1;
          return multiplier * guests;
        }
        
        // "1 per night" o "X per night"
        if (ruleLower.includes('per night')) {
          const match = ruleLower.match(/(\d+)\s*per\s*night/);
          const multiplier = match ? parseInt(match[1]) : 1;
          return multiplier * nights;
        }
        
        // "1 per guest per night" o "X per guest per night"
        if (ruleLower.includes('per guest per night') || ruleLower.includes('per guest per nigth')) {
          const match = ruleLower.match(/(\d+)\s*per\s*guest\s*per\s*nig?ht/);
          const multiplier = match ? parseInt(match[1]) : 1;
          return multiplier * guests * nights;
        }
        
        // Si no coincide con ningún patrón, intentar extraer un número
        const numberMatch = ruleLower.match(/(\d+)/);
        return numberMatch ? parseInt(numberMatch[1]) : 0;
      };
      
      // Inicializar consumos por item
      const consumptions: {[itemName: string]: number} = {};
      locationItems.forEach(item => {
        consumptions[item.itemName] = 0;
      });
      
      // Procesar cada booking
      for (const booking of bookings) {
        const roomType = booking.RoomType || '';
        const propertyType = mapRoomTypeToPropertyType(roomType);
        const guests = booking.Guests || 0;
        const nights = booking.Nights || 0;
        
        // Para cada item de la ubicación
        for (const item of locationItems) {
          // Buscar la regla para este item y tipo de propiedad
          const itemRule = itemRules.find(
            r => r.itemName === item.itemName && r.propertyType === propertyType
          );
          
          if (itemRule && itemRule.consumptionRule) {
            const ruleName = itemRule.consumptionRule.name || '';
            const consumption = calculateConsumption(ruleName, guests, nights);
            consumptions[item.itemName] = (consumptions[item.itemName] || 0) + consumption;
          }
        }
      }
      
      setSpotCheckConsumptions(consumptions);
    } catch (error) {
      console.error('Error calculating consumptions:', error);
      alert('Error al calcular los consumos. Por favor intenta de nuevo.');
    } finally {
      setSpotCheckCalculating(false);
    }
  };
  
  // Función para retroceder al paso anterior
  const previousSpotCheckWizardStep = () => {
    if (spotCheckWizardStep > 1) {
      setSpotCheckWizardStep(spotCheckWizardStep - 1);
      if (spotCheckWizardStep === 3) {
        setSpotCheckApiResponse(null);
        setSpotCheckApiError(null);
      }
    }
  };
  
  // Función para cerrar el wizard
  const closeSpotCheckWizard = () => {
    setShowInventory2SpotCheckWizard(false);
    setSpotCheckWizardStep(1);
    setSpotCheckLocation('');
    setSpotCheckFromDate('');
    setSpotCheckToDate('');
    setSpotCheckApiResponse(null);
    setSpotCheckApiError(null);
    setSpotCheckCalculating(false);
    setSpotCheckConsumptions({});
    setSpotCheckVerifiedQuantities({});
  };

  const handleInventory2PurchaseClick = () => {
    setShowInventory2Purchase(true);
    setShowInventory2Table(false);
    setShowInventory2Rules(false);
    setShowInventory2SpotCheck(false);
    setShowInventory2ItemsRules(false);
    // Resetear formulario
    setPurchaseForm({
      itemName: '',
      quantity: 0,
      totalPrice: 0,
      unitPrice: 0,
      supplier: '',
      location: '',
      inventoryItemId: undefined,
      isNewItem: false,
    });
    setItemSearchQuery('');
    setShowItemSearch(false);
    setLocationCreateNew(false);
  };

  const handleItemSelect = (item: InventoryItem2) => {
    setPurchaseForm(prev => ({
      ...prev,
      itemName: item.itemName,
      location: item.location,
      inventoryItemId: item.id,
      isNewItem: false,
    }));
    setItemSearchQuery(item.itemName);
    setShowItemSearch(false);
    setLocationCreateNew(false); // Resetear modo "Create new" cuando se selecciona un item
  };

  const handleNewItemToggle = () => {
    setPurchaseForm(prev => ({
      ...prev,
      isNewItem: !prev.isNewItem,
      itemName: '',
      inventoryItemId: undefined,
      location: '', // Resetear ubicación cuando se cambia a item nuevo
    }));
    setItemSearchQuery('');
    setShowItemSearch(false);
    setLocationCreateNew(false); // Resetear modo "Create new"
  };

  const handleLocationChange = (value: string) => {
    if (value === '__CREATE_NEW__') {
      setLocationCreateNew(true);
      setPurchaseForm(prev => ({ ...prev, location: '' }));
    } else {
      setLocationCreateNew(false);
      setPurchaseForm(prev => ({ ...prev, location: value }));
    }
  };

  const registerPurchase = async () => {
    // Validaciones
    if (!purchaseForm.itemName || purchaseForm.quantity <= 0 || purchaseForm.totalPrice <= 0 || !purchaseForm.supplier || !purchaseForm.location) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      let finalInventoryItemId = purchaseForm.inventoryItemId;

      // Si es un item nuevo, crearlo primero para obtener su ID
      if (purchaseForm.isNewItem) {
        const { data: newItemData, errors: createErrors } = await client.models.InventoryItem2.create({
          itemName: purchaseForm.itemName,
          qty: purchaseForm.quantity,
          rebuyQty: 0, // Valor por defecto
          location: purchaseForm.location,
          status: 'OK',
          tolerance: 0,
          description: '',
          unitPrice: purchaseForm.unitPrice, // Guardar precio unitario
          consumptionRuleId: undefined,
        });

        if (createErrors) {
          console.error('Error creating inventory item:', createErrors);
          alert('Error al crear el item en el inventario. Por favor intenta de nuevo.');
          return;
        }

        if (newItemData && newItemData.id) {
          finalInventoryItemId = newItemData.id;
        }
      }

      // 1. Crear registro de compra con el inventoryItemId correcto
      const { errors: purchaseErrors } = await client.models.PurchaseRecord.create({
        itemName: purchaseForm.itemName,
        quantity: purchaseForm.quantity,
        totalPrice: purchaseForm.totalPrice,
        unitPrice: purchaseForm.unitPrice,
        supplier: purchaseForm.supplier,
        location: purchaseForm.location,
        inventoryItemId: finalInventoryItemId || undefined,
      });

      if (purchaseErrors) {
        console.error('Error creating purchase record:', purchaseErrors);
        alert('Error al registrar la compra. Por favor intenta de nuevo.');
        return;
      }

      // 2. Si es un item existente, actualizar su cantidad
      if (finalInventoryItemId && !purchaseForm.isNewItem) {
        const existingItem = inventoryItems2.find(item => item.id === finalInventoryItemId);
        if (existingItem) {
          const { errors: updateErrors } = await client.models.InventoryItem2.update({
            id: existingItem.id,
            qty: existingItem.qty + purchaseForm.quantity,
            itemName: existingItem.itemName,
            rebuyQty: existingItem.rebuyQty,
            location: purchaseForm.location, // Actualizar ubicación si cambió
            status: existingItem.status,
            tolerance: existingItem.tolerance,
            description: existingItem.description,
            unitPrice: purchaseForm.unitPrice, // Actualizar precio unitario
            consumptionRuleId: existingItem.consumptionRuleId || undefined,
          });

          if (updateErrors) {
            console.error('Error updating inventory item:', updateErrors);
            alert('Compra registrada, pero hubo un error al actualizar el inventario. Por favor actualiza manualmente.');
          }
        }
      }

      // 4. Actualizar listas
      await fetchInventoryItems2();

      // 5. Resetear formulario
      setPurchaseForm({
        itemName: '',
        quantity: 0,
        totalPrice: 0,
        unitPrice: 0,
        supplier: '',
        location: '',
        inventoryItemId: undefined,
        isNewItem: false,
      });
      setItemSearchQuery('');
      setShowItemSearch(false);
      setLocationCreateNew(false);

      alert('Compra registrada exitosamente!');
    } catch (error) {
      console.error('Error registering purchase:', error);
      alert('Error al registrar la compra. Por favor intenta de nuevo.');
    }
  };

  const fetchPurchaseHistory = async (inventoryItemId: string) => {
    setLoadingPurchaseHistory(true);
    try {
      const { data, errors } = await client.models.PurchaseRecord.list({
        filter: {
          inventoryItemId: { eq: inventoryItemId }
        }
      });
      
      if (errors) {
        console.error('Error fetching purchase history:', errors);
        setPurchaseRecords([]);
      } else {
        // Ordenar por fecha más reciente primero
        const sorted = (data || []).sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setPurchaseRecords(sorted as PurchaseRecord[]);
      }
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      setPurchaseRecords([]);
    } finally {
      setLoadingPurchaseHistory(false);
    }
  };

  const togglePurchaseHistory = async (itemId: string) => {
    if (expandedItemId === itemId) {
      setExpandedItemId(null);
      setPurchaseRecords([]);
    } else {
      setExpandedItemId(itemId);
      await fetchPurchaseHistory(itemId);
    }
  };

  const getCurrentSection = () => sections.find(s => s.id === currentSection);
  const getCurrentFeature = () => {
    const section = getCurrentSection();
    return section?.features.find(f => f.id === currentFeature);
  };


  const handleFeatureChange = (featureId: string) => {
    setCurrentFeature(featureId);
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

  // Funciones CRUD para Inventory 2
  const fetchInventoryItems2 = async () => {
    setLoadingInventory2(true);
    try {
      const { data, errors } = await client.models.InventoryItem2.list();
      if (errors) {
        console.error('Error fetching inventory items 2:', errors);
        setInventoryItems2([]);
      } else {
        // Mapear los datos y cargar las relaciones de consumo
        const itemsWithRules = await Promise.all(
          (data || []).map(async (item) => {
            let consumptionRule: ConsumptionRule | undefined;
            if (item.consumptionRuleId) {
              try {
                const ruleData = await item.consumptionRule();
                if (ruleData?.data) {
                  consumptionRule = {
                    id: ruleData.data.id,
                    name: ruleData.data.name,
                    description: ruleData.data.description || undefined,
                    formula: ruleData.data.formula || undefined,
                    createdAt: ruleData.data.createdAt,
                    updatedAt: ruleData.data.updatedAt,
                  };
                }
              } catch (error) {
                console.error('Error loading consumption rule:', error);
              }
            }
            return {
              id: item.id,
              itemName: item.itemName,
              qty: item.qty,
              rebuyQty: item.rebuyQty,
              location: item.location,
              status: item.status || undefined,
              tolerance: item.tolerance || undefined,
              description: item.description || undefined,
              unitPrice: item.unitPrice || undefined,
              consumptionRuleId: item.consumptionRuleId || undefined,
              consumptionRule,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            } as InventoryItem2;
          })
        );
        setInventoryItems2(itemsWithRules);
      }
    } catch (error) {
      console.error('Error fetching inventory items 2:', error);
      setInventoryItems2([]);
    } finally {
      setLoadingInventory2(false);
    }
  };

  const fetchConsumptionRules = async () => {
    try {
      const { data, errors } = await client.models.ConsumptionRule.list();
      if (errors) {
        console.error('Error fetching consumption rules:', errors);
        setConsumptionRules([]);
      } else {
        setConsumptionRules(data as ConsumptionRule[]);
      }
    } catch (error) {
      console.error('Error fetching consumption rules:', error);
      setConsumptionRules([]);
    }
  };

  const createInventoryItem2 = async () => {
    if (!newItemForm.itemName || !newItemForm.location) {
      alert('Por favor completa los campos requeridos: Nombre del Item y Ubicación');
      return;
    }

    try {
      const { errors } = await client.models.InventoryItem2.create({
        itemName: newItemForm.itemName!,
        qty: newItemForm.qty || 0,
        rebuyQty: newItemForm.rebuyQty || 0,
        location: newItemForm.location!,
        status: newItemForm.status || 'OK',
        tolerance: newItemForm.tolerance || 0,
        description: newItemForm.description || '',
        unitPrice: newItemForm.unitPrice || undefined,
        consumptionRuleId: newItemForm.consumptionRuleId || undefined,
      });

      if (errors) {
        console.error('Error creating inventory item:', errors);
        alert('Error al crear el item. Por favor intenta de nuevo.');
      } else {
        await fetchInventoryItems2();
        setIsAddingNewItem(false);
        setNewItemForm({
          itemName: '',
          qty: 0,
          rebuyQty: 0,
          location: '',
          status: 'OK',
          tolerance: 0,
          description: '',
          unitPrice: undefined,
          consumptionRuleId: undefined,
        });
      }
    } catch (error) {
      console.error('Error creating inventory item:', error);
      alert('Error al crear el item. Por favor intenta de nuevo.');
    }
  };

  const updateInventoryItem2 = async (item: InventoryItem2) => {
    try {
      const { errors } = await client.models.InventoryItem2.update({
        id: item.id,
        itemName: item.itemName,
        qty: item.qty,
        rebuyQty: item.rebuyQty,
        location: item.location,
        status: item.status,
        tolerance: item.tolerance,
        description: item.description,
        unitPrice: item.unitPrice || undefined,
        consumptionRuleId: item.consumptionRuleId || undefined,
      });

      if (errors) {
        console.error('Error updating inventory item:', errors);
        alert('Error al actualizar el item. Por favor intenta de nuevo.');
      } else {
        setEditingItemId(null);
        await fetchInventoryItems2();
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      alert('Error al actualizar el item. Por favor intenta de nuevo.');
    }
  };

  const deleteInventoryItem2 = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este item?')) {
      return;
    }

    try {
      const { errors } = await client.models.InventoryItem2.delete({ id });

      if (errors) {
        console.error('Error deleting inventory item:', errors);
        alert('Error al eliminar el item. Por favor intenta de nuevo.');
      } else {
        await fetchInventoryItems2();
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      alert('Error al eliminar el item. Por favor intenta de nuevo.');
    }
  };

  // Funciones CRUD para Reglas de Consumo
  const createConsumptionRule = async () => {
    if (!newRuleForm.name) {
      alert('Por favor ingresa el nombre de la regla');
      return;
    }

    try {
      const { errors } = await client.models.ConsumptionRule.create({
        name: newRuleForm.name!,
        description: newRuleForm.description || undefined,
        formula: newRuleForm.formula || undefined,
      });

      if (errors) {
        console.error('Error creating consumption rule:', errors);
        alert('Error al crear la regla. Por favor intenta de nuevo.');
      } else {
        await fetchConsumptionRules();
        setIsAddingNewRule(false);
        setNewRuleForm({
          name: '',
          description: '',
          formula: '',
        });
      }
    } catch (error) {
      console.error('Error creating consumption rule:', error);
      alert('Error al crear la regla. Por favor intenta de nuevo.');
    }
  };

  const updateConsumptionRule = async (rule: ConsumptionRule) => {
    try {
      const { errors } = await client.models.ConsumptionRule.update({
        id: rule.id,
        name: rule.name,
        description: rule.description || undefined,
        formula: rule.formula || undefined,
      });

      if (errors) {
        console.error('Error updating consumption rule:', errors);
        alert('Error al actualizar la regla. Por favor intenta de nuevo.');
      } else {
        setEditingRuleId(null);
        await fetchConsumptionRules();
        // También actualizar los items que usan esta regla
        await fetchInventoryItems2();
      }
    } catch (error) {
      console.error('Error updating consumption rule:', error);
      alert('Error al actualizar la regla. Por favor intenta de nuevo.');
    }
  };

  const deleteConsumptionRule = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta regla? Los items que la usan quedarán sin regla asignada.')) {
      return;
    }

    try {
      const { errors } = await client.models.ConsumptionRule.delete({ id });

      if (errors) {
        console.error('Error deleting consumption rule:', errors);
        alert('Error al eliminar la regla. Por favor intenta de nuevo.');
      } else {
        await fetchConsumptionRules();
        // Actualizar items para reflejar que ya no tienen regla
        await fetchInventoryItems2();
      }
    } catch (error) {
      console.error('Error deleting consumption rule:', error);
      alert('Error al eliminar la regla. Por favor intenta de nuevo.');
    }
  };

  // Funciones CRUD para Spot Checks
  const fetchSpotChecks = async () => {
    setLoadingSpotChecks(true);
    try {
      const { data, errors } = await client.models.InventorySpotCheck.list();
      
      if (errors) {
        console.error('Error fetching spot checks:', errors);
        setSpotChecks([]);
      } else {
        // Ordenar por fecha más reciente primero
        const sorted = (data || []).sort((a, b) => {
          const dateA = a.checkDate ? new Date(a.checkDate).getTime() : 0;
          const dateB = b.checkDate ? new Date(b.checkDate).getTime() : 0;
          return dateB - dateA;
        });
        setSpotChecks(sorted as InventorySpotCheck[]);
      }
    } catch (error) {
      console.error('Error fetching spot checks:', error);
      setSpotChecks([]);
    } finally {
      setLoadingSpotChecks(false);
    }
  };

  // Función para crear automáticamente un nuevo Spot Check
  const createSpotCheck = async () => {
    try {
      // Obtener fecha actual en formato ISO
      const currentDate = new Date().toISOString();
      
      // Obtener email del usuario autenticado
      const userEmail = await getUserEmail();
      
      // Obtener ubicación (usar la primera disponible del inventario o un valor por defecto)
      const locations = getUniqueLocations();
      const location = locations.length > 0 ? locations[0] : 'Default';
      
      const { errors } = await client.models.InventorySpotCheck.create({
        checkDate: currentDate,
        location: location,
        userId: userEmail,
      });

      if (errors) {
        console.error('Error creating spot check:', errors);
        alert('Error al crear el spot check. Por favor intenta de nuevo.');
      } else {
        await fetchSpotChecks();
        alert('Spot Check registrado exitosamente.');
      }
    } catch (error) {
      console.error('Error creating spot check:', error);
      alert('Error al crear el spot check. Por favor intenta de nuevo.');
    }
  };

  const updateSpotCheck = async (spotCheck: InventorySpotCheck) => {
    try {
      const { errors } = await client.models.InventorySpotCheck.update({
        id: spotCheck.id,
        checkDate: spotCheck.checkDate,
        location: spotCheck.location,
        userId: spotCheck.userId,
      });

      if (errors) {
        console.error('Error updating spot check:', errors);
        alert('Error al actualizar el spot check. Por favor intenta de nuevo.');
      } else {
        setEditingSpotCheckId(null);
        await fetchSpotChecks();
      }
    } catch (error) {
      console.error('Error updating spot check:', error);
      alert('Error al actualizar el spot check. Por favor intenta de nuevo.');
    }
  };

  const deleteSpotCheck = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este spot check?')) {
      return;
    }

    try {
      const { errors } = await client.models.InventorySpotCheck.delete({ id });

      if (errors) {
        console.error('Error deleting spot check:', errors);
        alert('Error al eliminar el spot check. Por favor intenta de nuevo.');
      } else {
        await fetchSpotChecks();
      }
    } catch (error) {
      console.error('Error deleting spot check:', error);
      alert('Error al eliminar el spot check. Por favor intenta de nuevo.');
    }
  };

  // Funciones CRUD para Items Rules
  const fetchItemRules = async () => {
    setLoadingItemRules(true);
    try {
      const { data, errors } = await client.models.ItemRule.list();
      
      if (errors) {
        console.error('Error fetching item rules:', errors);
        setItemRules([]);
      } else {
        // Cargar las reglas de consumo para cada ItemRule
        const rulesWithDetails = await Promise.all(
          (data || []).map(async (rule) => {
            let consumptionRule: ConsumptionRule | undefined;
            if (rule.consumptionRuleId) {
              try {
                const ruleData = await rule.consumptionRule();
                if (ruleData?.data) {
                  consumptionRule = {
                    id: ruleData.data.id,
                    name: ruleData.data.name,
                    description: ruleData.data.description || undefined,
                    formula: ruleData.data.formula || undefined,
                    createdAt: ruleData.data.createdAt,
                    updatedAt: ruleData.data.updatedAt,
                  };
                }
              } catch (error) {
                console.error('Error loading consumption rule:', error);
              }
            }
            return {
              id: rule.id,
              itemName: rule.itemName,
              propertyType: rule.propertyType,
              consumptionRuleId: rule.consumptionRuleId,
              consumptionRule,
              inventoryItemId: rule.inventoryItemId || undefined,
              createdAt: rule.createdAt,
              updatedAt: rule.updatedAt,
            } as ItemRule;
          })
        );
        setItemRules(rulesWithDetails);
      }
    } catch (error) {
      console.error('Error fetching item rules:', error);
      setItemRules([]);
    } finally {
      setLoadingItemRules(false);
    }
  };

  const saveItemRule = async (itemName: string, propertyType: string, consumptionRuleId: string) => {
    if (!consumptionRuleId || consumptionRuleId.trim() === '') {
      console.error('consumptionRuleId is required');
      alert('Por favor selecciona una regla válida.');
      return;
    }

    try {
      // Verificar si ya existe una regla para este item y tipo de propiedad
      const existingRule = itemRules.find(
        r => r.itemName === itemName && r.propertyType === propertyType
      );

      if (existingRule) {
        // Actualizar regla existente
        const { errors } = await client.models.ItemRule.update({
          id: existingRule.id,
          itemName: existingRule.itemName,
          propertyType: existingRule.propertyType,
          consumptionRuleId: consumptionRuleId,
          inventoryItemId: existingRule.inventoryItemId || undefined,
        });

        if (errors) {
          console.error('Error updating item rule:', errors);
          console.error('Error details:', JSON.stringify(errors, null, 2));
          alert(`Error al actualizar la regla: ${errors.map(e => e.message || e.errorType).join(', ')}`);
        } else {
          await fetchItemRules();
        }
      } else {
        // Crear nueva regla
        // Buscar el inventoryItemId si existe
        const inventoryItem = inventoryItems2.find(item => item.itemName === itemName);
        
        const { errors } = await client.models.ItemRule.create({
          itemName: itemName,
          propertyType: propertyType,
          consumptionRuleId: consumptionRuleId,
          inventoryItemId: inventoryItem?.id || undefined,
        });

        if (errors) {
          console.error('Error creating item rule:', errors);
          console.error('Error details:', JSON.stringify(errors, null, 2));
          alert(`Error al crear la regla: ${errors.map(e => e.message || e.errorType).join(', ')}`);
        } else {
          await fetchItemRules();
        }
      }
    } catch (error) {
      console.error('Error saving item rule:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al guardar la regla: ${errorMessage}`);
    }
  };

  const deleteItemRule = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta regla?')) {
      return;
    }

    try {
      const { errors } = await client.models.ItemRule.delete({ id });

      if (errors) {
        console.error('Error deleting item rule:', errors);
        alert('Error al eliminar la regla. Por favor intenta de nuevo.');
      } else {
        await fetchItemRules();
      }
    } catch (error) {
      console.error('Error deleting item rule:', error);
      alert('Error al eliminar la regla. Por favor intenta de nuevo.');
    }
  };

  const toggleItemRuleExpansion = (itemName: string) => {
    if (expandedItemRuleId === itemName) {
      setExpandedItemRuleId(null);
    } else {
      setExpandedItemRuleId(itemName);
    }
  };

  const getItemRuleForProperty = (itemName: string, propertyType: string): ItemRule | undefined => {
    return itemRules.find(r => r.itemName === itemName && r.propertyType === propertyType);
  };

  // Funciones CRUD para Properties
  const fetchProperties = async () => {
    setLoadingProperties(true);
    try {
      const { data, errors } = await client.models.Property.list();
      
      if (errors) {
        console.error('Error fetching properties:', errors);
        setProperties([]);
      } else {
        setProperties((data || []) as Property[]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const createProperty = async () => {
    if (!newPropertyForm.propertyName || !newPropertyForm.propertyType || !newPropertyForm.guestCapacity) {
      alert('Por favor completa todos los campos requeridos: Nombre, Tipo y Capacidad de huéspedes');
      return;
    }

    try {
      const { errors } = await client.models.Property.create({
        propertyName: newPropertyForm.propertyName!,
        propertyType: newPropertyForm.propertyType!,
        guestCapacity: newPropertyForm.guestCapacity!,
        apiReference: newPropertyForm.apiReference || undefined,
      });

      if (errors) {
        console.error('Error creating property:', errors);
        alert('Error al crear la propiedad. Por favor intenta de nuevo.');
      } else {
        await fetchProperties();
        setIsAddingNewProperty(false);
        setNewPropertyForm({
          propertyName: '',
          propertyType: 'Entire home',
          guestCapacity: 0,
          apiReference: '',
        });
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Error al crear la propiedad. Por favor intenta de nuevo.');
    }
  };

  const updateProperty = async (property: Property) => {
    try {
      const { errors } = await client.models.Property.update({
        id: property.id,
        propertyName: property.propertyName,
        propertyType: property.propertyType,
        guestCapacity: property.guestCapacity,
        apiReference: property.apiReference || undefined,
      });

      if (errors) {
        console.error('Error updating property:', errors);
        alert('Error al actualizar la propiedad. Por favor intenta de nuevo.');
      } else {
        setEditingPropertyId(null);
        await fetchProperties();
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error al actualizar la propiedad. Por favor intenta de nuevo.');
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      return;
    }

    try {
      const { errors } = await client.models.Property.delete({ id });

      if (errors) {
        console.error('Error deleting property:', errors);
        alert('Error al eliminar la propiedad. Por favor intenta de nuevo.');
      } else {
        await fetchProperties();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error al eliminar la propiedad. Por favor intenta de nuevo.');
    }
  };

  // Funciones CRUD para Alarms
  const fetchAlarms = async () => {
    setLoadingAlarmsOps(true);
    try {
      const { data, errors } = await client.models.Alarm.list();
      
      if (errors) {
        console.error('Error fetching alarms:', errors);
        setAlarmsOps([]);
      } else {
        // Filtrar solo alarmas de la sección Ops
        const opsAlarms = (data || []).filter(alarm => alarm.section === 'Ops') as Alarm[];
        setAlarmsOps(opsAlarms);
      }
    } catch (error) {
      console.error('Error fetching alarms:', error);
      setAlarmsOps([]);
    } finally {
      setLoadingAlarmsOps(false);
    }
  };

  const createAlarm = async () => {
    if (!newAlarmForm.name || !newAlarmForm.section || !newAlarmForm.function || !newAlarmForm.type) {
      alert('Por favor completa todos los campos requeridos: Nombre, Sección, Función y Tipo');
      return;
    }

    try {
      const { errors } = await client.models.Alarm.create({
        name: newAlarmForm.name!,
        description: newAlarmForm.description || undefined,
        section: newAlarmForm.section!,
        function: newAlarmForm.function!,
        type: newAlarmForm.type!,
        status: newAlarmForm.status || 'Pending',
        date: newAlarmForm.date ? new Date(newAlarmForm.date).toISOString() : new Date().toISOString(),
        log: undefined,
      });

      if (errors) {
        console.error('Error creating alarm:', errors);
        alert('Error al crear la alarma. Por favor intenta de nuevo.');
      } else {
        await fetchAlarms();
        setIsAddingNewAlarm(false);
        setNewAlarmForm({
          name: '',
          description: '',
          section: 'Ops',
          function: 'Inventory',
          type: '',
          status: 'Pending',
        });
      }
    } catch (error) {
      console.error('Error creating alarm:', error);
      alert('Error al crear la alarma. Por favor intenta de nuevo.');
    }
  };


  // Función para marcar alarma como Check (Completed)
  const checkAlarm = async (alarm: Alarm) => {
    try {
      const userEmail = await getUserEmail();
      const currentDate = new Date().toISOString();
      const logEntry = `${userEmail}: ${currentDate}`;
      const existingLog = alarm.log ? `${alarm.log}\n${logEntry}` : logEntry;
      
      const { errors } = await client.models.Alarm.update({
        id: alarm.id,
        name: alarm.name,
        description: alarm.description || undefined,
        section: alarm.section,
        function: alarm.function,
        type: alarm.type,
        status: 'Completed',
        date: alarm.date || undefined,
        log: existingLog,
      });

      if (errors) {
        console.error('Error checking alarm:', errors);
        alert('Error al marcar la alarma como completada. Por favor intenta de nuevo.');
      } else {
        await fetchAlarms();
      }
    } catch (error) {
      console.error('Error checking alarm:', error);
      alert('Error al marcar la alarma como completada. Por favor intenta de nuevo.');
    }
  };
  
  // Función para marcar alarma como Snooze
  const snoozeAlarm = async (alarm: Alarm) => {
    try {
      const userEmail = await getUserEmail();
      const currentDate = new Date().toISOString();
      const logEntry = `${userEmail}: ${currentDate}`;
      const existingLog = alarm.log ? `${alarm.log}\n${logEntry}` : logEntry;
      
      const { errors } = await client.models.Alarm.update({
        id: alarm.id,
        name: alarm.name,
        description: alarm.description || undefined,
        section: alarm.section,
        function: alarm.function,
        type: alarm.type,
        status: 'Snoozed',
        date: alarm.date || undefined,
        log: existingLog,
      });

      if (errors) {
        console.error('Error snoozing alarm:', errors);
        alert('Error al poner la alarma en snooze. Por favor intenta de nuevo.');
      } else {
        await fetchAlarms();
      }
    } catch (error) {
      console.error('Error snoozing alarm:', error);
      alert('Error al poner la alarma en snooze. Por favor intenta de nuevo.');
    }
  };

  // Funciones para Incident Tracker
  // Función para parsear menciones del texto
  const parseMentions = (text: string) => {
    const userMentions = Array.from(new Set((text.match(/@(\w+)/g) || []).map(m => m.substring(1))));
    const propertyMentions = Array.from(new Set((text.match(/#(\w+)/g) || []).map(m => m.substring(1))));
    return { userMentions, propertyMentions };
  };

  // Función para renderizar texto con menciones destacadas (solo negrita en tabla)
  const renderTextWithMentions = (text: string, useBold: boolean = false) => {
    let result = text;
    if (useBold) {
      // Resaltar menciones de usuarios con negrita
      result = result.replace(/@(\w+)/g, '<strong>@$1</strong>');
      // Resaltar menciones de propiedades con negrita
      result = result.replace(/#(\w+)/g, '<strong>#$1</strong>');
    } else {
      // Resaltar menciones de usuarios con badge (para vista de detalle)
      result = result.replace(/@(\w+)/g, '<span class="badge bg-primary me-1">@$1</span>');
      // Resaltar menciones de propiedades con badge (para vista de detalle)
      result = result.replace(/#(\w+)/g, '<span class="badge bg-info me-1">#$1</span>');
    }
    return result;
  };

  // Funciones CRUD para Incidents
  const fetchIncidents = async () => {
    setLoadingIncidents(true);
    try {
      const { data, errors } = await client.models.Incident.list();
      
      if (errors) {
        console.error('Error fetching incidents:', errors);
        setIncidents([]);
      } else {
        setIncidents((data || []) as Incident[]);
      }
      
      // También cargar todos los comentarios para contar
      const { data: commentsData, errors: commentsErrors } = await client.models.IncidentComment.list();
      if (!commentsErrors && commentsData) {
        setAllIncidentComments((commentsData || []) as IncidentComment[]);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setIncidents([]);
    } finally {
      setLoadingIncidents(false);
    }
  };
  
  const getCommentCount = (incidentId: string) => {
    return allIncidentComments.filter(comment => comment.incidentId === incidentId).length;
  };

  const fetchIncidentComments = async (incidentId: string) => {
    try {
      const { data, errors } = await client.models.IncidentComment.list();
      
      if (errors) {
        console.error('Error fetching comments:', errors);
        return [];
      } else {
        return ((data || []) as IncidentComment[]).filter(comment => comment.incidentId === incidentId);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const createIncident = async () => {
    if (!newIncidentForm.reportedBy || !newIncidentForm.reportDate || !newIncidentForm.affectedArea || !newIncidentForm.description) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      const { userMentions, propertyMentions } = parseMentions(newIncidentForm.description);
      
      const { errors } = await client.models.Incident.create({
        reportedBy: newIncidentForm.reportedBy,
        reportDate: new Date(newIncidentForm.reportDate).toISOString(),
        affectedArea: newIncidentForm.affectedArea,
        description: newIncidentForm.description,
        mentionedUsers: userMentions.length > 0 ? userMentions : undefined,
        mentionedProperties: propertyMentions.length > 0 ? propertyMentions : undefined,
        priority: newIncidentForm.priority || undefined,
      });

      if (errors) {
        console.error('Error creating incident:', errors);
        alert('Error al crear la incidencia. Por favor intenta de nuevo.');
      } else {
        await fetchIncidents();
        setShowIncidentForm(false);
        setNewIncidentForm({
          reportedBy: '',
          reportDate: new Date().toISOString().split('T')[0],
          affectedArea: '',
          description: '',
          priority: 'Medium',
        });
      }
    } catch (error) {
      console.error('Error creating incident:', error);
      alert('Error al crear la incidencia. Por favor intenta de nuevo.');
    }
  };

  const deleteIncident = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta incidencia?')) {
      return;
    }

    try {
      // Primero eliminar todos los comentarios asociados
      const comments = await fetchIncidentComments(id);
      for (const comment of comments) {
        await client.models.IncidentComment.delete({ id: comment.id });
      }

      // Luego eliminar la incidencia
      const { errors } = await client.models.Incident.delete({ id });

      if (errors) {
        console.error('Error deleting incident:', errors);
        alert('Error al eliminar la incidencia. Por favor intenta de nuevo.');
      } else {
        await fetchIncidents();
        if (selectedIncident?.id === id) {
          setShowIncidentDetail(false);
          setSelectedIncident(null);
        }
      }
    } catch (error) {
      console.error('Error deleting incident:', error);
      alert('Error al eliminar la incidencia. Por favor intenta de nuevo.');
    }
  };

  const addComment = async (incidentId: string) => {
    if (!newCommentForm.comment.trim()) {
      alert('Por favor ingresa un comentario.');
      return;
    }

    try {
      const userEmail = await getUserEmail();
      const { userMentions, propertyMentions } = parseMentions(newCommentForm.comment);
      
      const { errors } = await client.models.IncidentComment.create({
        incidentId: incidentId,
        comment: newCommentForm.comment,
        commentedBy: userEmail,
        commentedAt: new Date().toISOString(),
        mentionedUsers: userMentions.length > 0 ? userMentions : undefined,
        mentionedProperties: propertyMentions.length > 0 ? propertyMentions : undefined,
      });

      if (errors) {
        console.error('Error adding comment:', errors);
        alert('Error al agregar el comentario. Por favor intenta de nuevo.');
      } else {
        const updatedComments = await fetchIncidentComments(incidentId);
        setIncidentComments(updatedComments);
        setNewCommentForm({ comment: '' });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error al agregar el comentario. Por favor intenta de nuevo.');
    }
  };

  const viewIncidentDetail = async (incident: Incident) => {
    setSelectedIncident(incident);
    setShowIncidentDetail(true);
    const comments = await fetchIncidentComments(incident.id);
    setIncidentComments(comments);
  };

  // Función de filtrado de incidencias
  const getFilteredIncidents = () => {
    return incidents.filter(incident => {
      if (incidentFilters.affectedArea && incident.affectedArea !== incidentFilters.affectedArea) return false;
      if (incidentFilters.mentionedUser && !incident.mentionedUsers?.includes(incidentFilters.mentionedUser)) return false;
      if (incidentFilters.mentionedProperty && !incident.mentionedProperties?.includes(incidentFilters.mentionedProperty)) return false;
      if (incidentFilters.priority && incident.priority !== incidentFilters.priority) return false;
      if (incidentFilters.dateFrom && new Date(incident.reportDate) < new Date(incidentFilters.dateFrom)) return false;
      if (incidentFilters.dateTo && new Date(incident.reportDate) > new Date(incidentFilters.dateTo + 'T23:59:59')) return false;
      if (incidentFilters.searchText) {
        const searchLower = incidentFilters.searchText.toLowerCase();
        const matchesDescription = incident.description.toLowerCase().includes(searchLower);
        const matchesArea = incident.affectedArea.toLowerCase().includes(searchLower);
        const matchesReporter = incident.reportedBy.toLowerCase().includes(searchLower);
        if (!matchesDescription && !matchesArea && !matchesReporter) return false;
      }
      return true;
    });
  };

  // Funciones para estadísticas
  const getIncidentsByArea = () => {
    const areaCounts: { [key: string]: number } = {};
    getFilteredIncidents().forEach(incident => {
      areaCounts[incident.affectedArea] = (areaCounts[incident.affectedArea] || 0) + 1;
    });
    return Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);
  };

  const getIncidentsByReporter = () => {
    const reporterCounts: { [key: string]: number } = {};
    getFilteredIncidents().forEach(incident => {
      reporterCounts[incident.reportedBy] = (reporterCounts[incident.reportedBy] || 0) + 1;
    });
    return Object.entries(reporterCounts).sort((a, b) => b[1] - a[1]);
  };

  const getMostMentionedProperties = () => {
    const propertyCounts: { [key: string]: number } = {};
    getFilteredIncidents().forEach(incident => {
      incident.mentionedProperties?.forEach(prop => {
        propertyCounts[prop] = (propertyCounts[prop] || 0) + 1;
      });
    });
    return Object.entries(propertyCounts).sort((a, b) => b[1] - a[1]);
  };

  const getMostMentionedUsers = () => {
    const userCounts: { [key: string]: number } = {};
    getFilteredIncidents().forEach(incident => {
      incident.mentionedUsers?.forEach(user => {
        userCounts[user] = (userCounts[user] || 0) + 1;
      });
    });
    return Object.entries(userCounts).sort((a, b) => b[1] - a[1]);
  };

  const getUniqueAreas = () => {
    return Array.from(new Set(incidents.map(i => i.affectedArea))).sort();
  };

  const getUniqueMentionedUsers = () => {
    const users = new Set<string>();
    incidents.forEach(incident => {
      incident.mentionedUsers?.forEach(user => users.add(user));
    });
    return Array.from(users).sort();
  };

  const getUniqueMentionedProperties = () => {
    const properties = new Set<string>();
    incidents.forEach(incident => {
      incident.mentionedProperties?.forEach(prop => properties.add(prop));
    });
    return Array.from(properties).sort();
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
            {userEmail}
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
                {null}
                
                {currentFeature === 'inventory-2' && !showInventory2Table && !showInventory2Rules && !showInventory2Purchase && !showInventory2SpotCheck && !showInventory2ItemsRules && !showInventory2SpotCheckWizard ? (
                  <>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleInventory2TableClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-table me-2"></i>Table</h5>
                            <p className="mb-2 small">Gestiona los items de inventario. Agrega, edita y elimina items directamente en la tabla.</p>
                            <div className="mt-auto">
                              <h6 className="small">Total items: {inventoryItems2.length}</h6>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">Ver tabla →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleInventory2ItemsRulesClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-list-check me-2"></i>Items Rules</h5>
                            <p className="mb-2 small">Gestiona las reglas de consumo por tipo de propiedad para cada item de inventario.</p>
                            <div className="mt-auto">
                              <h6 className="small">Configura reglas por propiedad</h6>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">Gestionar reglas →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleInventory2PurchaseClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-cart-plus me-2"></i>Registro de Compra</h5>
                            <p className="mb-2 small">Registra nuevas compras de items. Actualiza automáticamente el inventario y crea un historial.</p>
                            <div className="mt-auto">
                              <p className="mb-0 small text-muted">Registra compras de items</p>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">Registrar compra →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Nueva fila para Spot Check History y Spot Check Wizard */}
                    <div className="row mt-4">
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleInventory2SpotCheckClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-clipboard-check me-2"></i>Spot Check History</h5>
                            <p className="mb-2 small">Gestiona el historial de spot checks de inventario. Registra y visualiza los controles realizados.</p>
                            <div className="mt-auto">
                              <h6 className="small">Total spot checks: {spotChecks.length}</h6>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">Ver historial →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleInventory2SpotCheckWizardClick}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-clipboard-data me-2"></i>Spot Check</h5>
                            <p className="mb-2 small">Realiza un nuevo spot check. Selecciona ubicación y fechas para analizar el consumo de inventario.</p>
                            <div className="mt-auto">
                              <p className="mb-0 small text-muted">Wizard de 5 pasos</p>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">Iniciar spot check →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : currentFeature === 'inventory-2' && showInventory2Table ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-table text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Table</h3>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <label htmlFor="locationFilter" className="form-label mb-0 small">Filtrar por ubicación:</label>
                          <select
                            id="locationFilter"
                            className="form-select form-select-sm"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            style={{ minWidth: '150px' }}
                          >
                            <option value="All">All</option>
                            {getUniqueLocations().sort().map((location) => (
                              <option key={location} value={location}>
                                {location}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={fetchInventoryItems2}
                          disabled={loadingInventory2}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loadingInventory2 ? 'Cargando...' : 'Actualizar'}
                        </button>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setIsAddingNewItem(true)}
                          disabled={isAddingNewItem}
                        >
                          <i className="bi-plus-circle me-1"></i>
                          Agregar Item
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => setShowInventory2Table(false)}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>

                    {loadingInventory2 ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando items de inventario...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start ps-3" style={{ width: '30px' }}></th>
                              <th className="text-start">Item</th>
                              <th className="text-start">Description</th>
                              <th className="text-start">Ubicación</th>
                              <th className="text-center">Cantidad</th>
                              <th className="text-center">Estado</th>
                              <th className="text-center">rebuyQty</th>
                              <th className="text-center">Tolerancia</th>
                              <th className="text-center">Precio unitario</th>
                              <th className="text-start" style={{ display: 'none' }}>Regla de Consumo</th>
                              <th className="text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Fila para agregar nuevo item */}
                            {isAddingNewItem && (
                              <tr className="table-info">
                                <td className="text-center"></td>
                                <td className="text-start ps-3">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Nombre del item"
                                    value={newItemForm.itemName || ''}
                                    onChange={(e) => setNewItemForm({ ...newItemForm, itemName: e.target.value })}
                                  />
                                </td>
                                <td className="text-start">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Descripción"
                                    value={newItemForm.description || ''}
                                    onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
                                  />
                                </td>
                                <td className="text-start">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Ubicación"
                                    value={newItemForm.location || ''}
                                    onChange={(e) => setNewItemForm({ ...newItemForm, location: e.target.value })}
                                  />
                                </td>
                                <td className="text-center">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm text-center"
                                    value={newItemForm.qty || 0}
                                    onChange={(e) => setNewItemForm({ ...newItemForm, qty: parseInt(e.target.value) || 0 })}
                                  />
                                </td>
                                <td className="text-center">
                                  <select
                                    className="form-select form-select-sm"
                                    value={newItemForm.status || 'OK'}
                                    onChange={(e) => setNewItemForm({ ...newItemForm, status: e.target.value })}
                                  >
                                    <option value="OK">OK</option>
                                    <option value="Low Stock">Low Stock</option>
                                    <option value="Reorder">Reorder</option>
                                  </select>
                                </td>
                                <td className="text-center">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm text-center"
                                    value={newItemForm.rebuyQty || 0}
                                    onChange={(e) => setNewItemForm({ ...newItemForm, rebuyQty: parseInt(e.target.value) || 0 })}
                                  />
                                </td>
                                <td className="text-center">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm text-center"
                                    value={newItemForm.tolerance || 0}
                                    onChange={(e) => setNewItemForm({ ...newItemForm, tolerance: parseInt(e.target.value) || 0 })}
                                  />
                                </td>
                                <td className="text-center">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm text-center"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={newItemForm.unitPrice || ''}
                                    onChange={(e) => setNewItemForm({ ...newItemForm, unitPrice: parseFloat(e.target.value) || 0 })}
                                  />
                                </td>
                                <td className="text-start" style={{ display: 'none' }}>
                                  <select
                                    className="form-select form-select-sm"
                                    value={newItemForm.consumptionRuleId || ''}
                                    onChange={(e) => setNewItemForm({ ...newItemForm, consumptionRuleId: e.target.value || undefined })}
                                  >
                                    <option value="">Sin regla</option>
                                    {consumptionRules.map((rule) => (
                                      <option key={rule.id} value={rule.id}>
                                        {rule.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="text-center">
                                  <div className="d-flex gap-1 justify-content-center">
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={createInventoryItem2}
                                      title="Guardar"
                                    >
                                      <i className="bi-check"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-secondary"
                                      onClick={() => {
                                        setIsAddingNewItem(false);
                                        setNewItemForm({
                                          itemName: '',
                                          qty: 0,
                                          rebuyQty: 0,
                                          location: '',
                                          status: 'OK',
                                          tolerance: 0,
                                          description: '',
                                          consumptionRuleId: undefined,
                                        });
                                      }}
                                      title="Cancelar"
                                    >
                                      <i className="bi-x"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}

                            {/* Filas de items existentes */}
                            {(() => {
                              // Filtrar y ordenar items
                              let filteredAndSortedItems = [...inventoryItems2];
                              
                              // Filtrar por ubicación
                              if (locationFilter !== 'All') {
                                filteredAndSortedItems = filteredAndSortedItems.filter(item => item.location === locationFilter);
                              }
                              
                              // Ordenar por nombre de A a Z
                              filteredAndSortedItems.sort((a, b) => {
                                const nameA = (a.itemName || '').toLowerCase();
                                const nameB = (b.itemName || '').toLowerCase();
                                return nameA.localeCompare(nameB);
                              });
                              
                              return filteredAndSortedItems.length > 0 ? (
                                filteredAndSortedItems.map((item) => (
                                <>
                                  <tr key={item.id}>
                                    {editingItemId === item.id ? (
                                    <>
                                      <td className="text-center"></td>
                                      <td className="text-start ps-3">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          value={item.itemName}
                                          onChange={(e) => {
                                            const updatedItems = inventoryItems2.map(i => 
                                              i.id === item.id ? { ...i, itemName: e.target.value } : i
                                            );
                                            setInventoryItems2(updatedItems);
                                          }}
                                        />
                                      </td>
                                      <td className="text-start">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          value={item.description || ''}
                                          onChange={(e) => {
                                            const updatedItems = inventoryItems2.map(i => 
                                              i.id === item.id ? { ...i, description: e.target.value } : i
                                            );
                                            setInventoryItems2(updatedItems);
                                          }}
                                        />
                                      </td>
                                      <td className="text-start">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          value={item.location}
                                          onChange={(e) => {
                                            const updatedItems = inventoryItems2.map(i => 
                                              i.id === item.id ? { ...i, location: e.target.value } : i
                                            );
                                            setInventoryItems2(updatedItems);
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <input
                                          type="number"
                                          className="form-control form-control-sm text-center"
                                          value={item.qty}
                                          onChange={(e) => {
                                            const updatedItems = inventoryItems2.map(i => 
                                              i.id === item.id ? { ...i, qty: parseInt(e.target.value) || 0 } : i
                                            );
                                            setInventoryItems2(updatedItems);
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <select
                                          className="form-select form-select-sm"
                                          value={item.status || 'OK'}
                                          onChange={(e) => {
                                            const updatedItems = inventoryItems2.map(i => 
                                              i.id === item.id ? { ...i, status: e.target.value } : i
                                            );
                                            setInventoryItems2(updatedItems);
                                          }}
                                        >
                                          <option value="OK">OK</option>
                                          <option value="Low Stock">Low Stock</option>
                                          <option value="Reorder">Reorder</option>
                                        </select>
                                      </td>
                                      <td className="text-center">
                                        <input
                                          type="number"
                                          className="form-control form-control-sm text-center"
                                          value={item.rebuyQty}
                                          onChange={(e) => {
                                            const updatedItems = inventoryItems2.map(i => 
                                              i.id === item.id ? { ...i, rebuyQty: parseInt(e.target.value) || 0 } : i
                                            );
                                            setInventoryItems2(updatedItems);
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <input
                                          type="number"
                                          className="form-control form-control-sm text-center"
                                          value={item.tolerance || 0}
                                          onChange={(e) => {
                                            const updatedItems = inventoryItems2.map(i => 
                                              i.id === item.id ? { ...i, tolerance: parseInt(e.target.value) || 0 } : i
                                            );
                                            setInventoryItems2(updatedItems);
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <input
                                          type="number"
                                          className="form-control form-control-sm text-center"
                                          step="0.01"
                                          value={item.unitPrice || ''}
                                          onChange={(e) => {
                                            const updatedItems = inventoryItems2.map(i => 
                                              i.id === item.id ? { ...i, unitPrice: parseFloat(e.target.value) || 0 } : i
                                            );
                                            setInventoryItems2(updatedItems);
                                          }}
                                        />
                                      </td>
                                      <td className="text-start" style={{ display: 'none' }}>
                                        <select
                                          className="form-select form-select-sm"
                                          value={item.consumptionRuleId || ''}
                                          onChange={(e) => {
                                            const updatedItems = inventoryItems2.map(i => 
                                              i.id === item.id ? { ...i, consumptionRuleId: e.target.value || undefined } : i
                                            );
                                            setInventoryItems2(updatedItems);
                                          }}
                                        >
                                          <option value="">Sin regla</option>
                                          {consumptionRules.map((rule) => (
                                            <option key={rule.id} value={rule.id}>
                                              {rule.name}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      <td className="text-center">
                                        <div className="d-flex gap-1 justify-content-center">
                                          <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => {
                                              const itemToUpdate = inventoryItems2.find(i => i.id === item.id);
                                              if (itemToUpdate) updateInventoryItem2(itemToUpdate);
                                            }}
                                            title="Guardar"
                                          >
                                            <i className="bi-check"></i>
                                          </button>
                                          <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                              setEditingItemId(null);
                                              fetchInventoryItems2(); // Recargar para cancelar cambios
                                            }}
                                            title="Cancelar"
                                          >
                                            <i className="bi-x"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="text-center">
                                        <button
                                          className="btn btn-sm btn-link p-0"
                                          onClick={() => togglePurchaseHistory(item.id)}
                                          title="Ver historial de compras"
                                        >
                                          <i className={`bi ${expandedItemId === item.id ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                                        </button>
                                      </td>
                                      <td className="text-start ps-3">
                                        <strong>{item.itemName}</strong>
                                      </td>
                                      <td className="text-start">{item.description || <span className="text-muted">-</span>}</td>
                                      <td className="text-start">{item.location}</td>
                                      <td className="text-center">{item.qty?.toLocaleString() || 0}</td>
                                      <td className="text-center">
                                        {item.status === 'OK' ? (
                                          <span className="badge" style={{ backgroundColor: 'rgba(39, 174, 96, 0.8)', color: 'white' }}>
                                            OK
                                          </span>
                                        ) : item.status === 'Low Stock' ? (
                                          <span className="badge" style={{ backgroundColor: 'rgba(243, 156, 18, 0.8)', color: 'white' }}>
                                            Low Stock
                                          </span>
                                        ) : (
                                          <span className="badge" style={{ backgroundColor: 'rgba(231, 76, 60, 0.8)', color: 'white' }}>
                                            Reorder
                                          </span>
                                        )}
                                      </td>
                                      <td className="text-center">{item.rebuyQty?.toLocaleString() || 0}</td>
                                      <td className="text-center">{item.tolerance?.toLocaleString() || 0}</td>
                                      <td className="text-center">
                                        {item.unitPrice ? `${item.unitPrice.toFixed(2)} €` : <span className="text-muted">-</span>}
                                      </td>
                                      <td className="text-start" style={{ display: 'none' }}>
                                        {item.consumptionRule?.name || (
                                          <span className="text-muted">Sin regla</span>
                                        )}
                                      </td>
                                      <td className="text-center">
                                        <div className="d-flex gap-1 justify-content-center">
                                          <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setEditingItemId(item.id)}
                                            title="Editar"
                                          >
                                            <i className="bi-pencil"></i>
                                          </button>
                                          <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteInventoryItem2(item.id)}
                                            title="Eliminar"
                                          >
                                            <i className="bi-trash"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                                {/* Fila expandible para historial de compras */}
                                {expandedItemId === item.id && (
                                  <tr>
                                    <td colSpan={11} className="p-0">
                                      <div className="p-3 bg-light">
                                        <h6 className="mb-3">
                                          <i className="bi-clock-history me-2"></i>
                                          Historial de Compras: {item.itemName}
                                        </h6>
                                        {loadingPurchaseHistory ? (
                                          <div className="text-center py-3">
                                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                              <span className="visually-hidden">Cargando...</span>
                                            </div>
                                          </div>
                                        ) : purchaseRecords.length > 0 ? (
                                          <div className="table-responsive">
                                            <table className="table table-sm table-bordered">
                                              <thead className="table-secondary">
                                                <tr>
                                                  <th className="text-start ps-3">Fecha</th>
                                                  <th className="text-center">Cantidad</th>
                                                  <th className="text-center">Precio Unitario (€)</th>
                                                  <th className="text-center">Precio Total (€)</th>
                                                  <th className="text-start">Proveedor</th>
                                                  <th className="text-start">Ubicación</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {purchaseRecords.map((record) => (
                                                  <tr key={record.id}>
                                                    <td className="text-start ps-3">
                                                      {record.createdAt ? (() => {
                                                        try {
                                                          const date = new Date(record.createdAt);
                                                          return date.toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                          });
                                                        } catch {
                                                          return record.createdAt;
                                                        }
                                                      })() : '-'}
                                                    </td>
                                                    <td className="text-center">{record.quantity}</td>
                                                    <td className="text-center">{record.unitPrice.toFixed(2)} €</td>
                                                    <td className="text-center">{record.totalPrice.toFixed(2)} €</td>
                                                    <td className="text-start">{record.supplier}</td>
                                                    <td className="text-start">{record.location}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        ) : (
                                          <div className="text-center text-muted py-3">
                                            <i className="bi-inbox fs-4 d-block mb-2"></i>
                                            <p className="mb-0">No hay registros de compra para este item</p>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                                </>
                              ))
                              ) : (
                                <tr>
                                  <td colSpan={11} className="text-center text-muted py-5">
                                    <i className="bi-inbox fs-1 d-block mb-3"></i>
                                    <h5>No hay items de inventario{locationFilter !== 'All' ? ` en ${locationFilter}` : ''}</h5>
                                    <p>Haz clic en "Agregar Item" para crear tu primer item de inventario.</p>
                                  </td>
                                </tr>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : currentFeature === 'inventory-2' && showInventory2Rules ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-gear text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Rules</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={fetchConsumptionRules}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          Actualizar
                        </button>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => setIsAddingNewRule(true)}
                          disabled={isAddingNewRule}
                        >
                          <i className="bi-plus-circle me-1"></i>
                          Nueva Regla
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => setShowInventory2Rules(false)}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th className="text-start ps-3">Nombre</th>
                            <th className="text-start">Descripción</th>
                            <th className="text-start">Fórmula</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Fila para agregar nueva regla */}
                          {isAddingNewRule && (
                            <tr className="table-info">
                              <td className="text-start ps-3">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Nombre de la regla"
                                  value={newRuleForm.name || ''}
                                  onChange={(e) => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                                />
                              </td>
                              <td className="text-start">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Descripción"
                                  value={newRuleForm.description || ''}
                                  onChange={(e) => setNewRuleForm({ ...newRuleForm, description: e.target.value })}
                                />
                              </td>
                              <td className="text-start">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Fórmula (opcional)"
                                  value={newRuleForm.formula || ''}
                                  onChange={(e) => setNewRuleForm({ ...newRuleForm, formula: e.target.value })}
                                />
                              </td>
                              <td className="text-center">
                                <div className="d-flex gap-1 justify-content-center">
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={createConsumptionRule}
                                    title="Guardar"
                                  >
                                    <i className="bi-check"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => {
                                      setIsAddingNewRule(false);
                                      setNewRuleForm({
                                        name: '',
                                        description: '',
                                        formula: '',
                                      });
                                    }}
                                    title="Cancelar"
                                  >
                                    <i className="bi-x"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}

                          {/* Filas de reglas existentes */}
                          {consumptionRules.length > 0 ? (
                            consumptionRules.map((rule) => (
                              <tr key={rule.id}>
                                {editingRuleId === rule.id ? (
                                  <>
                                    <td className="text-start ps-3">
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={rule.name}
                                        onChange={(e) => {
                                          const updatedRules = consumptionRules.map(r => 
                                            r.id === rule.id ? { ...r, name: e.target.value } : r
                                          );
                                          setConsumptionRules(updatedRules);
                                        }}
                                      />
                                    </td>
                                    <td className="text-start">
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={rule.description || ''}
                                        onChange={(e) => {
                                          const updatedRules = consumptionRules.map(r => 
                                            r.id === rule.id ? { ...r, description: e.target.value } : r
                                          );
                                          setConsumptionRules(updatedRules);
                                        }}
                                      />
                                    </td>
                                    <td className="text-start">
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={rule.formula || ''}
                                        onChange={(e) => {
                                          const updatedRules = consumptionRules.map(r => 
                                            r.id === rule.id ? { ...r, formula: e.target.value } : r
                                          );
                                          setConsumptionRules(updatedRules);
                                        }}
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="d-flex gap-1 justify-content-center">
                                        <button
                                          className="btn btn-sm btn-success"
                                          onClick={() => {
                                            const ruleToUpdate = consumptionRules.find(r => r.id === rule.id);
                                            if (ruleToUpdate) updateConsumptionRule(ruleToUpdate);
                                          }}
                                          title="Guardar"
                                        >
                                          <i className="bi-check"></i>
                                        </button>
                                        <button
                                          className="btn btn-sm btn-secondary"
                                          onClick={() => {
                                            setEditingRuleId(null);
                                            fetchConsumptionRules(); // Recargar para cancelar cambios
                                          }}
                                          title="Cancelar"
                                        >
                                          <i className="bi-x"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="text-start ps-3">
                                      <strong>{rule.name}</strong>
                                    </td>
                                    <td className="text-start">
                                      {rule.description || <span className="text-muted">-</span>}
                                    </td>
                                    <td className="text-start">
                                      {rule.formula || <span className="text-muted">-</span>}
                                    </td>
                                    <td className="text-center">
                                      <div className="d-flex gap-1 justify-content-center">
                                        <button
                                          className="btn btn-sm btn-outline-primary"
                                          onClick={() => setEditingRuleId(rule.id)}
                                          title="Editar"
                                        >
                                          <i className="bi-pencil"></i>
                                        </button>
                                        <button
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => deleteConsumptionRule(rule.id)}
                                          title="Eliminar"
                                        >
                                          <i className="bi-trash"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center text-muted py-5">
                                <i className="bi-gear fs-1 d-block mb-3"></i>
                                <h5>No hay reglas de consumo</h5>
                                <p>Haz clic en "Nueva Regla" para crear tu primera regla de consumo.</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : currentFeature === 'inventory-2' && showInventory2Purchase ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-cart-plus text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Registro de Compra</h3>
                      </div>
                      <button className="btn btn-outline-secondary" onClick={() => setShowInventory2Purchase(false)}>
                        <i className="bi-arrow-left me-1"></i>Back
                      </button>
                    </div>

                    <div className="card">
                      <div className="card-body">
                        <form onSubmit={(e) => { e.preventDefault(); registerPurchase(); }}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <div className="form-check mb-3">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="newItemCheck"
                                  checked={purchaseForm.isNewItem}
                                  onChange={handleNewItemToggle}
                                />
                                <label className="form-check-label" htmlFor="newItemCheck">
                                  Agregar item nuevo (no existe en el inventario)
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label htmlFor="itemName" className="form-label">
                                Nombre del Item <span className="text-danger">*</span>
                              </label>
                              {!purchaseForm.isNewItem ? (
                                <div className="position-relative">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="itemName"
                                    placeholder="Buscar item existente..."
                                    value={itemSearchQuery}
                                    onChange={(e) => {
                                      setItemSearchQuery(e.target.value);
                                      setShowItemSearch(true);
                                    }}
                                    onFocus={() => setShowItemSearch(true)}
                                    required
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary position-absolute"
                                    style={{ right: '5px', top: '5px', zIndex: 10 }}
                                    onClick={() => setShowItemSearch(!showItemSearch)}
                                    title="Buscar item"
                                  >
                                    <i className="bi-search"></i>
                                  </button>
                                  {showItemSearch && filteredItems.length > 0 && (
                                    <div 
                                      className="list-group position-absolute w-100"
                                      style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                                    >
                                      {filteredItems.map((item) => (
                                        <button
                                          key={item.id}
                                          type="button"
                                          className="list-group-item list-group-item-action"
                                          onClick={() => handleItemSelect(item)}
                                        >
                                          <div className="d-flex justify-content-between">
                                            <strong>{item.itemName}</strong>
                                            <small className="text-muted">{item.location}</small>
                                          </div>
                                          <small className="text-muted">Cantidad actual: {item.qty}</small>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  {showItemSearch && itemSearchQuery && filteredItems.length === 0 && (
                                    <div 
                                      className="list-group position-absolute w-100"
                                      style={{ zIndex: 1000 }}
                                    >
                                      <div className="list-group-item">
                                        <small className="text-muted">No se encontraron items</small>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  className="form-control"
                                  id="itemName"
                                  value={purchaseForm.itemName}
                                  onChange={(e) => setPurchaseForm(prev => ({ ...prev, itemName: e.target.value }))}
                                  required
                                />
                              )}
                            </div>

                            <div className="col-md-6">
                              <label htmlFor="location" className="form-label">
                                Ubicación <span className="text-danger">*</span>
                              </label>
                              {locationCreateNew ? (
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="location"
                                    placeholder="Escribe la nueva ubicación"
                                    value={purchaseForm.location}
                                    onChange={(e) => setPurchaseForm(prev => ({ ...prev, location: e.target.value }))}
                                    required
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                      setLocationCreateNew(false);
                                      setPurchaseForm(prev => ({ ...prev, location: '' }));
                                    }}
                                    title="Cancelar y volver a seleccionar"
                                  >
                                    <i className="bi-x"></i>
                                  </button>
                                </div>
                              ) : (
                                <select
                                  className="form-select"
                                  id="location"
                                  value={purchaseForm.location}
                                  onChange={(e) => handleLocationChange(e.target.value)}
                                  required
                                >
                                  <option value="">Selecciona una ubicación</option>
                                  {getUniqueLocations().map((location) => (
                                    <option key={location} value={location}>
                                      {location}
                                    </option>
                                  ))}
                                  <option value="__CREATE_NEW__">--- Create new ---</option>
                                </select>
                              )}
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label htmlFor="quantity" className="form-label">
                                Cantidad Comprada <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="quantity"
                                min="1"
                                value={purchaseForm.quantity || ''}
                                onChange={(e) => setPurchaseForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                                required
                              />
                            </div>

                            <div className="col-md-4">
                              <label htmlFor="totalPrice" className="form-label">
                                Precio Total (€) <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="totalPrice"
                                step="0.01"
                                min="0"
                                value={purchaseForm.totalPrice || ''}
                                onChange={(e) => setPurchaseForm(prev => ({ ...prev, totalPrice: parseFloat(e.target.value) || 0 }))}
                                required
                              />
                            </div>

                            <div className="col-md-4">
                              <label htmlFor="unitPrice" className="form-label">
                                Precio Unitario (€)
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="unitPrice"
                                step="0.01"
                                value={purchaseForm.unitPrice || ''}
                                readOnly
                                style={{ backgroundColor: '#f8f9fa' }}
                              />
                              <small className="text-muted">Calculado automáticamente</small>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label htmlFor="supplier" className="form-label">
                                Proveedor <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="supplier"
                                value={purchaseForm.supplier}
                                onChange={(e) => setPurchaseForm(prev => ({ ...prev, supplier: e.target.value }))}
                                required
                              />
                            </div>
                          </div>

                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => {
                                setShowInventory2Purchase(false);
                                setPurchaseForm({
                                  itemName: '',
                                  quantity: 0,
                                  totalPrice: 0,
                                  unitPrice: 0,
                                  supplier: '',
                                  location: '',
                                  inventoryItemId: undefined,
                                  isNewItem: false,
                                });
                                setItemSearchQuery('');
                                setShowItemSearch(false);
                                setLocationCreateNew(false);
                              }}
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                            >
                              <i className="bi-check-circle me-2"></i>
                              Registrar Compra
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : currentFeature === 'inventory-2' && showInventory2SpotCheck ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-clipboard-check text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <div>
                          <h3 className="mb-0">Spot Check History</h3>
                          {getLastSpotCheckDate() && (
                            <small className="text-muted">
                              Última ejecución: {new Date(getLastSpotCheckDate()!).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={fetchSpotChecks}
                          disabled={loadingSpotChecks}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loadingSpotChecks ? 'Cargando...' : 'Actualizar'}
                        </button>
                        <button 
                          className="btn btn-primary" 
                          onClick={createSpotCheck}
                          disabled={loadingSpotChecks}
                        >
                          <i className="bi-plus-circle me-1"></i>
                          Nuevo Spot Check
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => setShowInventory2SpotCheck(false)}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>

                    {loadingSpotChecks ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando spot checks...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start ps-3">Fecha del Spot Check</th>
                              <th className="text-start">Ubicación</th>
                              <th className="text-start">Usuario</th>
                              <th className="text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Filas de spot checks existentes */}
                            {spotChecks.length > 0 ? (
                              spotChecks.map((spotCheck) => (
                                <tr key={spotCheck.id}>
                                  {editingSpotCheckId === spotCheck.id ? (
                                    <>
                                      <td className="text-start ps-3">
                                        <input
                                          type="datetime-local"
                                          className="form-control form-control-sm"
                                          value={spotCheck.checkDate ? new Date(spotCheck.checkDate).toISOString().slice(0, 16) : ''}
                                          onChange={(e) => {
                                            const updated = spotChecks.map(s => 
                                              s.id === spotCheck.id ? { ...s, checkDate: e.target.value } : s
                                            );
                                            setSpotChecks(updated);
                                          }}
                                        />
                                      </td>
                                      <td className="text-start">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          value={spotCheck.location}
                                          onChange={(e) => {
                                            const updated = spotChecks.map(s => 
                                              s.id === spotCheck.id ? { ...s, location: e.target.value } : s
                                            );
                                            setSpotChecks(updated);
                                          }}
                                        />
                                      </td>
                                      <td className="text-start">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          value={spotCheck.userId}
                                          onChange={(e) => {
                                            const updated = spotChecks.map(s => 
                                              s.id === spotCheck.id ? { ...s, userId: e.target.value } : s
                                            );
                                            setSpotChecks(updated);
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="d-flex gap-1 justify-content-center">
                                          <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => updateSpotCheck(spotCheck)}
                                            title="Guardar"
                                          >
                                            <i className="bi-check"></i>
                                          </button>
                                          <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                              setEditingSpotCheckId(null);
                                              fetchSpotChecks(); // Recargar para cancelar cambios
                                            }}
                                            title="Cancelar"
                                          >
                                            <i className="bi-x"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="text-start ps-3">
                                        {spotCheck.checkDate ? new Date(spotCheck.checkDate).toLocaleDateString('es-ES', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        }) : '-'}
                                      </td>
                                      <td className="text-start">{spotCheck.location}</td>
                                      <td className="text-start">{spotCheck.userId}</td>
                                      <td className="text-center">
                                        <div className="d-flex gap-1 justify-content-center">
                                          <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setEditingSpotCheckId(spotCheck.id)}
                                            title="Editar"
                                          >
                                            <i className="bi-pencil"></i>
                                          </button>
                                          <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteSpotCheck(spotCheck.id)}
                                            title="Eliminar"
                                          >
                                            <i className="bi-trash"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center text-muted py-5">
                                  <i className="bi-inbox fs-1 d-block mb-3"></i>
                                  <h5>No hay spot checks registrados</h5>
                                  <p>Haz clic en "Nuevo Spot Check" para crear tu primer registro.</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : currentFeature === 'inventory-2' && showInventory2ItemsRules ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-list-check text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Items Rules</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={fetchItemRules}
                          disabled={loadingItemRules}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loadingItemRules ? 'Cargando...' : 'Actualizar'}
                        </button>
                        <button 
                          className="btn btn-outline-secondary" 
                          onClick={handleInventory2RulesClick}
                        >
                          <i className="bi-gear me-1"></i>
                          Gestionar Rules
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => setShowInventory2ItemsRules(false)}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>

                    {loadingItemRules ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando reglas de items...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start ps-3" style={{ width: '30px' }}></th>
                              <th className="text-start">Item</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventoryItems2.length > 0 ? (
                              // Obtener items únicos por nombre
                              Array.from(new Set(inventoryItems2.map(item => item.itemName))).map((itemName) => {
                                return (
                                  <>
                                    <tr key={itemName}>
                                      <td className="text-center">
                                        <button
                                          className="btn btn-sm btn-link p-0"
                                          onClick={() => toggleItemRuleExpansion(itemName)}
                                          title="Ver/Editar reglas"
                                        >
                                          <i className={`bi ${expandedItemRuleId === itemName ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                                        </button>
                                      </td>
                                      <td className="text-start ps-3">
                                        <strong>{itemName}</strong>
                                      </td>
                                    </tr>
                                    {/* Fila expandible para reglas por tipo de propiedad */}
                                    {expandedItemRuleId === itemName && (
                                      <tr key={`${itemName}-rules`}>
                                        <td colSpan={2} className="p-0">
                                          <div className="p-3 bg-light">
                                            <h6 className="mb-3">
                                              <i className="bi-gear me-2"></i>
                                              Reglas de Consumo por Tipo de Propiedad: {itemName}
                                            </h6>
                                            <div className="row">
                                              {propertyTypes.map((propertyType) => {
                                                const existingRule = getItemRuleForProperty(itemName, propertyType);
                                                return (
                                                  <div key={propertyType} className="col-md-4 mb-3">
                                                    <label className="form-label">
                                                      <strong>{propertyType}</strong>
                                                    </label>
                                                    <select
                                                      className="form-select"
                                                      value={existingRule?.consumptionRuleId || ''}
                                                      onChange={(e) => {
                                                        if (e.target.value) {
                                                          saveItemRule(itemName, propertyType, e.target.value);
                                                        }
                                                      }}
                                                    >
                                                      <option value="">Selecciona una regla</option>
                                                      {consumptionRules.map((rule) => (
                                                        <option key={rule.id} value={rule.id}>
                                                          {rule.name}
                                                        </option>
                                                      ))}
                                                    </select>
                                                    {existingRule?.consumptionRule && (
                                                      <small className="text-muted d-block mt-1">
                                                        {existingRule.consumptionRule.name}
                                                        {existingRule.consumptionRule.description && ` - ${existingRule.consumptionRule.description}`}
                                                      </small>
                                                    )}
                                                    {existingRule && (
                                                      <button
                                                        className="btn btn-sm btn-outline-danger mt-2"
                                                        onClick={() => deleteItemRule(existingRule.id)}
                                                        title="Eliminar regla"
                                                      >
                                                        <i className="bi-trash me-1"></i>
                                                        Eliminar
                                                      </button>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={2} className="text-center text-muted py-5">
                                  <i className="bi-inbox fs-1 d-block mb-3"></i>
                                  <h5>No hay items de inventario</h5>
                                  <p>Agrega items en la tabla de inventario para configurar sus reglas.</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : currentFeature === 'properties' ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-building text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Properties</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={fetchProperties}
                          disabled={loadingProperties}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loadingProperties ? 'Cargando...' : 'Actualizar'}
                        </button>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setIsAddingNewProperty(true)}
                          disabled={isAddingNewProperty}
                        >
                          <i className="bi-plus-circle me-1"></i>
                          Agregar Propiedad
                        </button>
                      </div>
                    </div>

                    {loadingProperties ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando propiedades...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start ps-3">Property Name</th>
                              <th className="text-start">Property Type</th>
                              <th className="text-center">Guest Capacity</th>
                              <th className="text-start">API Reference</th>
                              <th className="text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Fila para agregar nueva propiedad */}
                            {isAddingNewProperty && (
                              <tr className="table-info">
                                <td className="text-start ps-3">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Nombre de la propiedad"
                                    value={newPropertyForm.propertyName || ''}
                                    onChange={(e) => setNewPropertyForm({ ...newPropertyForm, propertyName: e.target.value })}
                                    required
                                  />
                                </td>
                                <td className="text-start">
                                  <select
                                    className="form-select form-select-sm"
                                    value={newPropertyForm.propertyType || 'Entire home'}
                                    onChange={(e) => setNewPropertyForm({ ...newPropertyForm, propertyType: e.target.value })}
                                  >
                                    <option value="Entire home">Entire home</option>
                                    <option value="Private room">Private room</option>
                                    <option value="Planta2">Planta2</option>
                                  </select>
                                </td>
                                <td className="text-center">
                                  <input
                                    type="number"
                                    className="form-control form-control-sm text-center"
                                    min="1"
                                    value={newPropertyForm.guestCapacity || ''}
                                    onChange={(e) => setNewPropertyForm({ ...newPropertyForm, guestCapacity: parseInt(e.target.value) || 0 })}
                                    required
                                  />
                                </td>
                                <td className="text-start">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="API Reference"
                                    value={newPropertyForm.apiReference || ''}
                                    onChange={(e) => setNewPropertyForm({ ...newPropertyForm, apiReference: e.target.value })}
                                  />
                                </td>
                                <td className="text-center">
                                  <div className="d-flex gap-1 justify-content-center">
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={createProperty}
                                      title="Guardar"
                                    >
                                      <i className="bi-check"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-secondary"
                                      onClick={() => {
                                        setIsAddingNewProperty(false);
                                        setNewPropertyForm({
                                          propertyName: '',
                                          propertyType: 'Entire home',
                                          guestCapacity: 0,
                                          apiReference: '',
                                        });
                                      }}
                                      title="Cancelar"
                                    >
                                      <i className="bi-x"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}

                            {/* Filas de propiedades existentes */}
                            {properties.length > 0 ? (
                              properties.map((property) => (
                                <tr key={property.id}>
                                  {editingPropertyId === property.id ? (
                                    <>
                                      <td className="text-start ps-3">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          value={property.propertyName}
                                          onChange={(e) => {
                                            const updated = properties.map(p => 
                                              p.id === property.id ? { ...p, propertyName: e.target.value } : p
                                            );
                                            setProperties(updated);
                                          }}
                                        />
                                      </td>
                                      <td className="text-start">
                                        <select
                                          className="form-select form-select-sm"
                                          value={property.propertyType}
                                          onChange={(e) => {
                                            const updated = properties.map(p => 
                                              p.id === property.id ? { ...p, propertyType: e.target.value } : p
                                            );
                                            setProperties(updated);
                                          }}
                                        >
                                          <option value="Entire home">Entire home</option>
                                          <option value="Private room">Private room</option>
                                          <option value="Planta2">Planta2</option>
                                        </select>
                                      </td>
                                      <td className="text-center">
                                        <input
                                          type="number"
                                          className="form-control form-control-sm text-center"
                                          min="1"
                                          value={property.guestCapacity}
                                          onChange={(e) => {
                                            const updated = properties.map(p => 
                                              p.id === property.id ? { ...p, guestCapacity: parseInt(e.target.value) || 0 } : p
                                            );
                                            setProperties(updated);
                                          }}
                                        />
                                      </td>
                                      <td className="text-start">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          value={property.apiReference || ''}
                                          onChange={(e) => {
                                            const updated = properties.map(p => 
                                              p.id === property.id ? { ...p, apiReference: e.target.value } : p
                                            );
                                            setProperties(updated);
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="d-flex gap-1 justify-content-center">
                                          <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => updateProperty(property)}
                                            title="Guardar"
                                          >
                                            <i className="bi-check"></i>
                                          </button>
                                          <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                              setEditingPropertyId(null);
                                              fetchProperties(); // Recargar para cancelar cambios
                                            }}
                                            title="Cancelar"
                                          >
                                            <i className="bi-x"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="text-start ps-3">
                                        <strong>{property.propertyName}</strong>
                                      </td>
                                      <td className="text-start">{property.propertyType}</td>
                                      <td className="text-center">{property.guestCapacity}</td>
                                      <td className="text-start">{property.apiReference || <span className="text-muted">-</span>}</td>
                                      <td className="text-center">
                                        <div className="d-flex gap-1 justify-content-center">
                                          <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setEditingPropertyId(property.id)}
                                            title="Editar"
                                          >
                                            <i className="bi-pencil"></i>
                                          </button>
                                          <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteProperty(property.id)}
                                            title="Eliminar"
                                          >
                                            <i className="bi-trash"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="text-center text-muted py-5">
                                  <i className="bi-inbox fs-1 d-block mb-3"></i>
                                  <h5>No hay propiedades registradas</h5>
                                  <p>Haz clic en "Agregar Propiedad" para crear tu primera propiedad.</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : currentFeature === 'alarms' ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-bell text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Alarms</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className={`btn ${alarmFilter === 'default' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setAlarmFilter('default')}
                          >
                            Activas
                          </button>
                          <button
                            type="button"
                            className={`btn ${alarmFilter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setAlarmFilter('completed')}
                          >
                            Completadas
                          </button>
                        </div>
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={fetchAlarms}
                          disabled={loadingAlarmsOps}
                        >
                          <i className="bi-arrow-clockwise me-1"></i>
                          {loadingAlarmsOps ? 'Cargando...' : 'Actualizar'}
                        </button>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setIsAddingNewAlarm(true)}
                          disabled={isAddingNewAlarm}
                        >
                          <i className="bi-plus-circle me-1"></i>
                          Agregar Alarma
                        </button>
                      </div>
                    </div>

                    {loadingAlarmsOps ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando alarmas...</p>
                      </div>
                    ) : (
                      <div>
                        {(() => {
                          // Filtrar alarmas según el filtro seleccionado
                          let filteredAlarms = alarmsOps;
                          
                          if (alarmFilter === 'default') {
                            // Vista predeterminada: excluir alarmas con status "Completed"
                            filteredAlarms = alarmsOps.filter(alarm => alarm.status !== 'Completed');
                          } else if (alarmFilter === 'completed') {
                            // Filtro completed: solo alarmas con status "Completed"
                            filteredAlarms = alarmsOps.filter(alarm => alarm.status === 'Completed');
                          }
                          
                          return (
                            <div className="table-responsive">
                              <table className="table table-hover">
                                <thead className="table-light">
                                  <tr>
                                    {alarmFilter === 'completed' ? (
                                      <>
                                        <th className="text-start ps-3">Date</th>
                                        <th className="text-start">Name</th>
                                        <th className="text-start">Description</th>
                                        <th className="text-start">Log</th>
                                      </>
                                    ) : (
                                      <>
                                        <th className="text-start ps-3">Date</th>
                                        <th className="text-start">Name</th>
                                        <th className="text-start">Description</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Acciones</th>
                                      </>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Fila para agregar nueva alarma - solo en vista default */}
                                  {isAddingNewAlarm && alarmFilter === 'default' && (
                                    <tr className="table-info">
                                      <td className="text-start ps-3">
                                        <input
                                          type="datetime-local"
                                          className="form-control form-control-sm"
                                          value={newAlarmForm.date ? new Date(newAlarmForm.date).toISOString().slice(0, 16) : ''}
                                          onChange={(e) => setNewAlarmForm({ ...newAlarmForm, date: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                                        />
                                      </td>
                                      <td className="text-start">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          placeholder="Nombre de la alarma"
                                          value={newAlarmForm.name || ''}
                                          onChange={(e) => setNewAlarmForm({ ...newAlarmForm, name: e.target.value })}
                                          required
                                        />
                                      </td>
                                      <td className="text-start">
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          placeholder="Descripción"
                                          value={newAlarmForm.description || ''}
                                          onChange={(e) => setNewAlarmForm({ ...newAlarmForm, description: e.target.value })}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <select
                                          className="form-select form-select-sm"
                                          value={newAlarmForm.status || 'Pending'}
                                          onChange={(e) => setNewAlarmForm({ ...newAlarmForm, status: e.target.value })}
                                        >
                                          <option value="Pending">Pending</option>
                                          <option value="Active">Active</option>
                                          <option value="Snooze">Snooze</option>
                                          <option value="Completed">Completed</option>
                                        </select>
                                      </td>
                                      <td className="text-center">
                                        <div className="d-flex gap-1 justify-content-center">
                                          <button
                                            className="btn btn-sm btn-success"
                                            onClick={createAlarm}
                                            title="Guardar"
                                          >
                                            <i className="bi-check"></i>
                                          </button>
                                          <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                              setIsAddingNewAlarm(false);
                                              setNewAlarmForm({
                                                name: '',
                                                description: '',
                                                section: 'Ops',
                                                function: 'Inventory',
                                                type: '',
                                                status: 'Pending',
                                              });
                                            }}
                                            title="Cancelar"
                                          >
                                            <i className="bi-x"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  )}

                                  {/* Filas de alarmas existentes */}
                                  {filteredAlarms.length > 0 ? (
                                    filteredAlarms.map((alarm) => {
                                      if (alarmFilter === 'completed') {
                                        // Vista de completadas: solo Date, Name, Description, Log
                                        return (
                                          <tr key={alarm.id}>
                                            <td className="text-start ps-3">
                                              {alarm.date ? new Date(alarm.date).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              }) : alarm.createdAt ? new Date(alarm.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              }) : '-'}
                                            </td>
                                            <td className="text-start">
                                              <strong>{alarm.name}</strong>
                                            </td>
                                            <td className="text-start">{alarm.description || <span className="text-muted">-</span>}</td>
                                            <td className="text-start">
                                              {alarm.log ? (
                                                <div style={{ maxWidth: '400px', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                                                  {alarm.log}
                                                </div>
                                              ) : (
                                                <span className="text-muted">-</span>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      } else {
                                        // Vista predeterminada: Date, Name, Description, Status, Acciones (sin Section, Function, Type, Log)
                                        return (
                                          <tr key={alarm.id}>
                                            <td className="text-start ps-3">
                                              {alarm.date ? new Date(alarm.date).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              }) : alarm.createdAt ? new Date(alarm.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                              }) : '-'}
                                            </td>
                                            <td className="text-start">
                                              <strong>{alarm.name}</strong>
                                            </td>
                                            <td className="text-start">{alarm.description || <span className="text-muted">-</span>}</td>
                                            <td className="text-center">
                                              {alarm.status === 'Completed' ? (
                                                <span className="badge" style={{ backgroundColor: 'rgba(39, 174, 96, 0.8)', color: 'white' }}>
                                                  Completed
                                                </span>
                                              ) : alarm.status === 'Snoozed' ? (
                                                <span className="badge" style={{ backgroundColor: 'rgba(108, 117, 125, 0.8)', color: 'white' }}>
                                                  Snoozed
                                                </span>
                                              ) : alarm.status === 'Active' ? (
                                                <span className="badge" style={{ backgroundColor: 'rgba(220, 53, 69, 0.8)', color: 'white' }}>
                                                  Pending
                                                </span>
                                              ) : (
                                                <span className="badge" style={{ backgroundColor: 'rgba(243, 156, 18, 0.8)', color: 'white' }}>
                                                  Pending
                                                </span>
                                              )}
                                            </td>
                                            <td className="text-center">
                                              <div className="d-flex gap-1 justify-content-center">
                                                <button
                                                  className="btn btn-sm btn-outline-success"
                                                  onClick={() => checkAlarm(alarm)}
                                                  title="Check"
                                                >
                                                  <i className="bi-check-circle"></i>
                                                </button>
                                                <button
                                                  className="btn btn-sm btn-outline-warning"
                                                  onClick={() => snoozeAlarm(alarm)}
                                                  title="Snooze"
                                                >
                                                  <i className="bi-clock"></i>
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan={alarmFilter === 'completed' ? 4 : 5} className="text-center text-muted py-5">
                                        <i className="bi-inbox fs-1 d-block mb-3"></i>
                                        <h5>No hay alarmas {alarmFilter === 'completed' ? 'completadas' : 'activas'}</h5>
                                        {alarmFilter === 'default' && (
                                          <p>Haz clic en "Agregar Alarma" para crear tu primera alarma.</p>
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ) : currentFeature === 'inventory-2' && showInventory2SpotCheckWizard ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-clipboard-data text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Spot Check</h3>
                      </div>
                      <button className="btn btn-outline-secondary" onClick={closeSpotCheckWizard}>
                        <i className="bi-x me-1"></i>Cerrar
                      </button>
                    </div>
                    
                    {/* Indicador de pasos */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        {[1, 2, 3, 4, 5].map((step) => (
                          <div key={step} className="d-flex align-items-center flex-grow-1">
                            <div className="d-flex flex-column align-items-center flex-grow-1">
                              <div
                                className={`rounded-circle d-flex align-items-center justify-content-center ${
                                  spotCheckWizardStep === step
                                    ? 'bg-primary text-white'
                                    : spotCheckWizardStep > step
                                    ? 'bg-success text-white'
                                    : 'bg-secondary text-white'
                                }`}
                                style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}
                              >
                                {spotCheckWizardStep > step ? <i className="bi-check"></i> : step}
                              </div>
                              <small className="mt-2 text-muted text-center">Paso {step}</small>
                            </div>
                            {step < 5 && (
                              <div
                                className={`flex-grow-1 mx-2 ${
                                  spotCheckWizardStep > step ? 'border-top border-success border-2' : 'border-top border-secondary border-2'
                                }`}
                                style={{ height: '2px' }}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Contenido del wizard */}
                    <div className="card">
                      <div className="card-body">
                        {/* Paso 1: Seleccionar ubicación */}
                        {spotCheckWizardStep === 1 && (
                          <div>
                            <h5 className="mb-4">Paso 1: Selecciona la ubicación</h5>
                            <p className="text-muted mb-4">Selecciona la ubicación a la que realizar el Spot Check</p>
                            
                            <div className="mb-3">
                              <label htmlFor="spotCheckLocation" className="form-label">
                                Ubicación <span className="text-danger">*</span>
                              </label>
                              <select
                                id="spotCheckLocation"
                                className="form-select"
                                value={spotCheckLocation}
                                onChange={(e) => setSpotCheckLocation(e.target.value)}
                                required
                              >
                                <option value="">-- Selecciona una ubicación --</option>
                                {getUniqueLocations().map((location) => (
                                  <option key={location} value={location}>
                                    {location}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="d-flex justify-content-end gap-2 mt-4">
                              <button className="btn btn-primary" onClick={nextSpotCheckWizardStep}>
                                Siguiente <i className="bi-arrow-right ms-1"></i>
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Paso 2: Seleccionar fechas */}
                        {spotCheckWizardStep === 2 && (
                          <div>
                            <h5 className="mb-4">Paso 2: Selecciona las fechas</h5>
                            <p className="text-muted mb-4">Selecciona las fechas para hacer el control de consumo</p>
                            
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <label htmlFor="spotCheckFromDate" className="form-label">
                                  From (Desde) <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="date"
                                  id="spotCheckFromDate"
                                  className="form-control"
                                  value={spotCheckFromDate}
                                  onChange={(e) => setSpotCheckFromDate(e.target.value)}
                                  required
                                />
                                <small className="text-muted">
                                  Valor predeterminado: Última fecha de Spot Check History
                                </small>
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="spotCheckToDate" className="form-label">
                                  To (Hasta) <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="date"
                                  id="spotCheckToDate"
                                  className="form-control"
                                  value={spotCheckToDate}
                                  onChange={(e) => setSpotCheckToDate(e.target.value)}
                                  required
                                />
                                <small className="text-muted">
                                  Valor predeterminado: Fecha de hoy
                                </small>
                              </div>
                            </div>
                            
                            <div className="d-flex justify-content-between gap-2 mt-4">
                              <button className="btn btn-outline-secondary" onClick={previousSpotCheckWizardStep}>
                                <i className="bi-arrow-left me-1"></i> Anterior
                              </button>
                              <button className="btn btn-primary" onClick={nextSpotCheckWizardStep}>
                                Siguiente <i className="bi-arrow-right ms-1"></i>
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Paso 3: Llamada API y preview */}
                        {spotCheckWizardStep === 3 && (
                          <div>
                            <h5 className="mb-4">Paso 3: Resumen de Reservas</h5>
                            <p className="text-muted mb-4">Revisa el resumen de las reservas para el rango de fechas seleccionado</p>
                            
                            <div className="mb-3">
                              <div className="alert alert-info">
                                <strong>Ubicación seleccionada:</strong> {spotCheckLocation}<br />
                                <strong>Rango de fechas:</strong> {spotCheckFromDate} a {spotCheckToDate}
                              </div>
                            </div>
                            
                            {spotCheckApiLoading ? (
                              <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Cargando...</span>
                                </div>
                                <p className="mt-3">Cargando resultados de la API...</p>
                              </div>
                            ) : spotCheckApiError ? (
                              <div className="alert alert-danger">
                                <i className="bi-exclamation-triangle me-2"></i>
                                <strong>Error:</strong> {spotCheckApiError}
                                <div className="mt-3">
                                  <details className="mt-2">
                                    <summary className="cursor-pointer text-decoration-underline">Detalles técnicos</summary>
                                    <div className="mt-2 small">
                                      <p><strong>URL:</strong> https://a2hytc4pdf3gqsfdosgukc3l3u0tgukb.lambda-url.eu-central-1.on.aws/</p>
                                      <p><strong>Método:</strong> POST</p>
                                      <p><strong>Body enviado:</strong></p>
                                      <pre className="bg-light p-2 rounded small">
                                        {JSON.stringify({
                                          fromYmd: spotCheckFromDate,
                                          toYmd: spotCheckToDate,
                                        }, null, 2)}
                                      </pre>
                                      <p className="mt-2 text-muted">
                                        <small>
                                          <i className="bi-info-circle me-1"></i>
                                          Revisa la consola del navegador (F12) para más detalles del error.
                                        </small>
                                      </p>
                                    </div>
                                  </details>
                                </div>
                                <div className="mt-2">
                                  <button className="btn btn-sm btn-outline-danger" onClick={fetchSpotCheckApiData}>
                                    <i className="bi-arrow-clockwise me-1"></i> Reintentar
                                  </button>
                                </div>
                              </div>
                            ) : spotCheckApiResponse ? (
                              <div>
                                {(() => {
                                  // Calcular resumen de la respuesta
                                  const bookings = spotCheckApiResponse.bookings || [];
                                  const totalGuests = bookings.reduce((sum: number, booking: any) => sum + (booking.Guests || 0), 0);
                                  const totalNights = bookings.reduce((sum: number, booking: any) => sum + (booking.Nights || 0), 0);
                                  const totalBookings = spotCheckApiResponse.totalReturned || 0;
                                  
                                  // Contar bookings por tipo
                                  const entireHomeCount = bookings.filter((b: any) => b.RoomType === 'Entire home/apt').length;
                                  const privateRoomCount = bookings.filter((b: any) => b.RoomType === 'Private room').length;
                                  const planta2Count = bookings.filter((b: any) => b.RoomType === 'Planta2').length;
                                  
                                  return (
                                    <div>
                                      <div className="row mb-4">
                                        <div className="col-md-3">
                                          <div className="card text-center">
                                            <div className="card-body">
                                              <h6 className="card-title text-muted mb-2">Total Guests</h6>
                                              <h3 className="mb-0 text-primary">{totalGuests}</h3>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-3">
                                          <div className="card text-center">
                                            <div className="card-body">
                                              <h6 className="card-title text-muted mb-2">Total Nights</h6>
                                              <h3 className="mb-0 text-primary">{totalNights}</h3>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-3">
                                          <div className="card text-center">
                                            <div className="card-body">
                                              <h6 className="card-title text-muted mb-2">Total Bookings</h6>
                                              <h3 className="mb-0 text-primary">{totalBookings}</h3>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-3">
                                          <div className="card text-center">
                                            <div className="card-body">
                                              <h6 className="card-title text-muted mb-2">Escritas</h6>
                                              <h3 className="mb-0 text-primary">{spotCheckApiResponse.written || 0}</h3>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="card mb-4">
                                        <div className="card-header">
                                          <h6 className="mb-0">Bookings por Tipo de Propiedad</h6>
                                        </div>
                                        <div className="card-body">
                                          <div className="row">
                                            <div className="col-md-4">
                                              <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                                                <div>
                                                  <strong>Entire home/apt</strong>
                                                </div>
                                                <span className="badge bg-primary fs-6">{entireHomeCount}</span>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                                                <div>
                                                  <strong>Private room</strong>
                                                </div>
                                                <span className="badge bg-info fs-6">{privateRoomCount}</span>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                                                <div>
                                                  <strong>Planta2</strong>
                                                </div>
                                                <span className="badge bg-success fs-6">{planta2Count}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="alert alert-success">
                                        <i className="bi-check-circle me-2"></i>
                                        <strong>Resumen cargado correctamente.</strong> Si la información es correcta, presiona "Siguiente" para calcular los consumos correspondientes.
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            ) : (
                              <div className="alert alert-warning">
                                No se ha realizado la llamada a la API aún.
                              </div>
                            )}
                            
                            <div className="d-flex justify-content-between gap-2 mt-4">
                              <button className="btn btn-outline-secondary" onClick={previousSpotCheckWizardStep}>
                                <i className="bi-arrow-left me-1"></i> Anterior
                              </button>
                              {spotCheckApiResponse && !spotCheckApiLoading && !spotCheckApiError && (
                                <button className="btn btn-primary" onClick={nextSpotCheckWizardStep}>
                                  Siguiente <i className="bi-arrow-right ms-1"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Paso 4: Cálculo de consumos */}
                        {spotCheckWizardStep === 4 && (
                          <div>
                            <h5 className="mb-4">Paso 4: Consumos Esperados</h5>
                            <p className="text-muted mb-4">Consumos calculados según las reglas de consumo y las reservas</p>
                            
                            {spotCheckCalculating ? (
                              <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                                  <span className="visually-hidden">Calculando...</span>
                                </div>
                                <p className="mt-3 fs-5">Calculando consumos...</p>
                                <p className="text-muted">Por favor espera mientras procesamos las reservas y aplicamos las reglas de consumo.</p>
                              </div>
                            ) : (
                              <div>
                                {Object.keys(spotCheckConsumptions).length > 0 ? (
                                  <div>
                                    <div className="alert alert-info mb-4">
                                      <strong>Ubicación:</strong> {spotCheckLocation}<br />
                                      <strong>Total de reservas procesadas:</strong> {spotCheckApiResponse?.bookings?.length || 0}
                                    </div>
                                    
                                    <div className="card">
                                      <div className="card-header">
                                        <h6 className="mb-0">Resumen de Consumos Esperados por Item</h6>
                                      </div>
                                      <div className="card-body">
                                        <div className="table-responsive">
                                          <table className="table table-hover">
                                            <thead className="table-light">
                                              <tr>
                                                <th className="text-start ps-3">Item</th>
                                                <th className="text-center">Consumo Esperado</th>
                                                <th className="text-start">Ubicación</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {Object.entries(spotCheckConsumptions)
                                                .filter(([_, consumption]) => consumption > 0)
                                                .sort(([a], [b]) => a.localeCompare(b))
                                                .map(([itemName, consumption]) => (
                                                  <tr key={itemName}>
                                                    <td className="text-start ps-3">
                                                      <strong>{itemName}</strong>
                                                    </td>
                                                    <td className="text-center">
                                                      <span className="badge bg-primary fs-6">{consumption}</span>
                                                    </td>
                                                    <td className="text-start">{spotCheckLocation}</td>
                                                  </tr>
                                                ))}
                                              {Object.values(spotCheckConsumptions).every(c => c === 0) && (
                                                <tr>
                                                  <td colSpan={3} className="text-center text-muted py-5">
                                                    <i className="bi-info-circle fs-1 d-block mb-3"></i>
                                                    <h5>No se encontraron consumos</h5>
                                                    <p>No hay reglas de consumo configuradas para los items de esta ubicación con los tipos de propiedad de las reservas.</p>
                                                  </td>
                                                </tr>
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="alert alert-success mt-4">
                                      <i className="bi-check-circle me-2"></i>
                                      <strong>Cálculo completado.</strong> Revisa el resumen de consumos esperados. Si la información es correcta, presiona "Siguiente" para continuar.
                                    </div>
                                  </div>
                                ) : (
                                  <div className="alert alert-warning">
                                    <i className="bi-exclamation-triangle me-2"></i>
                                    No se pudieron calcular los consumos. Por favor verifica que:
                                    <ul className="mb-0 mt-2">
                                      <li>Existen items de inventario en la ubicación seleccionada</li>
                                      <li>Las reglas de consumo están configuradas para los tipos de propiedad de las reservas</li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="d-flex justify-content-between gap-2 mt-4">
                              <button className="btn btn-outline-secondary" onClick={previousSpotCheckWizardStep}>
                                <i className="bi-arrow-left me-1"></i> Anterior
                              </button>
                              {!spotCheckCalculating && Object.keys(spotCheckConsumptions).length > 0 && (
                                <button className="btn btn-primary" onClick={nextSpotCheckWizardStep}>
                                  Siguiente <i className="bi-arrow-right ms-1"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Paso 5: Cantidades verificadas */}
                        {spotCheckWizardStep === 5 && (
                          <div>
                            <h5 className="mb-4">Paso 5: Cantidades Verificadas</h5>
                            <p className="text-muted mb-4">Introduce las cantidades verificadas para cada item</p>
                            
                            <div className="alert alert-info mb-4">
                              <strong>Ubicación:</strong> {spotCheckLocation}<br />
                              <small className="text-muted">
                                El valor predeterminado es la cantidad actual menos el consumo estimado. 
                                Ajusta los valores según la verificación física realizada.
                              </small>
                            </div>
                            
                            {(() => {
                              const locationItems = inventoryItems2.filter(item => item.location === spotCheckLocation);
                              
                              if (locationItems.length === 0) {
                                return (
                                  <div className="alert alert-warning">
                                    <i className="bi-exclamation-triangle me-2"></i>
                                    No se encontraron items de inventario para la ubicación seleccionada.
                                  </div>
                                );
                              }
                              
                              return (
                                <div className="card">
                                  <div className="card-header">
                                    <h6 className="mb-0">Items de Inventario - {spotCheckLocation}</h6>
                                  </div>
                                  <div className="card-body">
                                    <div className="table-responsive">
                                      <table className="table table-hover">
                                        <thead className="table-light">
                                          <tr>
                                            <th className="text-start ps-3">Item</th>
                                            <th className="text-center">Cantidad Actual</th>
                                            <th className="text-center">Consumo Estimado</th>
                                            <th className="text-center">Cantidad Verificada</th>
                                            <th className="text-center">Status</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {locationItems
                                            .sort((a, b) => a.itemName.localeCompare(b.itemName))
                                            .map((item) => {
                                              const currentQty = item.qty || 0;
                                              const estimatedConsumption = spotCheckConsumptions[item.itemName] || 0;
                                              const tolerance = item.tolerance || 0;
                                              
                                              // Valor esperado: cantidad actual - consumo estimado (o cantidad actual si no hay consumo)
                                              const expectedQty = estimatedConsumption > 0 
                                                ? Math.max(0, currentQty - estimatedConsumption)
                                                : currentQty;
                                              
                                              const verifiedQty = spotCheckVerifiedQuantities[item.itemName] ?? expectedQty;
                                              
                                              // Calcular el umbral mínimo (valor esperado - tolerancia)
                                              const minThreshold = expectedQty - tolerance;
                                              
                                              // Determinar el status: warning si está por debajo del umbral, check verde en caso contrario
                                              const isBelowThreshold = verifiedQty < minThreshold;
                                              
                                              return (
                                                <tr key={item.id}>
                                                  <td className="text-start ps-3">
                                                    <strong>{item.itemName}</strong>
                                                  </td>
                                                  <td className="text-center">
                                                    <span className="badge bg-secondary">{currentQty}</span>
                                                  </td>
                                                  <td className="text-center">
                                                    {estimatedConsumption > 0 ? (
                                                      <span className="badge bg-warning text-dark">{estimatedConsumption}</span>
                                                    ) : (
                                                      <span className="text-muted">-</span>
                                                    )}
                                                  </td>
                                                  <td className="text-center">
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                      <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => decrementQuantity(item.itemName)}
                                                        type="button"
                                                      >
                                                        <i className="bi-dash"></i>
                                                      </button>
                                                      <input
                                                        type="number"
                                                        className="form-control form-control-sm text-center"
                                                        style={{ width: '80px' }}
                                                        min="0"
                                                        value={verifiedQty}
                                                        onChange={(e) => {
                                                          const value = parseInt(e.target.value) || 0;
                                                          updateVerifiedQuantity(item.itemName, value);
                                                        }}
                                                      />
                                                      <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => incrementQuantity(item.itemName)}
                                                        type="button"
                                                      >
                                                        <i className="bi-plus"></i>
                                                      </button>
                                                    </div>
                                                  </td>
                                                  <td className="text-center">
                                                    {isBelowThreshold ? (
                                                      <i className="bi-exclamation-triangle-fill text-warning fs-4" title={`Valor por debajo del umbral mínimo (${minThreshold})`}></i>
                                                    ) : (
                                                      <i className="bi-check-circle-fill text-success fs-4" title="Valor dentro del rango aceptable"></i>
                                                    )}
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            <div className="alert alert-success mt-4">
                              <i className="bi-info-circle me-2"></i>
                              <strong>Instrucciones:</strong> Verifica físicamente cada item y ajusta las cantidades según corresponda. 
                              Los valores predeterminados ya consideran el consumo estimado calculado anteriormente.
                            </div>
                            
                            <div className="d-flex justify-content-between gap-2 mt-4">
                              <button className="btn btn-outline-secondary" onClick={previousSpotCheckWizardStep}>
                                <i className="bi-arrow-left me-1"></i> Anterior
                              </button>
                              <button className="btn btn-success" onClick={finalizeSpotCheck}>
                                <i className="bi-check-circle me-1"></i> Finalizar Spot Check
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : currentFeature === 'incident-tracker' ? (
                  <div>
                    {!showIncidentTracker && !showIncidentDetail && !showIncidentForm && !showIncidentStats ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div className="d-flex align-items-center gap-3">
                            <h3 className="mb-0"><i className="bi-exclamation-triangle me-2"></i>Incident Tracker</h3>
                          </div>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-outline-secondary" 
                              onClick={() => setShowIncidentFilters(!showIncidentFilters)}
                            >
                              <i className={`bi-${showIncidentFilters ? 'chevron-up' : 'chevron-down'} me-1`}></i>
                              Filtros
                            </button>
                            <button 
                              className="btn btn-outline-primary" 
                              onClick={() => {
                                fetchIncidents();
                              }}
                              disabled={loadingIncidents}
                            >
                              <i className="bi-arrow-clockwise me-1"></i>
                              {loadingIncidents ? 'Cargando...' : 'Actualizar'}
                            </button>
                            <button 
                              className="btn btn-primary" 
                              onClick={() => {
                                setShowIncidentForm(true);
                                setNewIncidentForm({
                                  reportedBy: userEmail,
                                  reportDate: new Date().toISOString().split('T')[0],
                                  affectedArea: '',
                                  description: '',
                                  priority: 'Medium',
                                });
                              }}
                            >
                              <i className="bi-plus-circle me-1"></i>
                              Nueva Incidencia
                            </button>
                            <button 
                              className="btn btn-outline-info" 
                              onClick={() => {
                                setShowIncidentStats(true);
                              }}
                            >
                              <i className="bi-graph-up me-1"></i>
                              Estadísticas
                            </button>
                          </div>
                        </div>

                        {/* Filtros */}
                        {showIncidentFilters && (
                          <div className="card mb-4">
                            <div className="card-header">
                              <h6 className="mb-0">Filtros</h6>
                            </div>
                            <div className="card-body">
                            <div className="row g-3">
                              <div className="col-md-3">
                                <label className="form-label">Búsqueda de texto</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Buscar en descripción, área, reportero..."
                                  value={incidentFilters.searchText}
                                  onChange={(e) => setIncidentFilters({ ...incidentFilters, searchText: e.target.value })}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Área afectada</label>
                                <select
                                  className="form-select"
                                  value={incidentFilters.affectedArea}
                                  onChange={(e) => setIncidentFilters({ ...incidentFilters, affectedArea: e.target.value })}
                                >
                                  <option value="">Todas</option>
                                  {getUniqueAreas().map(area => (
                                    <option key={area} value={area}>{area}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Usuario mencionado</label>
                                <select
                                  className="form-select"
                                  value={incidentFilters.mentionedUser}
                                  onChange={(e) => setIncidentFilters({ ...incidentFilters, mentionedUser: e.target.value })}
                                >
                                  <option value="">Todos</option>
                                  {getUniqueMentionedUsers().map(user => (
                                    <option key={user} value={user}>@{user}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Propiedad mencionada</label>
                                <select
                                  className="form-select"
                                  value={incidentFilters.mentionedProperty}
                                  onChange={(e) => setIncidentFilters({ ...incidentFilters, mentionedProperty: e.target.value })}
                                >
                                  <option value="">Todas</option>
                                  {getUniqueMentionedProperties().map(prop => (
                                    <option key={prop} value={prop}>#{prop}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-1">
                                <label className="form-label">Prioridad</label>
                                <select
                                  className="form-select"
                                  value={incidentFilters.priority}
                                  onChange={(e) => setIncidentFilters({ ...incidentFilters, priority: e.target.value })}
                                >
                                  <option value="">Todas</option>
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High</option>
                                  <option value="Critical">Critical</option>
                                </select>
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Desde</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={incidentFilters.dateFrom}
                                  onChange={(e) => setIncidentFilters({ ...incidentFilters, dateFrom: e.target.value })}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Hasta</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={incidentFilters.dateTo}
                                  onChange={(e) => setIncidentFilters({ ...incidentFilters, dateTo: e.target.value })}
                                />
                              </div>
                              <div className="col-md-12">
                                <button 
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => setIncidentFilters({
                                    affectedArea: '',
                                    mentionedUser: '',
                                    mentionedProperty: '',
                                    dateFrom: '',
                                    dateTo: '',
                                    priority: '',
                                    searchText: '',
                                  })}
                                >
                                  <i className="bi-x-circle me-1"></i>
                                  Limpiar filtros
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        )}

                        {/* Tabla de incidencias */}
                        {loadingIncidents ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando incidencias...</p>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead className="table-light">
                                <tr>
                                  <th className="text-start ps-3">Fecha</th>
                                  <th className="text-start">Reportado por</th>
                                  <th className="text-start">Área afectada</th>
                                  <th className="text-start">Descripción</th>
                                  <th className="text-center">Prioridad</th>
                                  <th className="text-center">Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getFilteredIncidents().length > 0 ? (
                                  getFilteredIncidents().map((incident) => (
                                    <tr key={incident.id}>
                                      <td className="text-start ps-3">
                                        {new Date(incident.reportDate).toLocaleDateString('es-ES', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </td>
                                      <td className="text-start">{incident.reportedBy}</td>
                                      <td className="text-start">{incident.affectedArea}</td>
                                      <td className="text-start">
                                        <div 
                                          style={{ maxWidth: '400px', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}
                                          dangerouslySetInnerHTML={{ __html: renderTextWithMentions(incident.description, true) }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        {incident.priority === 'Critical' ? (
                                          <span className="badge bg-danger">Critical</span>
                                        ) : incident.priority === 'High' ? (
                                          <span className="badge bg-warning text-dark">High</span>
                                        ) : incident.priority === 'Low' ? (
                                          <span className="badge bg-secondary">Low</span>
                                        ) : (
                                          <span className="badge bg-info">Medium</span>
                                        )}
                                      </td>
                                      <td className="text-center">
                                        <div className="d-flex gap-1 justify-content-center">
                                          <button
                                            className="btn btn-sm btn-outline-primary position-relative"
                                            onClick={() => viewIncidentDetail(incident)}
                                            title="Ver detalles y comentarios"
                                          >
                                            <i className="bi-chat-dots"></i>
                                            {getCommentCount(incident.id) > 0 && (
                                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.65rem' }}>
                                                {getCommentCount(incident.id)}
                                              </span>
                                            )}
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={6} className="text-center text-muted py-5">
                                      <i className="bi-inbox fs-1 d-block mb-3"></i>
                                      <h5>No hay incidencias</h5>
                                      <p>Haz clic en "Nueva Incidencia" para crear tu primera incidencia.</p>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ) : showIncidentForm ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div className="d-flex align-items-center gap-3">
                            <i className="bi-exclamation-triangle text-dark fs-4" style={{ lineHeight: '1' }}></i>
                            <h3 className="mb-0"><i className="bi-exclamation-triangle me-2"></i>Nueva Incidencia</h3>
                          </div>
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => {
                              setShowIncidentForm(false);
                              setNewIncidentForm({
                                reportedBy: '',
                                reportDate: new Date().toISOString().split('T')[0],
                                affectedArea: '',
                                description: '',
                                priority: 'Medium',
                              });
                            }}
                          >
                            <i className="bi-arrow-left me-1"></i>
                            Volver
                          </button>
                        </div>

                        <div className="card">
                          <div className="card-body">
                            <form onSubmit={(e) => { e.preventDefault(); createIncident(); }}>
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label className="form-label">Persona que reporta <span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={newIncidentForm.reportedBy}
                                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, reportedBy: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">Fecha del reporte <span className="text-danger">*</span></label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={newIncidentForm.reportDate}
                                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, reportDate: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">Prioridad</label>
                                  <select
                                    className="form-select"
                                    value={newIncidentForm.priority}
                                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, priority: e.target.value })}
                                  >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                  </select>
                                </div>
                                <div className="col-md-12">
                                  <label className="form-label">Área afectada <span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: Limpieza, Inventario, Check-in, etc."
                                    value={newIncidentForm.affectedArea}
                                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, affectedArea: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="col-md-12">
                                  <label className="form-label">Descripción <span className="text-danger">*</span></label>
                                  <textarea
                                    className="form-control"
                                    rows={6}
                                    placeholder="Describe la incidencia. Puedes usar @usuario para mencionar usuarios y #propiedad para mencionar propiedades."
                                    value={newIncidentForm.description}
                                    onChange={(e) => setNewIncidentForm({ ...newIncidentForm, description: e.target.value })}
                                    required
                                  />
                                  <small className="text-muted">
                                    Tip: Usa @usuario para mencionar usuarios y #propiedad para mencionar propiedades. Ej: "Problema reportado por @juan en #apartment101"
                                  </small>
                                </div>
                                <div className="col-md-12">
                                  <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                      <i className="bi-check-circle me-1"></i>
                                      Crear Incidencia
                                    </button>
                                    <button 
                                      type="button"
                                      className="btn btn-outline-secondary"
                                      onClick={() => {
                                        setShowIncidentForm(false);
                                        setNewIncidentForm({
                                          reportedBy: '',
                                          reportDate: new Date().toISOString().split('T')[0],
                                          affectedArea: '',
                                          description: '',
                                          priority: 'Medium',
                                        });
                                      }}
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    ) : showIncidentDetail && selectedIncident ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div className="d-flex align-items-center gap-3">
                            <i className="bi-exclamation-triangle text-dark fs-4" style={{ lineHeight: '1' }}></i>
                            <h3 className="mb-0"><i className="bi-exclamation-triangle me-2"></i>Detalle de Incidencia</h3>
                          </div>
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => {
                              setShowIncidentDetail(false);
                              setSelectedIncident(null);
                              setIncidentComments([]);
                            }}
                          >
                            <i className="bi-arrow-left me-1"></i>
                            Volver
                          </button>
                        </div>

                        <div className="card mb-4">
                          <div className="card-header">
                            <h5 className="mb-0">Información de la Incidencia</h5>
                          </div>
                          <div className="card-body">
                            <div className="row g-3">
                              <div className="col-md-3">
                                <strong>Fecha:</strong>
                                <p>{new Date(selectedIncident.reportDate).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</p>
                              </div>
                              <div className="col-md-3">
                                <strong>Reportado por:</strong>
                                <p>{selectedIncident.reportedBy}</p>
                              </div>
                              <div className="col-md-3">
                                <strong>Área afectada:</strong>
                                <p>{selectedIncident.affectedArea}</p>
                              </div>
                              <div className="col-md-3">
                                <strong>Prioridad:</strong>
                                <p>
                                  {selectedIncident.priority === 'Critical' ? (
                                    <span className="badge bg-danger">Critical</span>
                                  ) : selectedIncident.priority === 'High' ? (
                                    <span className="badge bg-warning text-dark">High</span>
                                  ) : selectedIncident.priority === 'Low' ? (
                                    <span className="badge bg-secondary">Low</span>
                                  ) : (
                                    <span className="badge bg-info">Medium</span>
                                  )}
                                </p>
                              </div>
                              <div className="col-md-12">
                                <strong>Descripción:</strong>
                                <div 
                                  className="p-3 bg-light rounded mt-2"
                                  style={{ whiteSpace: 'pre-wrap' }}
                                  dangerouslySetInnerHTML={{ __html: renderTextWithMentions(selectedIncident.description) }}
                                />
                              </div>
                              {(selectedIncident.mentionedUsers && selectedIncident.mentionedUsers.length > 0) || 
                               (selectedIncident.mentionedProperties && selectedIncident.mentionedProperties.length > 0) ? (
                                <div className="col-md-12">
                                  <strong>Menciones:</strong>
                                  <div className="d-flex flex-wrap gap-2 mt-2">
                                    {selectedIncident.mentionedUsers?.map(user => (
                                      <span key={user} className="badge bg-primary">@{user}</span>
                                    ))}
                                    {selectedIncident.mentionedProperties?.map(prop => (
                                      <span key={prop} className="badge bg-info">#{prop}</span>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="card mb-4">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Comentarios ({incidentComments.length})</h5>
                          </div>
                          <div className="card-body">
                            {incidentComments.length > 0 ? (
                              <div className="mb-4">
                                {incidentComments.map((comment) => (
                                  <div key={comment.id} className="border-bottom pb-3 mb-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      <div>
                                        <strong>{comment.commentedBy}</strong>
                                        <small className="text-muted ms-2">
                                          {new Date(comment.commentedAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </small>
                                      </div>
                                    </div>
                                    <div 
                                      style={{ whiteSpace: 'pre-wrap' }}
                                      dangerouslySetInnerHTML={{ __html: renderTextWithMentions(comment.comment) }}
                                    />
                                    {(comment.mentionedUsers && comment.mentionedUsers.length > 0) || 
                                     (comment.mentionedProperties && comment.mentionedProperties.length > 0) ? (
                                      <div className="mt-2">
                                        {comment.mentionedUsers?.map(user => (
                                          <span key={user} className="badge bg-primary me-1">@{user}</span>
                                        ))}
                                        {comment.mentionedProperties?.map(prop => (
                                          <span key={prop} className="badge bg-info me-1">#{prop}</span>
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted">No hay comentarios aún.</p>
                            )}
                            
                            <div className="border-top pt-3">
                              <label className="form-label">Agregar comentario</label>
                              <textarea
                                className="form-control mb-2"
                                rows={3}
                                placeholder="Escribe tu comentario. Puedes usar @usuario y #propiedad para mencionar."
                                value={newCommentForm.comment}
                                onChange={(e) => setNewCommentForm({ comment: e.target.value })}
                              />
                              <small className="text-muted d-block mb-2">
                                Tip: Usa @usuario para mencionar usuarios y #propiedad para mencionar propiedades.
                              </small>
                              <button 
                                className="btn btn-primary"
                                onClick={() => addComment(selectedIncident.id)}
                              >
                                <i className="bi-plus-circle me-1"></i>
                                Agregar Comentario
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : showIncidentStats ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div className="d-flex align-items-center gap-3">
                            <i className="bi-graph-up text-dark fs-4" style={{ lineHeight: '1' }}></i>
                            <h3 className="mb-0">Estadísticas de Incidencias</h3>
                          </div>
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => setShowIncidentStats(false)}
                          >
                            <i className="bi-arrow-left me-1"></i>
                            Volver
                          </button>
                        </div>

                        <div className="row g-4 mb-4">
                          <div className="col-md-3">
                            <div className="card text-center">
                              <div className="card-body">
                                <h6 className="card-title text-muted mb-2">Total Incidencias</h6>
                                <h3 className="mb-0 text-primary">{getFilteredIncidents().length}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card text-center">
                              <div className="card-body">
                                <h6 className="card-title text-muted mb-2">Áreas Únicas</h6>
                                <h3 className="mb-0 text-info">{getUniqueAreas().length}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card text-center">
                              <div className="card-body">
                                <h6 className="card-title text-muted mb-2">Usuarios Mencionados</h6>
                                <h3 className="mb-0 text-success">{getUniqueMentionedUsers().length}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card text-center">
                              <div className="card-body">
                                <h6 className="card-title text-muted mb-2">Propiedades Mencionadas</h6>
                                <h3 className="mb-0 text-warning">{getUniqueMentionedProperties().length}</h3>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row g-4">
                          <div className="col-md-6">
                            <div className="card">
                              <div className="card-header">
                                <h6 className="mb-0">Incidencias por Área</h6>
                              </div>
                              <div className="card-body">
                                {getIncidentsByArea().length > 0 ? (
                                  <div className="table-responsive">
                                    <table className="table table-sm">
                                      <thead>
                                        <tr>
                                          <th>Área</th>
                                          <th className="text-end">Cantidad</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getIncidentsByArea().map(([area, count]) => (
                                          <tr key={area}>
                                            <td>{area}</td>
                                            <td className="text-end">
                                              <span className="badge bg-primary">{count}</span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p className="text-muted">No hay datos disponibles.</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card">
                              <div className="card-header">
                                <h6 className="mb-0">Incidencias por Reportero</h6>
                              </div>
                              <div className="card-body">
                                {getIncidentsByReporter().length > 0 ? (
                                  <div className="table-responsive">
                                    <table className="table table-sm">
                                      <thead>
                                        <tr>
                                          <th>Reportero</th>
                                          <th className="text-end">Cantidad</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getIncidentsByReporter().map(([reporter, count]) => (
                                          <tr key={reporter}>
                                            <td>{reporter}</td>
                                            <td className="text-end">
                                              <span className="badge bg-info">{count}</span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p className="text-muted">No hay datos disponibles.</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card">
                              <div className="card-header">
                                <h6 className="mb-0">Propiedades Más Mencionadas</h6>
                              </div>
                              <div className="card-body">
                                {getMostMentionedProperties().length > 0 ? (
                                  <div className="table-responsive">
                                    <table className="table table-sm">
                                      <thead>
                                        <tr>
                                          <th>Propiedad</th>
                                          <th className="text-end">Menciones</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getMostMentionedProperties().slice(0, 10).map(([prop, count]) => (
                                          <tr key={prop}>
                                            <td>#{prop}</td>
                                            <td className="text-end">
                                              <span className="badge bg-warning text-dark">{count}</span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p className="text-muted">No hay propiedades mencionadas.</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card">
                              <div className="card-header">
                                <h6 className="mb-0">Usuarios Más Mencionados</h6>
                              </div>
                              <div className="card-body">
                                {getMostMentionedUsers().length > 0 ? (
                                  <div className="table-responsive">
                                    <table className="table table-sm">
                                      <thead>
                                        <tr>
                                          <th>Usuario</th>
                                          <th className="text-end">Menciones</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getMostMentionedUsers().slice(0, 10).map(([user, count]) => (
                                          <tr key={user}>
                                            <td>@{user}</td>
                                            <td className="text-end">
                                              <span className="badge bg-success">{count}</span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p className="text-muted">No hay usuarios mencionados.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
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
