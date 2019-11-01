import React, { useState, useEffect } from 'react';
import section_file from './sections.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faInstagram, faEnvelop} from '@fortawesome/free-solid-svg-icons';
import Lightbox from 'react-spring-lightbox';

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
        renderHeader= {() => (<LbHeader onClose={handleClose}/>)}
      // renderFooter={() => (<CustomFooter />)}
      // renderPrevButton={() => (<CustomLeftArrowButton />)}
      // renderNextButton={() => (<CustomRightArrowButton />)}

      /* Add styling */
      // className="cool-class"
      style={{ background: "rgba(5, 5, 5, 0.9)"}}

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
      <h3 onClick = {props.onClose}>CLOSE</h3>
    </div>
  )
}

function NavBar(props) {
  return (
    <div className="header-nav row align-items-center justify-content-center">
      <div className="col-xs-auto text-center pl-4 pr-4 mt-2">
        <a className="logo-link" href="/">GREGORIO ANTONINO</a>
      </div>
      <div className="w-100 pb-1 pb-lg-4"></div>
      {
        props.sections.map((section, index) => {
          return (
            <div key={index} className="col-auto">
              <button
                onClick={() => { props.onClick(index, section.galleryPath) }}
                className={"btn btn-link h-nav-item"}>
                {section.sectionTitle.toLowerCase()}
              </button>
            </div>
          );
        }
        )
      }
    </div>
  )
}

function Footer() {
  return (
    <div id="contact" className="footer align-items-center justify-content-center">
			<div className="row justify-content-center mx-auto w-100">			
					<p><a href="http://instagram.com/gregoantonino">@gregoantonino - </a></p>
					<p><a href="mailto:info@gregorioantonino.com">mail</a></p>
			</div>
			<p id="copyright-year" className="footnote text-center">{"All rights reserved - Gregorio Antonino " + (new Date().getFullYear())}</p>
		</div>
  )
}

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState(section_file.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0)));
  const [imageArray, setImageArray] = useState([]);
  const [currentPath, setCurrentPath] = useState(sections[0].galleryPath);
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

  const sectionClick = (i, path) => {
    setCurrentSection(i);
    setCurrentPath(path);
  };

  return (
    <div className="App">
      <header>
        <NavBar onClick={(i, path) => sectionClick(i, path)} sections={sections} currentSection={currentSection} />
      </header>
      <Gallery imageSet={imageSet} galleryPath={currentPath} />
      <Footer/>
    </div>
  );
}
export default App;

/*
        <a href="/admin">
          <FontAwesomeIcon icon={faCog} />
        </a>
      </div>*/