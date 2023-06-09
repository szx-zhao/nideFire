const Base = require('./base.js');
//收藏功能的控制器

module.exports = class extends Base {
  async listAction() {
    /**
     * listAction用于获取用户收藏的商品列表
     * 
     * 在listAction中，首先获取typeId参数，然后通过model('collect')获取收藏表的数据，使用alias方法给表起别名c，
     * 使用join方法连接goods表，给goods表起别名g，使用where方法过滤出符合条件的数据，最后使用countSelect方法获取数据总数并返回。
     * */

    const typeId = this.get('typeId');

    const list = await this.model('collect')
      .field(['c.*', 'g.name', 'g.list_pic_url', 'g.goods_brief', 'g.retail_price'])
      .alias('c')
      .join({
        table: 'goods',
        join: 'left',
        as: 'g',
        on: ['c.value_id', 'g.id']
      }).where({user_id: this.getLoginUserId(), type_id: parseInt(typeId)}).countSelect();

    return this.success(list);
  }

  async addordeleteAction() {
    /**
     * addordeleteAction用于添加或删除用户的收藏。
     * 
     * 首先获取typeId和valueId参数，然后通过where方法查询是否已经存在该收藏记录，如果不存在则添加收藏记录，否则删除该收藏记录。
     * 最后根据操作结果返回成功或失败信息。 
    */

    const typeId = this.post('typeId');
    const valueId = this.post('valueId');

    const collect = await this.model('collect').where({type_id: typeId, value_id: valueId, user_id: this.getLoginUserId()}).find();
    let collectRes = null;
    let handleType = 'add';
    if (think.isEmpty(collect)) {
      // 添加收藏
      collectRes = await this.model('collect').add({
        type_id: typeId,
        value_id: valueId,
        user_id: this.getLoginUserId(),
        add_time: parseInt(new Date().getTime() / 1000)
      });
    } else {
      // 取消收藏
      collectRes = await this.model('collect').where({id: collect.id}).delete();
      handleType = 'delete';
    }

    if (collectRes > 0) {
      return this.success({type: handleType});
    }

    return this.fail('操作失败');
  }
};
