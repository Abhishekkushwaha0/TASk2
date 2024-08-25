// Graph.tsx
import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';

/**
 * Props interface for Graph component
 * It receives data as props from the parent App component
 */
interface Props {
  data: ServerRespond[]; // Array of data received from the App component
}

/**
 * PerspectiveViewerElement interface to extend HTMLElement
 * Allows usage of the Perspective 'load' method in TypeScript
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

/**
 * Graph component that renders a Perspective viewer for displaying stock data
 */
class Graph extends Component<Props, {}> {
  // Perspective table reference for updating data
  table: Table | undefined;

  /**
   * ComponentDidMount lifecycle method
   * This method sets up the Perspective table schema and loads it into the viewer
   */
  componentDidMount() {
    // Get the <perspective-viewer> element from the DOM
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    // Define the schema for the Perspective table
    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    // Check if Perspective worker is available and create a table with the schema
    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    // Load the table into the <perspective-viewer> element and set up visualization settings
    if (this.table) {
      elem.load(this.table);

      // Set the view to a line chart
      elem.setAttribute('view', 'y_line');
      // Group data by stock
      elem.setAttribute('column-pivots', '["stock"]');
      // Sort data by timestamp
      elem.setAttribute('row-pivots', '["timestamp"]');
      // Display top ask price on the graph
      elem.setAttribute('columns', '["top_ask_price"]');
      // Aggregate the data in the table
      elem.setAttribute(
        'aggregates',
        JSON.stringify({
          stock: 'distinct count',
          top_ask_price: 'avg',
          top_bid_price: 'avg',
          timestamp: 'distinct count',
        })
      );
    }
  }

  /**
   * ComponentDidUpdate lifecycle method
   * This method updates the Perspective table with new data whenever the props change
   */
  componentDidUpdate() {
    // Ensure the table exists before updating
    if (this.table) {
      // Map the incoming data to the schema format and update the table
      this.table.update(
        this.props.data.map((el: any) => ({
          stock: el.stock,
          top_ask_price: el.top_ask?.price || 0, // Set default to 0 if no top ask price
          top_bid_price: el.top_bid?.price || 0, // Set default to 0 if no top bid price
          timestamp: el.timestamp,
        }))
      );
    }
  }

  /**
   * Render method for the Graph component
   * It returns a <perspective-viewer> element where the graph will be displayed
   */
  render() {
    return <perspective-viewer></perspective-viewer>;
  }
}

export default Graph;
