module.exports = class extends think.Model {




  /**
   * 获取商品的product
   * 
   * getProductList方法接受一个goodsId参数
   * 然后使用this.model('product')查询数据库中goods_id等于goodsId的所有商品，并返回结果。
   * @param goodsId
   * @returns {Promise.<*>}
   */
  async getProductList(goodsId) {
    const goods = await this.model('product').where({goods_id: goodsId}).select();
    return goods;
  }

  /**
   * 获取商品的规格信息
   * 
   * getSpecificationList方法也接受一个goodsId参数
   * 然后使用this.model('goods_specification')查询数据库中goods_id等于goodsId的所有商品规格信息。
   * 查询结果包括规格信息和规格名称，然后按照规格名称分组，将相同规格名称的规格信息放在同一个数组中，最后返回规格信息的数组。
   * @param goodsId
   * @returns {Promise.<Array>}
   */
  async getSpecificationList(goodsId) {
    // 根据sku商品信息，查找规格值列表
    const specificationRes = await this.model('goods_specification').alias('gs')
      .field(['gs.*', 's.name'])
      .join({
        table: 'specification',
        join: 'inner',
        as: 's',
        on: ['specification_id', 'id']
      })
      .where({goods_id: goodsId}).select();

    const specificationList = [];
    const hasSpecificationList = {};
    // 按规格名称分组
    for (let i = 0; i < specificationRes.length; i++) {
      const specItem = specificationRes[i];
      if (!hasSpecificationList[specItem.specification_id]) {
        specificationList.push({
          specification_id: specItem.specification_id,
          name: specItem.name,
          valueList: [specItem]
        });
        hasSpecificationList[specItem.specification_id] = specItem;
      } else {
        for (let j = 0; j < specificationList.length; j++) {
          if (specificationList[j].specification_id === specItem.specification_id) {
            specificationList[j].valueList.push(specItem);
            break;
          }
        }
      }
    }

    return specificationList;
  }
};
