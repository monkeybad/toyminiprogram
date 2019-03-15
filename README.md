# toyminiprogram
玩具版小程序的实现，仅仅用于练习和学习小程序的实现，暂无实际用途。
<br />
<br />目前基于[nw.js](https://github.com/nwjs/nw.js)(原node-webkit.js)实现了一小部分调试器的核心功能：
<br />1.logic和view分离及通信
<br />2.wxml、wxss展示
<br />3.wxml与logic中data的mvvm联动
<br />4.bingtap事件
<br />由于刚刚起步，待实现的部分还很多，这里就不列了...
<br />
# 演示
## 1.wxml、wxss、js代码
![代码演示](https://raw.githubusercontent.com/monkeybad/toyminiprogram/master/document/img/code.jpg '代码演示')
## 2.点击事件演示
### (1)模拟器调试
![模拟器动图演示](https://raw.githubusercontent.com/monkeybad/toyminiprogram/master/document/img/demo.gif '模拟器动图演示')
<br />
### (2)iOS真机调试
![iOS动图演示](https://raw.githubusercontent.com/monkeybad/toyminiprogram/master/document/img/demo_ios.gif 'iOS动图演示')
<br />
### (3)Android真机调试
![Android动图演示](https://raw.githubusercontent.com/monkeybad/toyminiprogram/master/document/img/demo_android.gif 'Android真机动图演示')
<br />
## 调试程序执行方法
`./run_devtools.sh`
<br />
# 小程序调试原理解释
## 小程序实现原理
小程序原理和背景可以参看微信官方文档 [微信开发者工具](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0000a24f9d0ac86b00867f43a5700a '微信开发者工具')
## 玩具调试器的实现原理
1. 开发工具使用nw.js实现，该工具是一个电脑端的hybrid开发框架。
2. 模拟器调试时，所有逻辑都在电脑端，logic相关的js逻辑跑在一个webview tag中（逻辑进程），wxml和wxss被解析成DOM和style（被虚拟化为VDOM方便通信），跑在另一个webview tag中做展示（视图进程），中间通过chrome的事件进行消息通信和Data更新。
3. 真机调试时，**logic其实还是跑在电脑端（这个非常重要！）**，而视图进程跑在手机端的webview中，中间消息通信和Data更新使用websocket实现，背后起了一个webview tag做websocket的server端桥接电脑端logic和手机端view的通信。
4. 真机运行时，logic就跑在了手机端的JSC和V8中，中间的消息通信和Data的更新是基于原生bridge调用。
5. 最核心的部分其实是消息通信的实现，针对不同场景的不同实现（chrome事件/websocket通信/原生bridge）。
![逻辑flow](https://raw.githubusercontent.com/monkeybad/toyminiprogram/master/document/img/logic_debug_flow.png '逻辑flow')
6. 以上都是逻辑js部分的调试，wxml和wxss的调试实际上基于消息通信组件，自己在nw.js中给devtools实现了一个wxml解析插件。消息通信组件用于同步插件和视图之间的行为和数据。目前本项目还没实现，后续有空会补上。
![视图flow](https://raw.githubusercontent.com/monkeybad/toyminiprogram/master/document/img/wxml_debug_flow.png '视图flow')
## 其他(TODO List)
### WXML与WXSS文件的调试插件
待实现
### 有没有办法让logic直接运行到客户端去调试的方法？
<br />调研了谷歌官方的safari桥接调试工具 [ios-webkit-debug-proxy](https://github.com/google/ios-webkit-debug-proxy) 及相关工具，chrome的调试接口协议能找到可用的实现都是基于USB链接设备调试的场景。不能满足远程调试的需求。
<br />但是有没有办法基于chrome的调试接口协议来调试真机上的logic部分呢？由于没有深究，也许是有的...。一个思路是将移动设备上safari的webkit debug protocol适配到chrome的调试协议上，再基于代理来调试。
<br />猜测大家没这么做的原因可能是除了读USB外，没有其他办法读取移动设备上safari或chrome的调试信息（不然为什么safari真机调试非要连USB线呢）。不过这只是一个猜测，还得继续深究...
