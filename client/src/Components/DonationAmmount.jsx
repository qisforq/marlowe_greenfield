import React from 'react'
import {Panel, Table, DropdownButton, MenuItem} from 'react-bootstrap'
import axios from 'axios'
import moment from 'moment'

class DonationAmmount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      orgs: [],
      selectedYear: null,
      selectedOrg: false
     }
     this.handleSelect = this.handleSelect.bind(this)
  }

  componentDidMount() {
    axios.get('/dontations')
    .then((data) => console.log(data))
    .then(()=> {
    })
    this.handleSelect('View All')
  }

  handleSelect(key) {
    this.setState({selectedYear: key}, ()=> {
      let orgArr = [] 
      console.log('ORGS', this.state.orgs)
      for (let val in this.state.orgs) {
  
        let org = Object.assign({}, this.state.orgs[val])
        let donations = org.donations.filter(donation => {
          console.log('Is date equal? ', moment.unix(donation.created_at).format('YYYY') === key.toString())
          return moment.unix(donation.created_at).format('YYYY') === key.toString()
        })
  
        // console.log(donations)
  
        org.donations = (key === 'View All' ? org.donations : donations).sort((a,b)=> a.created_at < b.created_at)

        if (org.donations.length > 0) {
          orgArr.push(org)
        }
      }
      
      this.setState({displayOrgs: orgArr})
    })
  }

  render() {
    return (
      <div style={{marginTop: '55px'}}>
      <DropdownButton
        title={this.state.selectedYear}
        id={`dropdown-years`}
      > 
        <MenuItem onSelect={this.handleSelect} name={'View All'} eventKey={'View All'}>View All</MenuItem>
        {this.state.years.sort().reverse().map((year, i) => <MenuItem onSelect={this.handleSelect} name={year} eventKey={year}>{year}</MenuItem>)}
      </DropdownButton>
      {this.state.displayOrgs.map(org => {
        return (
          <Panel id="collapsible-panel-example-2">
              <Panel.Heading>
                  <Panel.Title toggle componentClass="h3">{org.orgInfo.orgName}</Panel.Title>
                  test
              </Panel.Heading>
              <Panel.Collapse>
                <Panel.Body>
                <Table responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Item</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                    {org.donations.map((donation, i) => {
                      return (
                      <tr key={i}>
                        <td>{
                          moment.unix(donation.created_at).format('MMM Qo YYYY')
                        }</td>
                        <td>{donation.item}</td>
                        <td>${donation.value.split('.')[0]}.00</td>
                      </tr>
                      )
                    })}
                    </tbody>
                  </Table>
                </Panel.Body>
              </Panel.Collapse>
            </Panel>
        )
        })
      }
      </div>
     )
  }
}

export default DonationAmmount;
