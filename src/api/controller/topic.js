const Base = require('./base.js');
//专题教育控制器。用于处理与话题相关的请求是一个继承自 base.js 的类


module.exports = class extends Base {
  /**
   *listAction() 方法使用 this.model('topic') 获取话题模型，并使用 page() 方法分页查询话题数据，返回一个包含查询结果的 Promise 对象。
   * 
   */
  async listAction() {
    const model = this.model('topic');
    const data = await model.field(['id', 'title', 'price_info', 'scene_pic_url', 'subtitle']).page(this.get('page') || 1, this.get('size') || 10).countSelect();

    return this.success(data);
  }

  /**
   *detailAction() 方法使用 this.model('topic') 获取话题模型，并使用 where() 方法查询指定 ID 的话题数据，返回一个包含查询结果的 Promise 对象。
   * 
   */
  async detailAction() {
    const model = this.model('topic');
    const data = await model.where({id: this.get('id')}).find();

    return this.success(data);
  }

  /**
   * relatedAction() 方法使用 this.model('topic') 获取话题模型，并使用 limit() 方法查询前四个话题数据，返回一个包含查询结果的 Promise 对象。
   */
  async relatedAction() {
    const model = this.model('topic');
    const data = await model.field(['id', 'title', 'price_info', 'scene_pic_url', 'subtitle']).limit(4).select();

    return this.success(data);
  }
};
