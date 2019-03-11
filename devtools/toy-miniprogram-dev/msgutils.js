'use strict';

var MSG = {};
MSG.msgListeners = null;

// 初始化webview之间的消息通信
var initMessageInteract = function(rootNode) {
    if (MSG.msgListeners == null)
    {
      MSG.msgListeners = {};
      rootNode.addEventListener('message', function(e) {            
          // I expect this check to work, but I have not tested it.
          //if (e.source != webview.contentWindow)
          //    return;
          console.log(e);

          var source = e.source;
          var origin = e.origin;
          var data = JSON.parse(e.data);

          //console.log(data);
          var msg_type = data['type'];
          var msg_obj = JSON.parse(data['obj']);

          var handles = MSG.msgListeners[msg_type];

          if (handles != undefined && handles != null) {  
              for(var i = 0; i < handles.length; i++)
              {
                var hdl = handles[i];
                var ctx = hdl['ctx'];                
                var cb = hdl['cb'];
                if(cb != undefined && cb != null) {
                    //console.log(cb);
                    cb(msg_type,msg_obj,ctx,origin,source);                  
                }
              }
          }
      });    
    }
};

// 注册监听
var registerMessageHandler = function(msg_type,context,callback) {
    var handles = MSG.msgListeners[msg_type];
    if (handles == null)
    {
        handles = new Array();
        MSG.msgListeners[msg_type] = handles;
    }
    var newObj = new Object();
    newObj['ctx'] = context;
    newObj['cb'] = callback;
    handles.push(newObj);
    MSG.msgListeners[msg_type] = handles;
};

var unregisterMessageHandler = function(msg_type) {
  var handles = MSG.msgListeners[msg_type];
  MSG.msgListeners[msg_type] = null;
}

// 向目标webview tag发消息，msg_type是字符串,msg_obj是个对象，会被stringfy
var postMessageToTargetWebview = function(target, msg_type, msg_obj,targetOrigin) {
  var msg = {
      'type':msg_type,
      'obj':JSON.stringify(msg_obj)
  };
  if (targetOrigin == null)
  {
    targetOrigin = '*';
  }
  target.postMessage(JSON.stringify(msg), targetOrigin);
};

MSG.init = initMessageInteract;
MSG.registerListener = registerMessageHandler;
MSG.unregisterListener = unregisterMessageHandler;
MSG.postMsg = postMessageToTargetWebview;

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
{
    module.exports = MSG;
}

      