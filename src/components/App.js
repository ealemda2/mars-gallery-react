import React, { Component } from 'react';
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';
import mars from '../mars.svg';
import '../App.css';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      images: [],
      photoIndex: 0,
      isOpen: false,
    };
    this.getImages = this.getImages.bind(this);
  }

  async getImages () {
    const nasaUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=2000&page=1&api_key=e6qeMVwVAobScq3QGBBCsWdk4haOxrTmcBfB3RPI'
    try {

      const response = await fetch(nasaUrl);
      const json = await response.json()

      const urls = json.photos.map((img, index) => {
        return img.img_src;
      })
      let photos = this.shuffle(urls);
      this.setState({images: photos, isOpen: true});

    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }


  shuffle (array) {
    let i = 0;
    let j = 0;
    let temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  displayCarousel () {
    if (this.state.isOpen) {
      const { photoIndex, isOpen, images } = this.state;
      let slider =
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => this.setState({ isOpen: false })}
          onMovePrevRequest={() =>
            this.setState({
              photoIndex: (photoIndex + images.length - 1) % images.length
            })}
          onMoveNextRequest={() =>
            this.setState({
              photoIndex: (photoIndex + 1) % images.length
            })}
        />;
      return slider;
    } else {
      return <button className="button" onClick={this.getImages.bind(this)}>Get Images!</button>;
    }
  }


  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={mars} className="App-logo" alt="logo" />
          <h1 className="App-title">Curiosity: Views from the Surface of Mars</h1>
        </header>
        {this.displayCarousel()}
      </div>
    );
  }
}

export default App;
