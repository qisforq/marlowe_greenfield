import React from 'react';
import axios from 'axios';
import {FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import Trigger from "../components/responsiveButton.jsx";
import {compose, withProps, lifecycle} from "recompose";
import {withScriptjs} from "react-google-maps";
import {StandaloneSearchBox} from "react-google-maps/lib/components/places/StandaloneSearchBox";
import GoogleSearchBox from "./autocomplete.jsx"

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      phone: '',
      title: '',
      description: '',
      address: '',
      isClaimed: false,
      photoUrl: ''
    }
    this.savePost = this.savePost.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handlePhotoUrl = this.handlePhotoUrl.bind(this);
  }

  savePost(e) {
    e.preventDefault()
    axios.post('/savepost', this.state)
      .then( (response) =>{
        console.log('Post has been saved.', response);
        this.clearFields();
        this.props.showModal();
      })
      .catch(function(error) {
        console.log('There was an error saving this post.', error);
      })
  }
  clearFields() {
    this.setState({
      username: '',
      phone: '',
      title: '',
      description: '',
      address: '',
      isClaimed: false,
      photoUrl: ''
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  render() {
    //Here is where a user enters their posting. Ensure that the address input is a real address. Recommend using
    // google maps auto complete API to ensure this. Server will break if an inputted address is invalid (not a real address)


    //STATE INPUT: only accepts two chars (e.g, NY, CA) - if anything beyond two chars is submitted, this will not be saved to
    // the mySql database - this is a restriction set in the schema.
    return (
      <div className="form formDonate">
          <form>
          <div className="formFields">
          <ControlLabel>Post your donations</ControlLabel>

          <FormControl
            id="title"
            type="text"
            value={this.state.title}
            placeholder="Title"
            onChange={this.handleChange}
          />
          <GoogleSearchBox />
        <FormControl
          id="phone"
          type="text"
          value={this.state.phone}
          placeholder="Phone Number"
          onChange={this.handleChange}
          />
          <FormControl
            style={{height: '125px'}}
            id="description"
            type="text"
            value={this.state.description}
            placeholder="Description"
            onChange={this.handleChange}
          />
          <FormControl
            id="photoUrl"
            type="text"
            value={this.state.photoUrl}
            placeholder="Link an image"
            onChange={this.handleChange}
          />
          </div>
          <div className="formButton"><Button onClick={this.savePost}>Submit</Button></div>
      </form>
      </div>
    );
  }
}

export default Form;
