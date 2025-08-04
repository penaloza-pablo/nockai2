
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

// Define the structure for our sections and features
interface Feature {
  id: string;
  title: string;
  description: string;
  content: string;
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
        title: 'Inventory Management',
        description: 'Track and manage inventory across all locations',
        content: 'Comprehensive inventory management system for tracking stock levels, orders, and supplies across all operational locations. Features real-time updates, automated reorder points, and detailed reporting.',
        icon: 'bi-boxes'
      },
      {
        id: 'cleaning-report',
        title: 'Cleaning Report',
        description: 'Generate and manage cleaning reports',
        content: 'Advanced cleaning report system for monitoring maintenance schedules, quality control, and compliance tracking. Includes automated scheduling and performance analytics.',
        icon: 'bi-brush'
      },
      {
        id: 'auto-pc-assignation',
        title: 'Auto PC Assignment',
        description: 'Automated PC assignment system',
        content: 'Intelligent system for automatically assigning PCs to users based on availability, requirements, and usage patterns. Optimizes resource allocation and reduces manual overhead.',
        icon: 'bi-laptop'
      },
      {
        id: 'sms-central',
        title: 'SMS Central',
        description: 'Centralized SMS communication platform',
        content: 'Centralized SMS management system for sending notifications and communications to staff and customers. Features templates, scheduling, and delivery tracking.',
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
        icon: 'bi-people'
      },
      {
        id: 'client-crm',
        title: 'Client CRM',
        description: 'Customer relationship management for clients',
        content: 'Comprehensive CRM platform for managing client relationships, sales pipeline, and business opportunities. Includes lead management and sales forecasting.',
        icon: 'bi-briefcase'
      }
    ]
  }
];

function App() {
  const { signOut, user } = useAuthenticator();
  const [currentSection, setCurrentSection] = useState<string>('ops');
  const [currentFeature, setCurrentFeature] = useState<string>('inventory');
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    if (newTodoText.trim()) {
      client.models.Todo.create({ content: newTodoText.trim() });
      setNewTodoText('');
    }
  }

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
  };

  const handleFeatureChange = (featureId: string) => {
    setCurrentFeature(featureId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createTodo();
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav d-flex justify-content-between align-items-center">
        <a href="#" className="nav-brand" onClick={(e) => e.preventDefault()}>
          nokai
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
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          {getCurrentSection() && (
            <div>
              <div className="sidebar-title">{getCurrentSection()?.title}</div>
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
                <div className="card">
                  <p>{getCurrentFeature()?.content}</p>
                </div>
                
                {/* Demo content - Todo list */}
                <div className="card">
                  <h3>Demo: Todo List</h3>
                  <div className="d-flex gap-2 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter new todo..."
                    />
                    <button className="btn btn-primary" onClick={createTodo}>
                      <i className="bi-plus me-1"></i>
                      Add Todo
                    </button>
                  </div>
                  
                  {todos.length > 0 ? (
                    <ul>
                      {todos.map((todo) => (
                        <li key={todo.id}>
                          <i className="bi-check-circle text-success me-2"></i>
                          {todo.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted fst-italic">
                      <i className="bi-info-circle me-2"></i>
                      No todos yet. Add your first one above!
                    </p>
                  )}
                </div>
                
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted small">
                    <i className="bi-person me-1"></i>
                    Welcome, {user?.username || 'User'}!
                  </div>
                  <button className="btn btn-outline-secondary" onClick={signOut}>
                    <i className="bi-box-arrow-right me-1"></i>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
