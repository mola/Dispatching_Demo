import { useState } from 'react';
import { CanvasEditor } from './components/CanvasEditor';
import { NetworkList } from './components/NetworkList';
import { NetworkData, SimulationResults } from './types';

function App() {
  const [showNetworkList, setShowNetworkList] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | undefined>();
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);
  const [loadedNetwork, setLoadedNetwork] = useState<NetworkData | undefined>();

  const handleRunSimulation = async (network: NetworkData) => {
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(network),
      });

      if (response.ok) {
        const results = await response.json();
        setSimulationResults(results);
        setSimulationMessage(results.message);
        
        // Show alert for simulation results
        if (results.success) {
          alert(`Simulation completed successfully!${results.message ? '\n' + results.message : ''}`);
        } else {
          alert(`Simulation failed: ${results.message}`);
        }
      } else {
        alert('Failed to run simulation');
      }
    } catch (error) {
      alert('Error running simulation');
    }
  };

  const handleSelectNetwork = async (networkId: number) => {
    try {
      const response = await fetch(`/api/networks/${networkId}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Loading network:', result);
        
        // Set the loaded network to be displayed in CanvasEditor
        setLoadedNetwork(result.network);
        setShowNetworkList(false);
        alert('Network loaded successfully');
      } else {
        alert('Failed to load network');
      }
    } catch (error) {
      alert('Error loading network');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <CanvasEditor
        onRunSimulation={handleRunSimulation}
        simulationResults={simulationResults}
        onLoadNetwork={() => setShowNetworkList(true)}
        initialNetwork={loadedNetwork}
      />
      
      {showNetworkList && (
        <NetworkList
          onSelectNetwork={handleSelectNetwork}
          onClose={() => setShowNetworkList(false)}
        />
      )}
      
      {simulationMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: simulationResults?.success ? '#d4edda' : '#f8d7da',
          color: simulationResults?.success ? '#155724' : '#721c24',
          padding: '10px 20px',
          borderRadius: '4px',
          border: `1px solid ${simulationResults?.success ? '#c3e6cb' : '#f5c6cb'}`,
          zIndex: 1000,
        }}>
          {simulationMessage}
        </div>
      )}
    </div>
  );
}

export default App;