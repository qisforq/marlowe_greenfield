import React from 'react'
import {ToggleButtonGroup, ToggleButton, Panel, Table, DropdownButton, MenuItem, Grid, Row, Col, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap'
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
     this.handleChange = this.handleChange.bind(this)
     this.handleSelect = this.handleSelect.bind(this)
     this.processOrg = this.processOrgs.bind(this)
  }

  componentDidMount() {
    axios.get('/donations')
    .then((data) => {
      this.setState({years: data.data.years, orgs: data.data.organizations})
    })
    .then(()=> {
      this.handleSelect('All Years')
    })
  }

  processOrgs(key = this.state.selectedYear) {
    let orgArr = [] 
    console.log('ORGS', this.state.orgs)
    for (let val in this.state.orgs) {

      let org = Object.assign({}, this.state.orgs[val])
      let donations = org.donations.filter(donation => {
        return moment.unix(donation.createdAt).format('YYYY') === key.toString()
      })

      // console.log(donations)

      org.donations = (key === 'All Years' ? org.donations : donations).sort((a,b)=> a.createdAt < b.createdAt)

      if (org.donations.length > 0) {
        if (this.state.filters.includes(1) && org.orgInfo.verified === 1) {
          orgArr.push(org)
        }
        if (this.state.filters.includes(2) && org.orgInfo.verified === null) {
          orgArr.push(org)
        }
        if (this.state.filters.includes(3) && org.orgInfo.verified === 0) {
          orgArr.push(org)
        }
      }
    }
    
    this.setState({displayOrgs: orgArr})
  }

  handleChange(e) {
    this.setState({ filters: e }, ()=> {
      this.processOrgs()
    });
  }

  handleSelect(key) {
    this.setState({selectedYear: key}, ()=> {
      this.processOrgs(key)
    })
  }

  render() {     
    // for each org donations list, filter by year where year is same as selected year
    // if donation list is not empty, push to org arr


    var tooltip = function(org) {
      return (
      <Tooltip  id={"tooltip_" + org.orgInfo.orgName}>
        This EIN bellongs to:
        <br />
        <strong>{org.orgInfo.guessedName.toString()}</strong>
        <br />
        <p>Report abuse to webmaster</p>
      </Tooltip>
      )
    }

    var buttonToolTip = function(button) {
      return (
      <Tooltip  id={"tooltip_" + button}>
        {button}
      </Tooltip>
      )
    }

    return ( 
      <div>
       <Grid>
         <Row>
           <Col xs={12}>
           <Panel style={{padding: '10px 5px 10px 5px', marginTop: '10px'}}>
           <Grid>
            <Row>
            <Col xs={9}>
           <div style={{display: 'inline-block', margin: '5px 10px 0 10px', fontSize: '18px'}}> Showing Your Deductions For: {' '} </div>
          <DropdownButton
            // bsClass={'yearsDrop'}
            bsSize="large"
            title={this.state.selectedYear}
            id={`dropdown-years`}
          > 
            <MenuItem onSelect={this.handleSelect} name={'All Years'} eventKey={'All Years'}>View All</MenuItem>
            {this.state.years.sort().reverse().map((year, i) => <MenuItem onSelect={this.handleSelect} name={year} eventKey={year}>{year}</MenuItem>)}
          </DropdownButton>
          </Col>
          <Col xs={3}>
            {/* <div display="inline-block">Filter by Verification: {' '}</div> */}
            <ToggleButtonGroup
            type="checkbox"
            value={this.state.filters}
            onChange={this.handleChange}
            style={{marginTop: '5px', marginLeft: '50px', display: 'inline-block'}}
            >
            {/* <OverlayTrigger placement="top" overlay={buttonToolTip('Bad Actor')}> */}
              <ToggleButton value={3} ><Glyphicon glyph={"remove-sign"} /></ToggleButton>
            {/* </OverlayTrigger> */}
            {/* <OverlayTrigger placement="top" overlay={buttonToolTip('Pending')}> */}
              <ToggleButton value={2} ><Glyphicon glyph={"question-sign"} /></ToggleButton>
            {/* </OverlayTrigger> */}
            {/* <OverlayTrigger placement="top" overlay={buttonToolTip('Verified')}> */}
              <ToggleButton value={1} ><Glyphicon glyph={"ok-sign"} /></ToggleButton>
            {/* </OverlayTrigger> */}
            </ToggleButtonGroup>
            </Col>
          </Row>
          </Grid>
          </Panel>
          </Col>
        </Row>
         <Row>
           <Col xs={12} sm={7}> 
        {this.state.displayOrgs.map((org, i) => {
          return (
            <Panel defaultExpanded key={i} className="panel-dense" bsStyle={org.orgInfo.verified === null ? "default" : !!org.orgInfo.verified ? "success" : "danger"} >
                <Panel.Heading>
                <Grid>
                  <Row>
                    <Col xs={4}>
                  <Panel.Title className="panel-title-margins" toggle componentClass="h2"> 
                  {org.orgInfo.orgName} {' '} {org.orgInfo.verified === null ? <Glyphicon glyph={'question-sign'} />: <Glyphicon glyph={!!org.orgInfo.verified ? "ok-sign" : "remove-sign"} />} 
                  </Panel.Title>
                    <OverlayTrigger placement="right" overlay={tooltip(org)}>
                      <span>EIN#: {org.orgInfo.ein}{' '}</span>
                    </OverlayTrigger>{' '}
                    {/* <span>Verified?: {(!!org.orgInfo.verified).toString()}</span> */}
                    </Col>
                    <Col xsHidden smHidden md={3}>
                    <div className={'totalContainer'}>
                      <span className={'totalHeader'}>Deductions For This Organization</span>
                      <span className={'orgTotal'}>${org.donations.reduce((sum, donation) => { return sum += parseInt(donation.value)},0 )}.00</span>
                    </div>
                    </Col>
                </Row>
                </Grid>
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
                            moment.unix(donation.createdAt).format('MMM Qo YYYY')
                          }</td>
                          <td>{donation.item}</td>
                          <td>${parseInt(donation.value)}.00</td>
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
        </Col>
        <Col xs={12} sm={5}>
          <Panel>
              <h4>Total</h4>
              <h1>${this.state.displayOrgs.reduce((total, org) => {
                  return total += org.donations.reduce((sum, donation) => { return sum += parseInt(donation.value)},0 )
                }, 0)
              }.00</h1>
          </Panel>
        </Col> 
        </Row>
        </Grid>
      </div>
     )
  }
}

export default DonationAmmount;
