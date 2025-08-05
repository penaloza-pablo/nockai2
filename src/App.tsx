
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

const sections: Section[] = [
  {
    id: 'ops',
    title: 'Operations',
    features: [
      {
        id: 'inventory',
        title: 'Inventory',
        description: 'Track and manage inventory across all locations',
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
    
    // Initialize update quantities with current values
    const initialQuantities: {[key: string]: number} = {};
    inventoryItems.forEach(item => {
      if (item && item.id) {
        initialQuantities[item.id] = item.qty || 0;
      }
    });
    setUpdateQuantities(initialQuantities);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                  <i className={`${getCurrentFeature()?.icon} fs-1 text-primary`}></i>
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
                {currentFeature === 'inventory' && !showInventoryTable && !showUpdateForm ? (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '50vh' }} onClick={handleInventoryCardClick}>
                        <div className="card-body">
                          <h4><i className="bi-database me-2"></i>Stock</h4>
                          <p>Displays the last saved inventory update.</p>
                          <div className="mt-3">
                            <ul className="list-unstyled">
                              <li className="d-flex align-items-center justify-content-between">
                                <span className="text-warning">
                                  <i className="bi-exclamation-triangle me-2"></i>
                                  Low Stock
                                </span>
                                <strong className="text-warning">{stockStatus.lowStock}</strong>
                              </li>
                              <li className="d-flex align-items-center justify-content-between">
                                <span className="text-danger">
                                  <i className="bi-x-circle me-2"></i>
                                  Reorder Needed
                                </span>
                                <strong className="text-danger">{stockStatus.reorderNeeded}</strong>
                              </li>
                            </ul>
                          </div>
                          <div className="mt-auto">
                            <small className="text-primary">Detailed stock →</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
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
                              <th className="text-center">Item</th>
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
                                    <div className="d-flex align-items-center">
                                      <i className="bi-box me-2 text-primary"></i>
                                      <strong>{item.id}</strong>
                                    </div>
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
                                        <span className="badge bg-danger">
                                          <i className="bi-exclamation-triangle me-1"></i>
                                          Reorder
                                        </span>
                                      ) : (
                                        <span className="badge bg-success">
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
                                <div className="text-success">
                                  <i className="bi-check-circle fs-4"></i>
                                  <div className="small">Healthy</div>
                                  <strong>{inventoryItems.filter(item => item && item.qty && item.rebuyQty && item.qty > item.rebuyQty).length}</strong>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-warning">
                                  <i className="bi-exclamation-triangle fs-4"></i>
                                  <div className="small">Low Stock</div>
                                  <strong>{inventoryItems.filter(item => item && item.qty && item.rebuyQty && item.qty <= item.rebuyQty && item.qty > item.rebuyQty * 0.5).length}</strong>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="text-danger">
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
                      <h3>Update inventory</h3>
                      <button className="btn btn-outline-secondary" onClick={() => setShowUpdateForm(false)}>
                        <i className="bi-arrow-left me-1"></i>Back to Inventory
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
                      <div className="card">
                        <div className="card-body">
                          <p className="text-muted mb-4">Update the quantities for each inventory item. All fields must be filled before submitting.</p>
                          
                          <div className="table-responsive">
                            <table className="table">
                              <thead className="table-light">
                                <tr>
                                  <th>Item</th>
                                  <th>Current Qty</th>
                                  <th>New Qty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inventoryItems.filter(item => item !== null).map((item) => (
                                  <tr key={item.id}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <i className="bi-box me-2 text-primary"></i>
                                        <strong>{item.id}</strong>
                                      </div>
                                    </td>
                                    <td>
                                      {item.qty?.toLocaleString() || 0}
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={updateQuantities[item.id] || ''}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        min="0"
                                        style={{ width: '100px' }}
                                      />
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
                              className="btn btn-primary" 
                              onClick={handleSubmitUpdate}
                              disabled={submitting || Object.keys(updateQuantities).length === 0}
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
