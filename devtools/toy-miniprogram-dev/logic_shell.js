'use strict';

var MSG = require('./msgutils');
MSG.init(window);

var Page = function(pageInfo) {
  return new InnerPage(pageInfo);
};

function InnerPage(anotherPage) {
  var self = this;

  console.log(self.data);

  self.data = anotherPage['data'];
  self.callfuncs = {};
  self.callfuncNames = {};
  Object.keys(anotherPage).forEach(function(key) {
    console.log(key);
    var value = anotherPage[key];
    if (key != 'data' && typeof value != 'undefined' && typeof value == 'function')
    {
      console.log(value);
      self.callfuncs[key] = value;
      self.callfuncNames[key] = {};
    }
  });
  
  // 第一次时接收外部的load_data，获取对外消息通知的抛送目标
  MSG.registerListener('load_data','',function(msg_type,msg_obj,ctx,origin,source){
    self.msgSource = source;
    self.msgOrigin = origin;
    MSG.postMsg(self.msgSource,'load_data',{data:self.data,callfuncs:self.callfuncNames},self.msgOrigin);
  });
  // 绑定来自ui的调用 
  MSG.registerListener('bind_func','',function(msg_type,msg_obj,ctx,origin,source){
    var funcName = msg_obj.func_name;
    var funcParams = msg_obj.func_params;
    var func = self.callfuncs[funcName];
    if(typeof func !== 'undefined' && func !== undefined)
    {
      func.apply(self,funcParams);
    }
  }); 
}

InnerPage.prototype.msgSource = null;
InnerPage.prototype.msgOrigin = null;
InnerPage.prototype.data = null; // 数据
InnerPage.prototype.callfuncs = null;  // 触发回调
InnerPage.prototype.callfuncNames = null;  // 触发回调的名字
InnerPage.prototype.setData = function(data) {
  var self = this;
  Object.keys(data).forEach(function(key) {
    self.data[key] = data[key];
  }); 
  MSG.postMsg(self.msgSource,'update_data',{data:self.data,callfuncs:self.callfuncNames},self.msgOrigin);
};

//require('./srcProject/page.js');
//include('./srcProject/page.js');

var LogicShell = {};
LogicShell.Page = Page;

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
{
    module.exports = LogicShell;
}