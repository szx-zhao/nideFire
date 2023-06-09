const mysql = require('think-model-mysql');

module.exports = {
  handle: mysql,
  database: 'nideshop',
  prefix: 'nideshop_',
  encoding: 'utf8mb4',
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '1234',
  dateStrings: true
};

// Node.js 应用程序的数据库配置文件。
//使用了 think-model-mysql 模块来处理 MySQL 数据库。
//其中，database 属性指定了数据库名称，prefix 属性指定了表前缀，encoding 属性指定了字符编码，host 属性指定了数据库服务器地址，port 属性指定了数据库服务器端口，user 属性指定了数据库用户名，password 属性指定了数据库密码，dateStrings 属性指定了是否将日期类型转换为字符串类型。这些属性的值可以根据具体的应用程序需求进行修改。 

//module.exports语句用于将数据库配置对象导出为一个模块。
//这允许应用程序中的其他模块导入和使用配置对象。
//在这种情况下，配置对象指定了使用think-model-mysql模块连接到MySQL数据库所需的属性。
//handle属性指定用于处理数据库的模块，而其他属性（如database、prefix、encoding、host、port、user、password和dateStrings）指定了数据库连接详细信息和设置。
//总的来说，module.exports语句是在Node.js中从模块中导出对象、函数或变量的常见方式。 