import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/data.js';
import $ from 'jquery';
import mousewheel from 'jquery-mousewheel'; // eslint-disable-line no-unused-vars
import dragscroll from 'dragscroll'; // eslint-disable-line no-unused-vars
import {TweenMax} from "gsap/all";
import topic1 from '../assets/images/山水污染分層-01.svg';
import topic2 from '../assets/images/山水污染分層-02.svg';
import topic3 from '../assets/images/山水污染分層-03.svg';

// Event Data
const event_data = data.events;

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [0,0,0],
      device: "",
      colors: ["#369EBB", "#85A48C", "#CF9479"]
    };
  }
  handleMouseEnter (id) {
    var topic = id.split('-')[0];
    var num = id.split('-')[1];
    var $this = this;
    var tween = null;
    var scale = null;

    switch(topic) {
    case "1":
      if($this.state.topics[0] === num-1) ;
      else {
        tween = TweenMax.to($('#topic-'+topic+' .eventBg'), .2, {opacity: 0});
        scale = TweenMax.to($('.bg-1'), .1, {transform: 'scale(1)'}, .1);
        tween.eventCallback("onComplete", function(){
          TweenMax.to($('#topic-'+topic+' .eventBg'), .6, {opacity: 1});
          TweenMax.to($('.bg-1'), 1.2, {transform: 'scale(1.04)'});
          $this.setState({topics:[num-1,0,0]});
        });
      }
      break;
    case "2":
      if($this.state.topics[1] === num-1) ;
      else {
        tween = TweenMax.to($('#topic-'+topic+' .eventBg'), .2, {opacity: 0});
        scale = TweenMax.to($('.bg-2'), .1, {transform: 'scale(1)'}, .1);
        tween.eventCallback("onComplete", function(){
          TweenMax.to($('#topic-'+topic+' .eventBg'), .6, {opacity: 1});
          TweenMax.to($('.bg-2'), 1.2, {transform: 'scale(1.04)'});
          $this.setState({topics:[0,num-1,0]});
        });
      }
      break;
    case "3":
      if($this.state.topics[2] === num-1) ;
      else {
        tween = TweenMax.to($('#topic-'+topic+' .eventBg'), .2, {opacity: 0});
        scale = TweenMax.to($('.bg-3'), .1, {transform: 'scale(1)'}, .1);
        tween.eventCallback("onComplete", function(){
          TweenMax.to($('#topic-'+topic+' .eventBg'), .6, {opacity: 1});
          TweenMax.to($('.bg-3'), 1.2, {transform: 'scale(1.04)'});
          $this.setState({topics:[0,0,num-1]});
        });
      }
      break;
    default:
      break;
    }
  }
  componentDidMount() {
    var $this = this;
    $(document).ready(function(){
      if($(window).width() >= 480) $this.setState({device: 'desktop'});
      else $this.setState({device: 'mobile'});
      $(window).resize(function(){
        if($(window).width() >= 480) $this.setState({device: 'desktop'});
        else $this.setState({device: 'mobile'});
      })
      //Init
      $('.eventItem').each(function(){
        TweenMax.to($(this), .001, {transform: "scale3d(0,0,0)"});
      });

      //Scroll
      var flag = [false, false, false];
      $(window).scroll( function(){
        for (var k = 1; k <= 3; k++) {
          var $this = $('#topic-'+k+' .eventBg');
          if($this.length !== 0) {
            var bottom_of_object = $this.offset().top + $this.outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            if( bottom_of_window > bottom_of_object + 50){
            if(!flag[k-1]) {
              $('#topic-'+k+' .eventItem').each(function(i){
                var $eventItem = $(this);
              setTimeout(function(){
                TweenMax.to($eventItem, .4, {transform: "scale3d(1,1,1)"});
                }, 50 + i * 50);
              });
              flag[k-1] = !flag[k-1];
            }
            } else if( bottom_of_window < bottom_of_object - 200){
              if(flag[k-1]) {
                $('#topic-'+k+' .eventItem').each(function(i){
                  TweenMax.to($(this), .4, {transform: "scale3d(0,0,0)"});
                });
                flag[k-1] = !flag[k-1];
              }
            }
          }
        }
      });

      //Check Width
      if($(window).width() < 850) {
        $('.eventBox').mousewheel(function(event, change) {
          this.scrollLeft -= (change * 1); //need a value to speed up the change
          event.preventDefault();
        });
      }
    });
  }

  event = (content, i) => {
    return (
      <li className="eventItem item dib center tc" key={i} onMouseEnter={() => this.handleMouseEnter(content.id)}>
        <Link to={"/ourisland/"+content.url+"/"}>
        <figure className="eventFigure circle-10 br-100 ma3 bg-white flex aic jcc">
          <img src={content.icon} width="120" height="120" alt={content.name} />
        </figure>
        <p className="f5 fw7 mv0 tracked">{content.name.split('@')[0]}</p>
        <p className="f6 o-50 fw4 mv2">{content.name.split('@')[1]}</p>
        </Link>
      </li>
    )
  }

  topics = (num) => {
    let list = [];
    const topic_title = event_data[num].title
    const event_content = event_data[num].content
    for(var i = 0; i < event_content.length; i++) {
      var content = event_content[i];
      list.push(this.event(content, i));
    }
    var bgUrl = event_content[this.state.topics[num]].image;
    var bgStyle = {
          backgroundImage: 'url('+bgUrl+')',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          height: '600px',
          backgroundRepeat: 'no-repeat'
    }
    var btnStyle= {
        background: this.state.colors[num],
        boxShadow: '#222 0px 0px 0px 2px',
        border: '4px solid #fff'
    }
    var topicBg = [
    {
          backgroundImage: 'url('+topic1+')',
          backgroundPosition: 'center center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
    },
    {
          backgroundImage: 'url('+topic2+')',
          backgroundPosition: 'center center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
    },
    {
          backgroundImage: 'url('+topic3+')',
          backgroundPosition: 'center center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
    }
    ]
    var topic_content = (
      <div className="cf ph2-ns white">
        <h1 className="dib f2-ns f3 fw7 mv0 mr2 tracked">{event_content[this.state.topics[num]].name.split('@')[0]}</h1>
        <h3 className="dib f4-ns f5 fw3 o-80">{"/ "+event_content[this.state.topics[num]].name.split('@')[1]}</h3>
        <p className="mw6 f4-ns f5 lh-copy fw4">{event_content[this.state.topics[num]].description}</p>
        <Link to={"/ourisland/"+event_content[this.state.topics[num]].url+"/"}>
          <button className="cp mt2 white dib mb6" style={btnStyle}>事件連結</button>
        </Link>        
      </div>
    )
    return (
      <section id={"topic-"+(num+1)} className="ma0 bb bw1 b--light-gray">
        <div className="mw8 center ph3">
          <div className="cf ph2-ns hide">
            <div className="topicTitle flex aic jcc w-100 ph2 relative mt4" style={topicBg[num]}>
              <h2 className="tc dn">{topic_title}</h2>
            </div>
          </div>
        </div>
        <div className="eventContainer relative hide mt4">
          <div className="pv6-ns pv4 eventBg flex aic relative overflow-hidden">
            <div className={"bg-"+(num+1) +" w-100 h-100 absolute top0"} style={bgStyle}></div>
            <div className="w-100 mw8 center ph5-l ph4 relative z1">
              {topic_content}
            </div>
          </div>
          <div className="mw8 center event tr-l tc relative">
            <ul className="eventBox dragscroll nowrap overflow-x-scroll dragscroll list pa0 ph2">{list}</ul>
          </div>
        </div>
      </section>
    )
  }

  render() {
    return (
      <section id="events" className="bg-white tl">
        <div className="bg-near-white center ph3 pv6">
          <div className="cf ph2-ns tc hide flex aic jcc flex-column">
            <h1 className="ph2 fw7 f2 mv2">三大主題介紹</h1>
            <h3 className="ph2 fw4 f4 mv2">三大主題介紹</h3>
          </div>
        </div>
        {this.topics(0)}
        {this.topics(1)}
        {this.topics(2)}
      </section>
    );
  }
}

export default Events;
