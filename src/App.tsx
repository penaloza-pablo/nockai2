
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

interface ExpectedUsageItem {
  id: string;
  bookingId: string;
  guestCount: number;
  wine: number;
  water: number;
  coffeeCapsules: number;
  checkIn: string;
  checkOut: string;
}

const sections: Section[] = [
  {
    id: 'ops',
    title: 'Operations',
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
    title: 'Technology',
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
    title: 'Marketing',
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
  const [lastUpdateDate, setLastUpdateDate] = useState<string>('04/08/2025');
  const [updateQuantities, setUpdateQuantities] = useState<{[key: string]: number}>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showExpectedUsageTable, setShowExpectedUsageTable] = useState<boolean>(false);
  const [expectedUsageItems, setExpectedUsageItems] = useState<ExpectedUsageItem[]>([]);
  const [fetchingGuesty, setFetchingGuesty] = useState<boolean>(false);
  const [executingFunction, setExecutingFunction] = useState<boolean>(false);
  const [functionResult, setFunctionResult] = useState<string>('');

  // Calculate stock status for preview
  const getStockStatus = () => {
    const validItems = inventoryItems.filter(item => item !== null);
    const lowStock = validItems.filter(item => item && item.qty && item.rebuyQty && item.qty <= item.rebuyQty && item.qty > item.rebuyQty * 0.5).length;
    const reorderNeeded = validItems.filter(item => item && item.qty && item.rebuyQty && item.qty <= item.rebuyQty).length;
    return { lowStock, reorderNeeded };
  };

  const stockStatus = getStockStatus();

  // Load inventory data when component mounts
  useEffect(() => {
    fetchInventoryData();
    loadLastUpdateDate();
  }, []);

  useEffect(() => {
    if (showInventoryTable) {
      fetchInventoryData();
    }
  }, [showInventoryTable]);

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

  const getCurrentSection = () => sections.find(s => s.id === currentSection);
  const getCurrentFeature = () => {
    const section = getCurrentSection();
    return section?.features.find(f => f.id === currentFeature);
  };

  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId);
    const section = sections.find(s => s.id === sectionId);
    if (section && section.features.length > 0) {
      setCurrentFeature(section.features[0].id);
    }
    setShowInventoryTable(false);
  };

  const handleFeatureChange = (featureId: string) => {
    setCurrentFeature(featureId);
    setShowInventoryTable(false);
  };

  const handleInventoryCardClick = () => {
    console.log('handleInventoryCardClick called');
    setShowInventoryTable(true);
    setShowUpdateForm(false);
  };

  const handleUpdateCardClick = () => {
    setShowUpdateForm(true);
    setShowInventoryTable(false);
    setShowExpectedUsageTable(false);
    
    // Initialize update quantities with current values
    const initialQuantities: {[key: string]: number} = {};
    inventoryItems.forEach(item => {
      if (item && item.id) {
        initialQuantities[item.id] = item.qty || 0;
      }
    });
    setUpdateQuantities(initialQuantities);
  };

  const handleExpectedUsageCardClick = () => {
    setShowExpectedUsageTable(true);
    setShowInventoryTable(false);
    setShowUpdateForm(false);
    fetchExpectedUsageData();
  };

  const handleQuantityChange = (itemId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setUpdateQuantities(prev => ({
      ...prev,
      [itemId]: numValue
    }));
  };

  const handleSubmitUpdate = async () => {
    setSubmitting(true);
    try {
      console.log('Submitting inventory updates...');
      
      // Update all inventory items
      for (const [itemId, newQty] of Object.entries(updateQuantities)) {
        const item = inventoryItems.find(i => i && i.id === itemId);
        if (item) {
          await client.models.Inventory.update({
            id: itemId,
            qty: newQty,
            rebuyQty: item.rebuyQty
          });
          console.log(`Updated ${itemId} to qty: ${newQty}`);
        }
      }
      
      // Create or update last update record
      const now = new Date().toISOString();
      const { data: lastUpdateRecord } = await client.models.LastUpdate.create({
        lastUpdateSubmit: now
      });
      console.log('Created last update record:', lastUpdateRecord);
      
      // Update the display date
      const formattedDate = new Date(now).toLocaleDateString('en-GB');
      setLastUpdateDate(formattedDate);
      
      // Refresh inventory data
      await fetchInventoryData();
      
      // Close the update form
      setShowUpdateForm(false);
      
    } catch (error) {
      console.error('Error submitting updates:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const loadLastUpdateDate = async () => {
    try {
      const { data: lastUpdateRecords } = await client.models.LastUpdate.list();
      if (lastUpdateRecords && lastUpdateRecords.length > 0) {
        const latestRecord = lastUpdateRecords[lastUpdateRecords.length - 1];
        if (latestRecord && latestRecord.lastUpdateSubmit) {
          const formattedDate = new Date(latestRecord.lastUpdateSubmit).toLocaleDateString('en-GB');
          setLastUpdateDate(formattedDate);
        }
      }
    } catch (error) {
      console.error('Error loading last update date:', error);
    }
  };

  const fetchExpectedUsageData = async () => {
    setLoading(true);
    try {
      const { data } = await client.models.ExpectedUsage.list();
      const validItems = data.filter((item: any) => item !== null);
      setExpectedUsageItems(validItems);
    } catch (error) {
      console.error('Error fetching expected usage data:', error);
      setExpectedUsageItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetFromGuesty = async () => {
    setFetchingGuesty(true);
    try {
      // Get the last update date
      const { data: lastUpdateRecords } = await client.models.LastUpdate.list();
      let startDate = new Date();
      if (lastUpdateRecords && lastUpdateRecords.length > 0) {
        const latestRecord = lastUpdateRecords[lastUpdateRecords.length - 1];
        if (latestRecord && latestRecord.lastUpdateSubmit) {
          startDate = new Date(latestRecord.lastUpdateSubmit);
        }
      }
      
      const endDate = new Date();
      
      // Call the Lambda function
      const response = await fetch('/api/fetchGuestyBookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch from Guesty');
      }
      
      // Refresh the expected usage data
      await fetchExpectedUsageData();
      
    } catch (error) {
      console.error('Error fetching from Guesty:', error);
      alert('Se produjo un error: imposible conectar con Guesty');
    } finally {
      setFetchingGuesty(false);
    }
  };

  const handleExecuteFunction = async () => {
    setExecutingFunction(true);
    setFunctionResult('');
    try {
      // Call the my-first-function Lambda using the Function URL
      const response = await fetch('https://ucx62yjkuhs4lofrfjeicvdaim0mkiac.lambda-url.eu-central-1.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.text();
      setFunctionResult(result);
      
    } catch (error) {
      console.error('Error executing function:', error);
      setFunctionResult('Error: No se pudo ejecutar la función. Verifica la configuración de la Function URL.');
    } finally {
      setExecutingFunction(false);
    }
  };



  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <a href="#" className="nav-brand me-4" onClick={(e) => e.preventDefault()}>
            <img src="/vite.svg" alt="noc.ai Logo" className="me-2" style={{ width: '24px', height: '24px' }} />
            noc.ai
          </a>
          <ul className="nav-links">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href="#"
                  className={currentSection === section.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionChange(section.id);
                  }}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white small">
            {user?.username || 'User'}
          </span>
          <button className="btn btn-link text-white p-0" onClick={signOut}>
            <i className="bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
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
        <main className="content-area">
          {getCurrentFeature() && (
            <>
              <div className="content-header">
                <div className="d-flex align-items-center gap-3">
                  <i className={`${getCurrentFeature()?.icon} fs-1`} style={{ color: 'var(--nokai-text)' }}></i>
                  <div>
                    <h1 className="content-title">{getCurrentFeature()?.title}</h1>
                    <p className="content-subtitle">{getCurrentFeature()?.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="content-body">
                {(() => {
                  return null;
                })()}
                {currentFeature === 'inventory' && !showInventoryTable && !showUpdateForm && !showExpectedUsageTable ? (
                  <div className="row">
                    <div className="col-md-4">
                      <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '50vh' }} onClick={handleInventoryCardClick}>
                        <div className="card-body">
                          <h4><i className="bi-database me-2"></i>Stock</h4>
                          <p>Displays the last saved inventory update.</p>
                          <div className="mt-3">
                            <ul className="list-unstyled">
                              <li className="d-flex align-items-center justify-content-between">
                                <span style={{ color: 'rgba(243, 156, 18, 0.8)' }}>
                                  <i className="bi-exclamation-triangle me-2"></i>
                                  Low Stock
                                </span>
                                <strong style={{ color: 'rgba(243, 156, 18, 0.8)' }}>{stockStatus.lowStock}</strong>
                              </li>
                              <li className="d-flex align-items-center justify-content-between">
                                <span style={{ color: 'rgba(231, 76, 60, 0.8)' }}>
                                  <i className="bi-x-circle me-2"></i>
                                  Reorder Needed
                                </span>
                                <strong style={{ color: 'rgba(231, 76, 60, 0.8)' }}>{stockStatus.reorderNeeded}</strong>
                              </li>
                            </ul>
                          </div>
                          <div className="mt-auto">
                            <small className="text-primary">Detailed stock →</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '50vh' }} onClick={handleUpdateCardClick}>
                        <div className="card-body">
                          <h4><i className="bi-pencil-square me-2"></i>Update</h4>
                          <p>Update the actual stock to reflect current inventory levels.</p>
                          <div className="mt-3">
                            <h6>Last update submit: {lastUpdateDate}</h6>
                          </div>
                          <div className="mt-auto">
                            <small className="text-primary">Update inventory →</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '50vh' }} onClick={handleExpectedUsageCardClick}>
                        <div className="card-body">
                          <h4><i className="bi-graph-up me-2"></i>Expected Usage</h4>
                          <p>Tracks stock used based on bookings since the last update.</p>
                          <div className="mt-3">
                            <h6>Total bookings: {expectedUsageItems.length}</h6>
                          </div>
                          <div className="mt-auto">
                            <small className="text-primary">Consumption details →</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentFeature === 'inventory' && showInventoryTable ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi-database text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Stock</h3>
                      </div>
                      <button className="btn btn-outline-secondary" onClick={() => setShowInventoryTable(false)}>
                        <i className="bi-arrow-left me-1"></i>Back
                      </button>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading inventory data...</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table">
                          <thead className="table-light">
                            <tr>
                              <th className="text-start ps-3">Item</th>
                              <th className="text-center">Quantity</th>
                              <th className="text-center">Rebuy Qty</th>
                              <th className="text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventoryItems.length > 0 ? (
                              inventoryItems.filter(item => item !== null).map((item) => (
                                <tr key={item.id}>
                                  <td className="text-start ps-3">
                                    {item.id}
                                  </td>
                                  <td className="text-center">
                                    {item.qty?.toLocaleString() || 0}
                                  </td>
                                  <td className="text-center">
                                    {item.rebuyQty?.toLocaleString() || 0}
                                  </td>
                                  <td className="text-center">
                                    {item.qty && item.rebuyQty ? (
                                      item.qty <= item.rebuyQty ? (
                                        <span className="badge" style={{ backgroundColor: 'rgba(231, 76, 60, 0.8)', color: 'white', minWidth: '100px' }}>
                                          <i className="bi-x-circle me-1"></i>
                                          Reorder
                                        </span>
                                      ) : item.qty > item.rebuyQty && item.qty < item.rebuyQty * 1.25 ? (
                                        <span className="badge" style={{ backgroundColor: 'rgba(243, 156, 18, 0.8)', color: 'white', minWidth: '100px' }}>
                                          <i className="bi-exclamation-triangle me-1"></i>
                                          Low Stock
                                        </span>
                                      ) : (
                                        <span className="badge" style={{ backgroundColor: 'rgba(39, 174, 96, 0.8)', color: 'white', minWidth: '100px' }}>
                                          <i className="bi-check-circle me-1"></i>
                                          Healthy
                                        </span>
                                      )
                                    ) : (
                                      <span className="text-muted">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center text-muted py-5">
                                  <i className="bi-inbox fs-1 d-block mb-3"></i>
                                  <h5>No inventory items found</h5>
                                  <p>Add some items to DynamoDB to see them here.</p>
                                  <small className="text-muted">
                                    Make sure you have deployed the backend and added items to the Inventory table.
                                  </small>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        
                        {inventoryItems.length > 0 && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <div className="row text-center">
                              <div className="col-md-4">
                                <div style={{ color: 'rgba(39, 174, 96, 0.8)' }}>
                                  <i className="bi-check-circle fs-4"></i>
                                  <div className="small">Healthy</div>
                                  <strong>{inventoryItems.filter(item => item && item.qty && item.rebuyQty && item.qty >= item.rebuyQty * 1.25).length}</strong>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div style={{ color: 'rgba(243, 156, 18, 0.8)' }}>
                                  <i className="bi-exclamation-triangle fs-4"></i>
                                  <div className="small">Low Stock</div>
                                  <strong>{inventoryItems.filter(item => item && item.qty && item.rebuyQty && item.qty > item.rebuyQty && item.qty < item.rebuyQty * 1.25).length}</strong>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div style={{ color: 'rgba(231, 76, 60, 0.8)' }}>
                                  <i className="bi-x-circle fs-4"></i>
                                  <div className="small">Reorder Needed</div>
                                  <strong>{inventoryItems.filter(item => item && item.qty && item.rebuyQty && item.qty <= item.rebuyQty).length}</strong>
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
                      <button className="btn btn-outline-secondary" onClick={() => setShowUpdateForm(false)}>
                        <i className="bi-arrow-left me-1"></i>Back
                      </button>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading inventory data...</p>
                      </div>
                    ) : (
                      <div>
                        <div className="table-responsive">
                          <table className="table">
                            <thead className="table-light">
                              <tr>
                                <th className="text-start ps-3">Item</th>
                                <th className="text-center">Current Qty</th>
                                <th className="text-center">New Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inventoryItems.filter(item => item !== null).map((item) => (
                                <tr key={item.id}>
                                  <td className="text-start ps-3">
                                    {item.id}
                                  </td>
                                  <td className="text-center">
                                    {item.qty?.toLocaleString() || 0}
                                  </td>
                                  <td className="text-center">
                                    <div className="d-flex justify-content-center">
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={updateQuantities[item.id] || ''}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        min="0"
                                        style={{ width: '100px' }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <div className="text-muted">
                            <small>Make sure all quantities are filled before submitting</small>
                          </div>
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
                                Updating...
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
                        <h3 className="mb-0">Expected Usage</h3>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn" 
                          onClick={handleGetFromGuesty}
                          disabled={fetchingGuesty}
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
                          {fetchingGuesty ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Fetching...
                            </>
                          ) : (
                            <>
                              <i className="bi-cloud-download me-2"></i>
                              Get from Guesty
                            </>
                          )}
                        </button>
                        <button 
                          className="btn btn-success" 
                          onClick={handleExecuteFunction}
                          disabled={executingFunction}
                          style={{ 
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          {executingFunction ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Ejecutando...
                            </>
                          ) : (
                            <>
                              <i className="bi-play-circle me-2"></i>
                              Ejecutar Función
                            </>
                          )}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => setShowExpectedUsageTable(false)}>
                          <i className="bi-arrow-left me-1"></i>Back
                        </button>
                      </div>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading expected usage data...</p>
                      </div>
                    ) : (
                      <div>
                        <div className="table-responsive">
                          <table className="table">
                            <thead className="table-light">
                              <tr>
                                <th className="text-start ps-3">Booking ID</th>
                                <th className="text-center">Guests</th>
                                <th className="text-center">Wine</th>
                                <th className="text-center">Water</th>
                                <th className="text-center">Coffee Capsules</th>
                                <th className="text-center">Check In</th>
                                <th className="text-center">Check Out</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expectedUsageItems.length > 0 ? (
                                expectedUsageItems.filter(item => item !== null).map((item) => (
                                  <tr key={item.id}>
                                    <td className="text-start ps-3">
                                      {item.bookingId}
                                    </td>
                                    <td className="text-center">
                                      {item.guestCount}
                                    </td>
                                    <td className="text-center">
                                      {item.wine}
                                    </td>
                                    <td className="text-center">
                                      {item.water}
                                    </td>
                                    <td className="text-center">
                                      {item.coffeeCapsules}
                                    </td>
                                    <td className="text-center">
                                      {new Date(item.checkIn).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="text-center">
                                      {new Date(item.checkOut).toLocaleDateString('en-GB')}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={7} className="text-center text-muted py-5">
                                    <i className="bi-inbox fs-1 d-block mb-3"></i>
                                    <h5>No expected usage data found</h5>
                                    <p>Click "Get from Guesty" to fetch booking data.</p>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        
                        {expectedUsageItems.length > 0 && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <div className="row text-center">
                              <div className="col-md-3">
                                <div style={{ color: 'rgba(39, 174, 96, 0.8)' }}>
                                  <i className="bi-wine-bottle fs-4"></i>
                                  <div className="small">Total Wine</div>
                                  <strong>{expectedUsageItems.reduce((sum, item) => sum + item.wine, 0)}</strong>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div style={{ color: 'rgba(243, 156, 18, 0.8)' }}>
                                  <i className="bi-droplet fs-4"></i>
                                  <div className="small">Total Water</div>
                                  <strong>{expectedUsageItems.reduce((sum, item) => sum + item.water, 0)}</strong>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div style={{ color: 'rgba(231, 76, 60, 0.8)' }}>
                                  <i className="bi-cup-hot fs-4"></i>
                                  <div className="small">Total Coffee Capsules</div>
                                  <strong>{expectedUsageItems.reduce((sum, item) => sum + item.coffeeCapsules, 0)}</strong>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div style={{ color: 'rgba(39, 174, 96, 0.8)' }}>
                                  <i className="bi-people fs-4"></i>
                                  <div className="small">Total Guests</div>
                                  <strong>{expectedUsageItems.reduce((sum, item) => sum + item.guestCount, 0)}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Function Result Section */}
                        {functionResult && (
                          <div className="mt-3 p-3 bg-success bg-opacity-10 border border-success rounded">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <i className="bi-check-circle text-success"></i>
                              <h6 className="mb-0 text-success">Resultado de la Función</h6>
                            </div>
                            <div className="p-3 bg-white rounded border">
                              <code className="text-dark">{functionResult}</code>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="card">
                    <h4>Overview</h4>
                    <p>{getCurrentFeature()?.content}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
