import React, { useState, useEffect } from 'react';
import section_file from './sections.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faInstagram, faEnvelope, faBars } from '@fortawesome/free-solid-svg-icons';
import Lightbox from 'react-spring-lightbox';
import ReactFitText from 'react-fittext';
//import { BreakpointProvider, Breakpoint } from 'react-socks';

function Image(props) {
  const [imageClass, setImageClass] = useState("");
  const [aspectRatio, setAspectRatio] = useState(0);


  const handleImgLoad = ({ target: img }) => {
    let ar = img.naturalWidth / img.naturalHeight;
    setAspectRatio({ aspectRatio: ar });

    if (ar > 1) {
      setImageClass('masonry-brick masonry-brick--h masonry-horizontal');
    }
    else {
      if (ar < 1) {
        setImageClass('masonry-brick masonry-brick--h masonry-vertical');
      } else {
        setImageClass('masonry-brick masonry-brick--h masonry-square');
      }

    }
    props.incrementImages();
  }
  return (
    <figure className={imageClass}>
      <img
        onClick={(e) => props.onClick(e)}
        src={props.src}
        className="masonry-img"
        onLoad={(e) => handleImgLoad(e, props.index)}
        alt={props.alt}
      >
      </img>
    </figure>

  )
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

function Gallery(props) {
  const [lightBoxOpen, setLightBoxOpen] = useState(false);
  const [hideGallery, setHideGallery] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const incrementImagesLoaded = () => {
    if (imagesLoaded === (props.imageSet.length - 1)) {
      setHideGallery(false);
    } else {
      setImagesLoaded(imagesLoaded + 1);
      setHideGallery(true);
    }
  }
  const gotoPrevious = () =>
    currentImage > 0 && setCurrentImage(currentImage - 1);

  const gotoNext = () =>
    currentImage + 1 < props.imageSet.length &&
    setCurrentImage(currentImage + 1);
  const handleClose = () => {
    setLightBoxOpen(false);
  }
  useEffect(() => { setHideGallery(true) }, []);

  useEffect(() => {
    setHideGallery(true);
    setImagesLoaded(0)
  },
    [props.galleryPath]);

  return (
    <div>
      <div hidden={hideGallery} id="cont-1" className="gallery-container fade-in masonry masonry--h pb-3">
        {props.imageSet.map((element, index) => {
          return (
            <Image
              key={index}
              onClick={() => { setLightBoxOpen(true); setCurrentImage(index) }}
              src={element.src}
              alt=""
              incrementImages={() => incrementImagesLoaded()}
            />
          );
        })}
      </div>
      <Spinner hideGallery={hideGallery} />
      <Lightbox
        isOpen={lightBoxOpen}
        onPrev={gotoPrevious}
        onNext={gotoNext}
        images={props.imageSet}
        currentIndex={currentImage}
        /* Add your own UI */
        renderHeader={() => (<LbHeader onClose={handleClose} />)}
        // renderFooter={() => (<CustomFooter />)}
        // renderPrevButton={() => (<CustomLeftArrowButton />)}
        // renderNextButton={() => (<CustomRightArrowButton />)}

        /* Add styling */
        // className="cool-class"
        style={{ background: "rgba(5, 5, 5, 0.9)" }}

        /* Handle closing */
        onClose={handleClose}

        /* react-spring config for open/close animation */
        pageTransitionConfig={{
          from: { transform: "scale(0.75)", opacity: 0 },
          enter: { transform: "scale(1)", opacity: 1 },
          leave: { transform: "scale(0.75)", opacity: 0 },
          config: { mass: 1, tension: 320, friction: 32 }
        }}
      />
    </div>
  )
}
function LbHeader(props) {
  return (
    <div className="lbheader text-right w-100 col">
      <p onClick={props.onClose}>CLOSE</p>
    </div>
  )
}

function HeadearBanner(props) {
  return (
    <div className="d-none d-lg-block">
      <div className="header-nav row">
        <div className="col-2"></div>
        <div className="col-8 w-100 text-center">
          <ReactFitText compressor={1}>
            <h1 className="banner-title">{props.sections[props.currentSection].sectionTitle.toUpperCase()}</h1>
          </ReactFitText>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  )
}

function Navigator(props) {
  return (
    <div className="d-none d-lg-block">
      <div className="navigator d-flex flex-column">
        {
          props.sections.map((section, index) => {
            return (
              <p key={index}
                onClick={() => { props.onClick(index, section.galleryPath) }}
                className={"h-nav-item"}>
                {section.sectionTitle.toLowerCase()}
              </p>
            )
          }
          )
        }
        <div className="text-right contact">
          <div className="pt-4">
            <p className="logo-link">GREGORIO ANTONINO</p>
            <p className="logo-date">{"Buenos Aires - " + (new Date().getMonth()) + "/" + (new Date().getFullYear())}</p>
          </div>
          {/*<div className="nav-icon d-inline">
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </div>*/}
          <div className="nav-icon d-inline">
            <a href="https://instagram.com/gregoantonino">
              <img src="./images/instagram.svg" alt="instagram" className="nav-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>

  )
}

function NavigatorMobile(props) {
  const [showMenu, setShowMenu] = useState(false);

  return (

    <div className="d-block d-lg-none">
      <div className="header-nav-mobile row">
        <div className="col-8 w-100 text-center">
          <ReactFitText compressor={1}>
            <h1 className="banner-title pt-2 pr-2 text-left">{props.sections[props.currentSection].sectionTitle.toUpperCase()}</h1>
          </ReactFitText>
        </div>
        <div className="col-4 text-right pt-2 nav-items">
          <FontAwesomeIcon className="align-top" icon={faBars} onClick={() => setShowMenu(!showMenu)} />
          {showMenu &&
            props.sections.map((section, index) => {
              return (
                <p key={index}
                  onClick={() => { props.onClick(index, section.galleryPath) }}
                  className={"h-nav-item-mobile"}>
                  {section.sectionTitle.toLowerCase()}
                </p>
              )
            }

            )}
          {/*<div className="pt-1">
            <p className="logo-link">GREGORIO ANTONINO</p>
            <p>{"Buenos Aires - " + (new Date().getMonth()) + "/" + (new Date().getFullYear())}</p>
          </div>*/}
        </div>
      </div>
    </div>
  )
}

function Footer(props) {
  return (
    <div id="contact" className="footer align-items-center justify-content-center">
      <p id="copyright-year" className="footnote text-center">{"All rights reserved - Gregorio Antonino " + (new Date().getFullYear())}</p>
    </div>
  )
}

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState(section_file.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0)));
  const [imageArray, setImageArray] = useState([]);
  const [currentPath, setCurrentPath] = useState(sections[0].galleryPath);
  const [currentTitle, setCurrentTitle] = useState(sections[0].sectionTitle);
  const [imageSet, setImageSet] = useState([]);
  //const [hideGallery, setHideGallery] = useState([]);

  useEffect(() => {
    getImages(currentPath);
  }, [currentPath]);

  useEffect(() => {
    let images = [];
    imageArray.map((image) => images.push({ src: currentPath + image }));
    setImageSet(images);
  }, [imageArray]);

  const getImages = async (path) => {
    await fetch('/dirfiles.php?path=' + path).then((response) => response.json())
      .then((json) => { setImageArray(json) })
  }

  const sectionClick = (i, path, title) => {
    setCurrentSection(i);
    setCurrentPath(path);
    setCurrentTitle(title);

  };

  return (
    <div className="App front-page">
      <header>
        <NavigatorMobile sections={sections} currentSection={currentSection} onClick={(i, path) => sectionClick(i, path)} />
        <HeadearBanner currentSection={currentSection} sections={sections} />
        <Navigator sections={sections} currentSection={currentSection} onClick={(i, path) => sectionClick(i, path)} />
      </header>
      <Gallery imageSet={imageSet} galleryPath={currentPath} />
      <Footer />
    </div>
  );
}
export default App;