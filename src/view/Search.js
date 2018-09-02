import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import loadImage from 'image-promise';
import data from '../data/data.js'
import $ from 'jquery';
import mousewheel from 'jquery-mousewheel'; // eslint-disable-line no-unused-vars
import dragscroll from 'dragscroll'; // eslint-disable-line no-unused-vars
import Modal from 'react-responsive-modal';
import {TweenMax} from "gsap/all";
import ReactList from 'react-list'; // eslint-disable-line no-unused-vars
import Image from "react-graceful-image";
import Swiper from 'swiper/dist/js/swiper.js';

// Story Data
const story_data = data.stories;
const topic_data = data.topics;
const date_data = data.dates;
var divides = [];
var offset_i = 520;
var offset_w = 440;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      area: '',
      open: false,
      content: {}
    };
    divides = [
      offset_i + (this.findDate('7') - topic_data.length)*offset_w,
      offset_i + (this.findDate('8') - topic_data.length)*offset_w,
      offset_i + (this.findDate('9') - topic_data.length)*offset_w,
      offset_i + (this.findDate('0') - topic_data.length)*offset_w,
      offset_i + (this.findDate('1') - topic_data.length)*offset_w
    ];
    console.log(divides);
  }

  onOpenModal = (event, c) => {
    if(!$(event.target).hasClass('noClick') && c.time !== "") {
      this.setState({ open: true, content: c});
    }
    $(document).ready(function(){
      console.log("swiper!");
      var mySwiper = new Swiper ('.swiper-container', {
        // Optional parameters
        autoHeight: true,
        loop: true,
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      })
    })
  };

  onCloseModal = () => {
    this.setState({ open: false });
    $('.noClick').removeClass('noClick');
  };

  componentDidMount() {
    $(document).scrollTop(0);
    $('#storyBox').scrollLeft(0);

    // Horizontal Scroll
    $('.storyBox').mousewheel(function(event, change) {
      this.scrollLeft -= (change * 1); //need a value to speed up the change
      event.preventDefault();
    });

    // Set Height
    function setHeight() {
      var windowHeight = $(window).height(),
        $block = $('#timeline');
        if(windowHeight > 550) { // 550px is your css min-height for this block
          $block.css('min-height', windowHeight + 'px') 
        } else {
          $block.css('min-height': '') 
        }
    }
    setHeight();
    $(window).on('resize orientationchange', setHeight);
    
    // Init Page
    document.body.classList.add('ds');
    document.getElementById('loading').classList.remove('fade');

    // Preload Images
    var images  = [];
    loadImage(images)
    .then(function (allImgs) {
      console.log(allImgs.length, 'images loaded!', allImgs);
      setTimeout(function(){
        document.getElementById('loading').classList.add('fade');
        document.body.classList.remove('ds');
      },600);
    })
    .catch(function (err) {
      console.error('One or more images have failed to load :(');
      console.error(err.errored);
      console.info('But these loaded fine:');
      console.info(err.loaded);
    });

    var $this = this;
    $(document).ready(function(){
      var scroll = document.getElementById("scrollRange");
      var panel = document.getElementById("storyBox");    
      scroll.oninput = function (el) {
        var total = panel.scrollWidth - panel.offsetWidth;
        var percentage = total*(this.value/100);
        panel.scrollLeft = percentage;
        window.scrollTo(window.scrollX, window.scrollY + 1);
        window.scrollTo(window.scrollX, window.scrollY - 1);
        $this.activeScroll(panel);
      }
      panel.onscroll = function (el) {
        var total = panel.scrollWidth - panel.offsetWidth;
        scroll.value = panel.scrollLeft*100/total;
        window.scrollTo(window.scrollX, window.scrollY + 1);
        window.scrollTo(window.scrollX, window.scrollY - 1);
        $this.activeScroll(panel);
      }
    });
  }

  activeScroll = (p) => {
      if(p.scrollLeft < divides[4] && p.scrollLeft >= divides[3]) {
        if(!$('.dateContainer li:nth-child(4)').hasClass('active')) {
          $('.dateContainer li.active').removeClass('active');
          $('.dateContainer li:nth-child(4)').addClass('active');
        }
      }
      else if(p.scrollLeft < divides[3] && p.scrollLeft >= divides[2]) {
        if(!$('.dateContainer li:nth-child(3)').hasClass('active')) {
          $('.dateContainer li.active').removeClass('active');
          $('.dateContainer li:nth-child(3)').addClass('active');
        }
      }
      else if(p.scrollLeft < divides[2] && p.scrollLeft >= divides[1]) {
        if(!$('.dateContainer li:nth-child(2)').hasClass('active')) {
          $('.dateContainer li.active').removeClass('active');
          $('.dateContainer li:nth-child(2)').addClass('active');
        }
      }
      else if(p.scrollLeft < divides[1]) {
        if(!$('.dateContainer li:nth-child(1)').hasClass('active')) {
          $('.dateContainer li.active').removeClass('active');
          $('.dateContainer li:nth-child(1)').addClass('active');
        }
      }
      else {
        if(!$('.dateContainer li:nth-child(5)').hasClass('active')) {
          $('.dateContainer li.active').removeClass('active');
          $('.dateContainer li:nth-child(5)').addClass('active');
        }
      }
  }

  stories = (s, i) => {
    let d = " dib";
    if(this.state.search === "" && s.keywords.indexOf("topic") !== -1) d = " dn";

    // Topic Cards
    let style = " bg-white dark-gray w6-ns w5 card";
    let image = " db";
    if(s.time === "") {
      style = " white bg-dark-gray w7-ns w5";
      image = " dn";
    } else {
      image = " flex aic"
    }
    let cover = ""
    if(s.images !== undefined) {
      cover = s.images[0];
    }

    return (
      <li className={"storyItem item cp mh3"+d+style} key={i} onClick={(e) => this.onOpenModal(e, s)}>
        <div className="pn">
          <figure className={"ma0 vh-25 overflow-hidden"+image}>
            <Image
              src={cover}
              width="100%"
              height="auto"
              alt="story"
            />
          </figure>
          <div className="pa4 tl">
            <h3 className="ma0 f4-ns f5 initial lh-copy">{s.name}</h3>
            <p className="mv2 f5-ns f6">{s.time}</p>
          </div>
        </div>
      </li>
    );
  } 

  // Story Component
  storyList = () => {
    let filteredStories = story_data.filter((s) => { 
      return s.keywords.indexOf(this.state.search) !== -1 && s.keywords.indexOf(this.state.area) !== -1;
    });
    return (<ul id="storyBox" className="storyBox tc pa0 nowrap list overflow-x-scroll dragscroll">{filteredStories.map((s, i) => { 
      return this.stories(s, i);
    })}</ul>);
  }

  // Topic Component
  topicList = () => {
    return (<ul className="topicBox list flex space-between pa0 ph2-ns nowrap list overflow-x-scroll dragscroll">{topic_data.map((t, i) => { 
      let highlight = '';
      if(t.title === 'All') highlight = 'active'
      return (
        <li className={"dib w-100 pa2 mh2 bg-white cp ph4 tc "+highlight} key={i} id={t.keyword} onClick={this.updateTopic.bind(this)}>{t.title}</li>
      );
    })}</ul>)
  }

  // Date Component
  scrollDate = (event) => {
    var t = event.target.innerHTML.toString()[2];
    var scrollL = offset_i + (this.findDate(t) - topic_data.length)*offset_w;
    $('#storyBox').animate( {scrollLeft: scrollL}, 400);
  }

  dateList = () => {
    let disable = ''
    if(this.state.search !== '') disable = 'none';

    return (<ul className={"list pa0 mb0 "+disable}>{date_data.map((d, i) => { 
      let highlight = '';
      if(d === '1970') highlight = 'active';
      return (
        <li className={"w-20 tc dib pa2 bg-white cp " + highlight} key={i} onClick={this.scrollDate.bind(this)}>{d}</li>
      ); 
    })}</ul>)
  }

  // Update Search
  updateSearch = (event) => {
    if(event) event.preventDefault();
    const key = this.refs.keyword.value;
    const key_area = this.refs.areas.value;
    var $this = this;
    var tween = TweenMax.to($('.storyBox'), .2, {opacity: 0});
    tween.eventCallback("onComplete", function(){
      TweenMax.to($('.storyBox'), .4, {opacity: 1});
    });
    
    $this.setState({
      search: key.substr(0,20),
      area: key_area
    });
    $('.storyBox').scrollLeft(0);
  }
  updateTopic = (event) => {
    if(!event.target.classList.contains('active')) {
      if(event) {
        $('.topicContainer .active').removeClass('active');
        event.target.classList.add('active');
        event.preventDefault();
      }
      const key = event.target.id;
      var $this = this;
      var tween = TweenMax.to($('.storyBox'), .2, {opacity: 0});
      tween.eventCallback("onComplete", function(){
        TweenMax.to($('.storyBox'), .4, {opacity: 1});
        $this.setState({
          search: key,
          area: "",
        });
        $this.refs.keyword.value = key;
        $this.refs.areas.value = '';
        $('.storyBox').scrollLeft(0);
      });
    }
  }
  findDate = (n) => {
    for (var i = 0; i < story_data.length; i++) {
      if(n > 1) {
        if(story_data[i].time.toString().split('.')[0].indexOf('9'+n) !== -1) return i;
      } else {
        if(story_data[i].time.toString().split('.')[0].indexOf('20'+n) !== -1) return i;
      }
    }
  }

  render() {
    const { open } = this.state;
    let images = [];
    let imageLength = 0;
    if(this.state.content.images !== undefined) {
      images = this.state.content.images;
      imageLength = images.length;
    }
    var imageSlider = [];
    for(var i = 0; i < imageLength; i++) {
      var slides = (
        <div className="swiper-slide">
          <figure className="mh0 mv4 modalImg">
            <img src={images[i]} alt="story" />
          </figure>
        </div>
      )
      imageSlider.push(slides);
    }

    return (
      <section id="timeline" className="min-vh-100 bg-light-gray">
        <Helmet>
            <title>Timeline</title>
        </Helmet>
        <div className="mw8-ns center ph3-ns mb4-ns">
          <div className="cf ph2-ns mb3-ns mb2">
            <div className="fl w-100 w-30-l ph2">
              <h2 className="ma0-l mb4 tl-ns tc mt0">台灣環境史三十年大事紀</h2>
            </div>
            <div className="fl w-100 w-70-l ph2-ns">
              <form className="flex space-between aic" onSubmit={this.updateSearch.bind(this)}>
                <input id="search_input" className="w-100 ph2" type="text" ref="keyword" placeholder="搜尋紀事"/>
                <select name="areas" ref="areas" className="w150">
                  <option value="">全部地區</option>
                  <option value="north">北部地區</option>
                  <option value="central">中部地區</option>
                  <option value="south">南部地區</option>
                  <option value="others">其他</option>
                </select>
                <input type="submit" className="ph2 tc cp w4" value="搜尋" />
              </form>
            </div>
          </div>
        </div>
        <div className="topicContainer mw8-ns center ph3-ns">
          {this.topicList()}
        </div>
        <div className="storyContainer mt3-ns mt1">
          {this.storyList()}
        </div>
        <div className="mw8 center ph3 mt2">
          <form className="rangeSlider">
            <input id="scrollRange" className="w-100" type="range" defaultValue="0"/>
          </form>
          <div className="dateContainer cf ph2-ns">
            {this.dateList()}
          </div>
        </div>
        <Modal open={open} onClose={this.onCloseModal}>
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {imageSlider}
            </div>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
          
          <div className="ph4-ns pb4">
            <h2>{this.state.content.name}</h2>
            <p className="lh-copy">
              {this.state.content.content}
            </p>
          </div>
        </Modal>
      </section>
    );
  }
}

export default Search;


