!function(t){var e={};function r(s){if(e[s])return e[s].exports;var i=e[s]={i:s,l:!1,exports:{}};return t[s].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=e,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(s,i,function(e){return t[e]}.bind(null,i));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";function s(t){return 180*t/Math.PI}function i(t,e,r,s,i,o){t.beginPath(),t.arc(e,r,s,0,2*Math.PI),t.strokeStyle=i,t.fillStyle=i,1==o?t.fill():t.stroke()}r.r(e);class o{constructor(t,e){this.x=t,this.y=e}plus(t){return new o(this.x+t.x,this.y+t.y)}}class n{constructor({r:t,orbitR:e,color:r,pos:s=new o(0,0),satellites:i=[],drawOrbits:n=!1}){this.pos=s,this.r=t,this.orbitR=e,this.color=r,this.drawOrbits=n,this.satellites=i}}class c{constructor(t,e){this.pos=t,this.v=e}}class l{constructor(t,e,r){this.sun=t,this.player=e,this.time=r}}function a(t,e){return t.satellites.forEach((r,i)=>{if(r){const n=t.r+t.orbitR*(i+1),c=e/(5e3*(i+1));r.pos=function(t,e,r){return new o(t.x+e*Math.sin(s(r)),t.y+e*Math.cos(s(r)))}(t.pos,n,c),a(r,5*e)}}),t}const u="black";const h=new n({r:5,orbitR:1,color:"grey"}),d=new n({r:8,orbitR:3,color:"red"}),f=new n({r:12,orbitR:5,color:"brown"}),w=new n({r:10,orbitR:10,color:"blue",drawOrbits:!0,satellites:[h]}),b=new n({pos:new o(200,200),r:25,orbitR:40,color:"orange",drawOrbits:!0,satellites:[d,w,f,null]}),x=document.getElementById("canvas"),y=x.getContext("2d");x.width=800,x.height=800,x.style.width="400px",x.style.height="400px",x.style.border="1px solid black",x.getContext("2d").scale(2,2);const p=new c(new o(20,20),new o(5,5)),g=new class{constructor(t,e,r){this.ctx=t,this.sun=e,this.sun_pos=r}draw(t){this.clearWorld(),this.drawCelestialBody(t.sun,t.sun.pos,t.time),this.drawRocket(t.player)}clearWorld(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}drawOrbits(t,e){for(let r=1;r<=t.satellites.length;r++)i(this.ctx,e.x,e.y,t.r+t.orbitR*r,u,!1)}drawGrid(t,e,r,s,i){if(i<=0)return;let o=t+(e-t)/2,n=r+(s-r)/2;this.ctx.strokeStyle="grey",this.ctx.beginPath(),this.ctx.moveTo(t,n),this.ctx.lineTo(e,n),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(o,r),this.ctx.lineTo(o,s),this.ctx.stroke(),drawGrid(t,o,r,n,i-1),drawGrid(o,e,r,n,i-1),drawGrid(t,o,n,s,i-1),drawGrid(o,e,n,s,i-1)}drawCelestialBody(t,e,r){t.drawOrbits&&this.drawOrbits(t,e),i(this.ctx,e.x,e.y,t.r,t.color,!0),t.satellites.forEach((t,e)=>{t&&this.drawCelestialBody(t,t.pos,5*r)})}drawRocket(t){this.ctx.beginPath(),this.ctx.strokeStyle="red",this.ctx.rect(t.pos.x,t.pos.y,20,20),this.ctx.stroke()}}(y);!function t(e,r,s){requestAnimationFrame((function(){r(e),t(s(e),r,s)}))}(new l(b,p,0),(function(t){g.draw(t)}),(function(t){const e=t.time+1;return new l(a(t.sun,e),(r=t.player,new c(new o(s=e,s),r.v)),e);var r,s}))}]);