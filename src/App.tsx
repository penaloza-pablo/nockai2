
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
  const [inventoryItems, setInventoryItems] = useState<Array<Schema["Inventory"]["type"]>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (showInventoryTable) {
      fetchInventoryData();
    }
  }, [showInventoryTable]);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const { data } = await client.models.Inventory.list();
      setInventoryItems(data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
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
    setShowInventoryTable(true);
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
                {currentFeature === 'inventory' && !showInventoryTable ? (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card h-100 inventory-card" style={{ cursor: 'pointer' }} onClick={handleInventoryCardClick}>
                        <div className="card-body">
                          <h4><i className="bi-database me-2"></i>Current Stock</h4>
                          <p>This section connects to a DynamoDB table with the following properties:</p>
                          <ul className="list-unstyled">
                            <li><i className="bi-check-circle text-success me-2"></i><strong>Item:</strong> Product name or identifier</li>
                            <li><i className="bi-check-circle text-success me-2"></i><strong>Cantidad:</strong> Current stock quantity</li>
                          </ul>
                          <p className="text-muted mt-3">The table will display real-time inventory levels for all items in stock.</p>
                          <div className="mt-auto">
                            <small className="text-primary">Click to view detailed stock information →</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card h-100 inventory-card" style={{ cursor: 'pointer' }}>
                        <div className="card-body">
                          <h4><i className="bi-pencil-square me-2"></i>Inventory Revision</h4>
                          <p>This module allows updating the actual stock quantities for each item in the inventory table.</p>
                          <div className="mt-3">
                            <h6>Example Items:</h6>
                            <ul className="list-unstyled">
                              <li><i className="bi-box me-2"></i>Vino</li>
                              <li><i className="bi-box me-2"></i>Agua</li>
                              <li><i className="bi-box me-2"></i>Café</li>
                            </ul>
                          </div>
                          <p className="text-muted mt-3">Staff can update quantities based on physical inventory counts to maintain accurate stock levels.</p>
                          <div className="mt-auto">
                            <small className="text-primary">Click to update inventory quantities →</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentFeature === 'inventory' && showInventoryTable ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3>Current Stock - Inventory Table</h3>
                      <button className="btn btn-outline-secondary" onClick={() => setShowInventoryTable(false)}>
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
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead className="table-dark">
                            <tr>
                              <th>Item</th>
                              <th>Cantidad</th>
                              <th>Categoría</th>
                              <th>Unidad</th>
                              <th>Ubicación</th>
                              <th>Última Actualización</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventoryItems.length > 0 ? (
                              inventoryItems.map((item) => (
                                <tr key={item.id}>
                                  <td><strong>{item.item}</strong></td>
                                  <td>
                                    <span className={`badge ${item.cantidad > 10 ? 'bg-success' : item.cantidad > 5 ? 'bg-warning' : 'bg-danger'}`}>
                                      {item.cantidad}
                                    </span>
                                  </td>
                                  <td>{item.categoria || '-'}</td>
                                  <td>{item.unidad || '-'}</td>
                                  <td>{item.ubicacion || '-'}</td>
                                  <td>{item.fechaActualizacion ? formatDate(item.fechaActualizacion) : '-'}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                  <i className="bi-inbox fs-1 d-block mb-2"></i>
                                  No inventory items found. Add some items to get started.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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
