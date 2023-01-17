import React from 'react';
import axios from 'axios'
import './App.css';
import moment from 'moment'
import FadeLoader from 'react-spinners/FadeLoader';


class App extends React.Component {
  state = {
    latestTime: 0,
    time: '00:00:00',
    loadingTime: true,
    loadingMetrics: true,
    metrics:''
  }

  metricRequest = () => {
    const metricsUrl = 'http://localhost:7000/metrics'
    axios.get(metricsUrl, {headers:{'Authorization': 'mysecrettoken'}}).then((response) => {
      this.setState({
        metrics: response.data,
        loadingMetrics: false
      })
      }).catch((err) => {
        console.log(err)
    })
  }
  timeRequest = () => {
    const timeUrl = 'http://localhost:7000/time'
    axios.get(timeUrl, {headers:{'Authorization': 'mysecrettoken'}}).then((response) => {
      this.setState({
        latestTime: response.data.epoch,
        loadingTime: false
      })
      }).catch((err) => {
        console.log(err)
    })
  }

  componentDidMount(): void {
    this.timeRequest()
    this.metricRequest()

     setInterval(() => {
      let timeDif = new Date().getTime() - this.state.latestTime
      const newDate = moment(timeDif - 3600000).format('HH:mm:ss')
      this.setState({
        time: this.state.loadingTime ? '00:00:00' : newDate,
      })
    }, 250);

    setInterval(() => {
      this.setState({
        loadingTime: true,
        loadingMetrics: true
      })
      this.metricRequest()
      this.timeRequest()
    }, 30000); 
  }

  render() {
    const isLoadingTime = this.state.loadingTime
    const isLoadingMetrics = this.state.loadingMetrics
    let leftView
    let rightView
    if (isLoadingTime) {
      leftView = <FadeLoader color="#36d7b7" />
    } else {
      leftView = (
        <div>
        <div className='left'>
          <div  className='leftInner' style={{border: '2px solid red',
        borderRadius: '10px', padding: '10px', marginTop:"100px"}}>
            <div className='epoch'>{this.state.latestTime}</div>
            <div className='stopWatch'>{this.state.time}</div>
          </div>  
        </div>
      </div>
      )
    }

    if (isLoadingMetrics) {
      rightView = <FadeLoader color="#36d7b7" />
    } else {
      rightView = (
        <div>
          <p className='metrics '>
            {this.state.metrics}
          </p>
      </div>
      )
    }

    return (
      <div className='container'>
        <div className='left'>
          {leftView}
        </div>
        <div className='right'>
        {rightView}
        </div>
      </div>
    );
  }
}

export default App;