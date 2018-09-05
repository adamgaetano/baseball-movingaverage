// Copyright 2018 Adam Gaetano. All Rights Reserved.

import React, { Component } from 'react';
import './App.css';

import ReactChartkick, { LineChart } from 'react-chartkick';
import Chart from 'chart.js'

const AT_BATS_COL = 10;
const HITS_COL = 12;
const HOMERUNS_COL = 15;
const DATE_COL = 3;

var averagesMap10 = [];
var averagesMap20 = [];
var overallAverage = [];

var data = [
    {"name":"10 Gam Average", "data": averagesMap10},
    {"name":"20 Game Average", "data": averagesMap20},
    {"name":"Overall Average", "data": overallAverage}
];

class App extends Component {

    constructor(props) {
        super(props);

        ReactChartkick.addAdapter(Chart);

        this.calculateMovingAverage = this.calculateMovingAverage.bind(this);
        this.calculateOverallAverage = this.calculateOverallAverage.bind(this);
        this.getScores = this.getScores.bind(this);
        this.state = {calculated: false}
        
    }

    render() {
        return (

        <div id="main" className="App">

        <form>
            <div class="form-group">
                <label for="playerInput">Player</label>
                <input id="playerInput" type="text" class="form-control" placeholder="Player"/>
            </div>
        </form>
            
            <button onClick={this.getScores}>calculate</button>

            <LineChart label="Average" data={data} min={0} max={.6} height={500}/>
            <div id="playerTable">
                <div id="data">

                </div>
            </div>
        </div>

        );
        
    }

    calculateOverallAverage () {

        var table = document.getElementById("data");
        var numberOfGames = table.rows.length;
        console.log(numberOfGames + " Overall Average ************************************************");

        var ab = 0;
        var h = 0;
        var hr = 0;
        for (var x = 0; x < numberOfGames; x++) {

            ab += Number(table.rows[x].cells[AT_BATS_COL].innerText);
            h += Number(table.rows[x].cells[HITS_COL].innerText);
            hr += Number(table.rows[x].cells[HOMERUNS_COL].innerText);
        }
        var startDate = String(table.rows[0].cells[DATE_COL].innerText);
        var endDate = String(table.rows[numberOfGames-1].cells[DATE_COL].innerText);
        var ba = Number((h / ab).toFixed(3));

        
        overallAverage.push([new Date(endDate + " 2018"), ba]);
        console.log(startDate + " - " + endDate + ", " + ba + " (" + ab + ", " + h +  ", " + hr + ")" + ":" + overallAverage.length);

        this.setState({calculated: true});
    }

    calculateMovingAverage (days, set) {

        var table = document.getElementById("data")
        var numberOfGames = table.rows.length - 1;
        console.log(days + " Day Moving Average ************************************************");

        var done = false;
        var index = 0;
        while (!done) {

            if (index + days - 1 > numberOfGames) {
                done = true;
            } else {

                var ab = 0;
                var h = 0;
                var hr = 0;
                for (var x = 0; x < days; x++) {

                    ab += Number(table.rows[index + x].cells[AT_BATS_COL].innerText);
                    h += Number(table.rows[index + x].cells[HITS_COL].innerText);
                    hr += Number(table.rows[index + x].cells[HOMERUNS_COL].innerText);
                }
                var startDate = String(table.rows[index].cells[DATE_COL].innerText);
                var endDate = String(table.rows[index + (days-1)].cells[DATE_COL].innerText);
                var ba = Number((h / ab).toFixed(3));

                if (set === 1) {
                    averagesMap10.push([new Date(endDate + " 2018"), ba]);
                    console.log(startDate + " - " + endDate + ", " + ba + " (" + ab + ", " + h +  ", " + hr + ")" + ":" + averagesMap10.length);
                } else {
                    averagesMap20.push([new Date(endDate + " 2018"), ba]);
                    console.log(startDate + " - " + endDate + ", " + ba + " (" + ab + ", " + h +  ", " + hr + ")" + ":" + averagesMap20.length);
                }
                
                

                index++;
            }

        }

        this.setState({calculated: true});
    }

    getScores () {

        var playerName = document.getElementById("playerInput").value;
        var firstName;
        var lastName;
        var keyName;

        if (playerName) {

            playerName = playerName.split(" ");
            firstName = playerName[0].slice(0, 2);
            lastName = playerName[1].slice(0, 5);
            keyName = (lastName + firstName).toLowerCase() + "01";

            console.log(keyName);
            
        var request = new XMLHttpRequest();
        request.open("GET", "http://localhost:8080/stats?player=" + keyName, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    document.getElementById('data').outerHTML = request.responseText;
                    this.calculateMovingAverage(10, 1);
                    this.calculateMovingAverage(20, 2);
                    this.calculateOverallAverage();
                }
            }
        }.bind(this);
        request.send();

        } else {

            console.log("empty player name");

        }   
    }

}

export default App;
