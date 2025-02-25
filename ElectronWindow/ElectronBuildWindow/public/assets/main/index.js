System.register("chunks:///_virtual/main",["./Test.ts"],(function(){return{setters:[null],execute:function(){}}}));

System.register("chunks:///_virtual/Test.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){var t,n,i,s,o,r,l,a,u,c;return{setters:[function(e){t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,s=e.assertThisInitialized},function(e){o=e.cclegacy,r=e._decorator,l=e.EditBox,a=e.Button,u=e.Label,c=e.Component}],execute:function(){var p,h,b,g,f,d,y,v,w;o._RF.push({},"0bf66WowvBAZbCQsPdeYoIO","Test",void 0);var m=r.ccclass,B=r.property;e("Test",(p=m("Test"),h=B({type:l}),b=B(a),g=B(u),p((y=t((d=function(e){function t(){for(var t,n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return t=e.call.apply(e,[this].concat(o))||this,i(t,"editBox",y,s(t)),i(t,"button",v,s(t)),i(t,"label",w,s(t)),t.messages=[],t}n(t,e);var o=t.prototype;return o.start=function(){var e=this;this.button.node.on(a.EventType.CLICK,this.onBtnClick,this),window.electronAPI.onFromMain((function(t,n){e.messages.push(n),e.showAllMessage()}))},o.onBtnClick=function(){var e=this.editBox.string;this.messages.push(e),window.electronAPI.sendToMain(e),this.showAllMessage()},o.showAllMessage=function(){for(var e="",t=0,n=this.messages.length;t<n;t++)e+=this.messages[t]+"\n";this.label.string=e},t}(c)).prototype,"editBox",[h],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),v=t(d.prototype,"button",[b],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),w=t(d.prototype,"label",[g],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),f=d))||f));o._RF.pop()}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});