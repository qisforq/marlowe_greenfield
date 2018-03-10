import React from 'react'
import {ToggleButtonGroup, ToggleButton, Panel, Table, DropdownButton, MenuItem, Grid, Row, Col, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap'
import axios from 'axios'
import moment from 'moment'
import c3 from 'c3'

class DonationAmmount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      orgs: {
          1: {
            orgInfo: {
              orgName: 'UNICEF',
              ein: 203287404,
              deductable: '501(c)(3)',
              verified: true
            },
            donations: [
              {
                 createdAt: 1320543744,
                 item: 'MY LIFE',
                 value: '500',
               },
               {
                createdAt: 1320443900,
                item: 'MY STUFF',
                value: '100',
              },
              {
                createdAt: 1520229039,
                item: 'MY FAMILY',
                value: '600',
              },
            ]
         },
         2: {
          orgInfo: {
            orgName: 'A REAL CHARITY',
            ein: 2972349198,
            deductable: '501(c)(7)',
            verified: false
          },
          donations: [
            {
               createdAt: 1520543744,
               item: 'MY LEFT ARM',
               value: '1234',
             },
             {
              createdAt: 1520543900,
              item: 'MY MIND',
              value: '123',
            },
            {
              createdAt: 1520529039,
              item: 'MY RIGHT KIDNEY',
              value: '2000',
            },
          ]
       },
        },
      displayOrgs: [],
      selectedYear: 'All Years',
      selectedOrg: false,
      filters: [1,2,3],
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
    var value = parseInt(e.target.value)
    var arr = this.state.filters.slice()

    if (arr.includes(value)) {
      arr.splice(arr.indexOf(value), 1)
    } else {
      arr.push(value)
    }

    this.setState({ filters: arr }, ()=> {
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
      <div style={{marginTop: '50px'}}>
       <Grid>
         <Row>
           <Col xs={12}>
           <Panel style={{padding: '10px 5px 15px 5px', margin: '10px 0 10px 0'}}>
           <Grid>
            <Row>
            <Col xs={9}>
           <div style={{display: 'inline-block', margin: '20px 10px 0 10px', fontSize: '24px'}}> Showing Your Deductions For: {' '} </div>
          <DropdownButton
            bsSize="large"
            title={this.state.selectedYear}
            id={`dropdown-years`}
          >
            <MenuItem onSelect={this.handleSelect} name={'All Years'} eventKey={'All Years'}>View All</MenuItem>
            {this.state.years.sort().reverse().map((year, i) => <MenuItem onSelect={this.handleSelect} name={year} eventKey={year}>{year}</MenuItem>)}
          </DropdownButton>
          </Col>
          <Col xs={3}>
            <p style={{display: "inline-block", marginLeft: '44px'}} > Filter by Verification </p>
            <ToggleButtonGroup
            type="checkbox"
            style={{marginTop: '3px', marginLeft: '50px'}}
            block
            >
            <OverlayTrigger placement="top" overlay={buttonToolTip('Bad Actors')}>
              <ToggleButton
                type="checkbox"
                checked={this.state.filters.includes(3)}
                bsStyle={this.state.filters.includes(3) ? "danger" : 'default'}
                onChange={this.handleChange}
                value={3}
              >
                <Glyphicon glyph={"remove-sign"} />
                </ToggleButton>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={buttonToolTip('Pending')}>
              <ToggleButton
                type="checkbox"
                checked={this.state.filters.includes(2)}
                bsStyle={this.state.filters.includes(2) ? "warning" : 'default'}
                onChange={this.handleChange}
                value={2}
              >
                <Glyphicon glyph={"question-sign"} />
              </ToggleButton>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={buttonToolTip('Verified')}>
              <ToggleButton
                type="checkbox"
                checked={this.state.filters.includes(1)}
                bsStyle={this.state.filters.includes(1) ? "success" : 'default'}
                onChange={this.handleChange}
                value={1}
              >
                <Glyphicon glyph={"ok-sign"} />
              </ToggleButton>
            </OverlayTrigger>
            </ToggleButtonGroup>
            </Col>
          </Row>
          </Grid>
          </Panel>
          </Col>
        </Row>
         <Row>
           <Col xs={12} sm={7}>
        <div style={{height: window.innerHeight * 0.8, overflowY: 'scroll'}}>
        {this.state.displayOrgs.map((org, i) => {
          return (
            /*defaultExpanded*/
            <Panel key={i} className="panel-dense" bsStyle={org.orgInfo.verified === null ? "default" : !!org.orgInfo.verified ? "success" : "danger"} >
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
      </div>
        </Col>
        <Col xs={12} sm={5} style={{}}>
          <Panel>
            <h4 style={{fontSize: '18px', textAlign: 'center'}}>Your total deduction for {' ' + this.state.selectedYear.toString().toLowerCase()}</h4>
            <h1 style={{fontSize: '72px', textAlign: 'center'}}>${this.state.displayOrgs.reduce((total, org) => {
                return total += org.donations.reduce((sum, donation) => { return sum += parseInt(donation.value)},0 )
              }, 0)
            }</h1>
          </Panel>
        </Col>
        </Row>
        </Grid>
      </div>
     )
  }
}

export default DonationAmmount;
