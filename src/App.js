import React from 'react';
import sections from './sections.json';
import Lightbox from 'react-images-extended'
const axios = require('axios');


class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
      imageClass: "",
      aspectRatio: 0
    }
  }
  setClassName({target: img}) {
    this.setState({imageLoaded: true});

    let ar = img.naturalWidth/ img.naturalHeight;
    this.setState({aspectRatio: ar});

    if (ar > 1) {
      this.setState({imageClass: 'masonry-brick masonry-brick--h masonry-horizontal'});
    }
    else {
      if (ar < 1) {
        this.setState({imageClass: 'masonry-brick masonry-brick--h masonry-vertical'});
      } else {
        this.setState({imageClass: 'masonry-brick masonry-brick--h masonry-square'});
      }
      
    }
  }

  render() {
    return (
      <figure className={this.state.imageClass}>
        <img
          onClick={(e) => this.props.onClick(e)} 
          src={this.props.src} 
          className="masonry-img"
          onLoad={(e) => this.setClassName(e)}
          alt={this.props.alt}
          >
        </img>
      </figure>
      
    )
  }
}

class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lightboxIsOpen: false,
      currentImage: 0,
    };

    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
  }

  openLightbox(index, event) {
    event.preventDefault();
    this.setState({
      currentImage: index,
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
    if (this.state.currentImage === this.props.images.length - 1) return;
    this.gotoNext();
  }

  render() {
    return (
      <div id="cont-1" className="gallery-container fade-in masonry masonry--h pb-3">
        { 
          this.props.imageSet.map((element, index) => {
            return (
                <Image
                  key={index}
                  onClick={(e) => this.openLightbox(index, e)}
                  src={element.src}
                  alt=""
                />
            )
          })
        }
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
        />
      </div>
    )
  }

}

function NavBar(props) {
  return (
    <div className="header-nav row align-items-center justify-content-center justify-content-md-around" style={{ Width: 90 + '%' }}>
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
      this.setState({ imageSet: images, galleryChange: true });
    });

  };

  render() {
    return (
      <div className="App">
        <NavBar onClick={(i, path) => this.sectionClick(i, path)} sections={this.state.sections} currentSection={this.state.currentSection} />
        <Gallery imageSet={this.state.imageSet} galleryPath={this.state.currentPath} />
      </div>
    );
  }
}

export default App;
