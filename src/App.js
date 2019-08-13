import React from 'react';
import sections from './sections.json';
import Lightbox from 'react-images-extended';

const axios = require('axios');

class Image extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imageClass: "",
      aspectRatio: 0,
    }
  }

  handleImgLoad({ target: img }) {
    let ar = img.naturalWidth / img.naturalHeight;
    this.setState({ aspectRatio: ar });

    if (ar > 1) {
      this.setState({ imageClass: 'masonry-brick masonry-brick--h masonry-horizontal' });
    }
    else {
      if (ar < 1) {
        this.setState({ imageClass: 'masonry-brick masonry-brick--h masonry-vertical' });
      } else {
        this.setState({ imageClass: 'masonry-brick masonry-brick--h masonry-square' });
      }

    }
    this.props.incrementImages();
  }
  render() {
    return (
      <figure className={this.state.imageClass}>
        <img
          onClick={(e) => this.props.onClick(e)}
          src={this.props.src}
          className="masonry-img"
          onLoad={(e) => this.handleImgLoad(e, this.props.index)}
          alt={this.props.alt}
        >
        </img>
      </figure>

    )
  }
}

function Spinner(props) {
  if (props.hideGallery) {
    return (
      <div className="spinnerContainer">
        <div className="lds-dual-ring"></div>
      </div>
      
    )
  } else return null;
}

class Gallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lightboxIsOpen: false,
      currentImage: 0,
      imagesLoaded: 0,
      hideGallery: true
    }

    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
  }

  openLightbox(i, event) {
    event.preventDefault();
    this.setState({
      currentImage: i,
      lightboxIsOpen: true,
    });
  }
  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }
  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }
  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  gotoImage(index) {
    this.setState({
      currentImage: index,
    });
  }

  handleClickImage() {
    if (this.state.currentImage === this.props.imageSet.length - 1) return;
    this.gotoNext();
  }

  incrementImagesLoaded() {
    if (this.state.imagesLoaded === (this.props.imageSet.length - 1)) {
      this.setState({
        imagesLoaded: 0,
        hideGallery: false
      });
    } else {
      this.setState({
        hideGallery: true,
        imagesLoaded: this.state.imagesLoaded + 1
      })
    }
  }
  componentDidMount() {
    this.setState({ hideGallery: true })
  }

  render() {
    return (
      <div>
        <div hidden={this.state.hideGallery} id="cont-1" className="gallery-container fade-in masonry masonry--h pb-3">
          {this.props.imageSet.map((element, index) => {
            return (
              <Image
                key={index}
                onClick={(e) => this.openLightbox(index, e)}
                src={element.src}
                alt=""
                incrementImages={() => this.incrementImagesLoaded()}
              />
            );
          })}
        </div>
        <Spinner hideGallery={this.state.hideGallery} />
        <Lightbox
          currentImage={this.state.currentImage}
          images={this.props.imageSet}
          isOpen={this.state.lightboxIsOpen}
          onClickImage={this.handleClickImage}
          onClickNext={this.gotoNext}
          onClickPrev={this.gotoPrevious}
          onClickThumbnail={this.gotoImage}
          onClose={this.closeLightbox}
          preventScroll={this.props.preventScroll}
          showThumbnails={this.props.showThumbnails}
          spinner={this.props.spinner}
          spinnerColor={this.props.spinnerColor}
          spinnerSize={this.props.spinnerSize}
          theme={this.props.theme}
        />
      </div>
    )
  }
}



function NavBar(props) {
  return (
    <div className="header-nav row align-items-center justify-content-around" style={{ Width: 90 + '%' }}>
      <div className="col-xs-auto text-center pl-4 pr-4">
        <a className="logo-link" href="/">GREGORIO ANTONINO</a>
      </div>
      <div className="w-100 d-xl-none pb-1 pb-lg-4"></div>
      {
        props.sections.map((section, index) => {
          return (
            <div key={index} className="col-auto">
              <button
                onClick={() => props.onClick(index, section.galleryPath)}
                className="btn btn-link h-nav-item " >
                {section.sectionTitle.toUpperCase()}
              </button>
            </div>
          );
        }
        )
      }
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSection: 0,
      sections: sections.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0)),
      imageArray: [],
      currentPath: sections[0].galleryPath,
      imageSet: [],

    }
    this.sectionClick = this.sectionClick.bind(this);
  }

  componentDidMount() {
    axios.get(this.state.currentPath).then((response) => {
      this.setState({ imageArray: response.data });
      let images = [];
      this.state.imageArray.map((image) => images.push({ src: this.state.currentPath + image }));
      this.setState({ imageSet: images });
    });
  }

  sectionClick(i, path) {
    this.setState({ currentSection: i });
    this.setState({ currentPath: path });
    axios.get(path).then((response) => {
      this.setState({ imageArray: response.data });
      let images = [];
      this.state.imageArray.map((image) => images.push({ src: this.state.currentPath + image }));
      this.setState({
        imageArray: response.data,
        imageSet: images,
      });
    });

  };

  render() {
    return (
      <div className="App">
        <NavBar onClick={(i, path) => this.sectionClick(i, path)} sections={this.state.sections} currentSection={this.state.currentSection} />

        <Gallery
          imageSet={this.state.imageSet}
          galleryPath={this.state.currentPath}
        />
      </div>
    );
  }
}
export default App;
