'use strict';

var MSG_WS = {};
MSG_WS.msgListeners = null;
MSG_WS.gClientsMap = [];
MSG_WS.isConnected = false;
MSG_WS.src_id = null;
MSG_WS.wsObject = null;

// 初始化webview之间的消息通信
var startMessageInteract = function(serverURL,my_src_id, closed_callback) {
  if (MSG_WS.msgListeners == null)
  {
    MSG_WS.msgListeners = {};
  }

  if(window.WebSocket){
    var ws = new WebSocket(serverURL);
    MSG_WS.wsObject = ws;
    MSG_WS.src_id = my_src_id;

    // 定时获取连到server的客户端
    var doSendMsgToGetClientMap = function() {
      var msg_wrapper = {
        src_id:my_src_id,
        dst_id:'Server',
        cmd:'getClientList',
        err_code:0,
        err_msg:'',
        msg:{
          'type':'getClientList',
          'obj':JSON.stringify({})
        }
      };
      ws.send(JSON.stringify(msg_wrapper));
    }
    var timerToTrigerGetClientMap = null;
    var stopTimerToTrigerGetClientMap = function() {
      if (timerToTrigerGetClientMap != null)
      {
        clearTimeout(timerToTrigerGetClientMap);
        timerToTrigerGetClientMap = null;
      }
    }

    // 连接关闭回调
    var callBackCallerWSClosed = function(isError) {
      if(closed_callback != undefined && closed_callback != null && typeof closed_callback == 'function') {
        //console.log(cb);
        closed_callback(isError);                  
      }
    }

    // websocket 各种处理
    ws.onopen = function(e){
        console.log("连接服务器成功");
        // 向服务器注册客户端
        doSendMsgToGetClientMap();
        MSG_WS.isConnected = true;
    }
    ws.onclose = function(e){
        console.log("服务器关闭");
        MSG_WS.isConnected = false;
        stopTimerToTrigerGetClientMap();
        MSG_WS.wsObject = null;
        callBackCallerWSClosed(false);
    }
    ws.onerror = function(){
        console.log("连接出错");
        MSG_WS.isConnected = false;
        stopTimerToTrigerGetClientMap();
        MSG_WS.wsObject = null;
        callBackCallerWSClosed(true);
    }

    ws.onmessage = function(event){
        // I expect this check to work, but I have not tested it.
        //if (e.source != webview.contentWindow)
        //    return;
        var str = event.data;
        console.log(str);
        var msg_wrapper = JSON.parse(str);
        if(typeof msg_wrapper != 'undefined' && typeof msg_wrapper.src_id != 'undefined')
        {
          var src_id = msg_wrapper.src_id;
          var dst_id = msg_wrapper.dst_id;
          var cmd = msg_wrapper.cmd;
          if (typeof cmd !=  'undefined')
          {
            if(cmd == 'postMSGToClient')
            {
              var is_send_failed = false;
              var err_code = 0;
              if (src_id == 'Server' && dst_id == my_src_id && msg_wrapper.err_code != 0)
              {
                // 发送失败了
                is_send_failed = true;
                err_code = msg_wrapper.err_code;
              }
              else if(dst_id == my_src_id)
              {
                // 收到其他客户端的消息
              }
              var data = msg_wrapper.msg;
              var msg_type = data['type'];
              var msg_obj = JSON.parse(data['obj']);

              var handles = MSG_WS.msgListeners[msg_type];

              if (handles != undefined && handles != null) {  
                for(var i = 0; i < handles.length; i++)
                {
                  var hdl = handles[i];
                  var ctx = hdl['ctx'];                
                  var cb = hdl['cb'];
                  if(cb != undefined && cb != null) {
                    //console.log(cb);
                    cb(msg_type,msg_obj,ctx,err_code,is_send_failed,src_id,dst_id);                  
                  }
                }
              }
            }
            else if(cmd == 'getClientList')
            {
              // 获取客户端列表
              MSG_WS.gClientsMap = JSON.parse(msg_wrapper.msg.obj);
              // 每隔1秒刷新一下服务端的客户端列表
              if (MSG_WS.isConnected) {
                timerToTrigerGetClientMap = setTimeout(function(){
                  doSendMsgToGetClientMap();
                },1000);
              }
            }
          }
        }
    }
  }
};

// 关闭与服务端的消息通信
var stopMessageInteract = function() {
  if (MSG_WS.wsObject != null) {
    MSG_WS.wsObject.close();
  }
}

// 注册监听
var registerMessageHandler = function(msg_type,context,callback) {
    var handles = MSG_WS.msgListeners[msg_type];
    if (handles == null)
    {
        handles = new Array();
        MSG_WS.msgListeners[msg_type] = handles;
    }
    var newObj = new Object();
    newObj['ctx'] = context;
    newObj['cb'] = callback;
    handles.push(newObj);
    MSG_WS.msgListeners[msg_type] = handles;
};

var unregisterMessageHandler = function(msg_type) {
  var handles = MSG_WS.msgListeners[msg_type];
  MSG_WS.msgListeners[msg_type] = null;
}

// 向目标Client发消息，由Server转发，msg_type是字符串,msg_obj是个对象，会被stringfy
var postMessageToTargetClient = function(dst_id, msg_type, msg_obj) {
  if (!MSG_WS.isConnected || MSG_WS.wsObject == null)
  {
    // 无连接，不发送
    return;
  }
  // 发送消息
  var msg_wrapper = {
    src_id:MSG_WS.src_id,
    dst_id:dst_id,
    cmd:'postMSGToClient',
    err_code:0,
    err_msg:'success',
    msg:{
      'type':msg_type,
      'obj':JSON.stringify(msg_obj)
    }
  };
  MSG_WS.wsObject.send(JSON.stringify(msg_wrapper));
};

var getServerClientsMap = function() {
  return MSG_WS.gClientsMap;
}

MSG_WS.start = startMessageInteract;
MSG_WS.stop = stopMessageInteract;
MSG_WS.registerListener = registerMessageHandler;
MSG_WS.unregisterListener = unregisterMessageHandler;
MSG_WS.postMsg = postMessageToTargetClient;
MSG_WS.getClientMap = getServerClientsMap;

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
{
    module.exports = MSG_WS;
}

      