YUI.add("scrollview-base",function(C){var E=C.ClassNameManager.getClassName,K="scrollview",H=10,B=150,I={scrollbar:E(K,"scrollbar"),vertical:E(K,"vertical"),horizontal:E(K,"horizontal"),child:E(K,"child"),b:E(K,"b"),middle:E(K,"middle"),showing:E(K,"showing")},A="scrollStart",G="scrollChange",L="scrollEnd",J="flick",F="ui";C.Node.DOM_EVENTS.DOMSubtreeModified=true;function D(){D.superclass.constructor.apply(this,arguments);}C.ScrollViewBase=C.extend(D,C.Widget,{initializer:function(){this._createEvents();},_createEvents:function(){this.publish(A);this.publish(G);this.publish(L);this.publish(J);},_uiSizeCB:function(){},_transitionEnded:function(){this.fire(L);},bindUI:function(){this.get("boundingBox").on("gesturemovestart",C.bind(this._onGestureMoveStart,this));var M=this.get("contentBox");M.on("transitionend",C.bind(this._transitionEnded,this),false);M.on("DOMSubtreeModified",C.bind(this._uiDimensionsChange,this));M.on("flick",C.bind(this._flick,this),{minDistance:0});this.after({"scrollYChange":this._afterScrollYChange,"scrollXChange":this._afterScrollXChange,"heightChange":this._afterHeightChange,"widthChange":this._afterWidthChange,"renderedChange":function(){C.later(0,this,"_uiDimensionsChange");}});},syncUI:function(){this.scrollTo(this.get("scrollX"),this.get("scrollY"));},scrollTo:function(N,T,P,S){var M=this.get("contentBox"),O=N*-1,R=T*-1,Q;if(N!==this.get("scrollX")){this.set("scrollX",N,{src:F});}if(T!==this.get("scrollY")){this.set("scrollY",T,{src:F});}Q={easing:S||"cubic-bezier(0, 0.1, 0, 1.0)",duration:P/1000};if(C.TransitionNative.supported){Q.transform="translate("+O+"px,"+R+"px)";}else{Q.easing="ease-out";Q.left=O;Q.top=R;}M.transition(Q);},_onGestureMoveStart:function(M){this._killTimer();var N=this.get("boundingBox");this._moveEvt=N.on("gesturemove",C.bind(this._onGestureMove,this));this._moveEndEvt=N.on("gesturemoveend",C.bind(this._onGestureMoveEnd,this));this._moveStartY=M.clientY+this.get("scrollY");this._moveStartX=M.clientX+this.get("scrollX");this._moveStartTime=(new Date()).getTime();this._moveStartClientY=M.clientY;this._moveStartClientX=M.clientX;this._isDragging=false;this._snapToEdge=false;},_onGestureMove:function(M){this._isDragging=true;this._moveEndClientY=M.clientY;this._moveEndClientX=M.clientX;this._lastMoved=(new Date()).getTime();if(this._scrollsVertical){this.set("scrollY",-(M.clientY-this._moveStartY));}if(this._scrollsHorizontal){this.set("scrollX",-(M.clientX-this._moveStartX));}},_onGestureMoveEnd:function(R){var T=this._minScrollY,P=this._maxScrollY,M=this._minScrollX,Q=this._maxScrollX,O=this._scrollsVertical?this._moveStartClientY:this._moveStartClientX,N=this._scrollsVertical?this._moveEndClientY:this._moveEndClientX,S=O-N;this._moveEvt.detach();this._moveEndEvt.detach();this._scrolledHalfway=false;this._snapToEdge=false;this._isDragging=false;if(this._scrollsHorizontal&&Math.abs(S)>(this.get("width")/2)){this._scrolledHalfway=true;this._scrolledForward=S>0;}if(this._scrollsVertical&&Math.abs(S)>(this.get("height")/2)){this._scrolledHalfway=true;this._scrolledForward=S>0;}if(this._scrollsVertical&&this.get("scrollY")<T){this._snapToEdge=true;this.set("scrollY",T);}if(this._scrollsHorizontal&&this.get("scrollX")<M){this._snapToEdge=true;this.set("scrollX",M);}if(this.get("scrollY")>P){this._snapToEdge=true;this.set("scrollY",P);}if(this.get("scrollX")>Q){this._snapToEdge=true;this.set("scrollX",Q);}if(this._snapToEdge){return;}if(+(new Date())-this._moveStartTime>100){this.fire(L,{staleScroll:true});return;}},_afterScrollYChange:function(M){if(M.src!==F){this._uiScrollY(M.newVal,M.duration,M.easing);}},_uiScrollY:function(N,M,O){M=M||this._snapToEdge?400:0;O=O||this._snapToEdge?"ease-out":null;this.scrollTo(this.get("scrollX"),N,M,O);},_afterScrollXChange:function(M){if(M.src!==F){this._uiScrollX(M.newVal,M.duration,M.easing);}},_uiScrollX:function(N,M,O){M=M||this._snapToEdge?400:0;O=O||this._snapToEdge?"ease-out":null;this.scrollTo(N,this.get("scrollY"),M,O);},_afterHeightChange:function(){this._uiDimensionsChange();},_afterWidthChange:function(){this._uiDimensionsChange();},_uiDimensionsChange:function(){var N=this.get("contentBox"),R=this.get("boundingBox"),M=this.get("height"),Q=this.get("width"),P=N.get("scrollHeight"),O=N.get("scrollWidth");if(M&&P>M){this._scrollsVertical=true;this._maxScrollY=P-M;this._minScrollY=0;R.setStyle("overflow-y","auto");}if(Q&&O>Q){this._scrollsHorizontal=true;this._maxScrollX=O-Q;this._minScrollX=0;R.setStyle("overflow-x","auto");}},_flick:function(N){var M=N.flick;this._currentVelocity=M.velocity*M.direction;this._flicking=true;this._flickFrame();this.fire(J);},_flickFrame:function(){var P=this.get("scrollY"),N=this._maxScrollY,R=this._minScrollY,Q=this.get("scrollX"),O=this._maxScrollX,M=this._minScrollX;this._currentVelocity=(this._currentVelocity*this.get("deceleration"));if(this._scrollsVertical){P=this.get("scrollY")-(this._currentVelocity*H);}if(this._scrollsHorizontal){Q=this.get("scrollX")-(this._currentVelocity*H);}if(Math.abs(this._currentVelocity).toFixed(4)<=0.015){this._flicking=false;this._killTimer(!(this._exceededYBoundary||this._exceededXBoundary));if(this._scrollsVertical){if(P<R){this._snapToEdge=true;this.set("scrollY",R);}else{if(P>N){this._snapToEdge=true;this.set("scrollY",N);}}}if(this._scrollsHorizontal){if(Q<M){this._snapToEdge=true;this.set("scrollX",M);}else{if(Q>O){this._snapToEdge=true;this.set("scrollX",O);}}}return;}if(this._scrollsVertical&&(P<R||P>N)){this._exceededYBoundary=true;this._currentVelocity*=this.get("bounce");}if(this._scrollsHorizontal&&(Q<M||Q>O)){this._exceededXBoundary=true;this._currentVelocity*=this.get("bounce");}if(this._scrollsVertical){this.set("scrollY",P);}if(this._scrollsHorizontal){this.set("scrollX",Q);}this._flickTimer=C.later(H,this,"_flickFrame");},_killTimer:function(M){if(this._flickTimer){this._flickTimer.cancel();}if(M){this.fire(L);}},_setScrollX:function(P){var N=this.get("bounce"),O=N?-B:0,M=N?this._maxScrollX+B:this._maxScrollX;if(!N||!this._isDragging){if(P<O){P=O;
}else{if(P>M){P=M;}}}return P;},_setScrollY:function(P){var N=this.get("bounce"),O=N?-B:0,M=N?this._maxScrollY+B:this._maxScrollY;if(!N||!this._isDragging){if(P<O){P=O;}else{if(P>M){P=M;}}}return P;}},{NAME:"scrollview",ATTRS:{scrollY:{value:0,setter:"_setScrollY"},scrollX:{value:0,setter:"_setScrollX"},deceleration:{value:0.98},bounce:{value:0.7}},CLASS_NAMES:I,UI_SRC:F});C.ScrollView=C.ScrollViewBase;},"@VERSION@",{requires:["widget","event-gestures","transition"]});