import React from 'react';
import * as d3 from 'd3';
import c3 from 'c3';

class Chart extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.orgs && this.props.orgs.length > 0) {
      this.buildChart(this.props.orgs);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.buildChart(nextProps.orgs);
  }

  buildChart(orgs) {
    // var names = orgs.map(org => org.orgInfo.orgName);
    // var totals = orgs.map(org => org.donations.reduce((total, donation)=> total+=donation.value ));

    console.log(orgs.map(org => [
      org.orgInfo.orgName,
      org.donations.reduce((total, donation)=> {
         return total += parseInt(donation.value)
        }, 0)
      ]))

    var chart = c3.generate({
      data: {
        columns: orgs.map(org => [
          org.orgInfo.orgName,
          org.donations.reduce((total, donation)=> {
             return total += parseInt(donation.value)
            }, 0)
          ]),
        type: 'donut'
      },
    //   donut: {
    //     title: 'Total: $' + orgs.reduce((total, org) => {
    //       return total += org.donations.reduce((sum, donation) => { return sum += parseInt(donation.value)},0 )
    //     }, 0)
    // },
      bar: {
        width: {
          ratio: 0.5
        }
      },
      padding: {
        bottom: 30,
        left: 10,
        right: 10
      }
    });
  }

  render() {
    return (
      <div id="chart"></div>
    );
  }
}

export default Chart;
