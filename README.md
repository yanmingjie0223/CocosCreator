# CocosCreator
基于cocos creator基础引擎工程

# 继承类
Singleton 单例继承<br/>
BComponent ui绑定类继承，提供有全局事件处理方法<br/>
BaseView 所有view继承方法<br/>
* onInit() 初始化信息重写方法
* onShown() 界面完全显示后实现重写方法
* onUpdate() 帧跟新方法
* onClickMatte() 点击蒙层继承重写方法
* onProgress() view依赖资源加载进度实现逻辑继承重写方法
* onShowAnimation() view展开动画方法，如有个别界面独特动画可继承重写
* 注：App.ViewManager.show开始添加显示view，因为客户端主要在view表现<br/>
BaseModel<br/>
* 单例model数据处理
* 注册获取在App.ModelManager中<br/>
BaseCtrl<br/>
* 绑定在view中的控制类，在创建view的时候也会给view创建一个控制类

# manager管理类
EventManager 全局事件处理单例<br/>
FguiManager fgui一些处理，绑定ui类，初始化UIConfig<br/>
LayerManager view层级管理<br/>
LoadManager 加载管理，加载资源组在resource.json文件中<br/>
ModelManager model数据源管理，管理所有model注册和获取<br/>
PathManager 资源路径管理类，获取路径统一走管理类<br/>
ResManager 资源获取/清理管理<br/>
StageManager 舞台管理，fgui GRoot初始化，获取舞台/显示区域宽高/适配宽高调整<br/>
SystemManager 设备管理，获取设备适配信息<br/>
TimeManager 时间管理类，获取本地/服务端时间<br/>
ViewManager view管理类，控制view显示和ctrl绑定<br/>

# 类管理
App 入口管理方便统一跟踪

# creator 场景启动入口类
AppEntry 启动场景后ui入口，相当于main

# 工具类
工具类都在utils中，一看便知。都是些对数组/时间/效果/字符串等常用方法

# libs依赖库
fairygui 免费且易于，并支持多个引擎（非常感谢谷主开源）
github上库地址 https://github.com/fairygui