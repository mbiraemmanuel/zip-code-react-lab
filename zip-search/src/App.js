import React, { Component } from 'react';
import { Card, Radio } from 'react-bootstrap'
import './App.css';


function City(props) {
  return (
    <div className="cards">
      <Card>
        <Card.Header>{props.name}</Card.Header>
        <Card.Body>
          <ul>
            <li>State: {props.state}</li>
            <li>Location: ({props.lat}, {props.long})</li>
            <li>Population (estimated): {props.population}</li>
            <li>Total Wages: {props.wages}</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
}

function Zip(props){
  console.log('Code: ' + props.codes);
  return (
    <div>
      <Card>
        <Card.Header>{props.cityName}</Card.Header>
        <Card.Body>
          <div className="zipList">
            <ul>
            {props.codes.map((code) => <li className="codes">{code}</li>)}
            </ul>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

function ZipSearchField(props) {
  return (
    <div>
      <label className="zipLabel" htmlFor="zipsearch">Zip Code: &nbsp;</label>
      <input type="text" onChange={props.changeHandler} id="zipsearch" placeholder="Try 10016"/>
    </div>
  );
}

function CitySearchField(props){
  return (
    <div>
      <label className="cityLabel" htmlFor="citysearch">City: &nbsp;</label>
      <input type="text" onChange={props.changeHandler} id="citysearch" placeholder="Try Baltimore"/>
    </div>
  );
}


class App extends Component {

  state = {
    zipCode : '',
    cities : [],
    zipRequestStatus : '',
    cityRequestStatus: '',
    searchBy : '',
    city : '',
    zips : [],
  }

  handleZipSearch = (event) => {
    console.log('Search text: ' + event.target.value);
    this.setState({ zipCode : event.target.value})
    let base = 'http://ctp-zip-api.herokuapp.com/zip/'
    base = base + event.target.value

    fetch(base)
    .then((resp) => {
      if(resp.status === 200){
        console.log('SUCCESS');
        this.setState({zipRequestStatus : 'Success'})
        return resp.json()
      } else if(resp.status === 404){
        console.log('NOT FOUND');
        this.setState({zipRequestStatus : 'Fail'})
        return resp.json()
      }
    })
    .then((data) => {
      console.log(data)
      this.setState({cities : data})
    })
    .catch(error => {
      console.log('Error' + error);
    })

  }
  handleSearchType = (event) =>{
      console.log(event.target.value);
      var ele = document.getElementsByClassName('searchTypeInput');

      for(let i = 0; i < ele.length; i++){
        if(ele[i].checked){
          this.setState({searchBy : ele[i].value})
        }
      }
  }
  handleCitySearch = (event) => {
    let city = event.target.value.toUpperCase()
    console.log('Search City' + city);
    this.setState({city : city})
    this.setState({zips : []})
    let url = `http://ctp-zip-api.herokuapp.com/city/${city}`

    fetch(url)
    .then((response) => {
      if(response.status === 200){
        console.log('SUCCESS');
        this.setState({cityRequestStatus : 'Success'})
        return response.json()
      } else if(response.status === 404){
        console.log('NOT FOUND');
        this.setState({cityRequestStatus : 'Fail'})
        return response.json()
      }    })
    .then((data) => {
      console.log(data);
      this.setState({zips : data})
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Zip Code Search</h2>
        </div>
        <div className="d-flex justify-content-center">
          <div className="main">
              <div className="searchType"> 
                <div className="inputGroup">
                  <input type="radio" name="searchtype" id="zipSearch" value="zip" className="searchTypeInput" onChange={this.handleSearchType}/>
                  <label htmlFor="zipSearch">Search By Zip</label>
                </div>
                  
                <div className="inputGroup">
                  <input type="radio" name="searchtype" id="citySearch" value="city" className="searchTypeInput" onChange={this.handleSearchType}/>
                  <label htmlFor="citySearch">Search by city</label>
                </div>
              </div>
            
            {this.state.searchBy === 'zip' && 
              <div className="zipSearch">


              <ZipSearchField zipCode={this.state.zipCode} changeHandler={this.handleZipSearch}/>
              <div>
                {this.state.cities.map((city) => <City name={city.City}
                                                      state={city.State} 
                                                      population={city.EstimatedPopulation} 
                                                      wages={city.TotalWages}
                                                      lat={city.Lat}
                                                      long={city.Long}/>)}
                {this.state.zipRequestStatus === 'Fail' &&
                  <h6>No Results</h6>
                }
              </div>  
            </div>
          
            }

            {this.state.searchBy === 'city' && 
              <div className="citySearch">
                  <CitySearchField city={this.state.city} changeHandler={this.handleCitySearch}/>
                  {/* {this.state.zips.map((zip) => <Zip code/>)} */}
                  
                  {this.state.cityRequestStatus === 'Success' && 
                    <Zip codes={this.state.zips} cityName={this.state.city}/>
                  }
                  {this.state.cityRequestStatus === 'Fail' && 
                    <h6>No Results</h6>
                  }
                  
              </div>
          
            }            
            </div>           
        </div>
        
      </div>
    );
  }
}

export default App;
