const Base = require('./base.js');
/**
 * Brand的控制器类，继承了Base类。
 * 两个方法都调用了success方法返回操作结果。 
*/


module.exports = class extends Base {
  async listAction() {

    //listAction方法用于获取品牌列表
    /**
     * 通过调用model('brand')获取Brand模型实例，然后使用field方法指定需要查询的字段，page方法指定分页参数，countSelect方法返回分页数据和总数。
    */

    const model = this.model('brand');
    const data = await model.field(['id', 'name', 'floor_price', 'app_list_pic_url']).page(this.get('page') || 1, this.get('size') || 10).countSelect();

    return this.success(data);
  }

  async detailAction() {
    //detailAction方法用于获取指定id的品牌详情
    /**
     * 通过调用model('brand')获取Brand模型实例，然后使用where方法指定查询条件，find方法返回查询结果。
     * 
    */
    const model = this.model('brand');
    const data = await model.where({id: this.get('id')}).find();

    return this.success({brand: data});
  }
};
