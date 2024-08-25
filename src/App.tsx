// App.tsx
import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph'; // Import the Graph component

/**
 * State interface for App component
 */
interface IState {
  data: ServerRespond[]; // Array to store data from the server
  showGraph: boolean; // Boolean to control when to show the graph
}

/**
 * The main App component that renders the UI and manages state
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    // Initialize state with empty data array and showGraph as false
    this.state = {
      data: [],
      showGraph: false,
    };
  }

  /**
   * Function to start fetching data from the server every 100 milliseconds
   * It updates the state with the new data and keeps appending the new data to existing data.
   */
  getDataFromServer() {
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update state with new data and set showGraph to true to display the graph
        this.setState({
          data: [...this.state.data, ...serverResponds],
          showGraph: true,
        });
      });
    }, 100); // Fetch new data every 100 milliseconds
  }

  /**
   * Conditionally render the Graph component when showGraph is true
   */
  renderGraph() {
    if (this.state.showGraph) {
      // Pass the data as props to the Graph component
      return <Graph data={this.state.data} />;
    }
    return null; // Return null if showGraph is false
  }

  /**
   * Render method for the App component
   * It contains a header, a button to start data streaming, and the graph section
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the Stock Trading App</h1>
        </header>
        <div>
          {/* Button to start streaming data from the server */}
          <button onClick={() => this.getDataFromServer()}>
            Start Streaming Data
          </button>
          {/* Render the Graph component */}
          {this.renderGraph()}
        </div>
      </div>
    );
  }
}

export default App;
