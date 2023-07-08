# 功能和数据库参考ecshop
服务端api基于Ｎode.js+ThinkJS+MySQL
计划添加基于Vue.js的后台管理系统、PC版、Ｗap版
本项目需要配合微信小程序端使用
GitHub: https://github.com/szx-zhao/nideFire_mini

# 本地开发环境配置
克隆项目到本地
git clone https://github.com/tumobi/nideshop
创建数据库nideshop并导入项目根目录下的nideshop.sql
CREATE SCHEMA `nideshop` DEFAULT CHARACTER SET utf8mb4 ;
注意数据库字符编码为utf8mb4

更改数据库配置 src/common/config/database.js
const mysql = require('think-model-mysql');

module.exports = {
    handle: mysql,
    database: 'nideshop',
    prefix: 'nideshop_',
    encoding: 'utf8mb4',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '你的密码',
    dateStrings: true
};
填写微信登录和微信支付配置 src/common/config/config.js
// default config
module.exports = {
  default_module: 'api',
  weixin: {
    appid: '', // 小程序 appid
    secret: '', // 小程序密钥
    mch_id: '', // 商户帐号ID
    partner_key: '', // 微信支付密钥
    notify_url: '' // 微信异步通知，例：https://www.nideshop.com/api/pay/notify
  }
};

# 安装依赖并启动
npm install
npm start





Nideshop_ad                   ：首页三幅图像

nideshop_brand              ：直供装备四个图像，包括点击进入后的展示页面（new_pic_url 列首页图片，app_list_pic_url 列是点击 bard 图像进入后的头图）

nideshop_goods_issue    ：记录每个商品下的注意事项

nideshop_keywords         ：记录搜索页面的中的高频搜索的 keyword 词语


nideshop_goods               ：货物表
	bard 模块（其中的 brand_id 字段, 与 nideshop_brand 表中的 id 字段一致，用来当点击首页四个 brand 图，紧随其后的头图下面的两列详情页的与之有关的商品的信息的全部展示，从数据库的最后一个开始反向展示出来。其中 list_pic_url 是两列展示时的图片。）


nideshop_goods_attribute     :   货物参数值的表（通过表中 attribute_id 的值找到参数名称，good_id 是货物的唯一标识符 id）


nideshop_attribute                ： 参数名称表

nideshop_goods_gallery       ：商品详情页的四幅头图，通过 good_id 索引找到

nideshop_region              ：存储国家地区信息表


nideshop_category          ： 分类库（具有内联属性的分类数据库），category 表中的 id 是用来查找 goods 表中的 category_id 的标准。同一类的数据会展示出来


nideshop_topic                 : 专题教育数据库

## 0.1 后端
### 0.1.1 think. js 框架分析
think.js 是一款基于 Node.js 的 Web 应用框架，它采用 MVC（Model-View-Controller）的设计模式，并提供逻辑类、控制类和模型类等组件，来帮助快速开发 Web 应用。

-   用户发送请求到控制器(Controller)
-   控制器接收请求,并将请求传递给相关的逻辑类(Logic)
-   逻辑类处理逻辑,可能需要从模型(Model)层获取数据
-   模型类和数据库交互,获取或更新数据
-   逻辑类处理完成后返回结果给控制器
-   控制器根据逻辑类返回的结果,返回相应的响应给用户


这些组件之间的关系如下：

-   逻辑类（Logic Class）：主要负责编写业务逻辑，包括数据的处理、计算和验证等。逻辑类是一个纯粹的 JavaScript 类，可以通过继承 think.Logic 类来创建自定义逻辑类。逻辑类通常是由控制类调用，以完成数据的处理和验证。
-   控制类（Controller Class）：主要负责接收和处理 HTTP 请求，并将请求转发给对应的逻辑类或模型类来处理。控制类是一个纯粹的 JavaScript 类，可以通过继承 think.Controller 类来创建自定义控制类。控制类通常是由路由模块调用，以执行对应的业务逻辑。
-   模型类（Model Class）：主要负责封装与数据库的交互，包括数据的增删改查等操作。模型类是一个纯粹的 JavaScript 类，可以通过继承 think.Model 类来创建自定义模型类。模型类通常由逻辑类调用，以完成数据的存取操作。

在整个应用的运行过程中，控制类负责接收 HTTP 请求，并根据请求的内容调用对应的逻辑类或模型类来完成数据的处理和存取。逻辑类负责处理业务逻辑，包括数据的处理、计算和验证等。模型类负责封装与数据库的交互，以完成数据的存取操作。通过这些组件的协作，可以快速开发出高质量的 Web 应用。


### 0.1.2 项目文件内容格式分析
项目中 admin 文件夹、api 文件夹和 common 文件夹之间的关系以及它们的作用。下面是对这些文件夹的详细分析：  
  
1. admin文件夹：admin文件夹通常用于存放与后台管理系统相关的代码。这些代码主要负责处理管理员对网站或应用程序的管理操作，例如添加、编辑、删除内容，管理用户权限等。在这个文件夹中，您可能会找到与后台管理界面相关的HTML、CSS、JavaScript文件，以及处理后台业务逻辑的服务器端代码。  
  
2. api文件夹：api文件夹主要用于存放与应用程序接口（API）相关的代码。API是一种允许不同软件之间进行通信的接口，它们通常以RESTful或GraphQL等形式提供。在这个文件夹中，您可能会找到处理API请求的服务器端代码，例如路由、控制器、中间件等。这些代码负责接收客户端的请求，处理业务逻辑，并将结果以JSON或XML等格式返回给客户端。  
  
3. common文件夹：common文件夹用于存放项目中通用的代码和资源，这些代码和资源可以在项目的多个部分中重复使用。例如，您可能会在这个文件夹中找到一些工具函数、常量、配置文件等。将这些通用代码和资源放在一个单独的文件夹中，有助于提高代码的可维护性和可重用性。  
  
总之，admin、api和common这三个文件夹在项目中扮演着不同的角色。admin文件夹负责处理后台管理系统的相关操作，api文件夹负责处理API请求，而common文件夹则存放通用的代码和资源。这种文件夹结构有助于保持项目的组织和可维护性。



### 0.1.3 后端代码的数据链接分析
1.  和数据库的链接:
think.js 使用 think-model 模块对数据进行操作和管理,think-model 是一个基于 ORM 模式的对象关系映射模块。
think.js 通过 think-model 将 JS 对象映射到数据库表,从而实现后端 JS 代码与数据库的链接。


2.  和前端代码的链接:

think.js 将后端渲染的结果通过 HTTP 请求返回给前端,前端通过 AJAX 或页面请求从后端获取数据。
通过模板引擎,think.js 可以很方便地将数据渲染到 HTML 或其他模板中,返回给前端。
前端通过 JavaScript 可以和后端发起 AJAX 请求,获取需要的资源。
所以总的来说,think.js 通过 think-model 实现了与数据库的连接;通过 HTTP 请求和模板渲染实现了与前端代码的链接。

### 0.1.4 think. Js 符合MVC 框架
#### 0.1.4.1 控制器类controller
```javascript
const Base = require('./base.js'); //地区信息存储控制器 
module.exports = class extends Base { 
	async infoAction() { 
	const region = 
	 await this.model('region').getRegionInfo(this.get('regionId')); 
	 return this.success(region); }
	
	async listAction() { 
	const regionList = 
	await this.model('region').getRegionList(this.get('parentId')); 
	return this.success(regionList); } 
	}; 
```

这是一个使用 ThinkJS 框架编写的地区信息存储控制器，用于处理请求并返回响应结果。整体看来,这个控制器用于处理地区信息的获取和列表,封装到对应的 action 方法中。

提供了获取地区信息和地区列表的方法。在方法中，使用异步方式调用数据库模型的方法，获取数据后返回响应结果，符合MVC架构的思想。

`const Base = require('./base.js');`  
引入基础控制器 Base
Base控制器是think.js框架提供的基础控制器,包含了一些公共方法。

```javascript
module.exports = class extends Base { // ... };

定义一个类并继承自Base，用于处理地区信息存储。
```


```javascript
async infoAction() { 
const region = await this.model('region').getRegionInfo(this.get('regionId')); return this.success(region); }

定义一个异步方法`infoAction()`，用于获取指定`regionId`的地区信息。在方法中，调用`this.model('region').getRegionInfo()`方法获取地区信息，并将其返回。
```


```javascript
async listAction() { 
const regionList = 
	  await this.model('region').getRegionList(this.get('parentId')); return this.success(regionList); }

定义一个异步方法`listAction()`，用于获取指定`parentId`下的所有地区列表。在方法中，调用`this.model('region').getRegionList()`方法获取地区列表，并将其返回。
```

**controller 文件夹**下的代码，继承基础 Base 类的代码可以用于与前端通信。在提供的代码中，Base 类被 Cart 类继承，Cart 类包含了添加、更新和检索购物车商品的方法。这些方法被设计为由前端调用，并返回可用于更新用户界面的数据。例如，getCart 方法返回一个 Promise，该 Promise 解析为一个包含用户购物车商品和各种统计信息的对象。类似地，addAction 和 updateAction 方法被设计为由前端调用，以添加或更新购物车中的商品。总的来说，Base 类中的代码提供了一个有用的接口，用于与前端通信和管理购物车数据。


**继承 base 类**的代码会返回一个 Promise 对象，并且该 Promise 对象的 resolved value 类型可能是 Promise、PreventPromise 或 void 中的一种。
```JavaScript
@returns {Promise.<Promise|PreventPromise|void>}


//这段代码是一个JSDoc注释，用于描述一个函数的返回值类型。具体含义如下：

@returns 表示该注释描述的是函数的返回值。

{Promise.<Promise|PreventPromise|void>}
表示该函数返回一个Promise对象，并且Promise对象的resolved value可能是Promise、PreventPromise或void类型。

其中，`Promise`表示Promise对象类型，`<Promise|PreventPromise|void>`表示该Promise对象resolved value的类型可能是Promise、PreventPromise或void。三者的含义如下：

-   `Promise` 表示Promise对象，即该Promise对象resolved value也是一个Promise对象。
-   `PreventPromise` 表示Promise对象，但是该Promise对象需要被阻止，即不会被resolve。
-   `void` 表示该Promise对象resolved value为空，即不返回任何值。
```

Promise 是一种用于异步编程的对象，它可以用来处理异步操作的结果。一般来说，异步操作指的是那些需要一定时间才能完成的操作，例如读取文件、发送网络请求等。

Promise 对象有三种状态：Pending（进行中）、Fulfilled（已成功）和 Rejected（已失败）。当一个异步操作开始执行时，Promise 对象的状态为 Pending。当操作成功完成时，Promise 对象的状态会变为 Fulfilled，并且可以获取到操作的结果。当操作失败时，Promise 对象的状态会变为 Rejected，并且可以获取到失败的原因。

Promise 对象可以通过 `then()` 方法来指定操作成功时的回调函数，并通过 `catch()` 方法来指定操作失败时的回调函数。这些回调函数会在异步操作完成后被调用，以处理操作的结果。此外，Promise 对象还可以通过 `Promise.all()` 和 `Promise.race()` 等方法来处理多个异步操作的结果。

使用 Promise 对象可以使异步代码更加清晰和易于维护，避免了回调地狱等问题。


#### 0.1.4.2 逻辑类
逻辑类位于模型(model)与视图(view)、控制器(controller)之间

think.js 逻辑类与控制器类关联：

在 think.js 中，逻辑类是一种用于处理业务逻辑的类。它们通常包含了一些方法，用于处理数据、验证数据、处理业务逻辑等。逻辑类的主要作用是将数据从控制器中分离出来，避免控制器变得过于臃肿，同时也方便代码的复用和维护。

控制器类是一种用于处理HTTP请求的类。在think.js中，控制器类通常包含了一些方法，用于处理HTTP请求、获取请求参数、调用逻辑类处理业务逻辑等。控制器类的主要作用是接收用户请求，将请求转发给逻辑类进行处理，并将处理结果返回给用户。

因此，逻辑类和控制器类在think.js中是密切相关的。控制器类负责接收用户请求并将请求转发给逻辑类进行处理，逻辑类则负责处理业务逻辑并返回处理结果给控制器类，最终返回给用户。通过将业务逻辑封装到逻辑类中，可以有效地提高代码的可读性、可维护性和可复用性。




**logic 文件夹**下的Cart 类继承了 **think.Logic 类**，它将具有不同的功能。think.Logic 类是一个基础逻辑类，它提供了一些用于验证和处理数据的方法，例如 validate 和 format 等。因此，如果 Cart 类继承了 think.Logic 类，它将具有不同的功能，可能更适合用于验证和处理购物车数据。



#### 0.1.4.3 模型类 Model

主要负责封装与数据库的交互，包括数据的增删改查等操作。模型类是一个纯粹的 JavaScript 类，可以通过继承 think.Model 类来创建自定义模型类。模型类通常由逻辑类调用，以完成数据的存取操作。

**model 文件夹**下面的的代码，继承了 think.Model 类，这意味着 Cart 类可以使用 think.Model 类中定义的方法和属性。think.Model 是一个基础模型类，它提供了许多用于**操作数据库**的方法，例如 where、select 和 delete 等。通过继承 think.Model 类，Cart 类可以使用这些方法来操作购物车数据表。





## 0.2 前端
### 0.2.1 config 文件中的 api. Js 文件
api.js 中**定义了后端 API 的地址，可以方便地管理 API 地址**，避免在代码中硬编码 API 地址，方便后期维护和修改。

导出了一个名为 module.exports 的模块，其中包含了一系列 API 接口的 URL。在其他文件中，可以通过 require 函数引入这个模块，然后使用其中的接口 URL 来发送 HTTP 请求以此来链接后端。

例如，在另一个文件中，可以这样使用 GoodsList 接口：
```JavaScript
const api = require('./config/api.js');

// 发送HTTP请求
fetch(api.GoodsList)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

这里假设 api.js 文件位于当前文件夹下的 config 子文件夹中。
通过require('./config/api.js')引入这个模块后，就可以使用其中的GoodsList接口URL来发送HTTP请求了。


### 0.2.2 untils 文件中的 untils. Js 文件
utils.js 中**封装了微信请求的工具函数库**，包含了一些常用的请求方法和辅助函数，可以方便地发送请求和处理响应数据。

封装了多个微信请求的工具函数库，并将将函数导出，以便其他文件可以引用。

装了微信请求的工具函数库，主要是为了方便开发者在小程序中发送请求。通过封装，可以减少代码的重复性，提高代码的可读性和可维护性。同时，引入 ../config/api.js 文件可以方便地管理请求的 API 地址，避免在代码中硬编码 API 地址，方便后期维护和修改。


### 0.2.3 page存放小程序页面相关的js文件和wxml(html)文件
1.  js 文件:对应页面的 js 逻辑。
2.  json文件(可选):对应页面的数据。
3.  wxml文件:对应页面的结构和布局。
4.  wxss文件(可选):对应页面的样式表。



### 0.2.4 servers 文件夹
用户登录相关服务

















```html
<p><img src="https://img.alicdn.com/imgextra/i1/3034699548/O1CN016MgADb2KP2TX4RzYy_!!3034699548.jpg"style=""/>
</p>
```


```html
<img src="https://www.119.gov.cn/images/kp/hzyf/ggylcs/2023/05/19/1684461237296096085.png">

<text>不少网红娱乐项目因为新鲜刺激又好玩吸引大量游客

在体验游玩的时候一定要注意安全

网红休闲娱乐项目安全提示

请收好！</text>
    
    
```
# 本项目来自于NideShop商城
项目地址：https://github.com/tumobi/nideshop



