import * as React from 'react';

import Splitter from './components/Splitters';
import type { SplitterRef } from './components/Splitters/Splitter';

interface AppState {
  maxPrimaryPane?: Boolean;
}

class App extends React.Component<{}, AppState> {
  ref = React.createRef<SplitterRef>();

  state = {
    maxPrimaryPane: false
  };

  maxPrimaryPane() {
    this.setState({
      maxPrimaryPane: !this.state.maxPrimaryPane
    });
  }

  onDragFinishedCallback = () => {
    console.log('callback', this.ref);
    if (this.ref.current) {
      console.log('Splitter State:', this.ref.current.getState(), this.ref.current.getRoot());
    }
  }

  render() {
    return (
      <div className="app">
        <div className="splitter-wrapper">
          <Splitter
            ref={this.ref}
            position="horizontal"
            maximizedPrimaryPane={this.state.maxPrimaryPane}
            minimalizedPrimaryPane={false}
            onDragFinished={this.onDragFinishedCallback}
            className="split"
          >            
            <Splitter
              position="vertical"
              primaryPaneMaxWidth="100%"
              primaryPaneMinWidth={0}
              primaryPaneWidth="400px"
              onDragFinished={this.onDragFinishedCallback}
              dispatchResize={true}
              postPoned={false}
              allowResize={true}
            >
              <div className="placeholder _1">
                <span>1</span>
                <p>postponed</p>
                <p>primary</p>
              </div>
              <Splitter
                  position="vertical"
                  primaryPaneMaxWidth="100%"
                  primaryPaneMinWidth={0}
                  primaryPaneWidth="400px"
                  onDragFinished={this.onDragFinishedCallback}
                  postPoned={false}
              >    
                  <div className="placeholder _2">
                    <span>2</span>
                    <p>normal resize</p>
                    <p>primary</p>
                  </div>
                  <div className="placeholder _3"><span>3</span></div>
              </Splitter> 
            </Splitter>
            <div className="placeholder _4">
              <span>4</span>
              <p>normal resize</p>  
            </div>
          </Splitter>         
        </div>
      </div>
    );
  }
}

export default App;
