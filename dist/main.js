!function(t){var e={};function r(i){if(e[i])return e[i].exports;var s=e[i]={i:i,l:!1,exports:{}};return t[i].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=t,r.c=e,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(i,s,function(e){return t[e]}.bind(null,s));return i},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}([function(t,e){class r{constructor(t,e){this.x=t,this.y=e}mag(){return Math.sqrt(this.x**2+this.y**2)}plus(t){return new r(this.x+t.x,this.y+t.y)}mult(t){return new r(this.x*t,this.y*t)}div(t){return new r(this.x/t,this.y/t)}tetha(){return Math.atan2(this.y,this.x)}normalize(){const t=this.mag();return 0!=t&&1!=t?this.div(t):this}rotate(t){return new r(this.x*Math.cos(t)-this.y*Math.sin(t),this.x*Math.sin(t)+this.y*Math.cos(t))}}t.exports=r},function(t,e,r){"use strict";function i(t){return 180*t/Math.PI}function s(t,e,r,i,s,n){t.beginPath(),t.arc(e,r,i,0,2*Math.PI),t.strokeStyle=s,t.fillStyle=s,1==n?t.fill():t.stroke()}r.r(e);var n=r(0),o=r.n(n);const a=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],c=3*Math.PI/180;const h=0,l=2,d=new o.a(1,0);class u{constructor({r:t,orbitR:e,c:r,pos:i=new o.a(0,0),satellites:s=[],drawOrbits:n=!1}){this.pos=i,this.r=t,this.orbitR=e,this.c=r,this.drawOrbits=n,this.satellites=s}}class w{constructor({pos:t,dir:e=d,speed:r=h,c:i="navy"}){this.pos=t,this.dir=e,this.speed=r,this.c=i}nextPos(){return new w({...this,pos:this.pos.plus(this.dir.mult(this.speed))})}}class p{constructor({sun:t,player:e,time:r,drawGrid:i=!1}){this.sun=t,this.player=e,this.time=r,this.drawGrid=i,y(this.sun,r)}}function y(t,e){return t.satellites.forEach((r,s)=>{if(r){const n=t.r+t.orbitR*(s+1),a=e/(5e3*(s+1));r.pos=function(t,e,r){return new o.a(t.x+e*Math.sin(i(r)),t.y+e*Math.cos(i(r)))}(t.pos,n,a),y(r,5*e)}}),t}function x(t,e){let r=0,i=0;e.ArrowLeft&&(r-=c),e.ArrowRight&&(r+=c),e.ArrowDown&&(i-=1),e.ArrowUp&&(i+=1);const s=t.dir.rotate(r),n=t.speed+i;return new w({...t,dir:s,speed:n<h?h:Math.min(n,l)})}const f="black";const b=new u({pos:new o.a(200,200),r:25,orbitR:40,c:"orange",drawOrbits:!0,satellites:[new u({r:8,orbitR:3,c:"red"}),new u({r:10,orbitR:10,c:"blue",drawOrbits:!0,satellites:[new u({r:5,orbitR:1,c:"grey"})]}),new u({r:12,orbitR:5,c:"brown"})]}),g=document.getElementById("canvas"),m=g.getContext("2d");g.width=800,g.height=800,g.style.width="400px",g.style.height="400px",g.style.border="1px solid black",g.getContext("2d").scale(2,2);const v=new w({pos:new o.a(50,50),dir:new o.a(.5,.5)}),k=new class{constructor(t,e,r){this.ctx=t,this.width=e,this.height=r}draw(t){this.clearWorld(),this.drawCelestialBody(t.sun,t.sun.pos,t.time),this.drawRocket(t.player),t.drawGrid&&this.drawGrid(0,this.width,0,this.height,3)}clearWorld(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height)}drawOrbits(t,e){for(let r=1;r<=t.satellites.length;r++)s(this.ctx,e.x,e.y,t.r+t.orbitR*r,f,!1)}drawGrid(t,e,r,i,s){if(s<=0)return;let n=t+(e-t)/2,o=r+(i-r)/2;this.ctx.strokeStyle="grey",this.ctx.beginPath(),this.ctx.moveTo(t,o),this.ctx.lineTo(e,o),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(n,r),this.ctx.lineTo(n,i),this.ctx.stroke(),this.drawGrid(t,n,r,o,s-1),this.drawGrid(n,e,r,o,s-1),this.drawGrid(t,n,o,i,s-1),this.drawGrid(n,e,o,i,s-1)}drawCelestialBody(t,e,r){t.drawOrbits&&this.drawOrbits(t,e),s(this.ctx,e.x,e.y,t.r,t.c,!0),t.satellites.forEach((t,e)=>{t&&this.drawCelestialBody(t,t.pos,5*r)})}drawRocket(t){this.ctx.save(),this.ctx.translate(t.pos.x,t.pos.y),this.ctx.rotate(t.dir.tetha()),this.ctx.translate(-t.pos.x,-t.pos.y),this.ctx.beginPath(),this.ctx.moveTo(t.pos.x+15,t.pos.y),this.ctx.lineTo(t.pos.x-15,t.pos.y-10),this.ctx.lineTo(t.pos.x-15,t.pos.y+10),this.ctx.fillStyle=t.c,this.ctx.fill(),this.ctx.restore()}}(m,400,400);!function({ws:t,onDraw:e,onTick:r,onKey:i}){const s=function(t){const e=Object.create(null);function r(r){t.includes(r.key)&&(e[r.key]="keydown"==r.type,r.preventDefault())}return window.addEventListener("keyup",r),window.addEventListener("keydown",r),e}(a),n=function(t,e,r,i){requestAnimationFrame((function(){e(t),n(r(i(t,s)),e,r,i)}))};n(t,e,r,i)}({ws:new p({sun:b,player:v,time:0,drawGrid:!1}),onDraw:function(t){k.draw(t)},onTick:function(t){const e=t.time+1;return new p({...t,sun:y(t.sun,e),player:t.player.nextPos(),time:e})},onKey:function(t,e){return e.ArrowUp||e.ArrowDown||e.ArrowLeft||e.ArrowRight?new p({...t,player:x(t.player,e)}):t}})}]);