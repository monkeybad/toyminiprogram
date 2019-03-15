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
123
## 其他(TODO List)
### 有没有办法让logic直接运行到客户端去调试的方法？
<br />调研了谷歌官方的safari桥接调试工具 [ios-webkit-debug-proxy](https://github.com/google/ios-webkit-debug-proxy) 及相关工具，chrome的调试接口协议能找到可用的实现都是基于USB链接设备调试的场景。不能满足远程调试的需求。
<br />但是有没有办法基于chrome的调试接口协议来调试真机上的logic部分呢？由于没有深究，也许是有的...。一个思路是将移动设备上safari的webkit debug protocol适配到chrome的调试协议上，再基于代理来调试。
<br />猜测大家没这么做的原因可能是除了读USB外，没有其他办法读取移动设备上safari或chrome的调试信息（不然为什么safari真机调试非要连USB线呢）。不过这只是一个猜测，还得继续深究...
