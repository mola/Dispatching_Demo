import React, { useState, useEffect } from 'react';
import { SavedNetwork } from '../types';

interface NetworkListProps {
  onSelectNetwork: (networkId: number) => void;
  onClose: () => void;
}

export const NetworkList: React.FC<NetworkListProps> = ({
  onSelectNetwork,
  onClose,
}) => {
  const [networks, setNetworks] = useState<SavedNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    try {
      const response = await fetch('/api/networks');
      if (response.ok) {
        const data = await response.json();
        setNetworks(data);
      }
    } catch (error) {
      console.error('Error fetching networks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (networkId: number) => {
    if (window.confirm('Are you sure you want to delete this network?')) {
      try {
        const response = await fetch(`/api/networks/${networkId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setNetworks(networks.filter(n => n.id !== networkId));
        } else {
          alert('Failed to delete network');
        }
      } catch (error) {
        alert('Error deleting network');
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        width: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0 }}>Saved Networks</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div>Loading networks...</div>
        ) : networks.length === 0 ? (
          <div>No saved networks found</div>
        ) : (
          <div>
            {networks.map(network => (
              <div
                key={network.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{network.name}</h3>
                    {network.description && (
                      <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                        {network.description}
                      </p>
                    )}
                    {network.fluid && (
                      <p style={{ margin: '0 0 5px 0', color: '#007bff', fontSize: '12px' }}>
                        Fluid: {network.fluid}
                      </p>
                    )}
                    <small style={{ color: '#999' }}>
                      Created: {new Date(network.created_at).toLocaleString()}
                    </small>
                  </div>
                  <div>
                    <button
                      onClick={() => onSelectNetwork(network.id)}
                      style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '5px 10px',
                        marginRight: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(network.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};