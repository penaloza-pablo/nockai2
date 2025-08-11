
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

// Define the booking interface for the new API
interface Booking {
  bookingId: string;
  checkinDate: string;
  guests: number;
  listingNickname: string;
  nights: number;
  roomType: string;
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
  const [lastUpdateInfo, setLastUpdateInfo] = useState<{date: string, user: string}>({date: 'Loading...', user: 'Loading...'});
  const [updateQuantities, setUpdateQuantities] = useState<{[key: string]: number}>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showExpectedUsageTable, setShowExpectedUsageTable] = useState<boolean>(false);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [bookingsError, setBookingsError] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);

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
    loadLastUpdateInfo();
    fetchBookingsCount();
  }, []);

  useEffect(() => {
    if (showInventoryTable) {
      fetchInventoryData();
    }
  }, [showInventoryTable]);

  useEffect(() => {
    if (currentFeature === 'inventory') {
      loadLastUpdateInfo();
      fetchBookingsCount();
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

  const handleExpectedUsageCardClick = async () => {
    setShowExpectedUsageTable(true);
    setShowInventoryTable(false);
    setShowUpdateForm(false);
    await fetchBookingsCount();
    await fetchBookingsData();
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
      
      // Refresh the last update info from the API
      await loadLastUpdateInfo();
      
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
      const response = await fetch('https://objrydrxxmvup6a6fbnprxugzm0gbapz.lambda-url.eu-central-1.on.aws/', {
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
      
      if (data.reservationsCount !== undefined) {
        setBookingsCount(data.reservationsCount);
        setBookingsError('');
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
      const response = await fetch('https://t5lpzd66lrmg62glr3huobvvbq0ixpnb.lambda-url.eu-central-1.on.aws/', {
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
      console.log('Raw API response:', data);
      
      // Parse the body string to get the actual data
      const bodyData = JSON.parse(data.body);
      console.log('Parsed body data:', bodyData);
      
      // Extract bookings from the items array and map the field names
      const bookingsData = (bodyData.items || []).map((item: any) => ({
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
        <aside className="sidebar position-fixed" style={{ top: '60px', left: 0, width: '250px', height: 'calc(100vh - 60px)', overflowY: 'auto', zIndex: 1020 }}>
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
                {currentFeature === 'inventory' && !showInventoryTable && !showUpdateForm && !showExpectedUsageTable && (
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
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }} onClick={handleExpectedUsageCardClick}>
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
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }}>
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
                              <small className="text-primary">Coming soon →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-gear me-2"></i>Rules</h5>
                            <p className="mb-2 small">Business logic for inventory consumption calculations.</p>
                            <div className="mt-auto">
                              <div className="alert alert-warning py-2">
                                <small>
                                  <strong>Logic:</strong><br/>
                                  • Wine: 1/2 guests/night<br/>
                                  • Water: 2/guest/night<br/>
                                  • Coffee: 2/guest/night
                                </small>
                              </div>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">View rules →</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card h-100 inventory-card" style={{ cursor: 'pointer', maxHeight: '40vh', fontSize: '0.9em' }}>
                          <div className="card-body d-flex flex-column">
                            <h5 className="mb-2"><i className="bi-chart-line me-2"></i>Analytics</h5>
                            <p className="mb-2 small">Performance metrics and inventory insights.</p>
                            <div className="mt-auto">
                              <div className="alert alert-success py-2">
                                <small>
                                  <strong>Features:</strong> Track consumption patterns and optimize stock levels.
                                </small>
                              </div>
                            </div>
                            <div className="mt-2">
                              <small className="text-primary">View analytics →</small>
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
                        <i className="bi-calendar-check text-dark fs-4" style={{ lineHeight: '1' }}></i>
                        <h3 className="mb-0">Bookings</h3>
                      </div>
                      <button className="btn btn-outline-secondary" onClick={() => setShowExpectedUsageTable(false)}>
                        <i className="bi-arrow-left me-1"></i>Back
                      </button>
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
                            {bookings.length > 0 ? (
                              bookings.map((booking) => (
                                <tr key={booking.bookingId}>
                                  <td className="text-start ps-3">
                                    {booking.bookingId}
                                  </td>
                                  <td className="text-center">
                                    {new Date(booking.checkinDate).toLocaleDateString('en-GB')}
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
                          <div className="mt-3 p-3 bg-light rounded">
                            <div className="row text-center">
                              <div className="col-md-4">
                                <div style={{ color: 'rgba(39, 174, 96, 0.8)' }}>
                                  <i className="bi-calendar-check fs-4"></i>
                                  <div className="small">Total Bookings</div>
                                  <strong>{bookings.length}</strong>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div style={{ color: 'rgba(243, 156, 18, 0.8)' }}>
                                  <i className="bi-people fs-4"></i>
                                  <div className="small">Total Guests</div>
                                  <strong>{bookings.reduce((sum, booking) => sum + booking.guests, 0)}</strong>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div style={{ color: 'rgba(231, 76, 60, 0.8)' }}>
                                  <i className="bi-moon fs-4"></i>
                                  <div className="small">Total Nights</div>
                                  <strong>{bookings.reduce((sum, booking) => sum + booking.nights, 0)}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
